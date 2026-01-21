"""
Gmail tools for reading, searching, and drafting emails.
"""

from typing import List, Dict, Any, Optional
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import BaseModel, Field


class GmailSearchInput(BaseModel):
    """Input for Gmail search."""
    query: str = Field(description="Gmail search query (e.g., 'from:example@email.com', 'subject:meeting')")


class GmailReadInput(BaseModel):
    """Input for reading a specific email."""
    message_id: str = Field(description="The ID of the email message to read")


class GmailDraftInput(BaseModel):
    """Input for drafting an email."""
    to: str = Field(description="Recipient email address(es), comma-separated for multiple")
    subject: str = Field(description="Email subject line")
    body: str = Field(description="Email body text (plain text or HTML)")


def get_gmail_service(creds: Credentials):
    """Get Gmail API service."""
    return build('gmail', 'v1', credentials=creds)


class GmailSearchTool(BaseTool):
    """Tool for searching Gmail messages."""
    name: str = "gmail_search"
    description: str = "Search Gmail messages using Gmail search syntax. Returns a list of message IDs and basic info."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, query: str) -> str:
        """Execute the search."""
        try:
            service = get_gmail_service(self.creds)
            results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
            messages = results.get('messages', [])
            
            if not messages:
                return f"No messages found for query: {query}"
            
            output = []
            for msg in messages:
                msg_detail = service.users().messages().get(userId='me', id=msg['id']).execute()
                payload = msg_detail['payload']
                headers = payload.get('headers', [])
                
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
                date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
                
                output.append({
                    'id': msg['id'],
                    'subject': subject,
                    'from': sender,
                    'date': date
                })
            
            return f"Found {len(output)} messages:\n" + "\n".join([
                f"- ID: {m['id']}, Subject: {m['subject']}, From: {m['from']}, Date: {m['date']}"
                for m in output
            ])
        except Exception as e:
            return f"Error searching Gmail: {str(e)}"
    
    async def _arun(self, query: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class GmailReadTool(BaseTool):
    """Tool for reading a specific Gmail message."""
    name: str = "gmail_read"
    description: str = "Read the full content of a specific Gmail message by its ID."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _get_message_body(self, payload: Dict[str, Any]) -> str:
        """Extract message body from payload."""
        body = ""
        
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    data = part['body']['data']
                    import base64
                    body += base64.urlsafe_b64decode(data).decode('utf-8')
                elif part['mimeType'] == 'text/html' and not body:
                    data = part['body']['data']
                    import base64
                    body += base64.urlsafe_b64decode(data).decode('utf-8')
        else:
            if payload['mimeType'] == 'text/plain':
                data = payload['body']['data']
                import base64
                body = base64.urlsafe_b64decode(data).decode('utf-8')
        
        return body
    
    def _run(self, message_id: str) -> str:
        """Execute the read."""
        try:
            service = get_gmail_service(self.creds)
            message = service.users().messages().get(userId='me', id=message_id).execute()
            payload = message['payload']
            headers = payload.get('headers', [])
            
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
            to = next((h['value'] for h in headers if h['name'] == 'To'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
            
            body = self._get_message_body(payload)
            
            return f"""Email Details:
Subject: {subject}
From: {sender}
To: {to}
Date: {date}

Body:
{body}"""
        except Exception as e:
            return f"Error reading email: {str(e)}"
    
    async def _arun(self, message_id: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class GmailDraftTool(BaseTool):
    """Tool for drafting (not sending) Gmail messages."""
    name: str = "gmail_draft"
    description: str = "Create a draft email in Gmail. The email will NOT be sent automatically - it will only be saved as a draft."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, to: str, subject: str, body: str) -> str:
        """Execute the draft creation."""
        try:
            service = get_gmail_service(self.creds)
            import base64
            from email.mime.text import MIMEText
            
            message = MIMEText(body)
            message['to'] = to
            message['subject'] = subject
            
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            draft = service.users().drafts().create(
                userId='me',
                body={'message': {'raw': raw_message}}
            ).execute()
            
            draft_id = draft['id']
            return f"Draft created successfully! Draft ID: {draft_id}. The draft has been saved to Gmail and can be reviewed before sending."
        except Exception as e:
            return f"Error creating draft: {str(e)}"
    
    async def _arun(self, to: str, subject: str, body: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_gmail_tools(creds: Credentials) -> List[BaseTool]:
    """Get all Gmail tools."""
    return [
        GmailSearchTool(creds=creds),
        GmailReadTool(creds=creds),
        GmailDraftTool(creds=creds),
    ]

