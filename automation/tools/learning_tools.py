"""
Learning tools for Vonga OS.
Allows agents to store and retrieve facts, preferences, and insights that persist across conversations.
"""

from typing import List, Dict, Optional
from datetime import datetime
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import Field


def get_drive_service(creds: Credentials):
    """Get Drive API service."""
    return build('drive', 'v3', credentials=creds)


def get_docs_service(creds: Credentials):
    """Get Docs API service."""
    return build('docs', 'v1', credentials=creds)


def get_sheets_service(creds: Credentials):
    """Get Sheets API service."""
    return build('sheets', 'v4', credentials=creds)


def find_or_create_learning_doc(creds: Credentials) -> str:
    """
    Find or create the Vonga_Agent_Learning Google Doc.
    Returns the document ID.
    """
    drive_service = get_drive_service(creds)
    docs_service = get_docs_service(creds)
    
    doc_name = "Vonga_Agent_Learning"
    
    # Search for existing document
    results = drive_service.files().list(
        q=f"name='{doc_name}' and mimeType='application/vnd.google-apps.document'",
        fields="files(id, name)"
    ).execute()
    
    files = results.get('files', [])
    
    if files:
        return files[0]['id']
    else:
        # Create new document with structured format
        doc = docs_service.documents().create(body={'title': doc_name}).execute()
        doc_id = doc.get('documentId')
        
        # Add initial structure
        initial_content = """VONGA AGENT LEARNING SYSTEM
============================

This document stores facts, preferences, and insights that all Vonga OS agents learn and remember across conversations.

STRUCTURE:
- FACTS: Objective information (e.g., "User prefers 7am-6pm EST for meetings")
- PREFERENCES: User preferences and settings (e.g., "Always use Aqua as primary brand color")
- INSIGHTS: Business insights and learnings (e.g., "Acme Corp prefers email over phone calls")

============================
FACTS
============================

[Facts will be added here]

============================
PREFERENCES
============================

[Preferences will be added here]

============================
INSIGHTS
============================

[Insights will be added here]

"""
        
        requests = [
            {
                'insertText': {
                    'location': {'index': 1},
                    'text': initial_content
                }
            }
        ]
        
        docs_service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
        
        return doc_id


def load_learned_facts(creds: Credentials) -> str:
    """
    Load all learned facts, preferences, and insights from the learning document.
    Returns formatted text to inject into agent system prompts.
    """
    try:
        doc_id = find_or_create_learning_doc(creds)
        docs_service = get_docs_service(creds)
        
        doc = docs_service.documents().get(documentId=doc_id).execute()
        content = doc.get('body', {}).get('content', [])
        
        # Extract text
        text = ""
        for element in content:
            if 'paragraph' in element:
                para = element['paragraph']
                for elem in para.get('elements', []):
                    if 'textRun' in elem:
                        text += elem['textRun'].get('content', '')
        
        # Parse sections
        facts_section = ""
        preferences_section = ""
        insights_section = ""
        
        current_section = None
        for line in text.split('\n'):
            line = line.strip()
            if 'FACTS' in line.upper() and '=' in line:
                current_section = 'facts'
                continue
            elif 'PREFERENCES' in line.upper() and '=' in line:
                current_section = 'preferences'
                continue
            elif 'INSIGHTS' in line.upper() and '=' in line:
                current_section = 'insights'
                continue
            elif line and not line.startswith('=') and not line.startswith('[') and current_section:
                if current_section == 'facts':
                    facts_section += line + '\n'
                elif current_section == 'preferences':
                    preferences_section += line + '\n'
                elif current_section == 'insights':
                    insights_section += line + '\n'
        
        # Format for system prompt
        learned_context = ""
        if facts_section.strip():
            learned_context += "LEARNED FACTS:\n" + facts_section.strip() + "\n\n"
        if preferences_section.strip():
            learned_context += "USER PREFERENCES:\n" + preferences_section.strip() + "\n\n"
        if insights_section.strip():
            learned_context += "BUSINESS INSIGHTS:\n" + insights_section.strip() + "\n\n"
        
        return learned_context.strip() if learned_context else ""
        
    except Exception as e:
        print(f"Error loading learned facts: {str(e)}")
        return ""


class StoreFactTool(BaseTool):
    """Tool for storing a fact that agents should remember."""
    name: str = "store_fact"
    description: str = """Store a fact that all agents should remember for future conversations.
    
    REQUIRES:
    - fact (string): The fact to remember (e.g., "User prefers 7am-6pm EST for meetings", "User's name is Bill")
    
    The fact will be stored in the learning system and available to all agents in future conversations."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, fact: str) -> str:
        """Execute the fact storage."""
        try:
            doc_id = find_or_create_learning_doc(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Get current document
            doc = docs_service.documents().get(documentId=doc_id).execute()
            end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
            insert_index = end_index - 1
            
            # Find the FACTS section and insert there
            # Read document to find FACTS section
            doc = docs_service.documents().get(documentId=doc_id).execute()
            content = doc.get('body', {}).get('content', [])
            
            # Extract text to find FACTS section
            text = ""
            for element in content:
                if 'paragraph' in element:
                    para = element['paragraph']
                    for elem in para.get('elements', []):
                        if 'textRun' in elem:
                            text += elem['textRun'].get('content', '')
            
            # Find position after "FACTS" section header
            facts_marker = "FACTS"
            facts_pos = text.find(facts_marker)
            if facts_pos != -1:
                # Find the end of the FACTS section (before PREFERENCES)
                preferences_marker = "PREFERENCES"
                prefs_pos = text.find(preferences_marker, facts_pos)
                if prefs_pos != -1:
                    # Insert before PREFERENCES section
                    insert_index = prefs_pos - 1
                else:
                    # Insert at end of FACTS section
                    insert_index = facts_pos + len(facts_marker) + 50  # Approximate
            else:
                # Fallback: append to end
                insert_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1) - 1
            
            timestamp = datetime.utcnow().strftime('%Y-%m-%d')
            fact_entry = f"- {fact} (learned: {timestamp})\n"
            
            requests = [
                {
                    'insertText': {
                        'location': {'index': insert_index},
                        'text': fact_entry
                    }
                }
            ]
            
            docs_service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': requests}
            ).execute()
            
            return f"Fact stored successfully: {fact}"
            
        except Exception as e:
            return f"Error storing fact: {str(e)}"
    
    async def _arun(self, fact: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class StorePreferenceTool(BaseTool):
    """Tool for storing a user preference."""
    name: str = "store_preference"
    description: str = """Store a user preference that agents should follow in future conversations.
    
    REQUIRES:
    - preference (string): The preference to remember (e.g., "Always use Aqua as primary brand color", "Never schedule meetings on Fridays")
    
    The preference will be stored and automatically applied by agents in future conversations."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, preference: str) -> str:
        """Execute the preference storage."""
        try:
            doc_id = find_or_create_learning_doc(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Get current document and find PREFERENCES section
            doc = docs_service.documents().get(documentId=doc_id).execute()
            content = doc.get('body', {}).get('content', [])
            
            # Extract text to find PREFERENCES section
            text = ""
            for element in content:
                if 'paragraph' in element:
                    para = element['paragraph']
                    for elem in para.get('elements', []):
                        if 'textRun' in elem:
                            text += elem['textRun'].get('content', '')
            
            # Find position after "PREFERENCES" section header
            prefs_marker = "PREFERENCES"
            prefs_pos = text.find(prefs_marker)
            if prefs_pos != -1:
                # Find the end of the PREFERENCES section (before INSIGHTS)
                insights_marker = "INSIGHTS"
                insights_pos = text.find(insights_marker, prefs_pos)
                if insights_pos != -1:
                    # Insert before INSIGHTS section
                    insert_index = insights_pos - 1
                else:
                    # Insert at end of PREFERENCES section
                    insert_index = prefs_pos + len(prefs_marker) + 50  # Approximate
            else:
                # Fallback: append to end
                insert_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1) - 1
            
            timestamp = datetime.utcnow().strftime('%Y-%m-%d')
            preference_entry = f"- {preference} (learned: {timestamp})\n"
            
            requests = [
                {
                    'insertText': {
                        'location': {'index': insert_index},
                        'text': preference_entry
                    }
                }
            ]
            
            docs_service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': requests}
            ).execute()
            
            return f"Preference stored successfully: {preference}"
            
        except Exception as e:
            return f"Error storing preference: {str(e)}"
    
    async def _arun(self, preference: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class StoreInsightTool(BaseTool):
    """Tool for storing a business insight."""
    name: str = "store_insight"
    description: str = """Store a business insight or learning that agents should remember.
    
    REQUIRES:
    - insight (string): The insight to remember (e.g., "Acme Corp prefers email over phone calls", "Q4 focus is enterprise clients")
    
    The insight will be stored and available to all agents for future reference."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, insight: str) -> str:
        """Execute the insight storage."""
        try:
            doc_id = find_or_create_learning_doc(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Get current document and find INSIGHTS section
            doc = docs_service.documents().get(documentId=doc_id).execute()
            content = doc.get('body', {}).get('content', [])
            
            # Extract text to find INSIGHTS section
            text = ""
            for element in content:
                if 'paragraph' in element:
                    para = element['paragraph']
                    for elem in para.get('elements', []):
                        if 'textRun' in elem:
                            text += elem['textRun'].get('content', '')
            
            # Find position after "INSIGHTS" section header
            insights_marker = "INSIGHTS"
            insights_pos = text.find(insights_marker)
            if insights_pos != -1:
                # Insert at end of INSIGHTS section (before end of document)
                # Find a good insertion point
                insert_index = insights_pos + len(insights_marker) + 50  # Approximate
            else:
                # Fallback: append to end
                insert_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1) - 1
            
            timestamp = datetime.utcnow().strftime('%Y-%m-%d')
            insight_entry = f"- {insight} (learned: {timestamp})\n"
            
            requests = [
                {
                    'insertText': {
                        'location': {'index': insert_index},
                        'text': insight_entry
                    }
                }
            ]
            
            docs_service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': requests}
            ).execute()
            
            return f"Insight stored successfully: {insight}"
            
        except Exception as e:
            return f"Error storing insight: {str(e)}"
    
    async def _arun(self, insight: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_learning_tools(creds: Credentials) -> List[BaseTool]:
    """Get all learning tools."""
    return [
        StoreFactTool(creds=creds),
        StorePreferenceTool(creds=creds),
        StoreInsightTool(creds=creds)
    ]




