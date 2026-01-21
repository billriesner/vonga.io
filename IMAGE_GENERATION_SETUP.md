# Image Generation Setup - Google NanoBanana

The Microsite Builder now uses Google's **NanoBanana** (Gemini 2.5 Flash Image) for image generation instead of OpenAI's DALL-E.

## Installation

Install the Google GenAI package:

```bash
pip install google-genai
```

## Configuration

The image generation tool uses the same `GOOGLE_API_KEY` that's already configured for Vonga OS.

No additional API keys needed! The existing Google API key will work for image generation.

## How It Works

1. **Model Used:** `gemini-2.5-flash-image` (NanoBanana)
2. **Image Size:** 1024x1024 pixels
3. **Output Format:** PNG files saved to `generated_assets/` folder

## Usage

The Microsite Builder agent automatically uses this tool when building microsites:

1. Reads the hero image suggestion from the microsite spec
2. Calls `generate_images` tool with the prompt
3. Image is saved to `generated_assets/hero_[company_name].png`
4. Image path is included in the GitHub repository

## Benefits of NanoBanana

- **Same API Key:** Uses existing GOOGLE_API_KEY (no separate key needed)
- **High Quality:** Google's latest image generation model
- **Fast:** Optimized for speed and quality
- **Integrated:** Part of the Gemini family, works seamlessly with other Google AI services

## Troubleshooting

If you get an error about `google-genai` not being installed:

```bash
pip install google-genai
```

If you get authentication errors, ensure `GOOGLE_API_KEY` is set in your environment or `.streamlit/secrets.toml`.




