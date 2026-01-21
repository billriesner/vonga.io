"""
CRM tools for Vonga OS.
Interacts with Vonga_CRM Google Sheet for sales pipeline management.
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import Field


def get_sheets_service(creds: Credentials):
    """Get Sheets API service."""
    return build('sheets', 'v4', credentials=creds)


def get_drive_service(creds: Credentials):
    """Get Drive API service."""
    return build('drive', 'v3', credentials=creds)


def find_crm_spreadsheet(creds: Credentials):
    """Find the Vonga_CRM spreadsheet and return its ID."""
    drive_service = get_drive_service(creds)
    sheet_name = "Vonga_CRM"
    
    results = drive_service.files().list(
        q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
        fields="files(id, name)"
    ).execute()
    
    files = results.get('files', [])
    if not files:
        raise ValueError(f"Google Sheet '{sheet_name}' not found. Please create the sheet first.")
    
    return files[0]['id']


def get_sheet_names(creds: Credentials, spreadsheet_id: str) -> Dict[str, str]:
    """Get sheet names and their IDs from the spreadsheet."""
    sheets_service = get_sheets_service(creds)
    spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    
    sheet_map = {}
    for sheet in spreadsheet.get('sheets', []):
        sheet_id = sheet['properties']['sheetId']
        sheet_name = sheet['properties']['title']
        sheet_map[sheet_name] = sheet_id
    
    return sheet_map


class LogSalesActivityTool(BaseTool):
    """Tool for logging sales activities to the Activity_Log tab."""
    name: str = "log_sales_activity"
    description: str = """Log a sales activity to the Activity_Log tab in Vonga_CRM.
    
    REQUIRES:
    - company_name (string): Name of the company
    - action (string): Type of action (e.g., "Research", "Pitch Drafted", "Email Sent", "Follow-up Scheduled")
    - notes (string): Detailed notes about the activity
    
    The tool will append a new row with timestamp, company name, action, and notes."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, action: str, notes: str) -> str:
        """Execute the activity logging."""
        try:
            spreadsheet_id = find_crm_spreadsheet(self.creds)
            sheets_service = get_sheets_service(self.creds)
            
            # Get sheet names to find Activity_Log tab
            sheet_map = get_sheet_names(self.creds, spreadsheet_id)
            
            if "Activity_Log" not in sheet_map:
                # Try to create the sheet if it doesn't exist
                try:
                    requests = [{
                        'addSheet': {
                            'properties': {
                                'title': 'Activity_Log'
                            }
                        }
                    }]
                    sheets_service.spreadsheets().batchUpdate(
                        spreadsheetId=spreadsheet_id,
                        body={'requests': requests}
                    ).execute()
                    # Add header row
                    sheets_service.spreadsheets().values().update(
                        spreadsheetId=spreadsheet_id,
                        range='Activity_Log!A1:D1',
                        valueInputOption='RAW',
                        body={'values': [['Timestamp', 'Company Name', 'Action', 'Notes']]}
                    ).execute()
                except Exception as e:
                    return f"Error: Activity_Log tab not found and could not be created: {str(e)}"
            
            # Append the activity
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            values = [[timestamp, company_name, action, notes]]
            
            sheets_service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range='Activity_Log!A:D',
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': values}
            ).execute()
            
            return f"Activity logged successfully: {action} for {company_name}"
            
        except Exception as e:
            return f"Error logging activity: {str(e)}"
    
    async def _arun(self, company_name: str, action: str, notes: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class UpdateDealStageTool(BaseTool):
    """Tool for updating the deal stage in the Pipeline tab."""
    name: str = "update_deal_stage"
    description: str = """Update the Stage column for a company in the Pipeline tab of Vonga_CRM.
    
    REQUIRES:
    - company_name (string): Name of the company to update
    - new_stage (string): New stage value (e.g., "Research", "Pitch Drafted", "In Negotiation", "Closed Won", "Closed Lost")
    
    The tool will find the company in the Pipeline tab and update its Stage column."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, new_stage: str) -> str:
        """Execute the stage update."""
        try:
            spreadsheet_id = find_crm_spreadsheet(self.creds)
            sheets_service = get_sheets_service(self.creds)
            
            # Read the Pipeline tab to find the company
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='Pipeline!A:Z'
            ).execute()
            
            values = result.get('values', [])
            if not values:
                return f"Error: Pipeline tab is empty or not found."
            
            # Find header row and locate Company Name and Stage columns
            header_row = values[0]
            try:
                company_col = header_row.index('Company Name')
                stage_col = header_row.index('Stage')
            except ValueError as e:
                return f"Error: Required columns not found in Pipeline tab. Expected 'Company Name' and 'Stage' columns. {str(e)}"
            
            # Find the company row
            company_row = None
            for idx, row in enumerate(values[1:], start=2):  # Start from row 2 (skip header)
                if len(row) > company_col and row[company_col].strip().lower() == company_name.strip().lower():
                    company_row = idx
                    break
            
            if not company_row:
                return f"Error: Company '{company_name}' not found in Pipeline tab. Use add_new_lead to add it first."
            
            # Update the Stage column
            range_name = f'Pipeline!{chr(65 + stage_col)}{company_row}'  # Convert column index to letter (A=0, B=1, etc.)
            sheets_service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body={'values': [[new_stage]]}
            ).execute()
            
            return f"Deal stage updated successfully: {company_name} -> {new_stage}"
            
        except Exception as e:
            return f"Error updating deal stage: {str(e)}"
    
    async def _arun(self, company_name: str, new_stage: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class AddNewLeadTool(BaseTool):
    """Tool for adding a new lead to the Pipeline tab."""
    name: str = "add_new_lead"
    description: str = """Add a new lead/company to the Pipeline tab in Vonga_CRM if it doesn't already exist.
    
    REQUIRES:
    - company_data (dict): Dictionary containing company information. Should include:
      * company_name (required)
      * website (optional)
      * contact_name (optional)
      * contact_email (optional)
      * stage (optional, default: "Research")
      * notes (optional)
      * microsite_spec_link (optional)
    
    The tool will check if the company exists, and if not, add it as a new row."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_data: Dict[str, Any]) -> str:
        """Execute the lead addition."""
        try:
            import json
            # Handle both dict and JSON string inputs
            if isinstance(company_data, str):
                company_data = json.loads(company_data)
            
            spreadsheet_id = find_crm_spreadsheet(self.creds)
            sheets_service = get_sheets_service(self.creds)
            
            # Read the Pipeline tab
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='Pipeline!A:Z'
            ).execute()
            
            values = result.get('values', [])
            
            # If empty, create header row
            if not values:
                headers = ['Company Name', 'Website', 'Contact Name', 'Contact Email', 'Stage', 'Notes', 'Microsite Spec Link']
                sheets_service.spreadsheets().values().update(
                    spreadsheetId=spreadsheet_id,
                    range='Pipeline!A1',
                    valueInputOption='RAW',
                    body={'values': [headers]}
                ).execute()
                values = [headers]
            
            # Find header row and map columns
            header_row = values[0]
            header_map = {header.lower().replace(' ', '_'): idx for idx, header in enumerate(header_row)}
            
            # Check if company already exists
            company_name = company_data.get('company_name', '').strip()
            if not company_name:
                return "Error: company_name is required in company_data"
            
            company_col = header_map.get('company_name', 0)
            for row in values[1:]:
                if len(row) > company_col and row[company_col].strip().lower() == company_name.lower():
                    return f"Company '{company_name}' already exists in Pipeline. Use update_deal_stage to update its stage."
            
            # Prepare new row data
            new_row = [''] * len(header_row)
            
            # Map company_data to columns
            field_mapping = {
                'company_name': 'company_name',
                'website': 'website',
                'contact_name': 'contact_name',
                'contact_email': 'contact_email',
                'stage': 'stage',
                'notes': 'notes',
                'microsite_spec_link': 'microsite_spec_link'
            }
            
            for field, header_key in field_mapping.items():
                if field in company_data and header_key in header_map:
                    col_idx = header_map[header_key]
                    new_row[col_idx] = str(company_data[field])
            
            # Default stage if not provided
            if 'stage' in header_map and not company_data.get('stage'):
                stage_col = header_map['stage']
                new_row[stage_col] = 'Research'
            
            # Append the new row
            sheets_service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range='Pipeline!A:Z',
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': [new_row]}
            ).execute()
            
            return f"New lead added successfully: {company_name}"
            
        except Exception as e:
            return f"Error adding new lead: {str(e)}"
    
    async def _arun(self, company_data: Dict[str, Any]) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class UpdateMicrositeSpecLinkTool(BaseTool):
    """Tool for updating the Microsite Spec Link in the Pipeline tab."""
    name: str = "update_microsite_spec_link"
    description: str = """Update the Microsite Spec Link column for a company in the Pipeline tab.
    
    REQUIRES:
    - company_name (string): Name of the company
    - microsite_spec_link (string): URL of the Google Doc microsite spec
    
    The tool will find the company in the Pipeline tab and update its Microsite Spec Link column."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, microsite_spec_link: str) -> str:
        """Execute the link update."""
        try:
            spreadsheet_id = find_crm_spreadsheet(self.creds)
            sheets_service = get_sheets_service(self.creds)
            
            # Read the Pipeline tab
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='Pipeline!A:Z'
            ).execute()
            
            values = result.get('values', [])
            if not values:
                return f"Error: Pipeline tab is empty or not found."
            
            # Find header row
            header_row = values[0]
            try:
                company_col = header_row.index('Company Name')
                link_col = header_row.index('Microsite Spec Link')
            except ValueError:
                # Try alternative column names
                try:
                    company_col = header_row.index('Company')
                    link_col = header_row.index('Microsite Spec Link')
                except ValueError:
                    return f"Error: Required columns not found. Expected 'Company Name' and 'Microsite Spec Link' columns."
            
            # Find the company row
            company_row = None
            for idx, row in enumerate(values[1:], start=2):
                if len(row) > company_col and row[company_col].strip().lower() == company_name.strip().lower():
                    company_row = idx
                    break
            
            if not company_row:
                return f"Error: Company '{company_name}' not found in Pipeline tab."
            
            # Update the Microsite Spec Link column
            range_name = f'Pipeline!{chr(65 + link_col)}{company_row}'
            sheets_service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body={'values': [[microsite_spec_link]]}
            ).execute()
            
            return f"Microsite spec link updated successfully for {company_name}: {microsite_spec_link}"
            
        except Exception as e:
            return f"Error updating microsite spec link: {str(e)}"
    
    async def _arun(self, company_name: str, microsite_spec_link: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_crm_tools(creds: Credentials) -> List[BaseTool]:
    """Get all CRM tools."""
    return [
        LogSalesActivityTool(creds=creds),
        UpdateDealStageTool(creds=creds),
        AddNewLeadTool(creds=creds),
        UpdateMicrositeSpecLinkTool(creds=creds),
    ]




