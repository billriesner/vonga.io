"""
Calendar tools for listing, searching, and creating calendar events.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from dateutil import parser as date_parser
from dateutil import tz
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from langchain.tools import BaseTool
from pydantic import BaseModel, Field


class CalendarListInput(BaseModel):
    """Input for listing calendar events."""
    time_min: Optional[str] = Field(default=None, description="Start time for events (ISO 8601 format, default: now)")
    time_max: Optional[str] = Field(default=None, description="End time for events (ISO 8601 format, default: 7 days from now)")
    max_results: int = Field(default=10, description="Maximum number of events to return")


class CalendarSearchInput(BaseModel):
    """Input for searching calendar events."""
    query: str = Field(description="Search query to filter events")
    time_min: Optional[str] = Field(default=None, description="Start time for search (ISO 8601 format)")
    time_max: Optional[str] = Field(default=None, description="End time for search (ISO 8601 format)")


class CalendarCreateEventInput(BaseModel):
    """Input for creating a calendar event."""
    summary: str = Field(description="Event title/summary")
    description: Optional[str] = Field(default=None, description="Event description")
    start_time: str = Field(description="Start time in ISO 8601 format (e.g., '2024-01-15T10:00:00')")
    end_time: str = Field(description="End time in ISO 8601 format (e.g., '2024-01-15T11:00:00')")
    attendees: Optional[str] = Field(default=None, description="Comma-separated list of attendee email addresses")


def get_calendar_service(creds: Credentials):
    """Get Calendar API service."""
    return build('calendar', 'v3', credentials=creds)


class CalendarListTool(BaseTool):
    """Tool for listing calendar events."""
    name: str = "calendar_list"
    description: str = "List upcoming calendar events. Optionally specify time range and max results."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, time_min: str = None, time_max: str = None, max_results: int = 10) -> str:
        """Execute the list."""
        try:
            service = get_calendar_service(self.creds)
            
            # Default to now and 7 days from now
            if not time_min:
                time_min = datetime.utcnow().isoformat() + 'Z'
            else:
                if not time_min.endswith('Z') and '+' not in time_min:
                    time_min = time_min + 'Z'
            
            if not time_max:
                time_max = (datetime.utcnow() + timedelta(days=7)).isoformat() + 'Z'
            else:
                if not time_max.endswith('Z') and '+' not in time_max:
                    time_max = time_max + 'Z'
            
            events_result = service.events().list(
                calendarId='primary',
                timeMin=time_min,
                timeMax=time_max,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            if not events:
                return f"No events found between {time_min} and {time_max}"
            
            output = []
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                summary = event.get('summary', 'No Title')
                event_id = event.get('id')
                
                output.append({
                    'id': event_id,
                    'summary': summary,
                    'start': start
                })
            
            return f"Found {len(output)} events:\n" + "\n".join([
                f"- {e['summary']} (ID: {e['id']}, Start: {e['start']})"
                for e in output
            ])
        except Exception as e:
            return f"Error listing calendar events: {str(e)}"
    
    async def _arun(self, time_min: str = None, time_max: str = None, max_results: int = 10) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CalendarSearchTool(BaseTool):
    """Tool for searching calendar events."""
    name: str = "calendar_search"
    description: str = "Search calendar events by query string (searches in title, description, etc.)."
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, query: str, time_min: str = None, time_max: str = None) -> str:
        """Execute the search."""
        try:
            service = get_calendar_service(self.creds)
            
            if not time_min:
                time_min = datetime.utcnow().isoformat() + 'Z'
            else:
                if not time_min.endswith('Z') and '+' not in time_min:
                    time_min = time_min + 'Z'
            
            if not time_max:
                time_max = (datetime.utcnow() + timedelta(days=30)).isoformat() + 'Z'
            else:
                if not time_max.endswith('Z') and '+' not in time_max:
                    time_max = time_max + 'Z'
            
            events_result = service.events().list(
                calendarId='primary',
                q=query,
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            if not events:
                return f"No events found matching query: {query}"
            
            output = []
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                summary = event.get('summary', 'No Title')
                description = event.get('description', '')
                event_id = event.get('id')
                
                output.append({
                    'id': event_id,
                    'summary': summary,
                    'start': start,
                    'description': description[:100] if description else ''
                })
            
            return f"Found {len(output)} events matching '{query}':\n" + "\n".join([
                f"- {e['summary']} (ID: {e['id']}, Start: {e['start']})"
                for e in output
            ])
        except Exception as e:
            return f"Error searching calendar: {str(e)}"
    
    async def _arun(self, query: str, time_min: str = None, time_max: str = None) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CalendarCreateEventTool(BaseTool):
    """Tool for creating calendar events."""
    name: str = "calendar_create_event"
    description: str = """Create a new calendar event to block time. 
    REQUIRES: summary (string), start_time (string), and end_time (string).
    
    Date format for start_time and end_time:
    - Use ISO 8601 format: 'YYYY-MM-DDTHH:MM:SS' (e.g., '2025-01-15T10:00:00')
    - Or with UTC: 'YYYY-MM-DDTHH:MM:SSZ' (e.g., '2025-01-15T10:00:00Z')
    - Time should be in 24-hour format (e.g., 14:00:00 for 2 PM)
    - CRITICAL: start_time MUST be in the future. Cannot schedule events in the past.
    
    BUSINESS HOURS: Events are automatically restricted to 7am-6pm EST/EDT (business hours).
    - The tool will reject times outside this range unless force_outside_hours=True.
    - If a requested time conflicts with existing events, the tool will suggest an available time slot.
    - Set force_conflict=True to override conflicts and create the event anyway (use only when user explicitly requests it).
    
    Examples:
    - start_time='2025-01-15T12:00:00', end_time='2025-01-15T13:00:00' (12:00 UTC = 7am EST)
    - start_time='2025-12-30T18:00:00Z', end_time='2025-12-30T19:00:00Z' (6pm EST)
    
    The tool will validate dates, check business hours, check for conflicts, and suggest alternatives if needed."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, summary: str, start_time: str, end_time: str, description: str = None, attendees: str = None, force_outside_hours: bool = False, force_conflict: bool = False) -> str:
        """Execute the event creation.
        
        Args:
            summary: Event title
            start_time: Start time in ISO 8601 format
            end_time: End time in ISO 8601 format
            description: Optional event description
            attendees: Optional comma-separated list of attendee emails
            force_outside_hours: If True, allows scheduling outside 7am-6pm business hours
            force_conflict: If True, allows scheduling even if there are conflicting events
        """
        try:
            service = get_calendar_service(self.creds)
            
            # Clean up the input strings (remove quotes if present, strip whitespace)
            start_time_clean = str(start_time).strip().strip("'\"")
            end_time_clean = str(end_time).strip().strip("'\"")
            
            # Parse and validate times - use dateutil.parser which is very flexible
            try:
                # Parse start time - dateutil.parser handles many formats
                try:
                    start_dt = date_parser.parse(start_time_clean)
                except Exception as parse_error:
                    # Try a few common fixes
                    # If it looks like a date but missing T separator, try adding it
                    if 'T' not in start_time_clean and len(start_time_clean) >= 10:
                        try:
                            # Try adding T00:00:00 if it's just a date
                            start_dt = date_parser.parse(start_time_clean + 'T00:00:00')
                        except:
                            raise parse_error
                    else:
                        raise parse_error
                
                # Convert to UTC if timezone-aware, or assume UTC if naive
                if start_dt.tzinfo is None:
                    start_dt = start_dt.replace(tzinfo=tz.UTC)
                else:
                    start_dt = start_dt.astimezone(tz.UTC)
                
                # Parse end time
                try:
                    end_dt = date_parser.parse(end_time_clean)
                except Exception as parse_error:
                    # Try a few common fixes
                    if 'T' not in end_time_clean and len(end_time_clean) >= 10:
                        try:
                            end_dt = date_parser.parse(end_time_clean + 'T00:00:00')
                        except:
                            raise parse_error
                    else:
                        raise parse_error
                
                # Convert to UTC if timezone-aware, or assume UTC if naive
                if end_dt.tzinfo is None:
                    end_dt = end_dt.replace(tzinfo=tz.UTC)
                else:
                    end_dt = end_dt.astimezone(tz.UTC)
                
                # Format for Google Calendar API (RFC3339 format with Z suffix)
                start_time_formatted = start_dt.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                end_time_formatted = end_dt.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                
            except Exception as e:
                error_detail = f"start_time='{start_time_clean}', end_time='{end_time_clean}', error: {str(e)}"
                return f"Error parsing dates: {error_detail}. Please use ISO 8601 format (e.g., '2025-01-15T10:00:00Z', '2025-01-15T10:00:00', or '2025-01-15T10:00:00-05:00')."
            
            # Validate: start time must be in the future
            now = datetime.now(tz.UTC)
            if start_dt < now:
                return f"Error: Cannot schedule events in the past. Start time {start_time_formatted} is before current time. Please use a future date/time."
            
            # Validate: end time must be after start time
            if end_dt <= start_dt:
                return f"Error: End time must be after start time. End time {end_time_formatted} is not after start time {start_time_formatted}."
            
            # Validate business hours: 7am-6pm EST/EDT
            # Convert UTC time to Eastern timezone to check business hours
            if not force_outside_hours:
                try:
                    # Get Eastern timezone (handles both EST and EDT automatically)
                    eastern_tz = tz.gettz('America/New_York')
                    if eastern_tz is None:
                        # Fallback: EST is UTC-5
                        eastern_tz = tz.tzoffset('EST', -5 * 3600)
                    
                    # Convert UTC datetime to Eastern time
                    start_dt_eastern = start_dt.astimezone(eastern_tz)
                    end_dt_eastern = end_dt.astimezone(eastern_tz)
                    
                    # Get hour in Eastern time
                    start_hour_eastern = start_dt_eastern.hour
                    end_hour_eastern = end_dt_eastern.hour
                    
                    # Business hours: 7am (7) to 6pm (18)
                    if start_hour_eastern < 7 or start_hour_eastern >= 18:
                        # Suggest moving to 9am Eastern (14:00 UTC for EST, 13:00 UTC for EDT) same day
                        # Use 14:00 UTC as default (9am EST)
                        suggested_start_utc = start_dt.replace(hour=14, minute=0, second=0, microsecond=0)
                        suggested_end_utc = suggested_start_utc + (end_dt - start_dt)
                        
                        # Ensure end time is also within business hours
                        suggested_end_eastern = suggested_end_utc.astimezone(eastern_tz)
                        if suggested_end_eastern.hour >= 18:
                            # Adjust to end at 6pm Eastern
                            suggested_end_eastern = suggested_end_eastern.replace(hour=18, minute=0, second=0, microsecond=0)
                            suggested_end_utc = suggested_end_eastern.astimezone(tz.UTC)
                            suggested_start_utc = suggested_end_utc - (end_dt - start_dt)
                        
                        suggested_start_str = suggested_start_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        suggested_end_str = suggested_end_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        suggested_eastern = suggested_start_utc.astimezone(eastern_tz)
                        return f"Error: Event time {start_time_formatted} ({start_hour_eastern}:00 Eastern) is outside business hours (7am-6pm EST/EDT). Suggested time: {suggested_start_str} ({suggested_eastern.strftime('%I:%M %p')} Eastern on {start_dt_eastern.strftime('%Y-%m-%d')})."
                except Exception as e:
                    # If timezone conversion fails, fall back to UTC hour check
                    start_hour_utc = start_dt.hour
                    if start_hour_utc < 11 or start_hour_utc >= 23:
                        suggested_start = start_dt.replace(hour=14, minute=0, second=0, microsecond=0)
                        suggested_end = suggested_start + (end_dt - start_dt)
                        suggested_start_str = suggested_start.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        suggested_end_str = suggested_end.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        return f"Error: Event time {start_time_formatted} is outside business hours (7am-6pm EST/EDT). Suggested time: {suggested_start_str} to {suggested_end_str}."
            
            # Check for conflicts and availability in calendar
            conflicts = []
            try:
                existing_events = service.events().list(
                    calendarId='primary',
                    timeMin=start_time_formatted,
                    timeMax=end_time_formatted,
                    singleEvents=True,
                    orderBy='startTime'
                ).execute()
                
                conflicts = existing_events.get('items', [])
                
                # If there are conflicts, BLOCK creation and suggest alternative times (unless force_conflict is True)
                if conflicts and not force_conflict:
                    try:
                        eastern_tz = tz.gettz('America/New_York')
                        if eastern_tz is None:
                            eastern_tz = tz.tzoffset('EST', -5 * 3600)
                        
                        event_duration = end_dt - start_dt
                        start_dt_eastern = start_dt.astimezone(eastern_tz)
                        
                        # Try to find available slots starting from 9am Eastern (14:00 UTC EST / 13:00 UTC EDT)
                        # Check every hour until 5pm Eastern (22:00 UTC EST / 21:00 UTC EDT)
                        suggested_start_utc = None
                        for hour_eastern in range(9, 18):  # 9am to 5pm Eastern
                            candidate_start_eastern = start_dt_eastern.replace(hour=hour_eastern, minute=0, second=0, microsecond=0)
                            candidate_start_utc = candidate_start_eastern.astimezone(tz.UTC)
                            candidate_end_utc = candidate_start_utc + event_duration
                            
                            # Check if candidate end time is still within business hours
                            candidate_end_eastern = candidate_end_utc.astimezone(eastern_tz)
                            if candidate_end_eastern.hour >= 18:
                                continue  # Skip if end time goes past 6pm
                            
                            # Check if this slot is available
                            candidate_start_str = candidate_start_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                            candidate_end_str = candidate_end_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                            
                            available_events = service.events().list(
                                calendarId='primary',
                                timeMin=candidate_start_str,
                                timeMax=candidate_end_str,
                                singleEvents=True,
                                orderBy='startTime'
                            ).execute()
                            
                            if not available_events.get('items', []):
                                suggested_start_utc = candidate_start_utc
                                suggested_end_utc = candidate_end_utc
                                break
                        
                        # Build error message with conflict details and suggestion
                        conflict_summaries = [e.get('summary', 'Untitled') for e in conflicts[:3]]
                        conflict_msg = f"Error: Requested time conflicts with existing event(s): {', '.join(conflict_summaries)}"
                        
                        if suggested_start_utc:
                            suggested_start_str = suggested_start_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                            suggested_end_str = suggested_end_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                            suggested_eastern = suggested_start_utc.astimezone(eastern_tz)
                            conflict_msg += f". Suggested available time: {suggested_start_str} to {suggested_end_str} ({suggested_eastern.strftime('%I:%M %p')} Eastern on {start_dt_eastern.strftime('%Y-%m-%d')}). Use these exact times to retry."
                        else:
                            conflict_msg += f". No available slots found on {start_dt_eastern.strftime('%Y-%m-%d')} within business hours. Please try a different date."
                        
                        # RETURN error - don't create the event
                        return conflict_msg
                    except Exception as e:
                        # If availability checking fails, still block creation and report the conflict
                        conflict_summaries = [e.get('summary', 'Untitled') for e in conflicts[:2]]
                        return f"Error: Requested time conflicts with existing event(s): {', '.join(conflict_summaries)}. Please choose a different time."
            except Exception as e:
                # Non-fatal: continue even if conflict check fails
                pass
            
            event = {
                'summary': summary,
                'start': {
                    'dateTime': start_time_formatted,
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time_formatted,
                    'timeZone': 'UTC',
                },
            }
            
            if description:
                event['description'] = description
            
            if attendees:
                attendee_list = [{'email': email.strip()} for email in attendees.split(',')]
                event['attendees'] = attendee_list
                event['sendUpdates'] = 'all'
            
            # Actually create the event
            created_event = service.events().insert(calendarId='primary', body=event).execute()
            
            event_id = created_event.get('id')
            html_link = created_event.get('htmlLink', '')
            event_start = created_event.get('start', {}).get('dateTime', start_time_formatted)
            
            if not event_id:
                return f"Error: Event creation appeared to succeed but no event ID was returned. Please check your calendar to confirm."
            
            # At this point, we've already checked for conflicts and blocked creation if found (unless force_conflict was used)
            # So we can safely create the event
            result_message = f"✓ Event '{summary}' created successfully!\n"
            result_message += f"- Start: {event_start}\n"
            result_message += f"- Event ID: {event_id}\n"
            result_message += f"- Link: {html_link}\n"
            
            # If there were conflicts but we forced through, note it
            if conflicts and force_conflict:
                conflict_summaries = [e.get('summary', 'Untitled') for e in conflicts[:3]]
                result_message += f"\n⚠️ Note: Event created despite conflicts with: {', '.join(conflict_summaries)}"
            
            return result_message
        except Exception as e:
            import traceback
            error_details = str(e)
            # Log the full traceback for debugging
            print(f"Error creating calendar event: {error_details}")
            print(traceback.format_exc())
            return f"Error creating calendar event: {error_details}. Please check the date format and try again."
    
    async def _arun(self, summary: str, start_time: str, end_time: str, description: str = None, attendees: str = None) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CalendarGetCurrentTimeTool(BaseTool):
    """Tool for getting the current date and time."""
    name: str = "calendar_get_current_time"
    description: str = """Get the current date and time in UTC and common timezones.
    Use this tool when you need to know what 'today' or 'tomorrow' means, or when the user asks for the current date/time.
    Returns the current date and time in multiple formats to help you calculate relative dates."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self) -> str:
        """Execute getting current time."""
        try:
            now_utc = datetime.now(tz.UTC)
            
            # Format in ISO 8601 format
            iso_format = now_utc.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
            
            # Format in readable format
            readable_format = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
            
            # Calculate tomorrow's date
            tomorrow = now_utc + timedelta(days=1)
            tomorrow_date = tomorrow.strftime('%Y-%m-%d')
            
            result = f"Current date and time:\n"
            result += f"- UTC: {readable_format}\n"
            result += f"- ISO 8601: {iso_format}\n"
            result += f"- Today's date: {now_utc.strftime('%Y-%m-%d')}\n"
            result += f"- Tomorrow's date: {tomorrow_date}\n"
            
            return result
        except Exception as e:
            return f"Error getting current time: {str(e)}"
    
    async def _arun(self) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CalendarEditEventTool(BaseTool):
    """Tool for editing calendar events."""
    name: str = "calendar_edit_event"
    description: str = """Edit an existing calendar event. 
    REQUIRES: event_id (string) - the ID of the event to edit.
    
    Optional parameters you can update:
    - summary: New event title
    - start_time: New start time in ISO 8601 format (e.g., '2025-01-15T14:00:00')
    - end_time: New end time in ISO 8601 format
    - description: New event description
    - attendees: Comma-separated list of attendee email addresses
    
    To find event IDs, use calendar_list or calendar_search tools first.
    The event_id is typically found in the event details from those tools.
    
    BUSINESS HOURS: Edited times are restricted to 7am-6pm EST/EDT unless force_outside_hours=True."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, event_id: str, summary: str = None, start_time: str = None, end_time: str = None, 
             description: str = None, attendees: str = None, force_outside_hours: bool = False) -> str:
        """Execute the event edit."""
        try:
            service = get_calendar_service(self.creds)
            
            # First, get the existing event to preserve fields we're not updating
            try:
                existing_event = service.events().get(calendarId='primary', eventId=event_id).execute()
            except Exception as e:
                return f"Error: Could not find event with ID {event_id}. {str(e)}"
            
            # Update fields if provided
            if summary:
                existing_event['summary'] = summary
            
            if description is not None:
                existing_event['description'] = description
            
            # Handle time updates
            if start_time or end_time:
                start_time_clean = str(start_time).strip().strip("'\"") if start_time else None
                end_time_clean = str(end_time).strip().strip("'\"") if end_time else None
                
                # If only one time is provided, we need to calculate the other based on original duration
                if start_time and not end_time:
                    # Use existing end time
                    existing_start = existing_event.get('start', {}).get('dateTime', existing_event.get('start', {}).get('date'))
                    existing_end = existing_event.get('end', {}).get('dateTime', existing_event.get('end', {}).get('date'))
                    if existing_start and existing_end:
                        existing_start_dt = date_parser.parse(existing_start)
                        existing_end_dt = date_parser.parse(existing_end)
                        duration = existing_end_dt - existing_start_dt
                        
                        new_start_dt = date_parser.parse(start_time_clean)
                        if new_start_dt.tzinfo is None:
                            new_start_dt = new_start_dt.replace(tzinfo=tz.UTC)
                        else:
                            new_start_dt = new_start_dt.astimezone(tz.UTC)
                        
                        new_end_dt = new_start_dt + duration
                        end_time_clean = new_end_dt.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                
                if end_time and not start_time:
                    # Use existing start time
                    existing_start = existing_event.get('start', {}).get('dateTime', existing_event.get('start', {}).get('date'))
                    if existing_start:
                        start_time_clean = existing_start
                
                # Parse and validate times
                try:
                    if start_time_clean:
                        start_dt = date_parser.parse(start_time_clean)
                        if start_dt.tzinfo is None:
                            start_dt = start_dt.replace(tzinfo=tz.UTC)
                        else:
                            start_dt = start_dt.astimezone(tz.UTC)
                        start_time_formatted = start_dt.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        existing_event['start'] = {'dateTime': start_time_formatted, 'timeZone': 'UTC'}
                    
                    if end_time_clean:
                        end_dt = date_parser.parse(end_time_clean)
                        if end_dt.tzinfo is None:
                            end_dt = end_dt.replace(tzinfo=tz.UTC)
                        else:
                            end_dt = end_dt.astimezone(tz.UTC)
                        end_time_formatted = end_dt.strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
                        existing_event['end'] = {'dateTime': end_time_formatted, 'timeZone': 'UTC'}
                    
                    # Validate business hours if times were updated
                    if not force_outside_hours and (start_time_clean or end_time_clean):
                        try:
                            eastern_tz = tz.gettz('America/New_York')
                            if eastern_tz is None:
                                eastern_tz = tz.tzoffset('EST', -5 * 3600)
                            
                            check_start_dt = start_dt if start_time_clean else date_parser.parse(existing_event.get('start', {}).get('dateTime'))
                            if check_start_dt.tzinfo is None:
                                check_start_dt = check_start_dt.replace(tzinfo=tz.UTC)
                            else:
                                check_start_dt = check_start_dt.astimezone(tz.UTC)
                            
                            check_start_eastern = check_start_dt.astimezone(eastern_tz)
                            start_hour_eastern = check_start_eastern.hour
                            
                            if start_hour_eastern < 7 or start_hour_eastern >= 18:
                                return f"Error: Updated start time is outside business hours (7am-6pm EST/EDT). Current time would be {start_hour_eastern}:00 Eastern."
                        except Exception:
                            pass  # Non-fatal
                
                except Exception as e:
                    return f"Error parsing dates: {str(e)}. Please use ISO 8601 format."
            
            # Handle attendees
            if attendees is not None:
                if attendees:
                    attendee_list = [{'email': email.strip()} for email in attendees.split(',')]
                    existing_event['attendees'] = attendee_list
                    existing_event['sendUpdates'] = 'all'
                else:
                    existing_event['attendees'] = []
            
            # Update the event
            updated_event = service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=existing_event
            ).execute()
            
            event_id_result = updated_event.get('id')
            html_link = updated_event.get('htmlLink', '')
            event_summary = updated_event.get('summary', 'Untitled')
            event_start = updated_event.get('start', {}).get('dateTime', updated_event.get('start', {}).get('date'))
            
            return f"✓ Event '{event_summary}' updated successfully!\n- Event ID: {event_id_result}\n- Start: {event_start}\n- Link: {html_link}"
        except Exception as e:
            return f"Error updating calendar event: {str(e)}"
    
    async def _arun(self, event_id: str, summary: str = None, start_time: str = None, end_time: str = None,
                    description: str = None, attendees: str = None, force_outside_hours: bool = False) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class CalendarDeleteEventTool(BaseTool):
    """Tool for deleting calendar events."""
    name: str = "calendar_delete_event"
    description: str = """Delete a calendar event.
    REQUIRES: event_id (string) - the ID of the event to delete.
    
    To find event IDs, use calendar_list or calendar_search tools first.
    The event_id is typically found in the event details from those tools.
    
    WARNING: This action cannot be undone. The event will be permanently deleted."""
    creds: Credentials = Field(exclude=True)
    
    def __init__(self, creds: Credentials, **kwargs):
        super().__init__(creds=creds, **kwargs)
    
    def _run(self, event_id: str) -> str:
        """Execute the event deletion."""
        try:
            service = get_calendar_service(self.creds)
            
            # First, get the event to show what's being deleted
            try:
                event = service.events().get(calendarId='primary', eventId=event_id).execute()
                event_summary = event.get('summary', 'Untitled')
            except Exception as e:
                return f"Error: Could not find event with ID {event_id}. {str(e)}"
            
            # Delete the event
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            
            return f"✓ Event '{event_summary}' (ID: {event_id}) deleted successfully."
        except Exception as e:
            return f"Error deleting calendar event: {str(e)}"
    
    async def _arun(self, event_id: str) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


def get_calendar_tools(creds: Credentials) -> List[BaseTool]:
    """Get all Calendar tools."""
    return [
        CalendarGetCurrentTimeTool(creds=creds),
        CalendarListTool(creds=creds),
        CalendarSearchTool(creds=creds),
        CalendarCreateEventTool(creds=creds),
        CalendarEditEventTool(creds=creds),
        CalendarDeleteEventTool(creds=creds),
    ]

