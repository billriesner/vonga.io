#!/usr/bin/env python3
"""
Generate 3 hero image options for Vonga blog post
"Your Fans Have 47 Apps. They Don't Want Yours."
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# Vonga brand colors
NAVY = "#0f172a"
AQUA = "#33BECC"
CORAL = "#FF6B6B"
WHITE = "#e2e8f0"

# Image dimensions (social sharing standard)
WIDTH = 1200
HEIGHT = 630

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def get_font(size, bold=False):
    """Get font - try multiple options"""
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    
    # Fallback to default
    return ImageFont.load_default()

def draw_text_with_outline(draw, text, position, font, fill_color, outline_color, outline_width=2):
    """Draw text with outline for better readability"""
    x, y = position
    # Draw outline
    for adj_x in range(-outline_width, outline_width + 1):
        for adj_y in range(-outline_width, outline_width + 1):
            draw.text((x + adj_x, y + adj_y), text, font=font, fill=outline_color)
    # Draw text
    draw.text((x, y), text, font=font, fill=fill_color)

def wrap_text(text, font, max_width, draw):
    """Wrap text to fit within max_width"""
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        width = bbox[2] - bbox[0]
        
        if width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines

# ==================== OPTION 1: AI-CONCEPTUAL ILLUSTRATION ====================
def create_option_1():
    """Phone screen overwhelmed with apps, one glowing NFC tap breaking through"""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(NAVY))
    draw = ImageDraw.Draw(img)
    
    # Create phone screen mockup in center
    phone_width = 320
    phone_height = 560
    phone_x = (WIDTH - phone_width) // 2
    phone_y = 40
    
    # Draw phone background (slightly lighter)
    draw.rounded_rectangle(
        [phone_x, phone_y, phone_x + phone_width, phone_y + phone_height],
        radius=30,
        fill="#1a2332"
    )
    
    # Grid of app icons (7x9 = 63 apps, showing "overwhelm")
    icon_size = 38
    icon_gap = 6
    grid_start_x = phone_x + 20
    grid_start_y = phone_y + 80
    
    app_colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
        "#98D8C8", "#6C5CE7", "#FDCB6E", "#E17055",
        "#74B9FF", "#A29BFE", "#FD79A8", "#FDCB6E"
    ]
    
    for row in range(9):
        for col in range(7):
            x = grid_start_x + col * (icon_size + icon_gap)
            y = grid_start_y + row * (icon_size + icon_gap)
            
            # Pick color
            color_idx = (row * 7 + col) % len(app_colors)
            color = app_colors[color_idx]
            
            # Most apps are regular squares
            if row == 4 and col == 3:
                # This is the NFC icon - make it special
                continue
            else:
                draw.rounded_rectangle(
                    [x, y, x + icon_size, y + icon_size],
                    radius=8,
                    fill=color
                )
    
    # Draw glowing NFC icon in center breaking through
    nfc_x = grid_start_x + 3 * (icon_size + icon_gap)
    nfc_y = grid_start_y + 4 * (icon_size + icon_gap)
    nfc_size = icon_size * 1.8
    
    # Create glow effect
    for i in range(15, 0, -1):
        alpha = int(180 * (i / 15))
        glow_size = nfc_size + (i * 4)
        glow_overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_overlay)
        
        aqua_rgb = hex_to_rgb(AQUA)
        glow_color = aqua_rgb + (alpha,)
        
        glow_draw.ellipse(
            [nfc_x - glow_size//2, nfc_y - glow_size//2, 
             nfc_x + glow_size//2, nfc_y + glow_size//2],
            fill=glow_color
        )
        
        img = Image.alpha_composite(img.convert('RGBA'), glow_overlay)
        img = img.convert('RGB')
        draw = ImageDraw.Draw(img)
    
    # Draw the NFC icon itself
    draw.ellipse(
        [nfc_x - nfc_size//2, nfc_y - nfc_size//2, 
         nfc_x + nfc_size//2, nfc_y + nfc_size//2],
        fill=hex_to_rgb(AQUA)
    )
    
    # NFC waves symbol (simplified)
    wave_color = hex_to_rgb(NAVY)
    for i in range(3):
        arc_size = 15 + (i * 12)
        draw.arc(
            [nfc_x - arc_size, nfc_y - arc_size, nfc_x + arc_size, nfc_y + arc_size],
            start=225, end=315, fill=wave_color, width=4
        )
    
    # Title text at bottom
    title = "Your Fans Have 47 Apps.\nThey Don't Want Yours."
    font_title = get_font(52, bold=True)
    
    # Calculate text position
    temp_draw = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    lines = title.split('\n')
    
    y_offset = HEIGHT - 140
    for line in lines:
        bbox = temp_draw.textbbox((0, 0), line, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        
        draw_text_with_outline(draw, line, (x, y_offset), font_title, 
                              hex_to_rgb(WHITE), hex_to_rgb(NAVY), 3)
        y_offset += 62
    
    # Branding
    font_small = get_font(18)
    branding = "The Tap | Vonga"
    bbox = draw.textbbox((0, 0), branding, font=font_small)
    branding_width = bbox[2] - bbox[0]
    draw.text((WIDTH - branding_width - 30, HEIGHT - 35), branding, 
              font=font_small, fill=hex_to_rgb(AQUA))
    
    return img

# ==================== OPTION 2: SPORTS ATMOSPHERE ====================
def create_option_2():
    """Split design: chaotic app world left, clean single-tap right"""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(NAVY))
    draw = ImageDraw.Draw(img)
    
    # Left side - chaos (app overload)
    for i in range(100):
        import random
        x = random.randint(0, WIDTH // 2)
        y = random.randint(0, HEIGHT)
        size = random.randint(25, 70)
        
        colors = [CORAL, "#FF8F8F", "#FFB5B5", "#FFA07A", "#E17055"]
        color = random.choice(colors)
        
        opacity = random.randint(40, 100)
        overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        rgb = hex_to_rgb(color)
        fill = rgb + (int(255 * opacity / 100),)
        
        overlay_draw.rounded_rectangle(
            [x, y, x + size, y + size],
            radius=8,
            fill=fill
        )
        
        img = Image.alpha_composite(img.convert('RGBA'), overlay)
        img = img.convert('RGB')
        draw = ImageDraw.Draw(img)
    
    # Right side - clean (single tap)
    # Create gradient effect
    for y in range(HEIGHT):
        gradient_factor = y / HEIGHT
        aqua_rgb = hex_to_rgb(AQUA)
        navy_rgb = hex_to_rgb(NAVY)
        
        r = int(navy_rgb[0] + (aqua_rgb[0] - navy_rgb[0]) * gradient_factor * 0.3)
        g = int(navy_rgb[1] + (aqua_rgb[1] - navy_rgb[1]) * gradient_factor * 0.3)
        b = int(navy_rgb[2] + (aqua_rgb[2] - navy_rgb[2]) * gradient_factor * 0.3)
        
        draw.line([(WIDTH // 2, y), (WIDTH, y)], fill=(r, g, b))
    
    # Large tap icon on right side
    tap_x = WIDTH * 3 // 4
    tap_y = HEIGHT // 2 - 80
    tap_size = 120
    
    # Glow
    for i in range(10, 0, -1):
        alpha = int(150 * (i / 10))
        glow_size = tap_size + (i * 6)
        
        overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        aqua_rgb = hex_to_rgb(AQUA)
        glow_color = aqua_rgb + (alpha,)
        
        overlay_draw.ellipse(
            [tap_x - glow_size//2, tap_y - glow_size//2,
             tap_x + glow_size//2, tap_y + glow_size//2],
            fill=glow_color
        )
        
        img = Image.alpha_composite(img.convert('RGBA'), overlay)
        img = img.convert('RGB')
        draw = ImageDraw.Draw(img)
    
    # Tap icon
    draw.ellipse(
        [tap_x - tap_size//2, tap_y - tap_size//2,
         tap_x + tap_size//2, tap_y + tap_size//2],
        fill=hex_to_rgb(AQUA)
    )
    
    # NFC symbol
    wave_color = hex_to_rgb(NAVY)
    for i in range(3):
        arc_size = 20 + (i * 16)
        draw.arc(
            [tap_x - arc_size, tap_y - arc_size, tap_x + arc_size, tap_y + arc_size],
            start=225, end=315, fill=wave_color, width=5
        )
    
    # Divider line
    draw.line([(WIDTH // 2, 80), (WIDTH // 2, HEIGHT - 80)], 
              fill=hex_to_rgb(AQUA), width=3)
    
    # Title across the middle/top
    title = "Your Fans Have 47 Apps.\nThey Don't Want Yours."
    font_title = get_font(48, bold=True)
    
    lines = title.split('\n')
    y_offset = 100
    for line in lines:
        temp_draw = ImageDraw.Draw(Image.new('RGB', (1, 1)))
        bbox = temp_draw.textbbox((0, 0), line, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        
        draw_text_with_outline(draw, line, (x, y_offset), font_title,
                              hex_to_rgb(WHITE), hex_to_rgb(NAVY), 3)
        y_offset += 56
    
    # Labels
    font_label = get_font(22, bold=True)
    
    # Left label
    draw.text((WIDTH // 4 - 80, HEIGHT - 100), "App Overload", 
              font=font_label, fill=hex_to_rgb(CORAL))
    
    # Right label
    draw.text((WIDTH * 3 // 4 - 60, HEIGHT - 100), "One Tap",
              font=font_label, fill=hex_to_rgb(AQUA))
    
    # Branding
    font_small = get_font(18)
    branding = "The Tap | Vonga"
    bbox = draw.textbbox((0, 0), branding, font=font_small)
    branding_width = bbox[2] - bbox[0]
    draw.text((WIDTH - branding_width - 30, HEIGHT - 35), branding,
              font=font_small, fill=hex_to_rgb(WHITE))
    
    return img

# ==================== OPTION 3: ABSTRACT GEOMETRIC ====================
def create_option_3():
    """Clean, minimal. Grid of 47 dots, only 9 lit up. Typography-forward."""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(NAVY))
    draw = ImageDraw.Draw(img)
    
    # Title at top (large and prominent)
    title = "Your Fans Have\n47 Apps."
    subtitle = "They Don't Want Yours."
    
    font_title = get_font(72, bold=True)
    font_subtitle = get_font(58, bold=True)
    
    # Draw title
    temp_draw = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    lines = title.split('\n')
    
    y_offset = 80
    for line in lines:
        bbox = temp_draw.textbbox((0, 0), line, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        
        draw.text((x, y_offset), line, font=font_title, fill=hex_to_rgb(WHITE))
        y_offset += 82
    
    # Draw subtitle (with aqua accent)
    bbox = temp_draw.textbbox((0, 0), subtitle, font=font_subtitle)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    y_offset += 20
    
    draw.text((x, y_offset), subtitle, font=font_subtitle, fill=hex_to_rgb(AQUA))
    
    # Dot grid visualization below (47 total dots, 9 lit)
    dot_grid_y = 420
    dot_size = 18
    dot_gap = 32
    
    # 7 rows of dots
    dots_per_row = [7, 7, 7, 7, 7, 7, 5]  # Total = 47
    
    import random
    random.seed(42)  # Consistent pattern
    
    # Pick 9 random positions to light up
    total_dots = sum(dots_per_row)
    lit_positions = random.sample(range(total_dots), 9)
    
    dot_index = 0
    current_y = dot_grid_y
    
    for row_idx, dots_in_row in enumerate(dots_per_row):
        # Calculate row width to center it
        row_width = dots_in_row * dot_size + (dots_in_row - 1) * dot_gap
        start_x = (WIDTH - row_width) // 2
        
        for col in range(dots_in_row):
            x = start_x + col * (dot_size + dot_gap)
            
            if dot_index in lit_positions:
                # Lit dot (aqua with glow)
                # Glow
                overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
                overlay_draw = ImageDraw.Draw(overlay)
                
                for i in range(8, 0, -1):
                    alpha = int(120 * (i / 8))
                    glow_size = dot_size + (i * 3)
                    
                    aqua_rgb = hex_to_rgb(AQUA)
                    glow_color = aqua_rgb + (alpha,)
                    
                    overlay_draw.ellipse(
                        [x + dot_size//2 - glow_size//2, current_y + dot_size//2 - glow_size//2,
                         x + dot_size//2 + glow_size//2, current_y + dot_size//2 + glow_size//2],
                        fill=glow_color
                    )
                
                img = Image.alpha_composite(img.convert('RGBA'), overlay)
                img = img.convert('RGB')
                draw = ImageDraw.Draw(img)
                
                # Actual dot
                draw.ellipse([x, current_y, x + dot_size, current_y + dot_size],
                            fill=hex_to_rgb(AQUA))
            else:
                # Unlit dot (dim gray)
                draw.ellipse([x, current_y, x + dot_size, current_y + dot_size],
                            fill="#2d3748")
            
            dot_index += 1
        
        current_y += dot_size + dot_gap
    
    # Branding
    font_small = get_font(18)
    branding = "The Tap | Vonga"
    bbox = draw.textbbox((0, 0), branding, font=font_small)
    branding_width = bbox[2] - bbox[0]
    draw.text((WIDTH - branding_width - 30, HEIGHT - 35), branding,
              font=font_small, fill=hex_to_rgb(AQUA))
    
    # Small explanatory text
    font_tiny = get_font(14)
    explanation = "Average person: 80 apps installed, 9 actively used"
    bbox = draw.textbbox((0, 0), explanation, font=font_tiny)
    exp_width = bbox[2] - bbox[0]
    draw.text((WIDTH - exp_width - 30, HEIGHT - 60), explanation,
              font=font_tiny, fill="#64748b")
    
    return img

# ==================== MAIN ====================
if __name__ == "__main__":
    print("Generating hero image options...")
    
    # Create output directory if needed
    output_dir = "/Users/bob/clawd/vonga.io/images/blog"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate Option 1
    print("Creating Option 1: AI-conceptual illustration...")
    img1 = create_option_1()
    output1 = os.path.join(output_dir, "hero-option-1-conceptual.png")
    img1.save(output1, "PNG", optimize=True)
    print(f"✓ Saved: {output1}")
    
    # Generate Option 2
    print("Creating Option 2: Sports atmosphere with branded overlay...")
    img2 = create_option_2()
    output2 = os.path.join(output_dir, "hero-option-2-branded.png")
    img2.save(output2, "PNG", optimize=True)
    print(f"✓ Saved: {output2}")
    
    # Generate Option 3
    print("Creating Option 3: Abstract geometric...")
    img3 = create_option_3()
    output3 = os.path.join(output_dir, "hero-option-3-abstract.png")
    img3.save(output3, "PNG", optimize=True)
    print(f"✓ Saved: {output3}")
    
    print("\nAll hero images generated successfully!")
    print(f"View at: {output_dir}")
