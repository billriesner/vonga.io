#!/bin/bash
# Pre-commit check: catch relative paths in blog HTML files
# These break on Vercel due to clean URL resolution
# Run: ./scripts/check-blog-paths.sh

ERRORS=0

for f in blog/*.html; do
  # Check for relative href to .html files (should be /blog/xxx.html)
  if grep -qE 'href="[a-zA-Z][^/"]*\.html"' "$f"; then
    echo "❌ $f: relative .html link found"
    grep -n 'href="[a-zA-Z][^/"]*\.html"' "$f"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for relative CSS (should be /blog/blog.css or /css/main.css)
  if grep -qE 'href="[a-zA-Z][^/"]*\.css"' "$f"; then
    echo "❌ $f: relative .css link found"
    grep -n 'href="[a-zA-Z][^/"]*\.css"' "$f"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for ../  paths (should be absolute)
  if grep -qE '(href|src)="\.\.' "$f"; then
    echo "❌ $f: relative ../ path found"
    grep -n '(href|src)="\.\.' "$f"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "⚠️  Found $ERRORS file(s) with relative paths. Use absolute paths (/blog/*, /css/*, /images/*, etc.)"
  exit 1
else
  echo "✅ All blog paths are absolute"
  exit 0
fi
