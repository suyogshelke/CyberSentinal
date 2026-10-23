"""
Celery scan tasks — OWASP ZAP integration + header/CORS analysis
"""
import logging
import requests
from celery import shared_task
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger('cybersentinel')
channel_layer = get_channel_layer()


def _broadcast_scan_update(scan_id, data):
    """Push scan progress to WebSocket group"""
    try:
        async_to_sync(channel_layer.group_send)(
            f'scan_{scan_id}',
            {'type': 'scan_update', 'data': data}
        )
    except Exception as e:
        logger.warning(f'WebSocket broadcast failed: {e}')


@shared_task(bind=True, max_retries=2)
def run_web_scan(self, scan_id):
    """Execute a web security scan using OWASP ZAP"""
    from scans.models import Scan, ScanStatus, ScanFinding
    from django.conf import settings

    try:
        scan = Scan.objects.get(id=scan_id)
        scan.status = ScanStatus.RUNNING
        scan.started_at = timezone.now()
        scan.save(update_fields=['status', 'started_at'])

        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 0, 'phase': 'INITIALIZING'})

        # Phase 1: Security Headers
        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 15, 'phase': 'ANALYZING HEADERS'})
        header_findings = _check_security_headers(scan.target_url)

        # Phase 2: CORS
        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 30, 'phase': 'ANALYZING CORS'})
        cors_findings = _check_cors(scan.target_url)

        # Phase 3: TLS
        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 45, 'phase': 'ANALYZING TLS'})
        tls_findings = _check_tls(scan.target_url)

        # Phase 4: ZAP Scan
        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 60, 'phase': 'ZAP SCANNING'})
        zap_findings = _run_zap_scan(scan, settings)

        # Phase 5: Store findings
        _broadcast_scan_update(scan_id, {'status': 'running', 'progress': 85, 'phase': 'STORING RESULTS'})
        all_findings = header_findings + cors_findings + tls_findings + zap_findings

        counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'informational': 0}
        for finding_data in all_findings:
            ScanFinding.objects.create(scan=scan, **finding_data)
            sev = finding_data.get('severity', 'informational')
            counts[sev] = counts.get(sev, 0) + 1

        # Calculate security score
        score = _calculate_security_score(counts)

        scan.status = ScanStatus.COMPLETED
        scan.progress = 100
        scan.completed_at = timezone.now()
        scan.security_score = score
        scan.findings_count = counts
        scan.save()

        _broadcast_scan_update(scan_id, {
            'status': 'completed', 'progress': 100,
            'phase': 'SCAN COMPLETE',
            'security_score': score,
            'findings_count': counts
        })

        logger.info(f'Scan {scan_id} completed. Score: {score}')

    except Exception as exc:
        logger.error(f'Scan {scan_id} failed: {exc}')
        try:
            scan = Scan.objects.get(id=scan_id)
            scan.status = ScanStatus.FAILED
            scan.error_message = str(exc)
            scan.save(update_fields=['status', 'error_message'])
            _broadcast_scan_update(scan_id, {'status': 'failed', 'error': str(exc)})
        except Exception:
            pass
        raise self.retry(exc=exc, countdown=60)


def _check_security_headers(url):
    """Check HTTP security headers"""
    findings = []
    required_headers = {
        'Content-Security-Policy': ('high', 'Missing Content-Security-Policy header'),
        'Strict-Transport-Security': ('high', 'Missing Strict-Transport-Security header'),
        'X-Content-Type-Options': ('medium', 'Missing X-Content-Type-Options header'),
        'X-Frame-Options': ('medium', 'Missing X-Frame-Options header'),
        'Referrer-Policy': ('low', 'Missing Referrer-Policy header'),
        'Permissions-Policy': ('low', 'Missing Permissions-Policy header'),
    }
    try:
        resp = requests.get(url, timeout=10, allow_redirects=True, verify=False)
        for header, (severity, msg) in required_headers.items():
            if header not in resp.headers:
                findings.append({
                    'title': msg,
                    'severity': severity,
                    'category': 'Security Headers',
                    'url': url,
                    'description': f'The {header} security header is not set.',
                    'solution': f'Configure the {header} header in your web server.',
                    'confidence': 'confirmed',
                })
    except Exception as e:
        logger.warning(f'Header check failed for {url}: {e}')
    return findings


def _check_cors(url):
    """Check CORS configuration"""
    findings = []
    try:
        resp = requests.options(
            url,
            headers={'Origin': 'https://evil.example.com'},
            timeout=10, verify=False
        )
        acao = resp.headers.get('Access-Control-Allow-Origin', '')
        if acao == '*':
            findings.append({
                'title': 'Wildcard CORS Policy',
                'severity': 'medium',
                'category': 'CORS',
                'url': url,
                'description': 'The API allows requests from any origin (Access-Control-Allow-Origin: *).',
                'solution': 'Restrict CORS to specific trusted origins.',
                'confidence': 'confirmed',
            })
    except Exception as e:
        logger.warning(f'CORS check failed for {url}: {e}')
    return findings


def _check_tls(url):
    """Check TLS configuration"""
    findings = []
    if not url.startswith('https://'):
        findings.append({
            'title': 'No HTTPS',
            'severity': 'high',
            'category': 'TLS',
            'url': url,
            'description': 'The application is served over HTTP, not HTTPS.',
            'solution': 'Configure TLS/SSL and redirect HTTP to HTTPS.',
            'confidence': 'confirmed',
        })
    return findings


def _run_zap_scan(scan, settings):
    """Run OWASP ZAP baseline scan"""
    findings = []
    try:
        from zapv2 import ZAPv2
        zap = ZAPv2(apikey=settings.ZAP_API_KEY,
                    proxies={'http': f'http://{settings.ZAP_HOST}:{settings.ZAP_PORT}',
                             'https': f'http://{settings.ZAP_HOST}:{settings.ZAP_PORT}'})

        zap.urlopen(scan.target_url)
        scan_id_zap = zap.spider.scan(scan.target_url)

        import time
        while int(zap.spider.status(scan_id_zap)) < 100:
            time.sleep(2)

        active_scan_id = zap.ascan.scan(scan.target_url)
        while int(zap.ascan.status(active_scan_id)) < 100:
            time.sleep(3)

        alerts = zap.core.alerts(baseurl=scan.target_url)
        severity_map = {'High': 'high', 'Medium': 'medium', 'Low': 'low', 'Informational': 'informational'}
        confidence_map = {'Confirmed': 'confirmed', 'High': 'high', 'Medium': 'medium', 'Low': 'low'}

        for alert in alerts:
            findings.append({
                'title': alert.get('name', 'Unknown'),
                'severity': severity_map.get(alert.get('risk', ''), 'informational'),
                'confidence': confidence_map.get(alert.get('confidence', ''), 'medium'),
                'category': alert.get('cweid', ''),
                'url': alert.get('url', ''),
                'parameter': alert.get('param', ''),
                'description': alert.get('description', ''),
                'evidence': alert.get('evidence', ''),
                'solution': alert.get('solution', ''),
                'reference': alert.get('reference', ''),
                'cwe_id': int(alert.get('cweid', 0)) if alert.get('cweid', '').isdigit() else None,
                'zap_alert_id': alert.get('alertRef', ''),
                'raw_data': alert,
            })
    except Exception as e:
        logger.warning(f'ZAP scan unavailable: {e}')
    return findings


def _calculate_security_score(counts):
    score = 100
    score -= counts.get('critical', 0) * 15
    score -= counts.get('high', 0) * 8
    score -= counts.get('medium', 0) * 3
    score -= counts.get('low', 0) * 1
    return max(0, min(100, score))
