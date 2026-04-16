#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator
 * Generates sponsorship-activation pages for NFL + NBA teams
 * 
 * Usage: node scripts/generate-seo-pages.js
 * 
 * Part of BRICK-SPRINT-APR7-11 V5: SEO Infrastructure
 */

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────────
// TEAM DATA
// ────────────────────────────────────────────────────────────────────────────────

const NFL_TEAMS = [
  { slug: 'arizona-cardinals', name: 'Arizona Cardinals', city: 'Arizona', league: 'NFL' },
  { slug: 'atlanta-falcons', name: 'Atlanta Falcons', city: 'Atlanta', league: 'NFL' },
  { slug: 'baltimore-ravens', name: 'Baltimore Ravens', city: 'Baltimore', league: 'NFL' },
  { slug: 'buffalo-bills', name: 'Buffalo Bills', city: 'Buffalo', league: 'NFL' },
  { slug: 'carolina-panthers', name: 'Carolina Panthers', city: 'Carolina', league: 'NFL' },
  { slug: 'chicago-bears', name: 'Chicago Bears', city: 'Chicago', league: 'NFL' },
  { slug: 'cincinnati-bengals', name: 'Cincinnati Bengals', city: 'Cincinnati', league: 'NFL' },
  { slug: 'cleveland-browns', name: 'Cleveland Browns', city: 'Cleveland', league: 'NFL' },
  { slug: 'dallas-cowboys', name: 'Dallas Cowboys', city: 'Dallas', league: 'NFL' },
  { slug: 'denver-broncos', name: 'Denver Broncos', city: 'Denver', league: 'NFL' },
  { slug: 'detroit-lions', name: 'Detroit Lions', city: 'Detroit', league: 'NFL' },
  { slug: 'green-bay-packers', name: 'Green Bay Packers', city: 'Green Bay', league: 'NFL' },
  { slug: 'houston-texans', name: 'Houston Texans', city: 'Houston', league: 'NFL' },
  { slug: 'indianapolis-colts', name: 'Indianapolis Colts', city: 'Indianapolis', league: 'NFL' },
  { slug: 'jacksonville-jaguars', name: 'Jacksonville Jaguars', city: 'Jacksonville', league: 'NFL' },
  { slug: 'kansas-city-chiefs', name: 'Kansas City Chiefs', city: 'Kansas City', league: 'NFL' },
  { slug: 'las-vegas-raiders', name: 'Las Vegas Raiders', city: 'Las Vegas', league: 'NFL' },
  { slug: 'los-angeles-chargers', name: 'Los Angeles Chargers', city: 'Los Angeles', league: 'NFL' },
  { slug: 'los-angeles-rams', name: 'Los Angeles Rams', city: 'Los Angeles', league: 'NFL' },
  { slug: 'miami-dolphins', name: 'Miami Dolphins', city: 'Miami', league: 'NFL' },
  { slug: 'minnesota-vikings', name: 'Minnesota Vikings', city: 'Minnesota', league: 'NFL' },
  { slug: 'new-england-patriots', name: 'New England Patriots', city: 'New England', league: 'NFL' },
  { slug: 'new-orleans-saints', name: 'New Orleans Saints', city: 'New Orleans', league: 'NFL' },
  { slug: 'new-york-giants', name: 'New York Giants', city: 'New York', league: 'NFL' },
  { slug: 'new-york-jets', name: 'New York Jets', city: 'New York', league: 'NFL' },
  { slug: 'philadelphia-eagles', name: 'Philadelphia Eagles', city: 'Philadelphia', league: 'NFL' },
  { slug: 'pittsburgh-steelers', name: 'Pittsburgh Steelers', city: 'Pittsburgh', league: 'NFL' },
  { slug: 'san-francisco-49ers', name: 'San Francisco 49ers', city: 'San Francisco', league: 'NFL' },
  { slug: 'seattle-seahawks', name: 'Seattle Seahawks', city: 'Seattle', league: 'NFL' },
  { slug: 'tampa-bay-buccaneers', name: 'Tampa Bay Buccaneers', city: 'Tampa Bay', league: 'NFL' },
  { slug: 'tennessee-titans', name: 'Tennessee Titans', city: 'Tennessee', league: 'NFL' },
  { slug: 'washington-commanders', name: 'Washington Commanders', city: 'Washington', league: 'NFL' },
];

const NBA_TEAMS = [
  { slug: 'atlanta-hawks', name: 'Atlanta Hawks', city: 'Atlanta', league: 'NBA' },
  { slug: 'boston-celtics', name: 'Boston Celtics', city: 'Boston', league: 'NBA' },
  { slug: 'brooklyn-nets', name: 'Brooklyn Nets', city: 'Brooklyn', league: 'NBA' },
  { slug: 'charlotte-hornets', name: 'Charlotte Hornets', city: 'Charlotte', league: 'NBA' },
  { slug: 'chicago-bulls', name: 'Chicago Bulls', city: 'Chicago', league: 'NBA' },
  { slug: 'cleveland-cavaliers', name: 'Cleveland Cavaliers', city: 'Cleveland', league: 'NBA' },
  { slug: 'dallas-mavericks', name: 'Dallas Mavericks', city: 'Dallas', league: 'NBA' },
  { slug: 'denver-nuggets', name: 'Denver Nuggets', city: 'Denver', league: 'NBA' },
  { slug: 'detroit-pistons', name: 'Detroit Pistons', city: 'Detroit', league: 'NBA' },
  { slug: 'golden-state-warriors', name: 'Golden State Warriors', city: 'Golden State', league: 'NBA' },
  { slug: 'houston-rockets', name: 'Houston Rockets', city: 'Houston', league: 'NBA' },
  { slug: 'indiana-pacers', name: 'Indiana Pacers', city: 'Indiana', league: 'NBA' },
  { slug: 'los-angeles-clippers', name: 'Los Angeles Clippers', city: 'Los Angeles', league: 'NBA' },
  { slug: 'los-angeles-lakers', name: 'Los Angeles Lakers', city: 'Los Angeles', league: 'NBA' },
  { slug: 'memphis-grizzlies', name: 'Memphis Grizzlies', city: 'Memphis', league: 'NBA' },
  { slug: 'miami-heat', name: 'Miami Heat', city: 'Miami', league: 'NBA' },
  { slug: 'milwaukee-bucks', name: 'Milwaukee Bucks', city: 'Milwaukee', league: 'NBA' },
  { slug: 'minnesota-timberwolves', name: 'Minnesota Timberwolves', city: 'Minnesota', league: 'NBA' },
  { slug: 'new-orleans-pelicans', name: 'New Orleans Pelicans', city: 'New Orleans', league: 'NBA' },
  { slug: 'new-york-knicks', name: 'New York Knicks', city: 'New York', league: 'NBA' },
  { slug: 'oklahoma-city-thunder', name: 'Oklahoma City Thunder', city: 'Oklahoma City', league: 'NBA' },
  { slug: 'orlando-magic', name: 'Orlando Magic', city: 'Orlando', league: 'NBA' },
  { slug: 'philadelphia-76ers', name: 'Philadelphia 76ers', city: 'Philadelphia', league: 'NBA' },
  { slug: 'phoenix-suns', name: 'Phoenix Suns', city: 'Phoenix', league: 'NBA' },
  { slug: 'portland-trail-blazers', name: 'Portland Trail Blazers', city: 'Portland', league: 'NBA' },
  { slug: 'sacramento-kings', name: 'Sacramento Kings', city: 'Sacramento', league: 'NBA' },
  { slug: 'san-antonio-spurs', name: 'San Antonio Spurs', city: 'San Antonio', league: 'NBA' },
  { slug: 'toronto-raptors', name: 'Toronto Raptors', city: 'Toronto', league: 'NBA' },
  { slug: 'utah-jazz', name: 'Utah Jazz', city: 'Utah', league: 'NBA' },
  { slug: 'washington-wizards', name: 'Washington Wizards', city: 'Washington', league: 'NBA' },
];

const ALL_TEAMS = [...NFL_TEAMS, ...NBA_TEAMS];

// ────────────────────────────────────────────────────────────────────────────────
// PAGE TEMPLATE
// ────────────────────────────────────────────────────────────────────────────────

function generateTeamPage(team) {
  const { slug, name, city, league } = team;
  
  const pageTitle = `${name} Sponsorship Activation | Vonga`;
  const pageDescription = `Measurable sponsorship activation for the ${name}. NFC-enabled fan experiences, real-time engagement tracking, and sponsor ROI dashboards. Turn ${city} fans into first-party data.`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://vonga.io/sponsorship-activation/${league.toLowerCase()}/${slug}">
    <link rel="canonical" href="https://vonga.io/sponsorship-activation/${league.toLowerCase()}/${slug}">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${name} Sponsorship Activation Platform",
      "provider": {
        "@type": "Organization",
        "name": "Vonga",
        "url": "https://vonga.io"
      },
      "description": "NFC-powered sponsorship activation and fan engagement platform for ${name} sponsors. Provides real-time engagement tracking, first-party fan data collection, and measurable ROI on sponsorship investments.",
      "serviceType": "Sponsorship Activation Technology",
      "areaServed": {
        "@type": "Place",
        "name": "${city}"
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "${name} sponsors and partners"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "USD"
        }
      }
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://vonga.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Sponsorship Activation",
          "item": "https://vonga.io/sponsorship-activation"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${league}",
          "item": "https://vonga.io/sponsorship-activation/${league.toLowerCase()}"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "${name}",
          "item": "https://vonga.io/sponsorship-activation/${league.toLowerCase()}/${slug}"
        }
      ]
    }
    </script>
    
    <style>
      :root {
        --color-bg: #0a1628;
        --color-surface: #1a2234;
        --color-border: #2a3548;
        --color-text: #ffffff;
        --color-text-secondary: #94a3b8;
        --color-accent: #33BECC;
        --color-accent-dark: #2da8b8;
      }
      
      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.6;
      }
      
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
      
      /* Header */
      .header {
        padding: 1rem 0;
        border-bottom: 1px solid var(--color-border);
      }
      .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo {
        color: var(--color-accent);
        font-size: 1.5rem;
        font-weight: 700;
        text-decoration: none;
      }
      .nav-links { display: flex; gap: 2rem; }
      .nav-links a {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: 0.875rem;
      }
      .nav-links a:hover { color: var(--color-accent); }
      
      /* Breadcrumbs */
      .breadcrumbs {
        padding: 1rem 0;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      .breadcrumbs a { color: var(--color-accent); text-decoration: none; }
      .breadcrumbs span { margin: 0 0.5rem; }
      
      /* Hero */
      .hero {
        padding: 4rem 0;
        text-align: center;
      }
      .hero-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--color-accent);
        color: var(--color-bg);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-radius: 999px;
        margin-bottom: 1.5rem;
      }
      .hero h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        line-height: 1.2;
      }
      @media (min-width: 768px) { .hero h1 { font-size: 3.5rem; } }
      .hero p {
        font-size: 1.25rem;
        color: var(--color-text-secondary);
        max-width: 700px;
        margin: 0 auto 2rem;
      }
      .cta-button {
        display: inline-block;
        padding: 1rem 2rem;
        background: var(--color-accent);
        color: var(--color-bg);
        font-weight: 600;
        text-decoration: none;
        border-radius: 0.5rem;
        transition: background 0.2s;
      }
      .cta-button:hover { background: var(--color-accent-dark); }
      
      /* Features */
      .features {
        padding: 4rem 0;
        border-top: 1px solid var(--color-border);
      }
      .features h2 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 3rem;
      }
      .features-grid {
        display: grid;
        gap: 2rem;
      }
      @media (min-width: 768px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }
      .feature-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        padding: 2rem;
      }
      .feature-icon {
        width: 48px;
        height: 48px;
        background: rgba(51, 190, 204, 0.1);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        color: var(--color-accent);
        font-size: 1.5rem;
      }
      .feature-card h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }
      .feature-card p {
        color: var(--color-text-secondary);
        font-size: 0.9375rem;
      }
      
      /* Stats */
      .stats {
        padding: 4rem 0;
        background: var(--color-surface);
        text-align: center;
      }
      .stats-grid {
        display: grid;
        gap: 2rem;
      }
      @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
      .stat-item h3 {
        font-size: 3rem;
        font-weight: 800;
        color: var(--color-accent);
      }
      .stat-item p { color: var(--color-text-secondary); }
      
      /* CTA Section */
      .cta-section {
        padding: 4rem 0;
        text-align: center;
      }
      .cta-section h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .cta-section p {
        color: var(--color-text-secondary);
        max-width: 600px;
        margin: 0 auto 2rem;
      }
      
      /* Footer */
      .footer {
        padding: 2rem 0;
        border-top: 1px solid var(--color-border);
        text-align: center;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
      .footer a { color: var(--color-accent); text-decoration: none; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container header-inner">
            <a href="/" class="logo">VONGA</a>
            <nav class="nav-links">
                <a href="/platform.html">Platform</a>
                <a href="/sponsor-roi.html">Sponsor ROI</a>
                <a href="/pricing.html">Pricing</a>
                <a href="/contact.html">Contact</a>
            </nav>
        </div>
    </header>
    
    <nav class="breadcrumbs">
        <div class="container">
            <a href="/">Home</a>
            <span>›</span>
            <a href="/sponsorship-activation">Sponsorship Activation</a>
            <span>›</span>
            <a href="/sponsorship-activation/${league.toLowerCase()}">${league}</a>
            <span>›</span>
            ${name}
        </div>
    </nav>
    
    <section class="hero">
        <div class="container">
            <span class="hero-badge">${league} Sponsorship Technology</span>
            <h1>${name} Sponsorship Activation</h1>
            <p>
                Turn ${name} fans into measurable sponsorship ROI. NFC-powered fan experiences 
                that capture first-party data, track engagement, and prove sponsor value — 
                all without app downloads.
            </p>
            <a href="/contact.html?team=${encodeURIComponent(slug)}" class="cta-button">
                Book a Demo →
            </a>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <h2>Activation Solutions for ${name} Sponsors</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Real-Time ROI Dashboard</h3>
                    <p>
                        See exactly how fans engage with sponsor activations. 
                        Impressions, interactions, and conversion data updated in real-time.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>NFC-Powered Experiences</h3>
                    <p>
                        Embed sponsor moments into ${name} merchandise. 
                        Fans tap, engage, and sponsors get measurable proof.
                    </p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>First-Party Fan Data</h3>
                    <p>
                        Build sponsor segments from real fan behavior, not surveys. 
                        Know who your ${city} superfans are and how they engage.
                    </p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>3.2x</h3>
                    <p>Average sponsor ROI</p>
                </div>
                <div class="stat-item">
                    <h3>68%</h3>
                    <p>Fan engagement rate</p>
                </div>
                <div class="stat-item">
                    <h3>0</h3>
                    <p>App downloads required</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="cta-section">
        <div class="container">
            <h2>Ready to Activate ${name} Sponsors?</h2>
            <p>
                See how Vonga helps ${league} teams and their sponsors 
                measure what matters. Book a 15-minute demo.
            </p>
            <a href="/contact.html?team=${encodeURIComponent(slug)}" class="cta-button">
                Schedule Demo →
            </a>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Vonga. All rights reserved. | <a href="/privacy.html">Privacy</a> | <a href="/terms.html">Terms</a></p>
        </div>
    </footer>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────────
// GENERATE PAGES
// ────────────────────────────────────────────────────────────────────────────────

function generateAllPages() {
  const baseDir = path.join(__dirname, '..', 'sponsorship-activation');
  
  // Create league directories
  const nflDir = path.join(baseDir, 'nfl');
  const nbaDir = path.join(baseDir, 'nba');
  
  fs.mkdirSync(nflDir, { recursive: true });
  fs.mkdirSync(nbaDir, { recursive: true });
  
  let generated = 0;
  
  // Generate team pages
  for (const team of ALL_TEAMS) {
    const leagueDir = team.league === 'NFL' ? nflDir : nbaDir;
    const filePath = path.join(leagueDir, `${team.slug}.html`);
    
    const html = generateTeamPage(team);
    fs.writeFileSync(filePath, html, 'utf8');
    generated++;
    console.log(`✓ Generated: /sponsorship-activation/${team.league.toLowerCase()}/${team.slug}`);
  }
  
  // Generate league index pages
  const nflIndexHtml = generateLeagueIndex('NFL', NFL_TEAMS);
  fs.writeFileSync(path.join(nflDir, 'index.html'), nflIndexHtml, 'utf8');
  console.log('✓ Generated: /sponsorship-activation/nfl/index.html');
  
  const nbaIndexHtml = generateLeagueIndex('NBA', NBA_TEAMS);
  fs.writeFileSync(path.join(nbaDir, 'index.html'), nbaIndexHtml, 'utf8');
  console.log('✓ Generated: /sponsorship-activation/nba/index.html');
  
  // Generate main index
  const mainIndexHtml = generateMainIndex();
  fs.writeFileSync(path.join(baseDir, 'index.html'), mainIndexHtml, 'utf8');
  console.log('✓ Generated: /sponsorship-activation/index.html');
  
  console.log(`\n✅ Generated ${generated} team pages + 3 index pages`);
}

function generateLeagueIndex(league, teams) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${league} Sponsorship Activation | Vonga</title>
    <meta name="description" content="Sponsorship activation solutions for ${league} teams. NFC-powered fan engagement, real-time ROI dashboards, and first-party data collection.">
    <link rel="canonical" href="https://vonga.io/sponsorship-activation/${league.toLowerCase()}">
    <style>
      :root {
        --color-bg: #0a1628;
        --color-surface: #1a2234;
        --color-border: #2a3548;
        --color-text: #ffffff;
        --color-text-secondary: #94a3b8;
        --color-accent: #33BECC;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.6;
      }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
      .header { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
      .logo { color: var(--color-accent); font-size: 1.5rem; font-weight: 700; text-decoration: none; }
      .hero { padding: 4rem 0; text-align: center; }
      .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
      .hero p { color: var(--color-text-secondary); max-width: 600px; margin: 0 auto; }
      .teams-grid { display: grid; gap: 1rem; padding: 2rem 0; }
      @media (min-width: 640px) { .teams-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1024px) { .teams-grid { grid-template-columns: repeat(4, 1fr); } }
      .team-link {
        display: block;
        padding: 1rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        color: var(--color-text);
        text-decoration: none;
        transition: border-color 0.2s;
      }
      .team-link:hover { border-color: var(--color-accent); }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="/" class="logo">VONGA</a>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <h1>${league} Sponsorship Activation</h1>
            <p>Select a team to learn about sponsorship activation solutions.</p>
        </div>
    </section>
    <section>
        <div class="container">
            <div class="teams-grid">
                ${teams.map(t => `<a href="/sponsorship-activation/${league.toLowerCase()}/${t.slug}" class="team-link">${t.name}</a>`).join('\n                ')}
            </div>
        </div>
    </section>
</body>
</html>`;
}

function generateMainIndex() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sponsorship Activation by League | Vonga</title>
    <meta name="description" content="Sponsorship activation solutions for professional sports. NFL and NBA teams use Vonga for NFC-powered fan engagement and sponsor ROI measurement.">
    <link rel="canonical" href="https://vonga.io/sponsorship-activation">
    <style>
      :root {
        --color-bg: #0a1628;
        --color-surface: #1a2234;
        --color-border: #2a3548;
        --color-text: #ffffff;
        --color-text-secondary: #94a3b8;
        --color-accent: #33BECC;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
        line-height: 1.6;
      }
      .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
      .header { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
      .logo { color: var(--color-accent); font-size: 1.5rem; font-weight: 700; text-decoration: none; }
      .hero { padding: 4rem 0; text-align: center; }
      .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
      .hero p { color: var(--color-text-secondary); }
      .leagues { padding: 2rem 0; display: grid; gap: 1.5rem; }
      @media (min-width: 640px) { .leagues { grid-template-columns: repeat(2, 1fr); } }
      .league-card {
        display: block;
        padding: 2rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        text-decoration: none;
        text-align: center;
        transition: border-color 0.2s;
      }
      .league-card:hover { border-color: var(--color-accent); }
      .league-card h2 { color: var(--color-text); font-size: 1.5rem; margin-bottom: 0.5rem; }
      .league-card p { color: var(--color-text-secondary); font-size: 0.875rem; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <a href="/" class="logo">VONGA</a>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <h1>Sponsorship Activation by League</h1>
            <p>NFC-powered sponsorship activation for professional sports</p>
        </div>
    </section>
    <section>
        <div class="container">
            <div class="leagues">
                <a href="/sponsorship-activation/nfl" class="league-card">
                    <h2>NFL</h2>
                    <p>32 teams • Sponsorship activation solutions</p>
                </a>
                <a href="/sponsorship-activation/nba" class="league-card">
                    <h2>NBA</h2>
                    <p>30 teams • Sponsorship activation solutions</p>
                </a>
            </div>
        </div>
    </section>
</body>
</html>`;
}

// Run
generateAllPages();
