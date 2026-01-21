"""
Google Sheets tools for Vonga OS.
Specifically for saving prospect data to the customer database.
"""

from typing import Dict, Any, Optional, List
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


def get_company_names_from_db(creds: Credentials) -> List[str]:
    """
    Get a list of company names from the Vonga Customer Database.
    Returns a list of company names (from column A).
    """
    try:
        sheets_service = get_sheets_service(creds)
        drive_service = get_drive_service(creds)
        
        # Search for the sheet
        sheet_name = "Vonga_Customer_DB"
        results = drive_service.files().list(
            q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
            fields="files(id, name)"
        ).execute()
        
        files = results.get('files', [])
        
        if not files:
            return []
        
        spreadsheet_id = files[0]['id']
        
        # Get the first sheet
        spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
        first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
        
        # Read column A (company names) - first 500 rows
        range_name = f"{first_sheet}!A2:A500"  # Skip header row
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        # Extract company names (first column, filter out empty)
        company_names = []
        for row in values:
            if row and len(row) > 0 and row[0].strip():
                company_names.append(row[0].strip())
        
        return company_names
        
    except Exception as e:
        print(f"Error reading company names from database: {str(e)}")
        return []


def get_company_data_from_db(creds: Credentials) -> Dict[str, str]:
    """
    Get company names and websites from the Vonga Customer Database.
    Returns a dictionary mapping company names to websites.
    """
    try:
        sheets_service = get_sheets_service(creds)
        drive_service = get_drive_service(creds)
        
        # Search for the sheet
        sheet_name = "Vonga_Customer_DB"
        results = drive_service.files().list(
            q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
            fields="files(id, name)"
        ).execute()
        
        files = results.get('files', [])
        
        if not files:
            return {}
        
        spreadsheet_id = files[0]['id']
        
        # Get the first sheet
        spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
        first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
        
        # Read columns A (company names) and B (websites) - first 500 rows
        range_name = f"{first_sheet}!A2:B500"  # Skip header row
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()
        
        values = result.get('values', [])
        
        # Extract company names and websites
        company_data = {}
        for row in values:
            if row and len(row) > 0 and row[0].strip():
                company_name = row[0].strip()
                website = row[1].strip() if len(row) > 1 and row[1].strip() else ""
                company_data[company_name] = website
        
        return company_data
        
    except Exception as e:
        print(f"Error reading company data from database: {str(e)}")
        return {}


class ReadCustomerDBTool(BaseTool):
    """Tool for reading the Vonga Customer Database."""
    name: str = "read_customer_db"
    description: str = """Read the Vonga Customer Database (Google Sheet) to see existing prospects.
    
    OPTIONAL: row_start (int) - Starting row number (default: 1 for header row)
    OPTIONAL: row_end (int) - Ending row number (default: 100, reads first 100 rows)
    
    Returns the customer database content as a formatted table with all prospect information.
    Useful for checking if a company already exists in the database before adding, or reviewing existing prospects."""
    
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, row_start: int = 1, row_end: int = 100) -> str:
        """Execute the read operation."""
        try:
            sheets_service = get_sheets_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Search for the sheet
            sheet_name = "Vonga_Customer_DB"
            results = drive_service.files().list(
                q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
                fields="files(id, name)"
            ).execute()
            
            files = results.get('files', [])
            
            if not files:
                return f"Error: Google Sheet '{sheet_name}' not found. Please create the sheet first."
            
            spreadsheet_id = files[0]['id']
            
            # Get the first sheet
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
            first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
            
            # Read the specified range (columns A through L)
            range_name = f"{first_sheet}!A{row_start}:L{row_end}"
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                return f"Database '{sheet_name}' is empty or contains no data in the specified range."
            
            # Format as table
            output_lines = [f"Customer Database: {sheet_name} (Rows {row_start}-{row_end})"]
            output_lines.append("=" * 80)
            
            for idx, row in enumerate(values, start=row_start):
                row_num = idx
                row_data = ' | '.join(str(cell) for cell in row)
                output_lines.append(f"Row {row_num}: {row_data}")
            
            output_lines.append(f"\nTotal rows shown: {len(values)}")
            return "\n".join(output_lines)
            
        except Exception as e:
            return f"Error reading customer database: {str(e)}"
    
    async def _arun(self, row_start: int = 1, row_end: int = 100) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class UpdateCustomerDBTool(BaseTool):
    """Tool for updating existing records in the Vonga Customer Database."""
    name: str = "update_customer_db"
    description: str = """Update an existing prospect record in the Vonga Customer Database (Google Sheet).
    
    REQUIRES:
    - row_number (int): The row number in the database to update (use read_customer_db first to find the row)
    - company_name (string): Company name
    - website (string): Company website URL
    - description (string): 2-3 sentence description
    - industry_sector (string): Industry or sector
    - company_stage (string): Growth stage, size
    - strategy_angle (string): Specific, detailed strategy angle (NOT generic)
    - key_contact_name (string): Name with title
    - contact_info (string): Email, LinkedIn, etc.
    - market_position (string): Competitive context, unique positioning
    - recent_signals (string): Growth signals, strategic moves, timing indicators
    - research_date (string): YYYY-MM-DD format
    - notes (string): Additional insights, risks, opportunities
    
    The tool will update the specified row with all 12 fields (A through L columns)."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, row_number: int, company_name: str, website: str, description: str,
             industry_sector: str, company_stage: str, strategy_angle: str,
             key_contact_name: str, contact_info: str, market_position: str,
             recent_signals: str, research_date: str, notes: str) -> str:
        """Execute the update operation."""
        try:
            sheets_service = get_sheets_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Search for the sheet
            sheet_name = "Vonga_Customer_DB"
            results = drive_service.files().list(
                q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
                fields="files(id, name)"
            ).execute()
            
            files = results.get('files', [])
            
            if not files:
                return f"Error: Google Sheet '{sheet_name}' not found. Please create the sheet first."
            
            spreadsheet_id = files[0]['id']
            
            # Get the first sheet
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
            first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
            
            # Update the row with all 12 columns (A through L)
            values = [[company_name, website, description, industry_sector, company_stage, 
                      strategy_angle, key_contact_name, contact_info, market_position, 
                      recent_signals, research_date, notes]]
            
            range_name = f"{first_sheet}!A{row_number}:L{row_number}"
            sheets_service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body={'values': values}
            ).execute()
            
            return f"Successfully updated row {row_number} for {company_name} in the customer database."
            
        except Exception as e:
            return f"Error updating customer database: {str(e)}"
    
    async def _arun(self, row_number: int, company_name: str, website: str, description: str,
                    industry_sector: str, company_stage: str, strategy_angle: str,
                    key_contact_name: str, contact_info: str, market_position: str,
                    recent_signals: str, research_date: str, notes: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class SaveProspectToDBTool(BaseTool):
    """Tool for saving a new prospect to the Vonga Customer Database."""
    name: str = "save_prospect_to_db"
    description: str = """Save a new prospect to the Vonga Customer Database (Google Sheet).
    
    REQUIRES all 12 fields:
    - company_name (string): Company name
    - website (string): Company website URL
    - description (string): 2-3 sentence description
    - industry_sector (string): Industry or sector
    - company_stage (string): Growth stage, size
    - strategy_angle (string): Specific, detailed strategy angle (NOT generic)
    - key_contact_name (string): Name with title
    - contact_info (string): Email, LinkedIn, etc.
    - market_position (string): Competitive context, unique positioning
    - recent_signals (string): Growth signals, strategic moves, timing indicators
    - research_date (string): YYYY-MM-DD format
    - notes (string): Additional insights, risks, opportunities
    
    The tool will append a new row with all 12 fields (A through L columns)."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, company_name: str, website: str, description: str,
             industry_sector: str, company_stage: str, strategy_angle: str,
             key_contact_name: str, contact_info: str, market_position: str,
             recent_signals: str, research_date: str, notes: str) -> str:
        """Execute the save operation."""
        try:
            sheets_service = get_sheets_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Search for the sheet
            sheet_name = "Vonga_Customer_DB"
            results = drive_service.files().list(
                q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
                fields="files(id, name)"
            ).execute()
            
            files = results.get('files', [])
            
            if not files:
                return f"Error: Google Sheet '{sheet_name}' not found. Please create the sheet first."
            
            spreadsheet_id = files[0]['id']
            
            # Get the first sheet
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
            first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
            
            # Check if header row exists, create if not
            header_result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=f"{first_sheet}!A1:L1"
            ).execute()
            
            header_values = header_result.get('values', [])
            if not header_values:
                # Create header row
                headers = ['Company Name', 'Website', 'Description', 'Industry/Sector', 'Company Stage', 
                          'Strategic Angle', 'Key Contact Name', 'Contact Info', 'Market Position', 
                          'Recent Signals', 'Research Date', 'Notes']
                sheets_service.spreadsheets().values().update(
                    spreadsheetId=spreadsheet_id,
                    range=f"{first_sheet}!A1:L1",
                    valueInputOption='RAW',
                    body={'values': [headers]}
                ).execute()
            
            # Append the new row with all 12 columns
            values = [[company_name, website, description, industry_sector, company_stage, 
                      strategy_angle, key_contact_name, contact_info, market_position, 
                      recent_signals, research_date, notes]]
            
            sheets_service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range=f"{first_sheet}!A:L",
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': values}
            ).execute()
            
            return f"Successfully saved {company_name} to the customer database."
            
        except Exception as e:
            return f"Error saving to customer database: {str(e)}"
    
    async def _arun(self, company_name: str, website: str, description: str,
                    industry_sector: str, company_stage: str, strategy_angle: str,
                    key_contact_name: str, contact_info: str, market_position: str,
                    recent_signals: str, research_date: str, notes: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_sheet_tools(creds: Credentials) -> list:
    """Get all sheet tools."""
    return [
        ReadCustomerDBTool(creds=creds),
        SaveProspectToDBTool(creds=creds),
        UpdateCustomerDBTool(creds=creds)
    ]
