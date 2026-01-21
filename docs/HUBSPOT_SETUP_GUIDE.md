# HubSpot Integration - Setup Guide

**Goal:** Automatically create contacts and deals in HubSpot when leads submit the website form.

---

## 📋 Step-by-Step Setup

### Step 1: Create HubSpot Account (if needed)

1. Go to https://www.hubspot.com/
2. Click **"Get started free"**
3. Sign up with your email (bill@vonga.io)
4. Choose **"Sales Hub"** as your primary use case
5. Complete the onboarding (you can skip most optional steps)

**Cost:** Free tier (unlimited contacts, basic CRM features)

---

### Step 2: Get Your HubSpot API Key

#### Option A: Private App (Recommended - More Secure)

1. **Go to Settings**
   - Click the ⚙️ icon in the top-right corner
   - Or go to: https://app.hubspot.com/settings/

2. **Navigate to Integrations**
   - In left sidebar: **Integrations** → **Private Apps**
   - Or direct link: https://app.hubspot.com/private-apps/YOUR_ACCOUNT_ID

3. **Create Private App**
   - Click **"Create a private app"**
   - Name: `Vonga Website Lead Form`
   - Description: `Captures leads from vonga.io contact form`

4. **Set Scopes (Permissions)**
   
   Under the **"Scopes"** tab, enable these:
   
   **CRM Scopes:**
   - ✅ `crm.objects.contacts.write` (Create/update contacts)
   - ✅ `crm.objects.contacts.read` (Read contacts)
   - ✅ `crm.objects.deals.write` (Create/update deals)
   - ✅ `crm.objects.deals.read` (Read deals)
   - ✅ `crm.objects.owners.read` (Read users for assignment)

   **Optional (for future):**
   - `crm.schemas.contacts.read` (Read custom properties)
   - `crm.schemas.deals.read` (Read deal properties)

5. **Create the App**
   - Click **"Create app"** in the top-right
   - Review the permissions
   - Click **"Continue creating"**

6. **Copy Your Access Token**
   - You'll see: **"Show token"** button
   - Click it and copy the token
   - **IMPORTANT:** Save this somewhere safe - you can only see it once!
   - Format: `pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

#### Option B: API Key (Legacy - Simpler but Less Secure)

**Note:** HubSpot is deprecating API keys in favor of Private Apps. Use Option A if possible.

1. Go to **Settings** (⚙️ icon)
2. **Integrations** → **API Key**
3. Click **"Create key"** or **"Show"** if one exists
4. Copy the key

---

### Step 3: Find Your HubSpot Portal ID (Optional but Helpful)

1. Go to Settings (⚙️)
2. Click **"Account Defaults"** in the left sidebar
3. Your **Hub ID** or **Portal ID** is shown at the top
4. Format: 8-digit number (e.g., `12345678`)

**Why you need this:** For debugging and support.

---

### Step 4: Configure Deal Pipeline (Optional - Customize Stages)

1. **Go to Settings** (⚙️)
2. **Objects** → **Deals**
3. **Pipelines** tab
4. You'll see a default "Sales Pipeline"

**Default stages:**
- Appointment scheduled
- Qualified to buy
- Presentation scheduled
- Decision maker bought-in
- Contract sent
- Closed won
- Closed lost

**Recommended stages for Vonga:**
1. **New Lead** - Just submitted form
2. **Discovery Call Scheduled** - Initial call booked
3. **Qualified** - Good fit, moving forward
4. **Pilot Proposal** - Custom plan created
5. **Contract Negotiation** - Terms being finalized
6. **In Production** - Kits being manufactured
7. **Launched** - Live with team
8. **Active Customer** - Ongoing account
9. **Closed Lost** - Not moving forward

**To customize:**
- Click **"Edit"** on the Sales Pipeline
- Add/remove/rename stages
- Click **"Save"**

**Note:** You can use the default pipeline to start and customize later.

---

### Step 5: Add Custom Contact Properties (Optional)

These help you track Vonga-specific info:

1. **Go to Settings** (⚙️)
2. **Data Management** → **Properties**
3. Select **"Contact properties"**
4. Click **"Create property"**

**Recommended custom properties:**

| Property Name | Type | Purpose |
|---------------|------|---------|
| `team_size` | Number | How many people in organization |
| `sport_type` | Dropdown | Basketball, Soccer, Hockey, etc. |
| `current_apparel_provider` | Text | Who they use now |
| `pilot_start_date` | Date | When they want to launch |
| `annual_merch_revenue` | Number | Current merch revenue |

**To create:**
- Label: `Team Size`
- Internal name: `team_size`
- Field type: `Number`
- Group: `Contact information`

---

### Step 6: Provide API Key to Developer (Me)

Once you have your Private App access token:

**Send me:**
- ✅ HubSpot Access Token (starts with `pat-na1-...`)
- ✅ Portal ID (optional, for debugging)

**How to share securely:**
- Option 1: Paste it in this conversation (I'll delete it after adding to code)
- Option 2: I'll add a placeholder and you can add it directly to `.env.local`

---

## 🔐 Security: Environment Variables

Your HubSpot token will be stored in `.env.local` (never committed to git):

```bash
# HubSpot Integration
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Email Notifications (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_TO=bill@vonga.io
EMAIL_FROM=leads@vonga.io
```

---

## 🧪 Testing the Integration

Once set up, I'll create a test submission:

### What Will Happen:
1. ✅ Contact created in HubSpot with form data
2. ✅ Deal created and linked to contact
3. ✅ Deal placed in first stage (e.g., "New Lead")
4. ✅ Email sent to bill@vonga.io
5. ✅ All data logged for debugging

### What You'll See in HubSpot:
- New contact: [Name from form]
- Email: [Email from form]
- Company: [Organization from form]
- Deal: "[Organization] - Pilot Inquiry"
- Deal stage: "New Lead" (or your first stage)
- Deal amount: $0 (you can update manually)

---

## 📊 What Data Gets Sent to HubSpot

### Contact Fields:
- `firstname` - First name from form
- `lastname` - Last name from form (or blank if only one name)
- `email` - Email address
- `company` - Team/Organization name
- `jobtitle` - Role (if provided)
- `message` - Their message (as a note)
- `hs_lead_status` - Set to "NEW"

### Deal Fields:
- `dealname` - "[Organization] - Pilot Inquiry"
- `dealstage` - First stage in your pipeline
- `amount` - $0 (you update after discovery call)
- `pipeline` - Default sales pipeline
- Associated contact: The contact we just created

---

## 🛠️ Troubleshooting

### "Invalid authentication credentials"
- Check that your access token is correct
- Make sure you copied the entire token
- Verify the token hasn't expired (private apps don't expire unless you delete them)

### "Missing required scopes"
- Go back to your Private App
- Check that you enabled all the CRM scopes listed above
- Re-generate the token if needed

### Contact created but no deal
- Check deal pipeline permissions
- Verify `crm.objects.deals.write` scope is enabled

### Duplicate contacts
- HubSpot will automatically merge contacts with the same email
- No action needed

---

## 🚀 Ready?

Once you have your HubSpot access token, either:

**Option 1:** Share it with me and I'll add it to the code
**Option 2:** I'll set up the code with placeholders and you can add it to `.env.local`

---

## 📚 Resources

- **HubSpot Private Apps:** https://developers.hubspot.com/docs/api/private-apps
- **HubSpot API Reference:** https://developers.hubspot.com/docs/api/overview
- **CRM API:** https://developers.hubspot.com/docs/api/crm/understanding-the-crm
- **Support:** https://help.hubspot.com/

---

**Next Steps:**
1. Create HubSpot account (if needed)
2. Create Private App
3. Copy access token
4. Share with me (or add to `.env.local` yourself)
5. I'll implement the integration
6. We'll test it together
