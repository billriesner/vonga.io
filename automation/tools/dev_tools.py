"""
Development tools for Vonga OS.
Image generation and GitHub deployment tools.
"""

import os
import json
from typing import Dict, Optional, Any, Union
from pathlib import Path
from langchain.tools import BaseTool
from pydantic import Field, BaseModel
from google.oauth2.credentials import Credentials

try:
    from github import Github
    GITHUB_AVAILABLE = True
except ImportError:
    GITHUB_AVAILABLE = False
    print("Warning: PyGithub not installed. GitHub tools will not be available.")

GOOGLE_GENAI_AVAILABLE = False
try:
    from google import genai
    from google.genai.types import GenerateImagesConfig
    GOOGLE_GENAI_AVAILABLE = True
except ImportError:
    print("Warning: google-genai not installed. Image generation will not be available. Install with: pip install google-genai")


def ensure_assets_directory():
    """Ensure the generated_assets directory exists."""
    assets_dir = Path("generated_assets")
    assets_dir.mkdir(exist_ok=True)
    return assets_dir


class GenerateImageTool(BaseTool):
    """Tool for generating images using Google's NanoBanana (Gemini 2.5 Flash Image) model."""
    name: str = "generate_images"
    description: str = """Generate an image based on a text prompt using Google's NanoBanana (Gemini 2.5 Flash Image) model.
    
    REQUIRES:
    - prompt (string): Detailed description of the image to generate
    - image_name (string, optional): Name for the saved image file (without extension)
    
    Returns the file path to the generated image saved in generated_assets/ folder."""
    
    api_key: Optional[str] = Field(default=None, exclude=True)
    
    def __init__(self, api_key: str = None, **kwargs):
        # Get API key from parameter or environment
        api_key_value = api_key or os.getenv("GOOGLE_API_KEY")
        super().__init__(api_key=api_key_value, **kwargs)
    
    def _run(self, prompt: str, image_name: Optional[str] = None) -> str:
        """Execute the image generation using Google's NanoBanana (Gemini 2.5 Flash Image)."""
        if not self.api_key:
            return "Error: GOOGLE_API_KEY not set. Please set GOOGLE_API_KEY environment variable."
        
        try:
            # Ensure assets directory exists
            assets_dir = ensure_assets_directory()
            
            # Try to import and use google-genai (try at runtime, not just module level)
            try:
                from google import genai
                from google.genai.types import GenerateImagesConfig
                
                # Initialize the client with API key
                if self.api_key:
                    client = genai.Client(api_key=self.api_key)
                else:
                    client = genai.Client()  # Will use GOOGLE_API_KEY from environment
                
                # Try available image generation models in order of preference
                # Based on available models: imagen-4.0-generate-001, gemini-2.5-flash-image, etc.
                model_names_to_try = [
                    "imagen-4.0-generate-001",  # Latest Imagen (most reliable)
                    "imagen-4.0-fast-generate-001",  # Fast Imagen
                    "gemini-2.5-flash-image",  # Gemini image model
                    "gemini-2.5-flash-image-preview",  # Preview version
                ]
                
                image_response = None
                last_error = None
                
                for model_name in model_names_to_try:
                    try:
                        image_response = client.models.generate_images(
                            model=model_name,
                            prompt=prompt,
                            config=GenerateImagesConfig(
                                image_size="1024x1024",
                            ),
                        )
                        break  # Success!
                    except Exception as e:
                        last_error = e
                        continue  # Try next model
                
                if image_response is None:
                    # All models failed - create placeholder image
                    if not image_name:
                        import uuid
                        image_name = f"placeholder_{uuid.uuid4().hex[:8]}"
                    placeholder_path = assets_dir / f"{image_name}.png"
                    
                    # Create a placeholder image using PIL
                    try:
                        from PIL import Image, ImageDraw, ImageFont
                        # Create image with Vonga brand colors (deep navy background)
                        img = Image.new('RGB', (1024, 1024), color='#0A1422')
                        draw = ImageDraw.Draw(img)
                        
                        # Try to use a nice font, fallback to default
                        try:
                            # Try system fonts
                            font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
                            font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
                        except:
                            try:
                                font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
                                font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
                            except:
                                font_large = ImageFont.load_default()
                                font_small = ImageFont.load_default()
                        
                        # Add text with Vonga brand color (Aqua)
                        text_lines = ["Hero Image", "Placeholder"]
                        y_offset = 400
                        for line in text_lines:
                            bbox = draw.textbbox((0, 0), line, font=font_large if line == "Hero Image" else font_small)
                            text_width = bbox[2] - bbox[0]
                            position = ((1024 - text_width) // 2, y_offset)
                            draw.text(position, line, fill='#33BECC', font=font_large if line == "Hero Image" else font_small)
                            y_offset += 60
                        
                        img.save(placeholder_path)
                        return f"Created placeholder image at: {str(placeholder_path)}. Image generation API unavailable (tried: {', '.join(model_names_to_try)}). Last error: {str(last_error)}. You can replace this placeholder with an actual hero image later."
                    except ImportError:
                        # PIL not available, create empty file
                        placeholder_path.touch()
                        return f"Created placeholder file at: {str(placeholder_path)}. Image generation failed. Please add actual hero image later. Error: {str(last_error)}"
                
                # Get the generated image
                generated_image = image_response.generated_images[0].image
                
                # Save the image
                if not image_name:
                    import uuid
                    image_name = f"generated_{uuid.uuid4().hex[:8]}"
                
                image_path = assets_dir / f"{image_name}.png"
                generated_image.save(image_path)
                
                return f"Image generated successfully! Saved to: {str(image_path)}"
                
            except ImportError as import_err:
                # Package not available
                return f"Error: google-genai package not available. Please install it with: pip install google-genai. Import error: {str(import_err)}"
            except Exception as api_error:
                # API error (not import error)
                import traceback
                return f"Error generating image with NanoBanana: {str(api_error)}\n{traceback.format_exc()}\n\nPlease ensure google-genai package is installed (pip install google-genai) and GOOGLE_API_KEY is set correctly."
            
        except Exception as e:
            import traceback
            return f"Error generating image: {str(e)}\n{traceback.format_exc()}"
    
    def _generate_with_generativeai(self, prompt: str, image_name: Optional[str], assets_dir) -> str:
        """Fallback method - should not be used, kept for compatibility."""
        return "Error: Please install 'google-genai' package for NanoBanana image generation. Install with: pip install google-genai"
    
    async def _arun(self, prompt: str, image_name: Optional[str] = None) -> str:
        """Async version - not implemented."""
        raise NotImplementedError("Async not implemented")


class WriteMicrositeFileTool(BaseTool):
    """Tool for writing a single file for the microsite."""
    name: str = "write_microsite_file"
    description: str = """Write a single file to the microsite staging directory.
    
    REQUIRES:
    - file_path (string): Relative path for the file (e.g., "index.html", "assets/hero.png")
    - file_content (string): The content of the file as a string. For images, pass the path to an existing generated image file (e.g., "generated_assets/image.png")
    - is_image (string, optional): Set to "true" (as a string) if file_content is a path to an image file that should be copied. Default: "false"
    
    IMPORTANT: Keep file_content reasonable in length. For very long HTML, consider splitting into smaller chunks or using simpler content.
    
    This tool writes files to a staging directory. After writing all files, use push_microsite_to_github to deploy."""
    
    def _run(self, file_path: str, file_content: str, is_image: str = "false") -> str:
        """Write a file to the staging directory."""
        try:
            from pathlib import Path
            
            # Handle is_image as string to avoid bool serialization issues
            is_image_bool = str(is_image).lower() in ("true", "1", "yes")
            
            # Create staging directory
            staging_dir = Path("microsite_staging")
            staging_dir.mkdir(exist_ok=True)
            
            # Ensure file_path is a string
            file_path = str(file_path) if file_path else "unknown.txt"
            
            file_path_obj = Path(file_path)
            target_path = staging_dir / file_path_obj
            
            # Create parent directories if needed
            target_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Ensure file_content is a string
            file_content_str = str(file_content) if file_content else ""
            
            if is_image_bool and Path(file_content_str).exists():
                # Copy image file
                import shutil
                shutil.copy2(file_content_str, target_path)
                return f"Image file copied: {file_path}"
            else:
                # Write text content
                target_path.write_text(file_content_str, encoding='utf-8')
                return f"File written: {file_path} ({len(file_content_str)} characters)"
                
        except Exception as e:
            import traceback
            return f"Error writing file: {str(e)}\n{traceback.format_exc()}"
    
    async def _arun(self, file_path: str, file_content: str, is_image: str = "false") -> str:
        raise NotImplementedError("Async not implemented")


class PushMicrositeToGitHubTool(BaseTool):
    """Tool for pushing the staged microsite to GitHub."""
    name: str = "push_microsite_to_github"
    description: str = """Push all files from the microsite staging directory to a new GitHub repository.
    
    REQUIRES:
    - repo_name (string): Name for the new GitHub repository (e.g., "vonga-microsite-company-name")
    - description (string, optional): Repository description. Default: "Vonga Microsite"
    - is_private (bool, optional): Whether the repo should be private. Default: True
    
    This tool reads all files from the microsite_staging directory and pushes them to GitHub.
    Call this AFTER you have written all files using write_microsite_file."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.github = None
        if GITHUB_AVAILABLE:
            token = os.getenv("GITHUB_TOKEN")
            if token:
                self.github = Github(token)
    
    def _run(self, repo_name: str, description: str = "Vonga Microsite", is_private: bool = True) -> str:
        """Execute the GitHub push from staging directory."""
        if not GITHUB_AVAILABLE or not self.github:
            return "Error: GitHub API not available. Please install 'PyGithub' package and set GITHUB_TOKEN environment variable."
        
        from pathlib import Path
        
        # Ensure repo_name is a string
        try:
            if isinstance(repo_name, list):
                repo_name = repo_name[0] if repo_name else "vonga-microsite"
            if not isinstance(repo_name, str):
                repo_name = str(repo_name)
        except Exception:
            repo_name = "vonga-microsite"
        
        # Ensure description is a string
        try:
            if isinstance(description, list):
                description = description[0] if description else "Vonga Microsite"
            if not isinstance(description, str):
                description = str(description)
        except Exception:
            description = "Vonga Microsite"
        
        # Ensure is_private is a boolean
        try:
            if isinstance(is_private, list):
                is_private = bool(is_private[0]) if is_private else True
            if not isinstance(is_private, bool):
                is_private = bool(is_private)
        except Exception:
            is_private = True
        
        # Clean up repo name
        try:
            import re
            repo_name = str(repo_name).lower().replace(" ", "-").replace("_", "-")
            repo_name = re.sub(r'[^a-z0-9-]', '', repo_name)
        except Exception:
            repo_name = "vonga-microsite"
        
        try:
            # Check if staging directory exists
            staging_dir = Path("microsite_staging")
            if not staging_dir.exists():
                return "Error: microsite_staging directory not found. Please write files using write_microsite_file first."
            
            # Get authenticated user
            user = self.github.get_user()
            
            # Create repository
            repo = user.create_repo(
                name=repo_name,
                description=description,
                private=is_private,
                auto_init=False
            )
            
            # Collect all files from staging directory
            import base64
            default_branch = "main"
            files_committed = 0
            
            for file_path_obj in staging_dir.rglob("*"):
                if file_path_obj.is_file():
                    relative_path = file_path_obj.relative_to(staging_dir)
                    relative_path_str = str(relative_path).replace("\\", "/")  # Normalize path separators
                    
                    try:
                        # Read file content
                        if file_path_obj.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
                            # Binary file
                            with open(file_path_obj, 'rb') as f:
                                file_content = f.read()
                            content_b64 = base64.b64encode(file_content).decode('utf-8')
                        else:
                            # Text file
                            file_content = file_path_obj.read_text(encoding='utf-8')
                            content_b64 = base64.b64encode(file_content.encode('utf-8')).decode('utf-8')
                        
                        # Try to create file
                        try:
                            repo.create_file(
                                path=relative_path_str,
                                message=f"Add {relative_path_str}",
                                content=content_b64,
                                branch=default_branch
                            )
                            files_committed += 1
                        except Exception as e:
                            # If branch doesn't exist, try master
                            if "Branch not found" in str(e) or "not found" in str(e).lower():
                                default_branch = "master"
                                repo.create_file(
                                    path=relative_path_str,
                                    message=f"Add {relative_path_str}",
                                    content=content_b64,
                                    branch=default_branch
                                )
                                files_committed += 1
                            else:
                                raise
                    except Exception as e:
                        return f"Error committing file {relative_path_str}: {str(e)}"
            
            if files_committed == 0:
                return "Error: No files found in microsite_staging directory."
            
            repo_url = repo.html_url
            return f"Site code pushed successfully! {files_committed} file(s) committed. Repository URL: {repo_url}"
            
        except Exception as e:
            import traceback
            return f"Error pushing to GitHub: {str(e)}\n{traceback.format_exc()}"


def get_dev_tools(api_key: str = None) -> list:
    """Get all development tools."""
    tools = []
    
    # Only include GenerateImageTool if image generation is needed
    # For prompt-based workflow, this may not be needed
    # tools.append(GenerateImageTool(api_key=api_key))
    
    # Removed file writing and GitHub tools - using prompt document approach instead
    
    return tools




