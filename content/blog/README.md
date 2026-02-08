# Vonga Blog Publishing System

This directory contains markdown source files for the Vonga blog ("The Tap").

## How It Works

1. **Write blog posts in markdown** in this directory (`/content/blog/`)
2. **Run the build script** to convert markdown to HTML: `npm run build:blog`
3. **HTML files are generated** in `/blog/` directory (ready to deploy)

## Creating a New Blog Post

### 1. Create a new `.md` file

Create a file in this directory, e.g., `my-awesome-post.md`

### 2. Add frontmatter (metadata)

Every blog post **must** start with YAML frontmatter:

```yaml
---
title: "Your Post Title Here"
slug: "your-post-slug"
date: "2026-02-06"
author: "Your Name"
excerpt: "A compelling 1-2 sentence summary that appears on the blog index and in social shares."
description: "SEO meta description (can be same as excerpt)"
featuredImage: "images/blog/your-image.png"
tags: ["Tag1", "Tag2", "Tag3"]
keywords: "seo, keywords, separated, by, commas"
---
```

### 3. Write your content in markdown

After the frontmatter, write your post using standard markdown:

```markdown
## Main Heading

Regular paragraph text here.

### Subheading

- Bullet points
- Work great
- For lists

**Bold text** and *italic text* are supported.

[Links work like this](https://example.com)

![Images too](../images/blog/my-image.png)
```

### 4. Build the blog

```bash
npm run build:blog
```

This will:
- Convert your markdown to HTML
- Generate individual post pages with full SEO meta tags
- Update the blog index with your new post
- Add proper navigation and styling

### 5. Preview locally

```bash
npm run dev
```

Then visit `http://localhost:3000/blog/` to see your blog.

## Frontmatter Fields Explained

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Post title (H1, social shares) | `"The Sponsor ROI Problem"` |
| `slug` | ✅ Yes | URL slug (becomes `/blog/slug.html`) | `"sponsor-roi-problem"` |
| `date` | ✅ Yes | Publish date (YYYY-MM-DD format) | `"2026-02-06"` |
| `author` | Recommended | Author name | `"Bill Riesner"` |
| `excerpt` | ✅ Yes | Short summary for blog index & social | `"Learn how to prove..."` |
| `description` | Optional | SEO meta description (defaults to excerpt) | Same as excerpt |
| `featuredImage` | ✅ Yes | Hero/social image path | `"images/blog/my-post.png"` |
| `tags` | Recommended | Category tags (array) | `["Sponsorship", "ROI"]` |
| `keywords` | Optional | SEO keywords | `"sponsor roi, athletics"` |

## Markdown Tips

### Headings

```markdown
## H2 - Main Section Heading
### H3 - Subsection Heading
#### H4 - Minor Heading
```

### Lists

```markdown
- Unordered list
- Another item

1. Ordered list
2. Second item
```

### Links

```markdown
[Link text](https://example.com)
[Internal link](/contact.html)
```

### Images

```markdown
![Alt text](../images/blog/my-image.png)
```

**Note:** Images should be placed in `/images/blog/` directory. Use relative paths from the blog post perspective.

### Emphasis

```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Code

Inline code: `code here`

Code blocks:
\`\`\`javascript
function example() {
  return "Hello!";
}
\`\`\`

### Blockquotes

```markdown
> This is a quote
> It can span multiple lines
```

### Horizontal Rule

```markdown
---
```

## File Naming

- Use lowercase letters
- Separate words with hyphens
- Use descriptive names: `sponsor-roi-tips.md` (good) vs `post1.md` (bad)
- The filename doesn't have to match the slug, but it helps with organization

## Post Organization

Posts are automatically sorted by date (newest first) on the blog index. The most recent post becomes the "featured" post with a larger layout.

## Images

1. **Featured images**: Should be ~1200x630px for optimal social sharing
2. **Inline images**: Can be any reasonable size (will be responsive)
3. **Storage**: Put all blog images in `/images/blog/`
4. **Naming**: Use descriptive names: `sponsor-roi-dashboard.png`

## SEO Best Practices

1. **Title**: 50-60 characters (includes "| Vonga Blog" suffix)
2. **Excerpt**: 120-155 characters (used as meta description)
3. **Keywords**: 5-10 relevant keywords/phrases
4. **Featured image**: Always include for social sharing
5. **Alt text**: Use descriptive alt text for all images

## Testing Before Publishing

```bash
# 1. Build the blog
npm run build:blog

# 2. Start local server
npm run dev

# 3. Open browser to http://localhost:3000/blog/

# 4. Check:
- Post appears on blog index
- Individual post page loads
- Images display correctly
- Links work
- Mobile layout looks good
- Meta tags are correct (view source)
```

## Deployment

The blog is deployed as static HTML to Vercel. When you push changes:

1. Build the blog: `npm run build:blog`
2. Commit the generated HTML files in `/blog/`
3. Push to your repository
4. Vercel will automatically deploy

**Important:** Always run `npm run build:blog` before committing! The markdown files alone won't display on the live site.

## Troubleshooting

### "No markdown files found"
- Make sure your file ends with `.md`
- Check that it's in `/content/blog/` directory

### Post not showing up
- Verify frontmatter is properly formatted (YAML syntax)
- Check the `date` field isn't in the future
- Run `npm run build:blog` again

### Images not loading
- Use correct relative path: `../images/blog/your-image.png`
- Verify image exists in `/images/blog/`
- Check filename matches exactly (case-sensitive)

### Build errors
- Check YAML frontmatter syntax (proper quotes, colons, dashes)
- Ensure required fields are present
- Look for special characters that need escaping

## Example Post Template

See `_template.md` in this directory for a complete example you can copy.

---

**Questions?** Check the existing posts in this directory for examples or contact the dev team.
