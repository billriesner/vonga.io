# Design Token System

## Overview
This project uses a comprehensive design token system built on CSS variables and Tailwind CSS for consistent styling across all components. Our design philosophy is **minimalist, clean, and focused** - inspired by vonga.io's aesthetic.

## Design Ethos

### Core Principles
1. **Minimalist Aesthetic**: Clean layouts with ample white space. Remove clutter and focus on essential content.
2. **No Gradients**: Use only solid colors. Gradients clutter the design and reduce clarity.
3. **Strategic Color Usage**: Navy and cyan as accents on white/gray backgrounds. Don't overuse brand colors - let them make an impact where they matter.
4. **High Contrast**: Ensure text is always readable. Light text on dark backgrounds, dark text on light backgrounds.
5. **Consistent Patterns**: Establish visual patterns and repeat them across the site for familiarity.

### Typography Hierarchy
- **Hero Titles**: 4xl to 7xl, bold, navy or white (on dark backgrounds)
- **Section Titles**: 3xl to 4xl, bold, navy or white (on dark backgrounds)
- **Card Titles**: 2xl, bold, navy or cyan (on dark cards)
- **Subheaders/Descriptions**: Base size, font-semibold, cyan (#33BECC)
- **Body Text**: Small to base, regular weight, navy or gray
- **Always use inline styles** for cyan text: `style={{ color: '#33BECC' }}` to ensure proper rendering

### Writing Guidelines
- **NEVER use em dashes (—)**: Em dashes are strictly forbidden. Always use periods or commas instead. Em dashes clutter copy and reduce readability.
  - ❌ Bad: "No apps needed — just tap"
  - ✅ Good: "No apps needed. Just tap."
  - ✅ Good: "No apps needed. Just tap"
- **Short sentences**: Break long sentences into multiple shorter ones
- **Active voice**: Use direct, active language
- **No jargon**: Keep language approachable for non-technical users

## Token Categories

### Colors
- **Brand Colors**
  - `--color-accent`: #33BECC (Primary brand color)
  - `--color-navy`: #303E55 (Secondary brand color)
  - `--color-text`: #0A0A0A (Primary text color)
  - `--color-bg`: #FFFFFF (Background color)
  - `--color-muted`: #F7F7F7 (Muted backgrounds)

- **Status Colors**
  - `--color-success`: #10B981
  - `--color-warning`: #F59E0B
  - `--color-error`: #EF4444

### Spacing (8px Grid System)
- `--spacing-xs`: 8px
- `--spacing-sm`: 16px
- `--spacing-md`: 24px
- `--spacing-lg`: 32px
- `--spacing-xl`: 40px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px
- `--spacing-4xl`: 80px
- `--spacing-5xl`: 96px

### Radius
- `--radius`: 16px (Default border radius)
- `--radius-lg`: 20px (Large border radius)

### Shadow
- `--shadow-soft`: 0 4px 12px rgba(0, 0, 0, 0.08) (Soft elevation shadow)

## Card Design Patterns

### Standard Card Layout
```tsx
<Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" style={{ backgroundColor: '#FFFFFF' }}>
  <CardHeader className="items-center text-center">
    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-md mx-auto shadow-lg" style={{ backgroundColor: '#33BECC' }}>
      <Icon className="w-10 h-10 text-white" />
    </div>
    <CardTitle className="text-navy text-2xl font-bold" style={{ textAlign: 'center' }}>Title</CardTitle>
    <CardDescription className="text-base font-semibold mt-sm" style={{ textAlign: 'center', color: '#33BECC' }}>
      Subheader in cyan
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-navy" style={{ marginBottom: '48px' }}>
      Descriptive copy here.
    </p>
  </CardContent>
</Card>
```

### Card Color Patterns
**Alternate colors for visual variety:**
- Pattern A (Three Ways): White → Navy → White
- Pattern B (How It Works): Navy → White → Navy  
- Pattern C (Two columns): Navy → Cyan

**Background Colors:**
- White cards: `style={{ backgroundColor: '#FFFFFF' }}`
- Navy cards: `style={{ backgroundColor: '#303E55' }}`
- Cyan cards: `style={{ backgroundColor: '#33BECC' }}`

**Text on Cards:**
- White cards: Navy text (`text-navy`)
- Navy cards: White text (`text-white`) and cyan titles (`text-accent`)
- Cyan cards: Navy text (`text-navy`)

### Icon Styling
- **Size**: 20x20 container (`w-20 h-20`)
- **Inner Icon**: 10x10 (`w-10 h-10`)
- **Backgrounds**: Solid cyan or navy circles
- **Icon Colors**: White for maximum contrast
- **Always centered**: Add `mx-auto` to icon container
- **Shadow**: `shadow-lg` for depth

## Section Backgrounds

### Background Pattern
Alternate section backgrounds for visual rhythm:
1. White (#FFFFFF)
2. Light Gray (#F7F7F7)  
3. Navy (#303E55) - use sparingly for impact
4. Cyan (#33BECC) - use sparingly for hero sections

### Section Props
- Use `dark={true}` prop when section has navy background
- This ensures titles and descriptions render in white/light colors

## Component System

### Button Guidelines
**Standard Button Styling:**
- Default: Gray background with black text
  ```tsx
  <Button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md">
  ```
- Navy CTA: `bg-navy hover:bg-navy/90 text-white`
- Cyan CTA: `bg-accent hover:bg-accent/90 text-black` or `text-white`
- Always use `font-semibold` and `shadow-md` for buttons

### Card Component
- **Border**: `border-2` (thicker borders for definition)
- **Border Colors**: 
  - White/Cyan cards: `border-muted`
  - Navy cards: `border-navy` or `border-accent`
- **Hover**: `hover:shadow-xl transition-shadow`
- **Text Alignment**: Always center-align with `items-center text-center` on CardHeader

### Section Component
- **Props**: eyebrow, title, description, children, dark, style
- **Padding**: `py-4xl` or `py-5xl` for consistent vertical rhythm
- **Max Width**: Cards should use `max-w-6xl` for three columns, `max-w-5xl` for two columns
- **Gap**: `gap-3xl` between cards

### Spacing Patterns
- **Between card content and bottom**: Use `style={{ marginBottom: '48px' }}` for reliable rendering
- **Between form inputs**: Use `style={{ marginBottom: '24px' }}` on each input
- **Never rely on Tailwind margin classes** for critical spacing - use inline styles

## Usage Guidelines

### General Rules
1. **Use semantic color names** where possible - `text-navy` instead of `text-[#303E55]`
2. **Follow the 8px grid** - Use spacing tokens for consistent layout
3. **Use component variants** - Prefer `variant="primary"` over custom classes

### When to Use Inline Styles
**Critical spacing** - When Tailwind classes don't render reliably:
- Card content spacing: `style={{ marginBottom: '48px' }}`
- Form input spacing: `style={{ marginBottom: '24px' }}`
- Hero text spacing: Use inline margins for precise control

**Cyan colors** - Always use inline styles for cyan to ensure rendering:
- Subheaders: `style={{ color: '#33BECC' }}`
- Backgrounds: `style={{ backgroundColor: '#33BECC' }}`
- This solves Tailwind compilation issues with accent color

**Section backgrounds** - Use inline styles for reliability:
- `style={{ backgroundColor: '#FFFFFF' }}` for white
- `style={{ backgroundColor: '#F7F7F7' }}` for gray
- `style={{ backgroundColor: '#303E55' }}` for navy
- `style={{ backgroundColor: '#33BECC' }}` for cyan

### Form Styling
- **Input Fields**: Always white backgrounds with `bg-white`
- **Borders**: `border-2 border-muted`
- **Padding**: `px-lg py-md` for comfortable input size
- **Focus States**: `focus:ring-2 focus:ring-accent focus:border-accent`
- **Spacing**: 24px between inputs using inline styles

## Visual Elements

### Hero Sections
- **Full-width or contained**: Can be full screen or max-width container
- **Background**: Image with overlay, or solid color (navy/cyan)
- **Overlay**: Light white (`bg-white/60`) for image backgrounds
- **Text Shadow**: Add for readability on images: `textShadow: '0 2px 4px rgba(255,255,255,0.8)'`
- **CTA Buttons**: High contrast - cyan/black or white/navy with shadows

### Dividers
- **Between sections**: Simple line with opacity
- **Example**: `<div style={{ height: '2px', backgroundColor: '#33BECC', opacity: 0.3 }}></div>`
- **Spacing**: 64px padding top and bottom

### Video/Image Placeholders
- **Video**: Full-width, black background, 16:9 ratio
- **Images**: Full-width with natural aspect ratio
- **Use**: `<img>` tags for SVGs, not background-image

## Best Practices

### Do's ✅
- Use alternating card color patterns for visual variety
- Center-align text in cards with inline styles
- Use cyan subheaders consistently
- Add proper spacing with inline styles
- Use gray buttons as default
- Keep layouts clean with white space
- Use solid colors only

### Don'ts ❌
- Don't use gradients
- Don't use scale animations or hover transforms
- Don't overcrowd with text - be concise
- Don't use ring effects or glows
- Don't rely on Tailwind classes for critical spacing
- Don't use light text on light backgrounds

## Tailwind Integration

All tokens are mapped to Tailwind classes:
- `bg-accent` → `background-color: var(--color-accent)`
- `text-navy` → `color: var(--color-navy)`
- `rounded-md` → `border-radius: var(--radius)`
- `shadow-sm` → `box-shadow: var(--shadow-soft)`

**Important**: Some colors and spacing require inline styles for reliable rendering. See "When to Use Inline Styles" section above.

This ensures consistency across the entire design system while maintaining the flexibility of Tailwind CSS.

## Quick Reference

### Standard Three-Column Section
```tsx
<Section 
  className="py-4xl"
  style={{ backgroundColor: '#FFFFFF' }}
  title="Section Title"
  description="Optional description"
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl max-w-6xl mx-auto">
    {/* White Card */}
    <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" 
          style={{ backgroundColor: '#FFFFFF' }}>
      {/* Card content */}
    </Card>
    
    {/* Navy Card */}
    <Card className="text-center hover:shadow-xl transition-shadow border-2 border-navy" 
          style={{ backgroundColor: '#303E55' }}>
      {/* Card content with white text */}
    </Card>
    
    {/* White Card */}
    <Card className="text-center hover:shadow-xl transition-shadow border-2 border-muted" 
          style={{ backgroundColor: '#FFFFFF' }}>
      {/* Card content */}
    </Card>
  </div>
</Section>
```

### Contact Form Pattern
```tsx
<form>
  <input
    type="email"
    placeholder="Enter your email"
    className="w-full px-lg py-md border-2 border-muted rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text bg-white"
    style={{ marginBottom: '24px' }}
    required
  />
  <Button className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold shadow-md">
    Submit
  </Button>
</form>
```

### Page Structure Template
1. Hero section (Navy, Cyan, or image background)
2. White or light gray content section
3. Alternate backgrounds for visual rhythm
4. Visual divider if needed (cyan line)
5. Call-to-action section
6. Footer (navy background, cyan headers)

---

**Remember**: Consistency is key. When in doubt, reference the homepage or this guide.
