# Vonga Blog - Quick Start Guide

## 🚀 Publishing a New Blog Post (5 Minutes)

### Step 1: Copy Template
```bash
cd /Users/bob/clawd/vonga.io
cp content/blog/_template.md content/blog/my-post.md
```

### Step 2: Edit Your Post
Open `content/blog/my-post.md` and update:

```yaml
---
title: "Your Catchy Title"
slug: "your-url-slug"
date: "2026-02-06"  # Today's date
author: "Your Name"
excerpt: "Hook readers in 1-2 sentences"
featuredImage: "images/blog/your-image.png"
tags: ["Tag1", "Tag2"]
keywords: "relevant, seo, keywords"
---

## Write Your Content

Use markdown syntax here...
```

### Step 3: Build
```bash
npm run build:blog
```

### Step 4: Preview
```bash
npm run dev
# Open: http://localhost:3000/blog/
```

### Step 5: Deploy
```bash
git add .
git commit -m "Add: [post title]"
git push
# Vercel auto-deploys
```

---

## 📝 Markdown Cheat Sheet

| You Write | You Get |
|-----------|---------|
| `## Heading` | Large heading |
| `**bold**` | **bold** text |
| `*italic*` | *italic* text |
| `[link](url)` | Clickable link |
| `![alt](image.png)` | Image |
| `- item` | Bullet point |
| `1. item` | Numbered list |

---

## 🎯 Required Frontmatter Fields

Must have:
- `title` - Your post title
- `slug` - URL (use-hyphens-like-this)
- `date` - YYYY-MM-DD format
- `excerpt` - For social shares
- `featuredImage` - Path to image
- `tags` - ["Array", "Of", "Tags"]

---

## 🖼️ Images

1. Put images in: `/images/blog/your-image.png`
2. Reference in markdown: `![alt text](../images/blog/your-image.png)`
3. Featured image: Use in frontmatter

---

## 📚 Full Documentation

- **System overview:** `BLOG-SYSTEM-README.md`
- **Complete guide:** `content/blog/README.md`
- **Template:** `content/blog/_template.md`
- **Examples:** Check existing `.md` files in `content/blog/`

---

## 🆘 Quick Fixes

**Build fails?**
```bash
# Check YAML syntax (proper quotes and colons)
# Verify all required fields present
# Look for special characters needing escaping
```

**Images not showing?**
```bash
# Use path: ../images/blog/filename.png
# Check image exists in /images/blog/
# Verify filename matches exactly (case-sensitive)
```

**Post not appearing?**
```bash
npm run build:blog  # Rebuild
# Check date isn't in future
# Verify .md file extension
```

---

## ⚡ Quick Commands

| Command | What It Does |
|---------|--------------|
| `npm run build:blog` | Convert markdown → HTML |
| `npm run dev` | Start local server |
| `npm install` | Install dependencies (first time) |

---

## 🎨 Brand Colors (for reference)

- Navy: `#303E55`
- Aqua: `#33BECC`
- Coral: `#F5856E`

---

## ✅ Pre-Publish Checklist

- [ ] Frontmatter complete and valid
- [ ] Images added to `/images/blog/`
- [ ] Links tested
- [ ] `npm run build:blog` runs successfully
- [ ] Preview looks good (`npm run dev`)
- [ ] Mobile layout checked
- [ ] Typos corrected

---

**That's it! Start writing. 🎯**
