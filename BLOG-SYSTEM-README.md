# Vonga.io Blog Publishing System

This project includes a markdown-based blog publishing system for vonga.io.

## 🎯 Overview

The blog ("The Tap") uses markdown files as the source, which are converted to static HTML for deployment on Vercel. This provides:
- ✅ Easy content authoring (markdown)
- ✅ Full SEO optimization (meta tags, structured data)
- ✅ Static HTML output (fast, secure, free hosting)
- ✅ Version control for content (Git)
- ✅ No database required

## 📁 Project Structure

```
vonga.io/
├── content/
│   └── blog/              # Markdown source files (edit these!)
│       ├── README.md      # Full documentation
│       ├── _template.md   # Copy this for new posts
│       └── *.md          # Your blog posts
│
├── blog/                  # Generated HTML (don't edit directly!)
│   ├── index.html        # Blog index page
│   ├── blog.css          # Blog styles
│   └── *.html           # Individual post pages
│
├── scripts/
│   └── build-blog.js     # Markdown → HTML converter
│
├── images/
│   └── blog/             # Blog images go here
│
└── package.json          # Dependencies & build scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a New Blog Post

Copy the template:
```bash
cp content/blog/_template.md content/blog/my-new-post.md
```

Edit the frontmatter and content in `my-new-post.md`.

### 3. Build the Blog

```bash
npm run build:blog
```

This converts all markdown files to HTML and updates the blog index.

### 4. Preview Locally

```bash
npm run dev
```

Open `http://localhost:3000/blog/` in your browser.

### 5. Deploy

Commit the generated HTML files and push to your repository. Vercel will automatically deploy.

```bash
git add blog/ content/blog/
git commit -m "Add new blog post"
git push
```

## 📝 Creating Blog Posts

### Frontmatter (Required)

Every markdown file must start with YAML frontmatter:

```yaml
---
title: "Your Post Title"
slug: "url-friendly-slug"
date: "2026-02-06"
author: "Author Name"
excerpt: "Compelling summary for social shares and blog index"
featuredImage: "images/blog/your-image.png"
tags: ["Tag1", "Tag2"]
keywords: "seo, keywords, here"
---
```

### Content (Markdown)

After the frontmatter, write your post using standard markdown:

```markdown
## Main Heading

Regular paragraph text.

### Subheading

- Bullet points
- Work great

**Bold** and *italic* text supported.

![Images](../images/blog/example.png)
```

See `content/blog/README.md` for complete documentation.

## 🎨 Styling & Design

The blog uses existing Vonga brand styles:
- **Colors:** Navy (`#303E55`), Aqua (`#33BECC`), Coral (`#F5856E`)
- **Font:** Inter
- **Theme:** Dark hero sections, light content areas
- **Responsive:** Mobile-first design

Custom blog styles are in `/blog/blog.css` (automatically updated by build script).

## 🔧 Build Scripts

| Command | Description |
|---------|-------------|
| `npm run build:blog` | Convert markdown to HTML |
| `npm run dev` | Start local development server |
| `npm run prebuild` | Auto-runs before build (builds blog) |

## 📊 SEO Features

Every blog post automatically includes:
- ✅ Meta title & description
- ✅ Open Graph tags (Facebook)
- ✅ Twitter Card tags
- ✅ Structured data (Schema.org)
- ✅ Canonical URLs
- ✅ Proper heading hierarchy
- ✅ Alt text support for images

## 🖼️ Images

1. **Featured images**: Place in `/images/blog/`
   - Recommended size: 1200x630px
   - Format: PNG or JPG
   - Naming: descriptive-kebab-case.png

2. **Inline images**: Also in `/images/blog/`
   - Reference in markdown: `![Alt text](../images/blog/my-image.png)`
   - Will be responsive automatically

## 🚢 Deployment Workflow

1. **Write** → Create/edit markdown in `/content/blog/`
2. **Build** → Run `npm run build:blog`
3. **Test** → Run `npm run dev` and check `localhost:3000/blog/`
4. **Commit** → Add both markdown source and generated HTML
5. **Push** → Vercel deploys automatically

**Important:** Always run `npm run build:blog` before committing! The site serves the HTML files, not the markdown.

## 📚 Example Posts

- `sponsor-roi-problem.md` - Full example with all features
- `_template.md` - Copy this for new posts

## 🐛 Troubleshooting

### Build fails
- Check YAML frontmatter syntax (proper indentation, quotes)
- Verify all required fields are present
- Look for special characters that need escaping

### Images not loading
- Verify image path: `../images/blog/filename.png`
- Check image exists in correct directory
- Ensure filename case matches exactly

### Post not appearing
- Check `date` field isn't in the future
- Verify file has `.md` extension
- Re-run `npm run build:blog`

### Styles look wrong
- Clear browser cache
- Check `blog.css` was updated by build
- Verify custom HTML doesn't break layout

## 🔄 Updating Existing Posts

1. Edit the markdown file in `/content/blog/`
2. Run `npm run build:blog`
3. Commit and push

The HTML will be regenerated with your changes.

## 📖 Full Documentation

See `content/blog/README.md` for:
- Complete frontmatter reference
- Markdown syntax guide
- SEO best practices
- Writing tips
- Advanced features

## 🤝 Contributing

When adding blog posts:
1. Use the template (`_template.md`)
2. Follow the style guide (conversational, actionable, scannable)
3. Include compelling featured image
4. Add relevant tags and keywords
5. Build and test before pushing

## 📞 Support

Questions? Check:
1. `content/blog/README.md` (comprehensive guide)
2. Existing posts for examples
3. Build script comments (`scripts/build-blog.js`)

---

**Built with:** Node.js, marked, gray-matter, date-fns  
**Deployed on:** Vercel (static HTML)  
**Content format:** Markdown with YAML frontmatter
