const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { format } = require('date-fns');

// Configure marked for better HTML output
marked.setOptions({
  headerIds: true,
  mangle: false,
  breaks: true,
  gfm: true
});

const CONTENT_DIR = path.join(__dirname, '../content/blog');
const OUTPUT_DIR = path.join(__dirname, '../blog');

// Helper to read markdown files
function getMarkdownPosts() {
  const files = fs.readdirSync(CONTENT_DIR).filter(file => {
    // Only include .md files, exclude README and template
    return file.endsWith('.md') && 
           file !== 'README.md' && 
           !file.startsWith('_');
  });
  
  return files.map(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: data.slug || file.replace('.md', ''),
      frontmatter: data,
      content,
      file
    };
  }).sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });
}

// Generate individual blog post HTML
function generatePostHTML(post) {
  const { frontmatter, content, slug } = post;
  const html = marked(content);
  const formattedDate = format(new Date(frontmatter.date), 'MMMM d, yyyy');
  
  // Calculate read time (roughly 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  
  // Generate tags HTML
  const tagsHTML = frontmatter.tags 
    ? frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
    : '<span class="tag">Article</span>';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${frontmatter.title} | Vonga Blog</title>
    <meta name="description" content="${frontmatter.excerpt || frontmatter.description || ''}">
    <meta name="keywords" content="${frontmatter.keywords || frontmatter.tags?.join(', ') || ''}">
    <meta name="author" content="${frontmatter.author || 'Vonga Team'}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://vonga.io/blog/${slug}.html">
    <meta property="og:title" content="${frontmatter.title}">
    <meta property="og:description" content="${frontmatter.excerpt || frontmatter.description || ''}">
    <meta property="og:image" content="https://vonga.io/${frontmatter.featuredImage || 'images/blog/default-featured.png'}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://vonga.io/blog/${slug}.html">
    <meta property="twitter:title" content="${frontmatter.title}">
    <meta property="twitter:description" content="${frontmatter.excerpt || frontmatter.description || ''}">
    <meta property="twitter:image" content="https://vonga.io/${frontmatter.featuredImage || 'images/blog/default-featured.png'}">
    
    <link rel="canonical" href="https://vonga.io/blog/${slug}.html">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="blog.css">
    <script src="../js/main.js" defer></script>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${frontmatter.title}",
      "image": "https://vonga.io/${frontmatter.featuredImage || 'images/blog/default-featured.png'}",
      "author": {
        "@type": "Person",
        "name": "${frontmatter.author || 'Vonga Team'}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Vonga",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vonga.io/images/logos/logo.svg"
        }
      },
      "datePublished": "${frontmatter.date}",
      "description": "${frontmatter.excerpt || frontmatter.description || ''}"
    }
    </script>
</head>
<body class="blog-post">
    <header>
        <nav>
            <a href="../index.html" class="logo"><img src="../images/logos/logo.svg" alt="Vonga"></a>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul>
                <li><a href="../how-it-works.html">How It Works</a></li>
                <li><a href="../case-studies.html">Stories</a></li>
                <li><a href="../pricing.html">Pricing</a></li>
                <li><a href="index.html" class="active">The Tap</a></li>
                <li><a href="../contact.html" class="btn btn-primary">Let's Connect</a></li>
            </ul>
        </nav>
    </header>

    <!-- Article Header -->
    <article class="blog-article">
        <div class="article-header">
            <div class="article-header-content">
                <div class="breadcrumbs">
                    <a href="index.html">← Back to The Tap</a>
                </div>
                <h1>${frontmatter.title}</h1>
                ${frontmatter.featuredImage ? `<img src="../${frontmatter.featuredImage}" alt="${frontmatter.title}" class="featured-image" style="width: 100%; max-width: 800px; border-radius: 12px; margin: 24px auto; display: block;">` : ''}
                <div class="article-meta">
                    <div class="author-info">
                        <div>
                            <div class="author-name">${frontmatter.author || 'Vonga Team'}</div>
                            <div class="publish-date">${formattedDate} · ${readTime} min read</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Article Content -->
        <div class="article-content">
            ${html}
        </div>
    </article>

    <!-- Newsletter CTA -->
    <section class="newsletter-section">
        <div class="newsletter-container">
            <h3>Get Weekly Insights</h3>
            <p>Join athletic directors and marketing leaders who get actionable insights every Thursday.</p>
            <div class="newsletter-form">
                <input type="email" placeholder="Your email address" id="newsletter-email">
                <button class="btn btn-primary" onclick="subscribeNewsletter()">Subscribe</button>
            </div>
            <p class="newsletter-substack"><a href="https://vonga.substack.com" target="_blank" rel="noopener">Or follow us on Substack →</a></p>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="blog-cta-section">
        <div class="blog-cta-content">
            <h2>Ready to Prove Your Sponsor ROI?</h2>
            <p>Let's show you how Vonga turns merchandise into measurable engagement.</p>
            <a href="../contact.html" class="btn btn-coral">Schedule a Demo</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <img src="../images/logos/logo.svg" alt="Vonga" style="height: 96px; width: auto; filter: invert(64%) sepia(88%) saturate(425%) hue-rotate(138deg) brightness(95%) contrast(92%); margin-bottom: var(--space-md);">
                <p style="font-weight: 600; color: white; font-size: 18px;">Live Connected.</p>
            </div>
            
            <div class="footer-section">
                <h4>Resources</h4>
                <ul>
                    <li><a href="../how-it-works.html">How It Works</a></li>
                    <li><a href="../case-studies.html">Stories</a></li>
                    <li><a href="../pricing.html">Pricing</a></li>
                    <li><a href="index.html">The Tap</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Let's Talk</h4>
                <ul>
                    <li><a href="../contact.html">Get Started</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2026 Vonga. All rights reserved.</p>
        </div>
    </footer>

    <script>
        function subscribeNewsletter() {
            const email = document.getElementById('newsletter-email').value;
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Newsletter signup coming soon! For now, follow us on Substack: https://vonga.substack.com');
        }
    </script>
</body>
</html>`;
}

// Generate blog index HTML
function generateIndexHTML(posts) {
  const featuredPost = posts[0]; // Most recent post is featured
  const otherPosts = posts.slice(1);
  
  const featuredHTML = featuredPost ? `
    <section class="featured-section">
        <article class="featured-article">
            <a href="${featuredPost.slug}.html" class="featured-article-link">
                <div class="featured-article-image">
                    <img src="../${featuredPost.frontmatter.featuredImage || 'images/blog/default-featured.png'}" alt="${featuredPost.frontmatter.title}">
                </div>
                <div class="featured-article-content">
                    <div class="article-tags">
                        ${featuredPost.frontmatter.tags ? featuredPost.frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '<span class="tag">Article</span>'}
                        <span class="read-time">${Math.ceil(featuredPost.content.split(/\s+/).length / 200)} min read</span>
                    </div>
                    <h2>${featuredPost.frontmatter.title}</h2>
                    <p class="article-excerpt">${featuredPost.frontmatter.excerpt || featuredPost.frontmatter.description || ''}</p>
                    <div class="article-footer">
                        <span class="author">${featuredPost.frontmatter.author || 'Vonga Team'}</span>
                        <span class="date">${format(new Date(featuredPost.frontmatter.date), 'MMMM d, yyyy')}</span>
                    </div>
                </div>
            </a>
        </article>
    </section>` : '';
  
  const otherPostsHTML = otherPosts.length > 0 ? `
    <section class="blog-grid-section">
        <div class="blog-grid">
            ${otherPosts.map(post => `
                <article class="blog-card">
                    <a href="${post.slug}.html" class="blog-card-link">
                        <div class="blog-card-image">
                            <img src="../${post.frontmatter.featuredImage || 'images/blog/default-featured.png'}" alt="${post.frontmatter.title}">
                        </div>
                        <div class="blog-card-content">
                            <div class="article-tags">
                                ${post.frontmatter.tags ? post.frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '<span class="tag">Article</span>'}
                            </div>
                            <h3>${post.frontmatter.title}</h3>
                            <p>${post.frontmatter.excerpt || post.frontmatter.description || ''}</p>
                            <div class="article-footer">
                                <span class="author">${post.frontmatter.author || 'Vonga Team'}</span>
                                <span class="date">${format(new Date(post.frontmatter.date), 'MMMM d, yyyy')}</span>
                            </div>
                        </div>
                    </a>
                </article>
            `).join('')}
        </div>
    </section>` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Tap - Vonga Blog</title>
    <meta name="description" content="Insights on athletic sponsorship, fan engagement, and sports marketing from Vonga.">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="blog.css">
    <script src="../js/main.js" defer></script>
</head>
<body>
    <header>
        <nav>
            <a href="../index.html" class="logo"><img src="../images/logos/logo.svg" alt="Vonga"></a>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul>
                <li><a href="../how-it-works.html">How It Works</a></li>
                <li><a href="../case-studies.html">Stories</a></li>
                <li><a href="../pricing.html">Pricing</a></li>
                <li><a href="index.html" class="active">The Tap</a></li>
                <li><a href="../contact.html" class="btn btn-primary">Let's Connect</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero -->
    <section class="blog-hero">
        <div class="blog-hero-content">
            <h1>The Tap</h1>
            <p class="hero-subtitle">Insights on sponsor ROI, fan engagement, and the future of sports marketing</p>
        </div>
    </section>

    ${featuredHTML}
    ${otherPostsHTML}

    <!-- Newsletter CTA -->
    <section class="newsletter-section">
        <div class="newsletter-container">
            <h3>Get Weekly Insights</h3>
            <p>Join athletic directors and marketing leaders who get actionable insights every Thursday.</p>
            <div class="newsletter-form">
                <input type="email" placeholder="Your email address" id="newsletter-email">
                <button class="btn btn-primary" onclick="subscribeNewsletter()">Subscribe</button>
            </div>
            <p class="newsletter-substack"><a href="https://vonga.substack.com" target="_blank" rel="noopener">Or follow us on Substack →</a></p>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="blog-cta-section">
        <div class="blog-cta-content">
            <h2>Ready to Prove Your Sponsor ROI?</h2>
            <p>Let's show you how Vonga turns merchandise into measurable engagement.</p>
            <a href="../contact.html" class="btn btn-coral">Schedule a Demo</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <img src="../images/logos/logo.svg" alt="Vonga" style="height: 96px; width: auto; filter: invert(64%) sepia(88%) saturate(425%) hue-rotate(138deg) brightness(95%) contrast(92%); margin-bottom: var(--space-md);">
                <p style="font-weight: 600; color: white; font-size: 18px;">Live Connected.</p>
            </div>
            
            <div class="footer-section">
                <h4>Resources</h4>
                <ul>
                    <li><a href="../how-it-works.html">How It Works</a></li>
                    <li><a href="../case-studies.html">Stories</a></li>
                    <li><a href="../pricing.html">Pricing</a></li>
                    <li><a href="index.html">The Tap</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Let's Talk</h4>
                <ul>
                    <li><a href="../contact.html">Get Started</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2026 Vonga. All rights reserved.</p>
        </div>
    </footer>

    <script>
        function subscribeNewsletter() {
            const email = document.getElementById('newsletter-email').value;
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Newsletter signup coming soon! For now, follow us on Substack: https://vonga.substack.com');
        }
    </script>
</body>
</html>`;
}

// Add styles for blog grid (appended to existing blog.css)
function addBlogGridStyles() {
  const additionalCSS = `

/* ===== BLOG GRID (for multiple posts on index) ===== */
.blog-grid-section {
    max-width: 1200px;
    margin: 60px auto;
    padding: 0 24px;
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 32px;
}

.blog-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.blog-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.blog-card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
}

.blog-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.blog-card:hover .blog-card-image img {
    transform: scale(1.05);
}

.blog-card-content {
    padding: 24px;
}

.blog-card-content .article-tags {
    margin-bottom: 12px;
}

.blog-card-content h3 {
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 12px;
    color: var(--navy);
}

.blog-card-content p {
    font-size: 15px;
    line-height: 1.6;
    color: var(--gray-600);
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.blog-card-content .article-footer {
    border-top: 1px solid var(--gray-200);
    padding-top: 12px;
}

@media (max-width: 768px) {
    .blog-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }
    
    .blog-grid-section {
        margin: 40px auto;
        padding: 0 16px;
    }
}
`;

  const cssPath = path.join(OUTPUT_DIR, 'blog.css');
  const existingCSS = fs.readFileSync(cssPath, 'utf8');
  
  // Only append if not already there
  if (!existingCSS.includes('BLOG GRID')) {
    fs.writeFileSync(cssPath, existingCSS + additionalCSS);
    console.log('✓ Added blog grid styles to blog.css');
  }
}

// Main build function
function buildBlog() {
  console.log('🔨 Building blog from markdown...\n');
  
  // Get all markdown posts
  const posts = getMarkdownPosts();
  console.log(`Found ${posts.length} blog post(s)\n`);
  
  if (posts.length === 0) {
    console.log('⚠️  No markdown files found in /content/blog/');
    console.log('Create a .md file there to get started!');
    return;
  }
  
  // Generate individual post pages
  posts.forEach(post => {
    const html = generatePostHTML(post);
    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`✓ Generated: ${post.slug}.html`);
  });
  
  // Generate blog index
  const indexHTML = generateIndexHTML(posts);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
  console.log('✓ Generated: index.html');
  
  // Add blog grid styles
  addBlogGridStyles();
  
  console.log('\n✅ Blog build complete!');
  console.log(`📝 ${posts.length} post(s) published\n`);
}

// Run the build
try {
  buildBlog();
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
