"""
WebSocket consumers for real-time security events
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class SecurityEventConsumer(AsyncWebsocketConsumer):
    """Real-time SIEM event stream"""

    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        # Join org-specific group
        org_id = str(self.user.organization_id) if self.user.organization_id else 'global'
        self.group_name = f'events_{org_id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to security event stream'
        }))

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass  # Client → server messages not needed for event stream

    async def security_event(self, event):
        """Broadcast a new security event to connected clients"""
        await self.send(text_data=json.dumps({
            'type': 'security_event',
            'data': event['data']
        }))


class DashboardConsumer(AsyncWebsocketConsumer):
    """Real-time dashboard metrics updates"""

    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        org_id = str(self.user.organization_id) if self.user.organization_id else 'global'
        self.group_name = f'dashboard_{org_id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def dashboard_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'dashboard_update',
            'data': event['data']
        }))
