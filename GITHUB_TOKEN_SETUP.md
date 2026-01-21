# GitHub Token Setup for Vonga OS

The Microsite Builder uses GitHub to deploy microsite code. You'll need a Personal Access Token (PAT) to enable this feature.

## How to Create a GitHub Token

### Step 1: Go to GitHub Settings
1. Log in to GitHub.com
2. Click your profile picture (top right)
3. Click **Settings**

### Step 2: Navigate to Developer Settings
1. Scroll down in the left sidebar
2. Click **Developer settings** (at the bottom)

### Step 3: Create Personal Access Token
1. Click **Personal access tokens**
2. Click **Tokens (classic)** or **Fine-grained tokens**
3. Click **Generate new token** → **Generate new token (classic)**

### Step 4: Configure Token
1. **Note:** Give it a descriptive name (e.g., "Vonga OS Microsite Builder")
2. **Expiration:** Choose your preferred expiration (90 days, 1 year, or no expiration)
3. **Select scopes:** Check the following:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
   - ✅ **workflow** (if you want to use GitHub Actions later)

### Step 5: Generate and Copy Token
1. Click **Generate token** (scroll to bottom)
2. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!
3. It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Adding Token to Vonga OS

### Option 1: Environment Variable (Recommended)
Add to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Option 2: Streamlit Secrets
Add to `.streamlit/secrets.toml`:

```toml
GITHUB_TOKEN = "ghp_your_token_here"
```

## Verify Token Works

After setting the token, restart Vonga OS. The Microsite Builder will use it automatically when pushing code to GitHub.

## Security Notes

- **Never commit your token to git** - It's already in `.gitignore`
- **Use classic tokens** for full repository access
- **Set expiration** for security (you can always regenerate)
- **Revoke old tokens** if compromised

## Troubleshooting

If you get "Authentication failed" errors:
1. Verify the token is correct (no extra spaces)
2. Check token hasn't expired
3. Ensure `repo` scope is selected
4. Try regenerating the token

## Token Permissions Needed

Minimum required scopes:
- **repo** - To create repositories and push code

Optional but useful:
- **workflow** - If you want to use GitHub Actions
- **read:org** - If working with organization repos




