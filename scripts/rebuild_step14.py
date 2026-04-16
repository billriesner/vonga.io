import os
import glob
import re
import json

base_dir = '/Users/bob/clawd/vonga.io'

def fix_step_14():
    # 1. Update vercel.json
    v_json = os.path.join(base_dir, 'vercel.json')
    with open(v_json, 'r') as f:
        data = json.load(f)
        
    has_redirect = any(r['source'] == '/sponsor-roi/' for r in data['redirects'])
    if not has_redirect:
        data['redirects'].append({
            "source": "/sponsor-roi/",
            "destination": "/use-cases/sponsor-attribution/",
            "permanent": True
        })
        with open(v_json, 'w') as f:
            json.dump(data, f, indent=2)

    # 2. Update partner.html placeholder
    partner = os.path.join(base_dir, 'partner.html')
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner Program | Vonga</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <header>
        <nav></nav>
    </header>
    <main style="padding: 150px 20px; text-align: center; min-height: 60vh;">
        <h1>Partner program coming soon.</h1>
        <br>
        <a href="/contact.html" class="btn btn-primary">In the meantime, let's talk.</a>
    </main>
</body>
</html>"""
    with open(partner, 'w') as f:
        f.write(html)
        
fix_step_14()
