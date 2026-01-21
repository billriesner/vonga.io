# Environment Variables Configuration

Create a `.env.local` file in the root directory with these variables:

```bash
# Resend Email Service
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration
EMAIL_TO=bill@vonga.io
EMAIL_FROM=leads@vonga.io

# HubSpot CRM Integration
# Get your access token from: https://app.hubspot.com/private-apps
# See docs/HUBSPOT_SETUP_GUIDE.md for detailed setup instructions
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Optional: HubSpot Portal ID (for debugging)
HUBSPOT_PORTAL_ID=12345678
```

## Setup Instructions

### 1. Resend (Email Notifications)
1. Sign up at https://resend.com
2. Verify your sending domain (or use test domain for development)
3. Create an API key
4. Add to `.env.local`

### 2. HubSpot (CRM Integration)
1. Follow the detailed guide: `docs/HUBSPOT_SETUP_GUIDE.md`
2. Create a Private App in HubSpot
3. Copy the access token
4. Add to `.env.local`

## Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit it
- ✅ Environment variables are only accessible server-side
- ✅ Never expose API keys in client-side code
- ✅ Rotate keys if accidentally exposed
