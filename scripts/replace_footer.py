#!/usr/bin/env python3
"""Replace footer in all HTML files with the new simplified footer structure."""

import os
import re
import glob

NEW_FOOTER = '''<footer>
    <div class="footer-content">
        <div class="footer-section">
            <img src="/images/logos/logo.svg" alt="Vonga" style="height: 96px; width: auto; filter: invert(64%) sepia(88%) saturate(425%) hue-rotate(138deg) brightness(95%) contrast(92%); margin-bottom: var(--space-md);">
            <p style="font-weight: 600; color: white; font-size: 18px;">Fan Intelligence Platform.</p>
        </div>

        <div class="footer-section">
            <h4>Product</h4>
            <ul>
                <li><a href="/how-it-works.html">How It Works</a></li>
                <li><a href="/use-cases/sponsor-attribution.html">Sponsor ROI</a></li>
                <li><a href="/activations/">Activations</a></li>
                <li><a href="/pricing.html">Pricing</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Resources</h4>
            <ul>
                <li><a href="/blog/">The Tap</a></li>
                <li><a href="/whitepaper/">Whitepaper</a></li>
                <li><a href="/contact.html">Book a Demo</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Contact</h4>
            <ul>
                <li><a href="mailto:bill@vonga.io">bill@vonga.io</a></li>
                <li><a href="/privacy.html">Privacy Policy</a></li>
                <li><a href="/terms.html">Terms of Service</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; 2026 Vonga. All rights reserved. &bull; <a href="/privacy.html">Privacy Policy</a> &bull; <a href="/terms.html">Terms of Service</a></p>
    </div>
</footer>'''

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'node_modules', '.git', 'tools', 'scripts'}

footer_pattern = re.compile(r'<footer>.*?</footer>', re.DOTALL)

count = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fname in filenames:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        # Skip index.html - already done
        if os.path.abspath(fpath) == os.path.join(ROOT, 'index.html'):
            continue
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue
        if '<footer>' not in content:
            continue
        new_content = footer_pattern.sub(NEW_FOOTER, content)
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {os.path.relpath(fpath, ROOT)}")

print(f"\nDone. Updated {count} files (index.html was already done separately).")
