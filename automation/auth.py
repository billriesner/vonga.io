"""
Authentication module for Google Workspace APIs.
Handles OAuth flow and token persistence.
"""

import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Scopes required for the application
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',  # For reading and writing Google Sheets
    'https://www.googleapis.com/auth/tasks',
]

CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.json'


def get_credentials():
    """
    Get valid user credentials from storage or start OAuth flow.
    
    Returns:
        Credentials object for making API calls.
    """
    creds = None
    
    # Check if token.json exists
    if os.path.exists(TOKEN_FILE):
        # Load credentials - use scopes from token file if available, otherwise use SCOPES
        try:
            import json
            with open(TOKEN_FILE, 'r') as f:
                token_data = json.load(f)
            token_scopes = token_data.get('scopes', SCOPES)
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, token_scopes)
        except Exception:
            # Fallback to default SCOPES if token file parsing fails
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # If there are no (valid) credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                # Save refreshed credentials
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())
            except Exception as e:
                # If refresh fails, we need to re-authenticate
                print(f"Token refresh failed: {e}. Starting new OAuth flow...")
                creds = None
        
        if not creds or not creds.valid:
            if not os.path.exists(CREDENTIALS_FILE):
                raise FileNotFoundError(
                    f"{CREDENTIALS_FILE} not found. Please download it from "
                    "Google Cloud Console and place it in the project root."
                )
            
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES
            )
            # Use port 8080 - make sure this is added as a redirect URI in Google Cloud Console
            creds = flow.run_local_server(port=8080, prompt='consent')
            
            # Save the credentials for the next run
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
    
    return creds


def get_user_email(creds):
    """
    Get the authenticated user's email address.
    
    Args:
        creds: Google credentials object
        
    Returns:
        str: User's email address
    """
    # Try multiple methods to get the email
    
    # Method 1: Check if email is stored in token file
    if os.path.exists(TOKEN_FILE):
        try:
            import json
            with open(TOKEN_FILE, 'r') as f:
                token_data = json.load(f)
            account = token_data.get('account')
            if account:
                return account
        except Exception:
            pass
    
    # Method 2: Try Gmail API profile (works with Gmail scopes)
    try:
        if not creds.valid:
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
        
        gmail_service = build('gmail', 'v1', credentials=creds)
        profile = gmail_service.users().getProfile(userId='me').execute()
        email = profile.get('emailAddress')
        if email:
            return email
    except Exception as e:
        pass
    
    # Method 3: Try OAuth2 userinfo API
    try:
        if not creds.valid:
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
        
        service = build('oauth2', 'v2', credentials=creds)
        user_info = service.userinfo().get().execute()
        email = user_info.get('email')
        if email:
            return email
    except Exception as e:
        pass
    
    # If all methods fail, raise an error
    raise Exception("Failed to get user email from any method. Please delete token.json and re-authenticate.")

