"""
Google Drive tools for reading and writing Google Docs.
"""

from typing import List, Dict, Any, Optional
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import io


class DriveSearchInput(BaseModel):
    """Input for searching Drive files."""
    query: str = Field(description="Search query for files (e.g., 'name:report', 'mimeType:application/vnd.google-apps.document')")
    max_results: int = Field(default=10, description="Maximum number of results to return")


class DriveReadDocInput(BaseModel):
    """Input for reading a Google Doc."""
    file_id: str = Field(description="The ID of the Google Doc file to read")


class DriveCreateDocInput(BaseModel):
    """Input for creating a new Google Doc."""
    title: str = Field(description="Title of the new Google Doc")


class DriveAppendDocInput(BaseModel):
    """Input for appending text to a Google Doc."""
    file_id: str = Field(description="The ID of the Google Doc to append to")
    text: str = Field(description="Text to append to the document")


def get_drive_service(creds: Credentials):
    """Get Drive API service."""
    return build('drive', 'v3', credentials=creds)


def get_docs_service(creds: Credentials):
    """Get Docs API service."""
    return build('docs', 'v1', credentials=creds)


def get_sheets_service(creds: Credentials):
    """Get Sheets API service."""
    return build('sheets', 'v4', credentials=creds)


def read_google_doc_by_url(creds: Credentials, doc_url: str) -> str:
    """
    Read a Google Doc by its URL and return the full text content.
    
    Args:
        creds: Google credentials for API access
        doc_url: URL of the Google Doc (e.g., "https://docs.google.com/document/d/FILE_ID/edit")
    
    Returns:
        Full text content of the document, or error message if not found
    """
    try:
        # Extract file ID from URL
        # URL format: https://docs.google.com/document/d/FILE_ID/edit
        if '/document/d/' in doc_url:
            file_id = doc_url.split('/document/d/')[1].split('/')[0]
        elif '/document/d/' in doc_url.replace('https://', ''):
            file_id = doc_url.split('/document/d/')[1].split('/')[0]
        else:
            return f"Error: Invalid Google Doc URL format: {doc_url}"
        
        docs_service = get_docs_service(creds)
        doc = docs_service.documents().get(documentId=file_id).execute()
        
        title = doc.get('title', 'Untitled')
        body_content = doc.get('body', {}).get('content', [])
        
        # Extract text from document elements
        content = ""
        for element in body_content:
            if 'paragraph' in element:
                para = element['paragraph']
                for elem in para.get('elements', []):
                    if 'textRun' in elem:
                        content += elem['textRun'].get('content', '')
            elif 'table' in element:
                # Handle tables
                for row in element['table'].get('tableRows', []):
                    row_text = []
                    for cell in row.get('tableCells', []):
                        cell_content = cell.get('content', [])
                        cell_text = ""
                        for cell_elem in cell_content:
                            if 'paragraph' in cell_elem:
                                for para_elem in cell_elem['paragraph'].get('elements', []):
                                    if 'textRun' in para_elem:
                                        cell_text += para_elem['textRun'].get('content', '')
                        row_text.append(cell_text)
                    content += ' | '.join(row_text) + '\n'
        
        return content
        
    except Exception as e:
        return f"Error reading document from URL '{doc_url}': {str(e)}"


def read_google_doc_by_name(creds: Credentials, filename: str) -> str:
    """
    Read a Google Doc by its filename and return the full text content.
    
    Args:
        creds: Google credentials for API access
        filename: Name of the Google Doc to read (without extension)
    
    Returns:
        Full text content of the document, or error message if not found
    """
    try:
        drive_service = get_drive_service(creds)
        docs_service = get_docs_service(creds)
        
        # Search for the document - try multiple variations
        search_queries = [
            f"name='{filename}'",
            f"name contains '{filename}'",
            f"fullText contains '{filename}'"
        ]
        
        file_id = None
        file_type = None
        
        for query in search_queries:
            results = drive_service.files().list(
                q=f"{query} and mimeType='application/vnd.google-apps.document'",
                pageSize=5,
                fields="files(id, name, mimeType)"
            ).execute()
            
            files = results.get('files', [])
            if files:
                # Prefer exact match
                exact_match = [f for f in files if f.get('name') == filename]
                if exact_match:
                    file_id = exact_match[0]['id']
                    file_type = exact_match[0].get('mimeType', '')
                    break
                else:
                    file_id = files[0]['id']
                    file_type = files[0].get('mimeType', '')
                    break
        
        if not file_id:
            return f"Error: Google Doc '{filename}' not found. Please ensure the document exists in Google Drive."
        
        # Read the document content
        doc = docs_service.documents().get(documentId=file_id).execute()
        title = doc.get('title', filename)
        body_content = doc.get('body', {}).get('content', [])
        
        # Extract text from document elements
        content = ""
        for element in body_content:
            if 'paragraph' in element:
                para = element['paragraph']
                for elem in para.get('elements', []):
                    if 'textRun' in elem:
                        content += elem['textRun'].get('content', '')
            elif 'table' in element:
                # Handle tables
                for row in element['table'].get('tableRows', []):
                    row_text = []
                    for cell in row.get('tableCells', []):
                        cell_content = cell.get('content', [])
                        cell_text = ""
                        for cell_elem in cell_content:
                            if 'paragraph' in cell_elem:
                                for para_elem in cell_elem['paragraph'].get('elements', []):
                                    if 'textRun' in para_elem:
                                        cell_text += para_elem['textRun'].get('content', '')
                        row_text.append(cell_text)
                    content += ' | '.join(row_text) + '\n'
        
        return content
        
    except Exception as e:
        return f"Error reading document '{filename}': {str(e)}"


class DriveSearchTool(BaseTool):
    """Tool for searching Google Drive files."""
    name: str = "drive_search"
    description: str = """Search for files in Google Drive. Use Google Drive query syntax:
    - name='exact filename' - exact filename match
    - name contains 'text' - search for files with text in the name (most common)
    - fullText contains 'text' - search for files containing text in content
    - mimeType='application/vnd.google-apps.document' - search for Google Docs
    - mimeType='application/vnd.google-apps.spreadsheet' - search for Google Sheets
    - Combine with AND: name contains 'strategy' AND mimeType='application/vnd.google-apps.document'
    IMPORTANT: Do NOT include file extensions like .gsheet, .gdoc - these don't exist in Drive. 
    Search for just the filename without extension.
    Examples: 
    - 'name contains "Vonga 7 Year Roadmap"' (not ".gsheet")
    - 'name contains strategy'
    - 'fullText contains Vonga strategy'
    - 'name contains company AND mimeType contains spreadsheet'"""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, query: str, max_results: int = 10) -> str:
        """Execute the search."""
        try:
            service = get_drive_service(self.creds)
            results = service.files().list(
                q=query,
                pageSize=max_results,
                fields="files(id, name, mimeType, webViewLink)"
            ).execute()
            
            files = results.get('files', [])
            
            if not files:
                return f"No files found matching query: {query}"
            
            output = []
            for file in files:
                output.append({
                    'id': file.get('id'),
                    'name': file.get('name'),
                    'mimeType': file.get('mimeType'),
                    'link': file.get('webViewLink', 'N/A')
                })
            
            result_text = f"Found {len(output)} files:\n" + "\n".join([
                f"- {f['name']} (ID: {f['id']}, Type: {f['mimeType']})"
                for f in output
            ])
            result_text += "\n\nTo read a file:"
            result_text += "\n- For Google Docs: use the file ID with drive_read_doc tool"
            result_text += "\n- For Google Sheets: use the file ID with drive_read_sheet tool"
            return result_text
        except Exception as e:
            return f"Error searching Drive: {str(e)}"
    
    async def _arun(self, query: str, max_results: int = 10) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class DriveReadDocTool(BaseTool):
    """Tool for reading content from a Google Doc."""
    name: str = "drive_read_doc"
    description: str = "Read the text content from a Google Doc by its file ID."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _extract_text(self, elements: List[Dict[str, Any]]) -> str:
        """Recursively extract text from document elements."""
        text_parts = []
        for element in elements:
            if 'paragraph' in element:
                para = element['paragraph']
                for elem in para.get('elements', []):
                    if 'textRun' in elem:
                        text_parts.append(elem['textRun'].get('content', ''))
            elif 'table' in element:
                # Handle tables - extract text from cells
                for row in element['table'].get('tableRows', []):
                    row_text = []
                    for cell in row.get('tableCells', []):
                        cell_text = self._extract_text(cell.get('content', []))
                        row_text.append(cell_text)
                    text_parts.append(' | '.join(row_text))
        return ''.join(text_parts)
    
    def _run(self, file_id: str) -> str:
        """Execute the read."""
        try:
            docs_service = get_docs_service(self.creds)
            doc = docs_service.documents().get(documentId=file_id).execute()
            
            title = doc.get('title', 'Untitled')
            content = doc.get('body', {}).get('content', [])
            
            text = self._extract_text(content)
            
            return f"Document: {title}\n\nContent:\n{text}"
        except Exception as e:
            return f"Error reading document: {str(e)}"
    
    async def _arun(self, file_id: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class DriveReadDocByUrlTool(BaseTool):
    """Tool for reading content from a Google Doc by URL."""
    name: str = "read_google_doc_by_url"
    description: str = """Read the text content from a Google Doc by its URL.
    
    REQUIRES:
    - doc_url (string): The full URL of the Google Doc (e.g., "https://docs.google.com/document/d/FILE_ID/edit")
    
    Returns the full text content of the document."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, doc_url: str) -> str:
        """Execute the read."""
        return read_google_doc_by_url(self.creds, doc_url)
    
    async def _arun(self, doc_url: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class DriveCreateDocTool(BaseTool):
    """Tool for creating a new Google Doc."""
    name: str = "drive_create_doc"
    description: str = "Create a new Google Doc with the specified title."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, title: str) -> str:
        """Execute the creation."""
        try:
            docs_service = get_docs_service(self.creds)
            doc = docs_service.documents().create(body={'title': title}).execute()
            
            file_id = doc.get('documentId')
            doc_url = doc.get('documentUrl', f"https://docs.google.com/document/d/{file_id}")
            
            return f"Google Doc created successfully! Title: {title}, ID: {file_id}, URL: {doc_url}"
        except Exception as e:
            return f"Error creating document: {str(e)}"
    
    async def _arun(self, title: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class DriveAppendDocTool(BaseTool):
    """Tool for appending text to an existing Google Doc."""
    name: str = "drive_append_doc"
    description: str = "Append text to the end of an existing Google Doc."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, file_id: str, text: str) -> str:
        """Execute the append."""
        try:
            docs_service = get_docs_service(self.creds)
            
            # First, get the document to find the end index
            doc = docs_service.documents().get(documentId=file_id).execute()
            end_index = doc.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)
            
            # Insert text at the end (minus 1 to account for the final newline)
            insert_index = end_index - 1
            
            requests = [
                {
                    'insertText': {
                        'location': {
                            'index': insert_index
                        },
                        'text': '\n' + text
                    }
                }
            ]
            
            docs_service.documents().batchUpdate(
                documentId=file_id,
                body={'requests': requests}
            ).execute()
            
            return f"Text appended successfully to document {file_id}"
        except Exception as e:
            return f"Error appending to document: {str(e)}"
    
    async def _arun(self, file_id: str, text: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class DriveReadSheetTool(BaseTool):
    """Tool for reading content from a Google Sheet."""
    name: str = "drive_read_sheet"
    description: str = """Read the content from a Google Sheet by its file ID. 
    Supports reading all tabs/sheets in the spreadsheet.
    - To read a specific tab: use 'TabName!A1:Z1000' (replace TabName with the actual tab name)
    - To read the first tab: use 'A1:Z1000' or leave range_name empty
    - If no range is specified, reads the entire first sheet/tab.
    - The tool can access ALL tabs in the spreadsheet - just specify the tab name in the range.
    Examples: 'Sheet1!A1:Z100', 'Data!A1:Z1000', 'Summary!A:Z'"""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, file_id: str, range_name: str = None) -> str:
        """Execute the read."""
        try:
            sheets_service = get_sheets_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Get spreadsheet metadata
            try:
                sheet_metadata = drive_service.files().get(fileId=file_id).execute()
                spreadsheet_name = sheet_metadata.get('name', 'Untitled Sheet')
            except Exception:
                spreadsheet_name = 'Sheet'
            
            # Get list of all sheets/tabs
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=file_id).execute()
            all_sheets = spreadsheet.get('sheets', [])
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in all_sheets]
            
            # If no range specified, read the first sheet
            if not range_name:
                if sheet_names:
                    first_sheet_name = sheet_names[0]
                    range_name = f"{first_sheet_name}!A1:Z1000"  # Read a large range
                else:
                    range_name = 'A1:Z1000'
            
            # Read the sheet data
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=file_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                # Include available tabs info even if no data
                tabs_info = f"\nAvailable tabs in this spreadsheet: {', '.join(sheet_names)}" if sheet_names else ""
                return f"Spreadsheet '{spreadsheet_name}' (ID: {file_id}) - Range '{range_name}' is empty or contains no data.{tabs_info}"
            
            # Determine which tab we're reading
            tab_name = range_name.split('!')[0] if '!' in range_name else sheet_names[0] if sheet_names else 'Sheet1'
            
            # Format as table with metadata
            output_lines = [
                f"Spreadsheet: {spreadsheet_name}",
                f"Tab/Sheet: {tab_name}",
                f"Range: {range_name}",
                f"Available tabs: {', '.join(sheet_names)}" if len(sheet_names) > 1 else "",
                ""
            ]
            
            for row in values:
                # Join cells with pipe for readability
                output_lines.append(" | ".join(str(cell) for cell in row))
            
            return "\n".join(output_lines)
        except Exception as e:
            return f"Error reading sheet: {str(e)}"
    
    async def _arun(self, file_id: str, range_name: str = None) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CreateMarketingBriefTool(BaseTool):
    """Tool for creating a formatted Marketing Campaign Brief in Google Drive."""
    name: str = "create_marketing_brief"
    description: str = """Create a beautifully formatted Marketing Campaign Brief as a Google Doc in the Marketing_Campaigns folder.
    
    REQUIRES:
    - campaign_name (string): Name of the marketing campaign
    - target_audience (string): Description of the target audience
    - key_message (string): The core message/positioning for the campaign
    - channels (string): Marketing channels to use (e.g., "Social Media, Email, Content Marketing")
    - competitor_analysis_summary (string): Summary of competitor analysis findings
    - key_tensions (string): Key tensions/problems we are trying to solve - the challenges, conflicts, or pain points the campaign addresses
    - insights (string): Key insights from research - important findings, trends, or understandings that inform the strategy
    - suggested_tactics (string): Specific tactics and recommendations
    
    The tool will create a formatted Google Doc in the Marketing_Campaigns folder with headers for each section.
    Returns the URL of the created document."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, campaign_name: str, target_audience: str, key_message: str, 
             channels: str, competitor_analysis_summary: str, key_tensions: str, 
             insights: str, suggested_tactics: str) -> str:
        """Execute the marketing brief creation."""
        try:
            drive_service = get_drive_service(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Step 1: Find or create Marketing_Campaigns folder
            folder_name = "Marketing_Campaigns"
            folder_id = None
            
            # Search for the folder
            results = drive_service.files().list(
                q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields="files(id, name)"
            ).execute()
            
            folders = results.get('files', [])
            if folders:
                folder_id = folders[0]['id']
            else:
                # Create the folder
                folder_metadata = {
                    'name': folder_name,
                    'mimeType': 'application/vnd.google-apps.folder'
                }
                folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
                folder_id = folder.get('id')
            
            # Step 2: Create the document
            doc_title = f"Campaign Brief: {campaign_name}"
            doc = docs_service.documents().create(body={'title': doc_title}).execute()
            doc_id = doc.get('documentId')
            doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
            
            # Step 3: Move document to folder
            if folder_id:
                # Get current parents
                file = drive_service.files().get(fileId=doc_id, fields='parents').execute()
                previous_parents = ",".join(file.get('parents', []))
                # Move to new folder
                drive_service.files().update(
                    fileId=doc_id,
                    addParents=folder_id,
                    removeParents=previous_parents,
                    fields='id, parents'
                ).execute()
            
            # Step 4: Format the document with headers and content
            # Get the document structure to find insertion point
            doc_content = docs_service.documents().get(documentId=doc_id).execute()
            body = doc_content.get('body', {})
            content = body.get('content', [])
            
            # Find insertion point - start at beginning (after title paragraph)
            insert_index = 1
            if content:
                # Get the end index of the first paragraph (title)
                first_para = content[0] if content else {}
                if 'paragraph' in first_para:
                    insert_index = first_para.get('endIndex', 1) - 1  # Before the final newline
            
            # Build formatted content - we'll insert all text first, then format
            requests = []
            current_index = insert_index
            
            # Build all content sections
            sections = [
                ("Campaign Overview", f"Campaign Name: {campaign_name}"),
                ("Target Audience", target_audience),
                ("Key Message", key_message),
                ("Marketing Channels", channels),
                ("Key Tensions", key_tensions),
                ("Insights", insights),
                ("Competitor Analysis", competitor_analysis_summary),
                ("Suggested Tactics", suggested_tactics),
            ]
            
            # Track heading positions for formatting
            heading_positions = []
            
            # Insert all content sequentially
            for heading_text, body_text in sections:
                # Insert heading
                heading_start = current_index
                heading_text_full = heading_text + '\n'
                requests.append({
                    'insertText': {
                        'location': {'index': current_index},
                        'text': heading_text_full
                    }
                })
                heading_end = current_index + len(heading_text)
                heading_positions.append((heading_start, heading_end))
                current_index += len(heading_text_full)
                
                # Insert body text
                body_text_full = body_text + '\n\n'
                requests.append({
                    'insertText': {
                        'location': {'index': current_index},
                        'text': body_text_full
                    }
                })
                current_index += len(body_text_full)
            
            # Apply heading styles (after all text is inserted)
            for heading_start, heading_end in heading_positions:
                requests.append({
                    'updateParagraphStyle': {
                        'range': {
                            'startIndex': heading_start,
                            'endIndex': heading_end
                        },
                        'paragraphStyle': {
                            'namedStyleType': 'HEADING_1'
                        },
                        'fields': 'namedStyleType'
                    }
                })
            
            # Execute batch update
            if requests:
                docs_service.documents().batchUpdate(
                    documentId=doc_id,
                    body={'requests': requests}
                ).execute()
            
            return f"✅ Marketing Campaign Brief created successfully!\n\nCampaign: {campaign_name}\nDocument URL: {doc_url}"
            
        except Exception as e:
            import traceback
            return f"❌ Error creating marketing brief: {str(e)}\n\nDebug: {traceback.format_exc()[-500:]}"
    
    async def _arun(self, campaign_name: str, target_audience: str, key_message: str,
                    channels: str, competitor_analysis_summary: str, key_tensions: str,
                    insights: str, suggested_tactics: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CreateMicrositeBuildPromptTool(BaseTool):
    """Tool for creating a microsite build prompt document."""
    name: str = "create_microsite_build_prompt"
    description: str = """Create a comprehensive build prompt document for a microsite.
    
    REQUIRES:
    - company_name (string): Name of the company/client
    - hero_headline (string): Final polished hero headline
    - hero_subheadline (string): Final polished hero subheadline
    - hero_image_prompt (string): Detailed prompt for NanoBanana image generation
    - value_prop_1_headline (string): Value proposition 1 headline
    - value_prop_1_copy (string): Value proposition 1 copy
    - value_prop_2_headline (string): Value proposition 2 headline
    - value_prop_2_copy (string): Value proposition 2 copy
    - value_prop_3_headline (string): Value proposition 3 headline
    - value_prop_3_copy (string): Value proposition 3 copy
    - features_section (string): Features and benefits section
    - social_proof (string): Social proof section (if applicable)
    - cta_headline (string): Call-to-action headline
    - cta_button_text (string): CTA button text
    - cta_subtext (string): CTA supporting text
    - design_notes (string): Design and styling notes
    - html_structure_description (string): Description of HTML structure and layout
    
    This creates a Google Doc with detailed prompts for image generation (NanoBanana) and microsite building (Cursor)."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, hero_headline: str, hero_subheadline: str,
             hero_image_prompt: str, value_prop_1_headline: str, value_prop_1_copy: str,
             value_prop_2_headline: str, value_prop_2_copy: str,
             value_prop_3_headline: str, value_prop_3_copy: str,
             features_section: str, social_proof: str,
             cta_headline: str, cta_button_text: str, cta_subtext: str,
             design_notes: str, html_structure_description: str) -> str:
        """Create the build prompt document."""
        try:
            from datetime import datetime
            docs_service = get_docs_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Create document
            doc_title = f"Microsite Build Prompt: {company_name}"
            doc = docs_service.documents().create(body={'title': doc_title}).execute()
            doc_id = doc.get('documentId')
            doc_url = doc.get('documentUrl', f"https://docs.google.com/document/d/{doc_id}")
            
            # Try to move to Microsite_Builds folder
            folder_id = None
            try:
                results = drive_service.files().list(
                    q="name='Microsite_Builds' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                    fields="files(id, name)"
                ).execute()
                files = results.get('files', [])
                if files:
                    folder_id = files[0]['id']
                else:
                    folder_metadata = {
                        'name': 'Microsite_Builds',
                        'mimeType': 'application/vnd.google-apps.folder'
                    }
                    folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
                    folder_id = folder.get('id')
            except Exception as e:
                print(f"Warning: Could not create/find Microsite_Builds folder: {str(e)}")
            
            if folder_id:
                try:
                    file = drive_service.files().get(fileId=doc_id, fields='parents').execute()
                    previous_parents = ",".join(file.get('parents', []))
                    drive_service.files().update(
                        fileId=doc_id,
                        addParents=folder_id,
                        removeParents=previous_parents,
                        fields='id, parents'
                    ).execute()
                except Exception:
                    pass
            
            # Build document content
            doc_content = docs_service.documents().get(documentId=doc_id).execute()
            body = doc_content.get('body', {})
            content = body.get('content', [])
            insert_index = 1
            if content:
                first_para = content[0] if content else {}
                if 'paragraph' in first_para:
                    insert_index = first_para.get('endIndex', 1) - 1
            
            requests = []
            current_index = insert_index
            heading_positions = []
            
            # Title section
            title_heading = f"MICROSITE BUILD PROMPT: {company_name}"
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': title_heading + '\n\n'
                }
            })
            title_end = current_index + len(title_heading)
            heading_positions.append((current_index, title_end))
            current_index = title_end + 2
            
            # IMAGE GENERATION PROMPTS (NanoBanana)
            image_heading = "IMAGE GENERATION PROMPTS (NanoBanana)"
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': image_heading + '\n'
                }
            })
            image_heading_end = current_index + len(image_heading)
            heading_positions.append((current_index, image_heading_end))
            current_index = image_heading_end + 1
            
            image_content = f"""HERO IMAGE PROMPT:
{hero_image_prompt}

IMPORTANT: Use this exact prompt with NanoBanana (Google Gemini 2.5 Flash Image) to generate the hero background image.
Style: Moody, cinematic, professional. Match Vonga's brand aesthetic (aqua and coral energy lines, deep navy background #0A1422).
Resolution: 1920x1080 or higher for hero backgrounds.
"""
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': image_content + '\n\n'
                }
            })
            current_index += len(image_content) + 2
            
            # MICROSITE BUILD PROMPT (Cursor)
            build_heading = "MICROSITE BUILD PROMPT (Cursor)"
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': build_heading + '\n'
                }
            })
            build_heading_end = current_index + len(build_heading)
            heading_positions.append((current_index, build_heading_end))
            current_index = build_heading_end + 1
            
            build_prompt = f"""Build a complete, production-ready single-page microsite for {company_name} using the following specifications:

HERO SECTION:
- Headline: {hero_headline}
- Subheadline: {hero_subheadline}
- Hero Image: Use the image generated from the prompt above (save as assets/hero_{company_name.lower().replace(' ', '_')}.png)

VALUE PROPOSITIONS:
1. Headline: {value_prop_1_headline}
   Copy: {value_prop_1_copy}

2. Headline: {value_prop_2_headline}
   Copy: {value_prop_2_copy}

3. Headline: {value_prop_3_headline}
   Copy: {value_prop_3_copy}

FEATURES & BENEFITS:
{features_section}

SOCIAL PROOF:
{social_proof if social_proof else "None specified"}

CALL TO ACTION:
- Headline: {cta_headline}
- Button Text: {cta_button_text}
- Supporting Text: {cta_subtext}

DESIGN & STYLING:
{design_notes}

HTML STRUCTURE:
{html_structure_description}

TECHNICAL REQUIREMENTS:
- Single-page HTML/CSS/JS application
- Responsive design (mobile-first)
- Use Tailwind CSS (CDN) or inline styles
- Modern, clean design matching Vonga's brand aesthetic
- Background: Deep navy (#0A1422)
- Accent colors: Aqua (#33BECC), Coral (#FF7F50)
- Smooth scroll behavior
- Optimized images (WebP preferred)
- Fast loading times

IMPLEMENTATION NOTES:
- All copy is final and polished - use exactly as provided
- Hero image should be full-width with overlay text
- Value props should be clearly separated with visual hierarchy
- CTA should be prominent and clearly visible
- Follow Vonga brand guidelines (moody, cinematic aesthetic)
- Ensure accessibility (proper heading hierarchy, alt text, ARIA labels)
"""
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': build_prompt + '\n'
                }
            })
            
            # Apply heading styles
            for heading_start, heading_end in heading_positions:
                requests.append({
                    'updateParagraphStyle': {
                        'range': {
                            'startIndex': heading_start,
                            'endIndex': heading_end
                        },
                        'paragraphStyle': {
                            'namedStyleType': 'HEADING_1' if heading_start == insert_index else 'HEADING_2'
                        },
                        'fields': 'namedStyleType'
                    }
                })
            
            # Execute batch update
            if requests:
                docs_service.documents().batchUpdate(
                    documentId=doc_id,
                    body={'requests': requests}
                ).execute()
            
            return f"Microsite build prompt document created successfully! URL: {doc_url}"
        except Exception as e:
            import traceback
            return f"Error creating build prompt document: {str(e)}\n{traceback.format_exc()}"
    
    async def _arun(self, company_name: str, hero_headline: str, hero_subheadline: str,
                    hero_image_prompt: str, value_prop_1_headline: str, value_prop_1_copy: str,
                    value_prop_2_headline: str, value_prop_2_copy: str,
                    value_prop_3_headline: str, value_prop_3_copy: str,
                    features_section: str, social_proof: str,
                    cta_headline: str, cta_button_text: str, cta_subtext: str,
                    design_notes: str, html_structure_description: str) -> str:
        raise NotImplementedError("Async not implemented")


class CreateMicrositeSpecTool(BaseTool):
    """Tool for creating a structured Microsite Spec (Pitch Deck) in Google Drive."""
    name: str = "create_microsite_spec"
    description: str = """Create a structured Microsite Spec document formatted as a "pitch deck" that another agent can interpret to build a complete microsite (copy, images, videos) with minimal human interaction.
    
    This is a PROMOTIONAL PITCH DECK for a specific prospect, not the actual Vonga product documentation.
    
    REQUIRES:
    - company_name (string): Name of the target company
    - hero_headline (string): Main headline for hero section (personalized to their pain point)
    - hero_subheadline (string): Supporting subheadline
    - hero_image_suggestion (string): Description/suggestion for hero image or video
    - value_prop_1_headline (string): First value proposition headline
    - value_prop_1_copy (string): Body copy for first value prop
    - value_prop_1_media_suggestion (string): Image/video suggestion for first value prop
    - value_prop_2_headline (string): Second value proposition headline
    - value_prop_2_copy (string): Body copy for second value prop
    - value_prop_2_media_suggestion (string): Image/video suggestion for second value prop
    - value_prop_3_headline (string): Third value proposition headline
    - value_prop_3_copy (string): Body copy for third value prop
    - value_prop_3_media_suggestion (string): Image/video suggestion for third value prop
    - features_section (string): Detailed features/benefits section with copy and media suggestions
    - social_proof (string): Testimonials, case studies, or proof points (if applicable, otherwise "N/A")
    - cta_headline (string): Call-to-action headline
    - cta_button_text (string): CTA button text
    - cta_subtext (string): Supporting text for CTA section
    - design_notes (string): Color scheme, tone, visual style recommendations
    
    The tool will create a formatted Google Doc named "Microsite_Spec_[Company]" in the Microsite_Specs folder.
    Returns the URL of the created document."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, hero_headline: str, hero_subheadline: str, 
             hero_image_suggestion: str, value_prop_1_headline: str, value_prop_1_copy: str,
             value_prop_1_media_suggestion: str, value_prop_2_headline: str, value_prop_2_copy: str,
             value_prop_2_media_suggestion: str, value_prop_3_headline: str, value_prop_3_copy: str,
             value_prop_3_media_suggestion: str, features_section: str, social_proof: str,
             cta_headline: str, cta_button_text: str, cta_subtext: str, design_notes: str) -> str:
        """Execute the creation."""
        try:
            from datetime import datetime
            drive_service = get_drive_service(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Create the document
            doc_title = f"Microsite_Spec_{company_name}"
            doc = docs_service.documents().create(body={'title': doc_title}).execute()
            doc_id = doc.get('documentId')
            doc_url = doc.get('documentUrl', f"https://docs.google.com/document/d/{doc_id}")
            
            # Create or find Microsite_Specs folder
            folder_id = None
            try:
                # Search for existing folder
                results = drive_service.files().list(
                    q="name='Microsite_Specs' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                    fields="files(id, name)"
                ).execute()
                files = results.get('files', [])
                if files:
                    folder_id = files[0]['id']
                else:
                    # Create folder
                    folder_metadata = {
                        'name': 'Microsite_Specs',
                        'mimeType': 'application/vnd.google-apps.folder'
                    }
                    folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
                    folder_id = folder.get('id')
            except Exception as e:
                print(f"Warning: Could not create/find Microsite_Specs folder: {str(e)}")
            
            # Move document to folder if folder exists
            if folder_id:
                try:
                    drive_service.files().update(
                        fileId=doc_id,
                        addParents=folder_id,
                        fields='id, parents'
                    ).execute()
                except Exception:
                    pass  # If move fails, continue anyway
            
            # Build structured content
            current_date = datetime.now().strftime('%Y-%m-%d')
            
            requests = []
            current_index = 1
            
            # Title
            title_text = f"Microsite Spec: {company_name}\n"
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': title_text
                }
            })
            title_end = current_index + len(title_text) - 1
            current_index += len(title_text)
            
            # Format title as heading 1
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': 1,
                        'endIndex': title_end
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_1'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            # Metadata
            metadata_text = f"\nTarget Company: {company_name}\nCreated: {current_date}\n\n"
            metadata_text += "NOTE: This is a PROMOTIONAL PITCH DECK for this specific prospect, formatted for another agent to build a complete microsite (copy, images, videos) with minimal human interaction.\n\n"
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': metadata_text
                }
            })
            current_index += len(metadata_text)
            
            # Track heading positions
            heading_positions = []
            
            # Hero Section
            hero_heading = "HERO SECTION"
            hero_content = f"Headline: {hero_headline}\n\n"
            hero_content += f"Subheadline: {hero_subheadline}\n\n"
            hero_content += f"Image/Video Suggestion: {hero_image_suggestion}\n\n"
            
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': hero_heading + '\n'
                }
            })
            heading_end = current_index + len(hero_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': hero_content + '\n'
                }
            })
            current_index += len(hero_content) + 1
            
            # Value Propositions
            vp_heading = "VALUE PROPOSITIONS"
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': vp_heading + '\n'
                }
            })
            heading_end = current_index + len(vp_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            vp_content = f"Value Prop 1:\n"
            vp_content += f"Headline: {value_prop_1_headline}\n"
            vp_content += f"Copy: {value_prop_1_copy}\n"
            vp_content += f"Media Suggestion: {value_prop_1_media_suggestion}\n\n"
            
            vp_content += f"Value Prop 2:\n"
            vp_content += f"Headline: {value_prop_2_headline}\n"
            vp_content += f"Copy: {value_prop_2_copy}\n"
            vp_content += f"Media Suggestion: {value_prop_2_media_suggestion}\n\n"
            
            vp_content += f"Value Prop 3:\n"
            vp_content += f"Headline: {value_prop_3_headline}\n"
            vp_content += f"Copy: {value_prop_3_copy}\n"
            vp_content += f"Media Suggestion: {value_prop_3_media_suggestion}\n\n"
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': vp_content + '\n'
                }
            })
            current_index += len(vp_content) + 1
            
            # Features Section
            features_heading = "FEATURES & BENEFITS"
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': features_heading + '\n'
                }
            })
            heading_end = current_index + len(features_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': features_section + '\n\n'
                }
            })
            current_index += len(features_section) + 2
            
            # Social Proof
            social_heading = "SOCIAL PROOF"
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': social_heading + '\n'
                }
            })
            heading_end = current_index + len(social_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': social_proof + '\n\n'
                }
            })
            current_index += len(social_proof) + 2
            
            # CTA Section
            cta_heading = "CALL TO ACTION"
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': cta_heading + '\n'
                }
            })
            heading_end = current_index + len(cta_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            cta_content = f"Headline: {cta_headline}\n\n"
            cta_content += f"Button Text: {cta_button_text}\n\n"
            cta_content += f"Supporting Text: {cta_subtext}\n\n"
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': cta_content + '\n'
                }
            })
            current_index += len(cta_content) + 1
            
            # Design Notes
            design_heading = "DESIGN NOTES"
            heading_start = current_index
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': design_heading + '\n'
                }
            })
            heading_end = current_index + len(design_heading)
            heading_positions.append((heading_start, heading_end))
            current_index = heading_end + 1
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': design_notes + '\n'
                }
            })
            
            # Apply heading styles
            for heading_start, heading_end in heading_positions:
                requests.append({
                    'updateParagraphStyle': {
                        'range': {
                            'startIndex': heading_start,
                            'endIndex': heading_end
                        },
                        'paragraphStyle': {
                            'namedStyleType': 'HEADING_2'
                        },
                        'fields': 'namedStyleType'
                    }
                })
            
            # Execute batch update
            if requests:
                docs_service.documents().batchUpdate(
                    documentId=doc_id,
                    body={'requests': requests}
                ).execute()
            
            return f"Microsite spec created successfully! URL: {doc_url}"
        except Exception as e:
            import traceback
            return f"Error creating microsite spec: {str(e)}\n{traceback.format_exc()}"
    
    async def _arun(self, company_name: str, hero_headline: str, hero_subheadline: str, 
                    hero_image_suggestion: str, value_prop_1_headline: str, value_prop_1_copy: str,
                    value_prop_1_media_suggestion: str, value_prop_2_headline: str, value_prop_2_copy: str,
                    value_prop_2_media_suggestion: str, value_prop_3_headline: str, value_prop_3_copy: str,
                    value_prop_3_media_suggestion: str, features_section: str, social_proof: str,
                    cta_headline: str, cta_button_text: str, cta_subtext: str, design_notes: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_drive_tools(creds: Credentials) -> List[BaseTool]:
    """Get all Drive tools."""
    return [
        DriveSearchTool(creds=creds),
        DriveReadDocTool(creds=creds),
        DriveReadDocByUrlTool(creds=creds),
        DriveReadSheetTool(creds=creds),
        DriveCreateDocTool(creds=creds),
        DriveAppendDocTool(creds=creds),
        CreateMicrositeSpecTool(creds=creds),
        CreateMicrositeBuildPromptTool(creds=creds)
    ]


class CreateResearchReportTool(BaseTool):
    """Tool for creating a formatted Marketing Research Report in Google Drive."""
    name: str = "create_research_report"
    description: str = """Create a comprehensive Marketing Research Report as a formatted Google Doc in the Marketing_Research folder.

    REQUIRES:
    - research_title (string): Title of the research report (e.g., "Industry Trends: SaaS Marketing 2024", "Competitor Analysis: Company X")
    - research_type (string): Type of research (e.g., "Industry Trends", "Competitor Analysis", "Market Research")
    - research_summary (string): Executive summary of the research findings
    - detailed_findings (string): Comprehensive detailed findings with specific examples, data points, case studies, etc.
    - key_insights (string): Key actionable insights from the research
    - implications_for_vonga (string): Strategic implications and recommendations for Vonga based on the research

    The tool will create a formatted Google Doc in the Marketing_Research folder with proper headers and structure.
    Returns the URL of the created document."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, research_title: str, research_type: str, research_summary: str, 
             detailed_findings: str, key_insights: str, implications_for_vonga: str) -> str:
        """Execute the research report creation."""
        try:
            drive_service = get_drive_service(self.creds)
            docs_service = get_docs_service(self.creds)
            
            # Step 1: Find or create Marketing_Research folder
            folder_name = "Marketing_Research"
            folder_id = None
            
            # Search for the folder
            results = drive_service.files().list(
                q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields="files(id, name)"
            ).execute()
            
            folders = results.get('files', [])
            if folders:
                folder_id = folders[0]['id']
            else:
                # Create the folder
                folder_metadata = {
                    'name': folder_name,
                    'mimeType': 'application/vnd.google-apps.folder'
                }
                folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
                folder_id = folder.get('id')
            
            # Step 2: Create the document
            doc_title = f"Research Report: {research_title}"
            doc = docs_service.documents().create(body={'title': doc_title}).execute()
            doc_id = doc.get('documentId')
            doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
            
            # Step 3: Move document to folder
            if folder_id:
                drive_service.files().update(
                    fileId=doc_id,
                    addParents=folder_id,
                    fields='id, parents'
                ).execute()
            
            # Step 4: Format the document with content
            from datetime import datetime
            current_date = datetime.now().strftime('%Y-%m-%d')
            
            requests = []
            current_index = 1
            
            # Title
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': f'{research_title}\n'
                }
            })
            current_index += len(research_title) + 1
            
            # Format title as heading 1
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': 1,
                        'endIndex': current_index - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_1'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            # Metadata
            metadata_text = f'\nResearch Type: {research_type}\nDate: {current_date}\n\n'
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': metadata_text
                }
            })
            current_index += len(metadata_text)
            
            # Executive Summary section
            summary_text = 'Executive Summary\n'
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': summary_text
                }
            })
            current_index += len(summary_text)
            
            # Format as heading 2
            summary_start = current_index - len(summary_text)
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': summary_start,
                        'endIndex': current_index - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_2'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': f'{research_summary}\n\n'
                }
            })
            current_index += len(research_summary) + 2
            
            # Detailed Findings section
            findings_text = 'Detailed Findings\n'
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': findings_text
                }
            })
            current_index += len(findings_text)
            
            # Format as heading 2
            findings_start = current_index - len(findings_text)
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': findings_start,
                        'endIndex': current_index - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_2'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': f'{detailed_findings}\n\n'
                }
            })
            current_index += len(detailed_findings) + 2
            
            # Key Insights section
            insights_text = 'Key Insights\n'
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': insights_text
                }
            })
            current_index += len(insights_text)
            
            # Format as heading 2
            insights_start = current_index - len(insights_text)
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': insights_start,
                        'endIndex': current_index - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_2'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': f'{key_insights}\n\n'
                }
            })
            current_index += len(key_insights) + 2
            
            # Implications for Vonga section
            implications_text = 'Implications for Vonga\n'
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': implications_text
                }
            })
            current_index += len(implications_text)
            
            # Format as heading 2
            implications_start = current_index - len(implications_text)
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': implications_start,
                        'endIndex': current_index - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_2'
                    },
                    'fields': 'namedStyleType'
                }
            })
            
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': f'{implications_for_vonga}\n'
                }
            })
            
            # Execute all formatting requests
            docs_service.documents().batchUpdate(
                documentId=doc_id,
                body={'requests': requests}
            ).execute()
            
            return f"Research report created successfully! URL: {doc_url}"
        except Exception as e:
            import traceback
            return f"Error creating research report: {str(e)}\n{traceback.format_exc()}"


def get_marketing_tools(creds: Credentials) -> List[BaseTool]:
    """Get marketing-specific tools."""
    from tools.marketing_tools import get_marketing_analytics_tools
    tools = [
        CreateMarketingBriefTool(creds=creds),
        CreateResearchReportTool(creds=creds),
    ]
    # Add analytics and brand governance tools
    tools.extend(get_marketing_analytics_tools(creds))
    return tools

