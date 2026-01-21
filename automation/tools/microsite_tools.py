"""
Microsite management tools for Vonga OS.
Tools for cataloging and retrieving microsite specs.
"""

from typing import List, Dict, Optional
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import Field


def get_drive_service(creds: Credentials):
    """Get Drive API service."""
    return build('drive', 'v3', credentials=creds)


def get_sheets_service(creds: Credentials):
    """Get Sheets API service."""
    return build('sheets', 'v4', credentials=creds)


def find_crm_spreadsheet(creds: Credentials):
    """Find the Vonga_CRM spreadsheet."""
    drive_service = get_drive_service(creds)
    results = drive_service.files().list(
        q="name='Vonga_CRM' and mimeType='application/vnd.google-apps.spreadsheet'",
        fields="files(id, name)"
    ).execute()
    files = results.get('files', [])
    if files:
        return files[0]['id']
    return None


class ListMicrositeSpecsTool(BaseTool):
    """Tool for listing all microsite specs from CRM."""
    name: str = "list_microsite_specs"
    description: str = """List all microsite specs from the CRM Pipeline tab.
    
    Returns a list of microsite specs with:
    - company_name: Company name
    - spec_url: URL of the microsite spec Google Doc
    - created_date: When it was created (if available)
    
    Use this to get all available microsite specs for building."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self) -> str:
        """Execute the list operation."""
        try:
            spreadsheet_id = find_crm_spreadsheet(self.creds)
            if not spreadsheet_id:
                return "Error: Vonga_CRM spreadsheet not found."
            
            sheets_service = get_sheets_service(self.creds)
            
            # Get sheet names
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
            
            # Look for Pipeline tab
            pipeline_sheet = None
            for sheet_name in sheet_names:
                if 'pipeline' in sheet_name.lower():
                    pipeline_sheet = sheet_name
                    break
            
            if not pipeline_sheet:
                pipeline_sheet = sheet_names[0] if sheet_names else 'Sheet1'
            
            # Read the Pipeline tab
            range_name = f"{pipeline_sheet}!A:Z"
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            if not values or len(values) < 2:
                return "No microsite specs found in CRM."
            
            # Find header row
            header_row = values[0]
            company_col = None
            spec_link_col = None
            
            for idx, header in enumerate(header_row):
                header_lower = str(header).lower()
                if 'company' in header_lower and 'name' in header_lower:
                    company_col = idx
                elif 'microsite' in header_lower and 'spec' in header_lower and 'link' in header_lower:
                    spec_link_col = idx
            
            if company_col is None:
                return "Error: Could not find 'Company Name' column in CRM."
            
            # Extract microsite specs
            specs = []
            for row_idx, row in enumerate(values[1:], start=2):
                if len(row) > max(company_col, spec_link_col if spec_link_col else 0):
                    # Handle cell values that might be lists
                    company_name_raw = row[company_col] if company_col < len(row) and row[company_col] else ""
                    if isinstance(company_name_raw, list):
                        company_name = company_name_raw[0].strip() if company_name_raw and isinstance(company_name_raw[0], str) else str(company_name_raw[0]) if company_name_raw else ""
                    else:
                        company_name = company_name_raw.strip() if isinstance(company_name_raw, str) else str(company_name_raw) if company_name_raw else ""
                    
                    spec_url_raw = row[spec_link_col] if spec_link_col and spec_link_col < len(row) and row[spec_link_col] else ""
                    if isinstance(spec_url_raw, list):
                        spec_url = spec_url_raw[0].strip() if spec_url_raw and isinstance(spec_url_raw[0], str) else str(spec_url_raw[0]) if spec_url_raw else ""
                    else:
                        spec_url = spec_url_raw.strip() if isinstance(spec_url_raw, str) else str(spec_url_raw) if spec_url_raw else ""
                    
                    if company_name and spec_url and spec_url.startswith('http'):
                        specs.append({
                            'company_name': company_name,
                            'spec_url': spec_url,
                            'row': row_idx
                        })
            
            if not specs:
                return "No microsite specs with valid URLs found in CRM."
            
            # Format output
            output = f"Found {len(specs)} microsite spec(s):\n\n"
            for idx, spec in enumerate(specs, 1):
                output += f"{idx}. {spec['company_name']}\n   URL: {spec['spec_url']}\n\n"
            
            return output
            
        except Exception as e:
            import traceback
            return f"Error listing microsite specs: {str(e)}\n{traceback.format_exc()}"
    
    async def _arun(self) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_microsite_specs_list(creds: Credentials) -> List[Dict[str, str]]:
    """
    Get a list of microsite specs from CRM for dropdown.
    Returns list of dicts with 'company_name' and 'spec_url'.
    """
    try:
        spreadsheet_id = find_crm_spreadsheet(creds)
        if not spreadsheet_id:
            return []
        
        sheets_service = get_sheets_service(creds)
        
        # Get sheet names
        spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
        
        # Look for Pipeline tab
        pipeline_sheet = None
        for sheet_name in sheet_names:
            if 'pipeline' in sheet_name.lower():
                pipeline_sheet = sheet_name
                break
        
        if not pipeline_sheet:
            pipeline_sheet = sheet_names[0] if sheet_names else 'Sheet1'
        
        # Read the Pipeline tab
        range_name = f"{pipeline_sheet}!A:Z"
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        if not values or len(values) < 2:
            return []
        
        # Find header row
        header_row = values[0]
        company_col = None
        spec_link_col = None
        
        for idx, header in enumerate(header_row):
            header_lower = str(header).lower()
            if 'company' in header_lower and 'name' in header_lower:
                company_col = idx
            elif 'microsite' in header_lower and 'spec' in header_lower and 'link' in header_lower:
                spec_link_col = idx
        
        if company_col is None:
            return []
        
        # Extract microsite specs
        specs = []
        for row in values[1:]:
            if len(row) > max(company_col, spec_link_col if spec_link_col else 0):
                # Handle cell values that might be lists
                company_name_raw = row[company_col] if company_col < len(row) and row[company_col] else ""
                if isinstance(company_name_raw, list):
                    company_name = company_name_raw[0].strip() if company_name_raw and isinstance(company_name_raw[0], str) else str(company_name_raw[0]) if company_name_raw else ""
                else:
                    company_name = company_name_raw.strip() if isinstance(company_name_raw, str) else str(company_name_raw) if company_name_raw else ""
                
                spec_url_raw = row[spec_link_col] if spec_link_col and spec_link_col < len(row) and row[spec_link_col] else ""
                if isinstance(spec_url_raw, list):
                    spec_url = spec_url_raw[0].strip() if spec_url_raw and isinstance(spec_url_raw[0], str) else str(spec_url_raw[0]) if spec_url_raw else ""
                else:
                    spec_url = spec_url_raw.strip() if isinstance(spec_url_raw, str) else str(spec_url_raw) if spec_url_raw else ""
                
                if company_name and spec_url and spec_url.startswith('http'):
                    specs.append({
                        'company_name': company_name,
                        'spec_url': spec_url
                    })
        
        return specs
        
    except Exception as e:
        print(f"Error getting microsite specs list: {str(e)}")
        return []


def get_microsite_tools(creds: Credentials) -> List[BaseTool]:
    """Get all microsite management tools."""
    return [ListMicrositeSpecsTool(creds=creds)]




