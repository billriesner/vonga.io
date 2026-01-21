# Marketing Production Team Setup

The Marketing Production Team has been added to Vonga OS with two new agents:

## 1. The Copywriter Agent (`agents/copywriter.py`)

A utility agent that refines copy based on Vonga's brand voice guidelines.

**Function:** `refine_copy(draft_text, channel, target_audience)`

**Features:**
- Loads `01_Brand_Voice_Guidelines` from Google Drive
- Optimizes copy for specific channels (Website, Email, Social, Microsite)
- Returns polished, brand-aligned copy

**Usage:**
- Can be called directly by other agents
- Available as a tool (`refine_copy`) for the Microsite Builder

## 2. The Microsite Builder Agent (`agents/microsite_builder.py`)

An orchestration agent that builds complete microsites from sales specs.

**Workflow:**
1. **Read Spec:** Reads the Microsite Spec Google Doc from URL
2. **Refine Copy:** Uses Copywriter to polish all copy sections
3. **Generate Images:** Creates hero image using DALL-E 3
4. **Write Code:** Generates complete HTML/CSS/JS microsite
5. **Deploy:** Pushes code to GitHub repository

**Output:** GitHub repository URL with complete microsite code

## 3. Development Tools (`tools/dev_tools.py`)

### `generate_images`
- Uses DALL-E 3 (OpenAI) to generate images
- Saves to `generated_assets/` folder
- Returns file path for use in code

**Required:** `OPENAI_API_KEY` environment variable

### `push_site_to_github`
- Creates new GitHub repository
- Commits all files (HTML, CSS, JS, images)
- Returns repository URL

**Required:** `GITHUB_TOKEN` environment variable

## 4. Production Studio UI

New tab in Vonga OS sidebar: **"Production Studio"**

**Features:**
- Input field for Microsite Spec Link (Google Doc URL)
- "Build Microsite" button
- Status display showing build progress
- Success message with GitHub repository URL

## Setup Requirements

### 1. Install Dependencies
```bash
pip install PyGithub openai
```

### 2. Environment Variables

Add to `.streamlit/secrets.toml` or environment:

```toml
OPENAI_API_KEY = "your-openai-api-key"
GITHUB_TOKEN = "your-github-personal-access-token"
```

**GitHub Token Setup:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create token with `repo` scope (full control of private repositories)
3. Add to secrets

**OpenAI API Key:**
1. Get from https://platform.openai.com/api-keys
2. Add to secrets

### 3. Directory Structure

The system will automatically create:
- `generated_assets/` - Folder for generated images

## Usage Flow

1. **Sales Agent** creates a Microsite Spec (Google Doc) and saves the URL to CRM
2. **User** goes to Production Studio
3. **User** pastes the Microsite Spec Link
4. **User** clicks "Build Microsite"
5. **Microsite Builder**:
   - Reads the spec
   - Refines all copy through Copywriter
   - Generates hero image
   - Writes complete code
   - Pushes to GitHub
6. **Output:** GitHub repository URL with deployed microsite

## File Structure Created

When a microsite is built, the GitHub repository contains:
```
vonga-microsite-[company-name]/
├── index.html          # Main page with all sections
├── styles.css          # Styling (or Tailwind)
├── script.js           # Interactive elements (if needed)
└── assets/
    └── hero_[company].png  # Generated hero image
```

## Notes

- The Copywriter agent loads brand voice guidelines dynamically from Google Drive
- All copy is optimized for the "Microsite" channel
- Images are generated using DALL-E 3 based on suggestions in the spec
- The microsite code is production-ready and responsive
- GitHub repositories are created as private by default




