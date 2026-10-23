from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze(request):
    return Response({'analysis': 'AI analysis requires OpenAI API key configuration.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    messages = request.data.get('messages', [])
    api_key = getattr(settings, 'OPENAI_API_KEY', '')
    if not api_key:
        return Response({
            'message': 'AI analyst requires OpenAI API key. Configure OPENAI_API_KEY in your .env file.',
            'role': 'assistant'
        })
    try:
        import openai
        client = openai.OpenAI(api_key=api_key)
        resp = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {
                    'role': 'system',
                    'content': (
                        'You are CyberSentinel AI Security Analyst. '
                        'Analyze security threats, explain vulnerabilities, '
                        'and provide remediation recommendations. '
                        'Be concise and technical.'
                    )
                }
            ] + messages
        )
        return Response({'message': resp.choices[0].message.content, 'role': 'assistant'})
    except Exception as e:
        return Response({'message': f'AI service error: {str(e)}', 'role': 'assistant'})
