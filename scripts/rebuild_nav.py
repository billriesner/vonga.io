import os
import glob
import re

base_dir = '/Users/bob/clawd/vonga.io'
all_files = glob.glob(os.path.join(base_dir, '**/*.html'), recursive=True)

nav_html = """<nav>
            <a href="/" class="logo" style="z-index: 1001;"><img src="/images/logos/logo.svg" alt="Vonga"></a>
            <div class="nav-mobile-actions">
                <a href="/contact.html" class="btn btn-primary mobile-cta">Book a Demo</a>
                <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <ul>
                <li><a href="/how-it-works.html">How It Works</a></li>
                <li><a href="/use-cases/sponsor-attribution.html">Sponsor ROI</a></li>
                <li><a href="/pricing.html">Pricing</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li class="desktop-cta-li"><a href="/contact.html" class="btn btn-primary">Book a Demo</a></li>
            </ul>
        </nav>"""

for file in all_files:
    if "node_modules" in file:
        continue
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace nav
    content = re.sub(r'<nav>.*?</nav>', nav_html, content, flags=re.DOTALL)
    
    # Remove footer links
    content = re.sub(r'<li><a href="[^"]*?/sponsor-roi\.html">.*?</a></li>\n?', '', content)
    content = re.sub(r'<li><a href="[^"]*?/partner\.html">.*?</a></li>\n?', '', content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Updated nav and footer in all HTML files.")
