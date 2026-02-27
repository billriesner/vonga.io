#!/usr/bin/env node
/**
 * Content Card Renderer
 * Usage: node render.mjs <template> <output.png> [--var KEY=VALUE]...
 * 
 * Templates: stat-card, quote-card, comparison-card, listicle-card
 * Or pass a full path to any HTML template.
 *
 * Example:
 *   node render.mjs stat-card /tmp/card.png \
 *     --var STAT="76%" \
 *     --var HEADLINE="of sponsors can't calculate ROI" \
 *     --var SUBLINE="The measurement gap is costing teams millions"
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve, basename, extname } from 'path';
import { execSync } from 'child_process';
import { createServer } from 'http';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(args) {
  const template = args[0];
  const output = args[1];
  const vars = {};
  
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--var' && args[i + 1]) {
      const [key, ...rest] = args[i + 1].split('=');
      vars[key] = rest.join('=');
      i++;
    }
  }
  
  return { template, output, vars };
}

function resolveTemplate(template) {
  // Check if it's a full path
  if (template.endsWith('.html')) return resolve(template);
  // Otherwise look in templates dir
  return resolve(__dirname, 'templates', `${template}.html`);
}

async function render(templatePath, vars, outputPath) {
  let html = readFileSync(templatePath, 'utf8');
  
  // Replace all {{VAR}} placeholders
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  
  // Warn about unreplaced vars
  const unreplaced = html.match(/\{\{[A-Z_]+\}\}/g);
  if (unreplaced) {
    console.warn(`⚠️  Unreplaced vars: ${[...new Set(unreplaced)].join(', ')}`);
  }
  
  // Write temp HTML
  const tmpHtml = `/tmp/content-card-${Date.now()}.html`;
  writeFileSync(tmpHtml, html);
  
  // Start a temp server
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
  
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  
  try {
    // Use playwright to screenshot
    const script = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
        await page.goto('http://127.0.0.1:${port}');
        await page.waitForTimeout(500);
        const el = await page.$('.card') || await page.$('.hero') || await page.$('body');
        await el.screenshot({ path: '${outputPath}', type: 'png' });
        await browser.close();
      })();
    `;
    execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
      stdio: 'pipe',
      timeout: 30000
    });
    console.log(`✅ Rendered: ${outputPath}`);
  } catch (e) {
    // Fallback: try using the OpenClaw browser endpoint
    console.log('Playwright not available, use browser tool to screenshot manually.');
    console.log(`Temp server running at: http://127.0.0.1:${port}`);
    console.log(`Template saved to: ${tmpHtml}`);
    server.close();
    process.exit(1);
  }
  
  server.close();
}

// Main
const { template, output, vars } = parseArgs(process.argv.slice(2));

if (!template || !output) {
  console.log(`
Content Card Renderer
Usage: node render.mjs <template> <output.png> [--var KEY=VALUE]...

Templates available:
  stat-card       — Big number + headline + subline
  quote-card      — Pull quote with attribution
  comparison-card — Side-by-side old vs new
  listicle-card   — Numbered list (up to 5 items)

Or pass any .html file path as template.

Example:
  node render.mjs stat-card /tmp/my-card.png \\
    --var STAT="76%" \\
    --var HEADLINE="of sponsors can't calculate ROI" \\
    --var SUBLINE="The measurement gap is real"
  `);
  process.exit(0);
}

const templatePath = resolveTemplate(template);
mkdirSync(dirname(output), { recursive: true });
render(templatePath, vars, output).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
