"""
Marketing tools for CMO agent - Analytics and Brand Governance.
"""

from typing import List
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import Field
import pandas as pd
from tools.drive_tools import get_sheets_service, get_drive_service, get_docs_service, read_google_doc_by_name


class AnalyzePerformanceMetricsTool(BaseTool):
    """Tool for analyzing marketing performance metrics from Google Sheets."""
    name: str = "analyze_performance_metrics"
    description: str = """Analyze marketing performance metrics from the Vonga_Marketing_Metrics Google Sheet.

    This tool reads the marketing metrics data, calculates key statistics (Average ROI, Best/Worst performing campaigns),
    and returns a comprehensive text summary of findings.
    
    No parameters required - it automatically reads from Vonga_Marketing_Metrics sheet."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self) -> str:
        """Execute the performance metrics analysis."""
        try:
            sheets_service = get_sheets_service(self.creds)
            drive_service = get_drive_service(self.creds)
            
            # Search for the sheet
            sheet_name = "Vonga_Marketing_Metrics"
            results = drive_service.files().list(
                q=f"name='{sheet_name}' and mimeType='application/vnd.google-apps.spreadsheet'",
                fields="files(id, name)"
            ).execute()
            
            files = results.get('files', [])
            
            if not files:
                return f"Error: Google Sheet '{sheet_name}' not found. Please create the sheet first with campaign data."
            
            spreadsheet_id = files[0]['id']
            
            # Get the first sheet
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_names = [s.get('properties', {}).get('title', 'Sheet1') for s in spreadsheet.get('sheets', [])]
            first_sheet = sheet_names[0] if sheet_names else 'Sheet1'
            
            # Read the sheet data (assuming headers in first row)
            range_name = f"{first_sheet}!A1:Z1000"
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            if not values or len(values) <= 1:
                return f"Error: Sheet '{sheet_name}' is empty or has no data rows. Please add campaign metrics data."
            
            # Convert to DataFrame (first row as headers)
            headers = values[0]
            data_rows = values[1:] if len(values) > 1 else []
            
            # Pad rows to match header length
            padded_rows = [row + [''] * (len(headers) - len(row)) for row in data_rows]
            
            df = pd.DataFrame(padded_rows, columns=headers)
            
            # Clean up any empty rows
            df = df.dropna(how='all')
            
            if df.empty:
                return f"Error: No data found in sheet '{sheet_name}' after processing."
            
            # Find ROI column (case-insensitive)
            roi_column = None
            for col in df.columns:
                if 'roi' in str(col).lower():
                    roi_column = col
                    break
            
            # Find campaign name column (case-insensitive)
            campaign_column = None
            for col in df.columns:
                if 'campaign' in str(col).lower() or 'name' in str(col).lower():
                    campaign_column = col
                    break
            
            # Find conversions column (case-insensitive)
            conversions_column = None
            for col in df.columns:
                if 'conversion' in str(col).lower() or 'conversions' in str(col).lower():
                    conversions_column = col
                    break
            
            # Build summary
            summary_parts = []
            summary_parts.append(f"Marketing Performance Analysis for {sheet_name}")
            summary_parts.append("=" * 60)
            
            # Calculate average ROI if ROI column exists
            if roi_column:
                try:
                    # Convert ROI to numeric, handling percentage strings and numeric values
                    df['roi_numeric'] = df[roi_column].apply(lambda x: self._parse_roi(str(x)) if pd.notna(x) and str(x).strip() else None)
                    valid_roi = df['roi_numeric'].dropna()
                    
                    if len(valid_roi) > 0:
                        avg_roi = valid_roi.mean()
                        summary_parts.append(f"\nAverage ROI: {avg_roi:.2f}x")
                    else:
                        summary_parts.append(f"\nAverage ROI: Unable to calculate (no valid ROI data found)")
                except Exception as e:
                    summary_parts.append(f"\nAverage ROI: Error calculating - {str(e)}")
            
            # Find best performing campaign by conversions
            if campaign_column and conversions_column:
                try:
                    # Convert conversions to numeric
                    df['conversions_numeric'] = pd.to_numeric(df[conversions_column], errors='coerce')
                    valid_conversions = df.dropna(subset=['conversions_numeric'])
                    
                    if len(valid_conversions) > 0:
                        best_idx = valid_conversions['conversions_numeric'].idxmax()
                        best_campaign = valid_conversions.loc[best_idx, campaign_column]
                        best_conversions = valid_conversions.loc[best_idx, 'conversions_numeric']
                        
                        # Get ROI if available
                        best_roi_info = ""
                        if roi_column and 'roi_numeric' in df.columns:
                            best_roi = df.loc[best_idx, 'roi_numeric']
                            if pd.notna(best_roi):
                                best_roi_info = f" (ROI: {best_roi:.2f}x)"
                        
                        summary_parts.append(f"\nBest Performing Campaign (by Conversions): '{best_campaign}' with {best_conversions:.0f} conversions{best_roi_info}")
                    else:
                        summary_parts.append(f"\nBest Performing Campaign: Unable to determine (no valid conversion data)")
                except Exception as e:
                    summary_parts.append(f"\nBest Performing Campaign: Error calculating - {str(e)}")
            
            # Find worst performing campaign by ROI (if ROI column exists)
            if campaign_column and roi_column and 'roi_numeric' in df.columns:
                try:
                    valid_roi_campaigns = df.dropna(subset=['roi_numeric'])
                    
                    if len(valid_roi_campaigns) > 0:
                        worst_idx = valid_roi_campaigns['roi_numeric'].idxmin()
                        worst_campaign = valid_roi_campaigns.loc[worst_idx, campaign_column]
                        worst_roi = valid_roi_campaigns.loc[worst_idx, 'roi_numeric']
                        
                        # Check if it's below 1.0 (negative ROI)
                        if worst_roi < 1.0:
                            overspend_pct = ((1.0 - worst_roi) * 100)
                            summary_parts.append(f"\nWorst Performing Campaign: '{worst_campaign}' with ROI {worst_roi:.2f}x (overspent by {overspend_pct:.1f}%)")
                        else:
                            summary_parts.append(f"\nLowest ROI Campaign: '{worst_campaign}' with ROI {worst_roi:.2f}x")
                    else:
                        summary_parts.append(f"\nWorst Performing Campaign: Unable to determine (no valid ROI data)")
                except Exception as e:
                    summary_parts.append(f"\nWorst Performing Campaign: Error calculating - {str(e)}")
            
            # Add data summary
            summary_parts.append(f"\n\nTotal Campaigns Analyzed: {len(df)}")
            
            return "\n".join(summary_parts)
            
        except Exception as e:
            import traceback
            return f"Error analyzing performance metrics: {str(e)}\n{traceback.format_exc()[-500:]}"
    
    def _parse_roi(self, roi_str: str) -> float:
        """Parse ROI from various formats (e.g., '3.5x', '350%', '3.5', etc.)."""
        try:
            roi_str = str(roi_str).strip().lower()
            
            # Remove 'x' suffix
            if roi_str.endswith('x'):
                return float(roi_str[:-1])
            
            # Handle percentage (e.g., 350% = 3.5x)
            if roi_str.endswith('%'):
                return float(roi_str[:-1]) / 100.0
            
            # Try direct float conversion
            return float(roi_str)
        except (ValueError, AttributeError):
            return None
    
    async def _arun(self) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class AuditBrandVoiceTool(BaseTool):
    """Tool for auditing text against brand voice guidelines."""
    name: str = "audit_brand_voice"
    description: str = """Audit a text string against Vonga's Brand Voice Guidelines.

    This tool reads the live 01_Brand_Voice_Guidelines document from Google Drive and compares
    the input text against the guidelines. Returns a Pass/Fail grade and specific rewrite suggestions if it fails.
    
    Input: text_to_audit (string): The text to audit (e.g., a drafted email, post, or marketing copy).
    
    Output: A detailed audit with Pass/Fail grade and specific rewrite suggestions if needed."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, text_to_audit: str) -> str:
        """Execute the brand voice audit."""
        try:
            # Read brand voice guidelines from Google Drive
            guidelines_content = read_google_doc_by_name(self.creds, "01_Brand_Voice_Guidelines")
            
            if guidelines_content.startswith("Error:"):
                return f"Error: Could not find '01_Brand_Voice_Guidelines' document in Google Drive. Please ensure it exists."
            
            # Return guidelines and text for LLM to analyze
            # The actual comparison will be done by the LLM in the agent's system prompt
            # This tool just provides the guidelines and text to compare
            audit_result = f"""Brand Voice Audit Request

BRAND VOICE GUIDELINES:
{guidelines_content}

TEXT TO AUDIT:
{text_to_audit}

Please compare the text against the brand voice guidelines and provide:
1. PASS/FAIL grade
2. Specific issues found (if any)
3. Rewrite suggestions with specific changes (if failed)

The audit should be strict - if the text doesn't align with Vonga's brand voice, it should FAIL with clear, actionable feedback."""
            
            return audit_result
            
        except Exception as e:
            import traceback
            return f"Error auditing brand voice: {str(e)}\n{traceback.format_exc()[-500:]}"
    
    async def _arun(self, text_to_audit: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_marketing_analytics_tools(creds: Credentials) -> List[BaseTool]:
    """Get marketing analytics and brand governance tools."""
    return [
        AnalyzePerformanceMetricsTool(creds=creds),
        AuditBrandVoiceTool(creds=creds),
    ]
