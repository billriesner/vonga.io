#!/usr/bin/env python3
"""
Emdash scrub script for vonga.io website.
Uses exact string replacements - no guessing, no regex magic.
"""

import os

os.chdir('/Users/bob/clawd/vonga.io')

# Each tuple: (old_string, new_string)
# ORDER MATTERS - more specific first if overlapping
REPLACEMENTS = [

    # ── TITLE TAGS ──────────────────────────────────────────────────────────
    ('<title>Platform — Vonga Fan Intelligence Platform</title>',
     '<title>Platform | Vonga Fan Intelligence Platform</title>'),
    ('<title>Book a Demo — Vonga Fan Intelligence Platform</title>',
     '<title>Book a Demo | Vonga Fan Intelligence Platform</title>'),
    ('<title>How It Works — Vonga Fan Intelligence Platform</title>',
     '<title>How It Works | Vonga Fan Intelligence Platform</title>'),
    ('<title>Vonga — Fan Intelligence Platform</title>',
     '<title>Vonga | Fan Intelligence Platform</title>'),
    ('<title>Partner Program — Vonga Fan Intelligence Platform</title>',
     '<title>Partner Program | Vonga Fan Intelligence Platform</title>'),
    ('<title>Pricing — Vonga Fan Intelligence Platform</title>',
     '<title>Pricing | Vonga Fan Intelligence Platform</title>'),
    ('<title>Data Connectivity — Vonga Fan Intelligence Platform</title>',
     '<title>Data Connectivity | Vonga Fan Intelligence Platform</title>'),
    ('<title>Fan Intelligence — Vonga</title>',
     '<title>Fan Intelligence | Vonga</title>'),
    ('<title>Platform Scalability — Vonga</title>',
     '<title>Platform Scalability | Vonga</title>'),
    ('<title>Sponsor ROI Proof — Vonga</title>',
     '<title>Sponsor ROI Proof | Vonga</title>'),
    ('<title>Data-Driven Revenue — Vonga</title>',
     '<title>Data-Driven Revenue | Vonga</title>'),
    ('<title>Sponsor ROI — Vonga Fan Intelligence Platform</title>',
     '<title>Sponsor ROI | Vonga Fan Intelligence Platform</title>'),

    # ── META OG/TWITTER TITLES ───────────────────────────────────────────────
    ('content="Platform — Vonga Fan Intelligence Platform"',
     'content="Platform | Vonga Fan Intelligence Platform"'),
    ('content="Book a Demo — Vonga Fan Intelligence Platform"',
     'content="Book a Demo | Vonga Fan Intelligence Platform"'),
    ('content="How It Works — Vonga Fan Intelligence Platform"',
     'content="How It Works | Vonga Fan Intelligence Platform"'),
    ('content="Vonga — Fan Intelligence Platform"',
     'content="Vonga | Fan Intelligence Platform"'),
    ('content="Merch Provider Partner Program — Vonga"',
     'content="Merch Provider Partner Program | Vonga"'),
    ('content="Pricing — Vonga Fan Intelligence Platform"',
     'content="Pricing | Vonga Fan Intelligence Platform"'),
    ('content="Sponsor ROI — Vonga Fan Intelligence Platform"',
     'content="Sponsor ROI | Vonga Fan Intelligence Platform"'),
    # JSON-LD schema name
    ('"name": "Vonga — Fan Intelligence Platform"',
     '"name": "Vonga | Fan Intelligence Platform"'),

    # ── CALENDAR EMBED TITLE ATTRIBUTE ──────────────────────────────────────
    ('title="Book a Demo — Vonga"',
     'title="Book a Demo | Vonga"'),

    # ── ALT TEXT (use colon) ─────────────────────────────────────────────────
    ('alt="Fan Tap Experience — Authenticate, Explore, Earn Rewards"',
     'alt="Fan Tap Experience: Authenticate, Explore, Earn Rewards"'),
    ('alt="Fan tap experience — authenticate, explore content, earn rewards"',
     'alt="Fan tap experience: authenticate, explore content, earn rewards"'),
    ('alt="Data visualization — proving sponsor ROI with verified engagement metrics"',
     'alt="Data visualization: proving sponsor ROI with verified engagement metrics"'),
    ('alt="Vonga dashboard — 2.2K taps, 257 fans, 94.2% engagement"',
     'alt="Vonga dashboard: 2.2K taps, 257 fans, 94.2% engagement"'),
    ('alt="Vonga Dashboard — Team analytics and fan intelligence"',
     'alt="Vonga Dashboard: Team analytics and fan intelligence"'),
    ('alt="Vonga Sponsor ROI Dashboard — live engagement metrics, fan attribution, and real-time sponsor portal"',
     'alt="Vonga Sponsor ROI Dashboard: live engagement metrics, fan attribution, and real-time sponsor portal"'),

    # ── META DESCRIPTIONS (og:description, twitter:description) ─────────────
    # index.html og:description
    ('fan data engine — no app downloads, no new suppliers.',
     'fan data engine. No app downloads, no new suppliers.'),
    # index.html JSON-LD description
    ('campaign intelligence — no app downloads required.',
     'campaign intelligence. No app downloads required.'),
    # solution-fan-engagement.html meta description
    ('into active data — fan profiles, behavioral segments',
     'into active data: fan profiles, behavioral segments'),
    # solution-measurement.html meta description
    ('from physical merchandise — who interacted',
     'from physical merchandise: who interacted'),
    # solution-revenue.html meta description
    ('into revenue — through sponsor premiums',
     'into revenue through sponsor premiums'),

    # ── CONTENT: SPECIFIC MULTI-EMDASH SENTENCES FIRST ──────────────────────
    # sponsor-roi.html: double emdash sentence
    ('live demo portal — real engagement data from a sample program — so you can see',
     'live demo portal with real engagement data from a sample program, so you can see'),
    # platform.html / case-studies.html: double emdash
    ('verified engagement data — taps, demographics, content performance — and close',
     'verified engagement data: taps, demographics, content performance, and close'),
    # solution-measurement.html: double emdash
    ('"here\'s who your activation actually reached" — instead of demographic estimates.',
     '"here\'s who your activation actually reached" instead of demographic estimates.'),
    ('real engagement profiles — "here\'s who your activation actually reached" — instead',
     'real engagement profiles: "here\'s who your activation actually reached" instead'),
    # solution-future-ready.html: double emdash  
    ('with measurable outcomes — engagement rates, sponsor proof, fan database growth — is a compelling',
     'with measurable outcomes: engagement rates, sponsor proof, fan database growth. It\'s a compelling'),

    # ── CONTENT: SINGLE EMDASH ───────────────────────────────────────────────

    # "— not X" → ", not X" (contrast/negation continuation)
    ('real behavior — not surveys, not estimates, not guesswork.',
     'real behavior, not surveys, not estimates, not guesswork.'),
    ('Published research — not our projections.',
     'Published research, not our projections.'),
    ('not just on game day, but for months after.',  # needs context - handled below
     'not just on game day, but for months after.'),
    ('it\'s generating fan intelligence — not just on game day, but for months after.',
     'it\'s generating fan intelligence, not just on game day, but for months after.'),
    ('isn\'t an asset — it\'s a snapshot.',
     'isn\'t an asset. It\'s a snapshot.'),
    ('isn\'t theoretical — it\'s already happening.',
     'isn\'t theoretical. It\'s already happening.'),
    ('not just a pilot.',  # handled below with context
     'not just a pilot.'),
    ('fan intelligence strategy — not just a pilot.',
     'fan intelligence strategy, not just a pilot.'),
    ('doesn\'t reset — it compounds.',
     'doesn\'t reset. It compounds.'),
    ('That\'s not attribution — that\'s a guess multiplied by another guess.',
     'That\'s not attribution. That\'s a guess multiplied by another guess.'),
    ('not actual fan interaction with your brand',  # context below
     'not actual fan interaction with your brand'),
    ('Based on total attendance — not actual fan interaction with your brand',
     'Based on total attendance, not actual fan interaction with your brand'),
    ('Every tap is a real person — not an impression estimate',
     'Every tap is a real person, not an impression estimate'),
    ('Data flows during the game — not in a post-season deck',
     'Data flows during the game, not in a post-season deck'),
    ('— not what you think worked.',
     ', not what you think worked.'),
    ('— not locked in one platform your marketing team checks separately.',
     ', not locked in one platform your marketing team checks separately.'),
    ('— not just one program\'s silo.',
     ', not just one program\'s silo.'),
    ('— not from ticket scans, but from how they interact',
     ', not from ticket scans, but from how they interact'),
    ('— not just your venue footprint.',
     ', not just your venue footprint.'),
    ('— not just your venue\'s digital reach.',
     ', not just your venue\'s digital reach.'),
    ('— not demographic guesses.',
     ', not demographic guesses.'),
    ('— not what you think they want.',
     ', not what you think they want.'),
    ('— not reactive reporting you build after the season ends.',
     ', not reactive reporting you build after the season ends.'),
    ('— not theoretical.',
     ', not theoretical.'),
    ('— not a siloed dashboard you have to check separately.',
     ', not a siloed dashboard you have to check separately.'),
    ('— not who was at the game.',
     ', not who was at the game.'),
    ('— not after the contract year is done.',
     ', not after the contract year is done.'),
    ('— not just a single-season snapshot.',
     ', not just a single-season snapshot.'),
    ('— not estimated impressions, real engagement data.',
     ', not estimated impressions. Real engagement data.'),
    ('— no app, no friction.',
     ', no app, no friction.'),
    ('— no code required.',
     ', no code required.'),
    ('— no new product needed',
     ', no new product needed'),
    ('— no third-party dependency',
     ', no third-party dependency'),
    ('— no app download required.',
     ', no app download required.'),
    ('— no app downloads required.',
     ', no app downloads required.'),
    ('— no app downloads, no new suppliers, no friction.',
     ', no app downloads, no new suppliers, no friction.'),
    ('— no app downloads.',
     ', no app downloads.'),

    # "— and X" → ", and X"
    ('every season — and capturing almost no data from any of them.',
     'every season, capturing almost no data from any of them.'),
    ('— and keeps generating intelligence for months after the event.',
     ', generating intelligence for months after the event.'),
    ('— and close on what they see, not what you estimate.',
     ', and close on what they see, not what you estimate.'),
    ('Repeat tappers are your most engaged fans — and the first cohort to build deeper campaigns around.',
     'Repeat tappers are your most engaged fans, and the first cohort to build deeper campaigns around.'),
    ('The metrics that matter — and the ones teams are wasting time on.',
     'The metrics that matter, and the ones teams are wasting time on.'),
    ('for renewals — and what teams can do about it.',
     'for renewals, and what teams can do about it.'),

    # "— it's" → ". It's"
    ('what fans spend — it\'s what their purchases tell you about who they are.',
     'what fans spend. It\'s what their purchases tell you about who they are.'),
    ('Share a link — they see exactly what their activation delivered.',
     'Share a link. They see exactly what their activation delivered.'),
    ('Share a link — your sponsor sees verified engagement, demographics, and ROI.',
     'Share a link. Your sponsor sees verified engagement, demographics, and ROI.'),
    ('Share a link with your sponsor — they see their own ROI data',
     'Share a link with your sponsor. They see their own ROI data'),

    # List introductions "— X, Y, Z" → ": X, Y, Z"
    ('Design what fans see when they tap — video, offers, polls, exclusive content.',
     'Design what fans see when they tap: video, offers, polls, exclusive content.'),
    ('Your marketing team builds the tap experience — video, offers, polls, challenges.',
     'Your marketing team builds the tap experience: video, offers, polls, challenges.'),
    ('Every tap is captured — location, time, device, behavior, repeat engagement.',
     'Every tap is captured: location, time, device, behavior, repeat engagement.'),
    ('Know what\'s working as it happens — heatmaps, tap feeds, audience segments, all in real time.',
     'Know what\'s working as it happens: heatmaps, tap feeds, audience segments, all in real time.'),
    ('Click through the tabs — Overview, Fans, Sponsors, Insights.',
     'Click through the tabs: Overview, Fans, Sponsors, Insights.'),
    ('surfaces what matters — which items drive the most engagement',
     'surfaces what matters: which items drive the most engagement'),
    ('Attendance patterns, preferences, engagement frequency — a database that grows with every game.',
     'Attendance patterns, preferences, engagement frequency: a database that grows with every game.'),
    ('fan profiles, sponsor portals, and campaign tools — all live, no slides.',
     'fan profiles, sponsor portals, and campaign tools, all live, no slides.'),
    ('fan profiles, sponsor portals, and campaign tools — all live. No slides, no estimates.',
     'fan profiles, sponsor portals, and campaign tools, all live. No slides, no estimates.'),
    ('Fan profiles, sponsor portals, campaign builder — all live. No slides, no estimates.',
     'Fan profiles, sponsor portals, campaign builder, all live. No slides, no estimates.'),
    ('campaign tools — all powered by the accumulated data.',
     'campaign tools, all powered by the accumulated data.'),
    ('app behavior — all tracked in detail.',
     'app behavior, all tracked in detail.'),
    ('Any merchandise item your supplier makes — with a Vonga NFC chip embedded during production.',
     'Any merchandise item your supplier makes, with a Vonga NFC chip embedded during production.'),
    ('Sew-in labels, hang tags, heat-seal patches — whatever form factor fits your production.',
     'Sew-in labels, hang tags, heat-seal patches: whatever form factor fits your production.'),
    ('merch to work harder — fan data, sponsor proof, engagement you can actually measure.',
     'merch to work harder: fan data, sponsor proof, engagement you can actually measure.'),
    ('the invisible layer that makes every item smarter.',  # handled with context
     'the invisible layer that makes every item smarter.'),
    ('want to add intelligence — the invisible layer that makes every item smarter.',
     'want to add intelligence, adding the invisible layer that makes every item smarter.'),

    # "—" as colon after bold/strong tag  
    ('<strong>Access their portal directly</strong> — branded link',
     '<strong>Access their portal directly:</strong> branded link'),
    ('<strong>Filter by date range</strong> — see performance',
     '<strong>Filter by date range:</strong> see performance'),
    ('<strong>Export data</strong> — download their activation report',
     '<strong>Export data:</strong> download their activation report'),
    ('<strong>Share internally</strong> — send the portal link',
     '<strong>Share internally:</strong> send the portal link'),
    ('<strong>Which data each sponsor sees</strong> — isolate their activation data',
     '<strong>Which data each sponsor sees:</strong> isolate their activation data'),
    ('<strong>Portal branding</strong> — white-label the portal',
     '<strong>Portal branding:</strong> white-label the portal'),
    ('<strong>How many portals you create</strong> — one per sponsor activation',
     '<strong>How many portals you create:</strong> one per sponsor activation'),
    ('<strong>Access expiry</strong> — set portal access windows',
     '<strong>Access expiry:</strong> set portal access windows'),

    # "— X" as continuation/elaboration → ", X"
    ('Profiles build over time — across items, events, and seasons.',
     'Profiles build over time, across items, events, and seasons.'),
    ('content performance — updated in real time, not at end-of-season.',
     'content performance, updated in real time, not at end-of-season.'),
    ('share sponsor portals — all from one dashboard.',
     'share sponsor portals, all from one dashboard.'),
    ('Every profile, every tap, every insight — export anytime, integrate anywhere.',
     'Every profile, every tap, every insight: export anytime, integrate anywhere.'),
    ('every fan profile, every tap event, every insight — it\'s yours.',
     'every fan profile, every tap event, every insight. It\'s yours.'),
    ('engagement data they\'ve never had — from physical merch, not a form fill.',
     'engagement data they\'ve never had, from physical merch, not a form fill.'),
    ('enters the fan database — giving you first-party data from a channel',
     'enters the fan database, giving you first-party data from a channel'),
    ('engagement level — without ever filling out a form.',
     'engagement level, without ever filling out a form.'),
    ('Vonga works with whatever your existing supplier makes — jerseys, hats, giveaway items, hard goods.',
     'Vonga works with whatever your existing supplier makes: jerseys, hats, giveaway items, hard goods.'),
    ('Fan intelligence that flows into your existing workflow — not a siloed',
     'Fan intelligence that flows into your existing workflow, not a siloed'),
    # solution-fan-engagement list item
    ('Which fans use your app (app analytics — if anyone downloads it)',
     'Which fans use your app (app analytics, if anyone downloads it)'),
    ('Which fans wear your gear — and where',
     'Which fans wear your gear, and where'),
    ('Progressive profiling builds automatically — each tap makes the picture richer.',
     'Progressive profiling builds automatically. Each tap makes the picture richer.'),
    ('physical reach — not just your venue\'s digital reach.',
     'physical reach, not just your venue\'s digital reach.'),
    ('NFC tap rates: <strong>15–40%</strong> (industry avg — Zigpoll)',
     'NFC tap rates: <strong>15–40%</strong> (industry avg, Zigpoll)'),
    ('Fan intelligence from the physical world — built through your existing merch program.',
     'Fan intelligence from the physical world, built through your existing merch program.'),
    # solution-future-ready
    ('The platform expands as you do — one tier, one sport, one season at a time.',
     'The platform expands as you do, one tier, one sport, one season at a time.'),
    ('Campaigns informed by what actually worked — not what you think worked.',
     'Campaigns informed by what actually worked, not what you think worked.'),
    # section headers with emdash
    ('<h3>Scout — Prove It</h3>',
     '<h3>Scout: Prove It</h3>'),
    ('<h3>Playbook — Expand It</h3>',
     '<h3>Playbook: Expand It</h3>'),
    ('<h3>Arena — Operationalize It</h3>',
     '<h3>Arena: Operationalize It</h3>'),
    ('<h3>Stadium — Lead It</h3>',
     '<h3>Stadium: Lead It</h3>'),
    ('<h3>Von AI — Insights Without Digging</h3>',
     '<h3>Von AI: Insights Without Digging</h3>'),
    ('<h2 class="section-title" style="color: var(--navy);">Who Uses This — And Why</h2>',
     '<h2 class="section-title" style="color: var(--navy);">Who Uses This and Why</h2>'),
    ('First-party fan data built from physical engagement — no third-party dependency',
     'First-party fan data built from physical engagement, no third-party dependency'),
    # solution-measurement
    ('Verified interactions tied to real fan behavior — down to the individual tap level.',
     'Verified interactions tied to real fan behavior, down to the individual tap level.'),
    ('interacted with a sponsor\'s activation — tap events logged, timestamped, and device-verified.',
     'interacted with a sponsor\'s activation: tap events logged, timestamped, and device-verified.'),
    ('happened — day by day, event by event.',
     'happened: day by day, event by event.'),
    ('tap to a sponsor\'s branded content — did they click through?',
     'tap to a sponsor\'s branded content. Did they click through?'),
    ('engaged with the sponsor\'s content — in-venue, at home, in other cities, across regions.',
     'engaged with the sponsor\'s content: in-venue, at home, in other cities, across regions.'),
    ('signal of genuine brand connection — and you can prove it now.',
     'signal of genuine brand connection, and you can prove it now.'),
    ('32% happened after the game — fans at home or at work.',
     '32% happened after the game: fans at home or at work.'),
    ('fix issues while you still have games left — not after the contract year is done.',
     'fix issues while you still have games left, not after the contract year is done.'),
    ('make the pitch tangible — not theoretical.',
     'make the pitch tangible, not theoretical.'),
    ('you can show the ROI trend — not just a single-season snapshot.',
     'you can show the ROI trend, not just a single-season snapshot.'),
    # solution-revenue
    ('into verifiable engagement proof — and that proof commands a premium.',
     'into verifiable engagement proof. That proof commands a premium.'),
    ('not because they can prove ROI. That\'s a fragile basis',  # already fine
     'not because they can prove ROI. That\'s a fragile basis'),
    ('likes your VP of Partnerships — not because they can prove ROI.',
     'likes your VP of Partnerships, not because they can prove ROI.'),
    ('annual platform cost — recovered from the first renewal cycle.',
     'annual platform cost, recovered from the first renewal cycle.'),
    ('ticket buyer demographics — which misses everyone who wears your brand',
     'ticket buyer demographics, which misses everyone who wears your brand'),
    ('built from physical engagement — people who wear your brand everywhere they go.',
     'built from physical engagement: people who wear your brand everywhere they go.'),
    ('fan spend — on the same marketing budget.',
     'fan spend, on the same marketing budget.'),
    ('specific fan segments — your most engaged fans,',
     'specific fan segments: your most engaged fans,'),
    ('Longer contracts at higher values — the revenue combination that makes',
     'Longer contracts at higher values: the revenue combination that makes'),
    ('every aspect of your revenue program — ticket campaigns, merchandise promotions, concession upsells.',
     'every aspect of your revenue program: ticket campaigns, merchandise promotions, concession upsells.'),
    # sponsor-roi
    ('A dedicated portal for each sponsor — live engagement data, updated in real time, shareable with one link.',
     'A dedicated portal for each sponsor: live engagement data, updated in real time, shareable with one link.'),
    ('Vonga logs a verified engagement event — complete with timestamp, location, and device type.',
     'Vonga logs a verified engagement event, complete with timestamp, location, and device type.'),
    ('Your branded items — jerseys, caps, scarves — carry an NFC tag during production.',
     'Your branded items (jerseys, caps, scarves) carry an NFC tag during production.'),
    ('<h4 style="color: white; margin-bottom: 4px;">Fan taps — engagement logged instantly</h4>',
     '<h4 style="color: white; margin-bottom: 4px;">Fan taps: engagement logged instantly</h4>'),
    ('Your sponsor portal updates as fans engage — during the game, during the season, across every activation.',
     'Your sponsor portal updates as fans engage: during the game, during the season, across every activation.'),
    ('Your live sponsor portal — updated as data comes in.',
     'Your live sponsor portal, updated as data comes in.'),
    # pricing
    ('NFC chips connect to Vonga at production — your fan data picture changes.',
     'NFC chips connect to Vonga at production. Your fan data picture changes.'),
    ('Prove ROI in 90 days — then decide.',
     'Prove ROI in 90 days. Then decide.'),
    ('Upgrade anytime — your data moves with you.',
     'Upgrade anytime. Your data moves with you.'),
    ('into standard merch production — sew-in labels, hang tags, or heat-seal patches depending on the product.',
     'into standard merch production: sew-in labels, hang tags, or heat-seal patches depending on the product.'),
    ('a 3-month commitment — enough time to prove ROI.',
     'a 3-month commitment, enough time to prove ROI.'),
    ('through the dashboard — a video from your head coach, an exclusive offer, a behind-the-scenes clip.',
     'through the dashboard: a video from your head coach, an exclusive offer, a behind-the-scenes clip.'),
    ('shareable link to their portal — live engagement data from their specific activation.',
     'shareable link to their portal: live engagement data from their specific activation.'),
    ('your fan profiles and historical data move with you.',  # already fine - context below
     'your fan profiles and historical data move with you.'),
    ('Upgrade anytime — your fan profiles and historical data move with you.',
     'Upgrade anytime. Your fan profiles and historical data move with you.'),
    # partner
    ('full API connectivity — pick the model that fits your operation.',
     'full API connectivity. Pick the model that fits your operation.'),
    ('No sales pressure — just a conversation about what\'s possible.',
     'No sales pressure, just a conversation about what\'s possible.'),
    ('Fan taps generate real engagement data — no app, no friction.',
     'Fan taps generate real engagement data, no app, no friction.'),
    ('didn\'t invent the fabric — they embedded a technology',
     'didn\'t invent the fabric. They embedded a technology'),
    # how-it-works
    ('From tap to content — faster than opening an app',
     'From tap to content, faster than opening an app'),
    ('No battery required — powered by the phone\'s NFC field.',
     'No battery required. Powered by the phone\'s NFC field.'),
    ('Content loads in seconds via native browser — no app download required.',
     'Content loads in seconds via native browser, no app download required.'),
    ('Update content anytime — no new product needed',
     'Update content anytime, no new product needed'),
    ('we don\'t replace your merch partner — we plug into them.',
     'we don\'t replace your merch partner. We plug into them.'),
    ('We don\'t replace your merch partner — we plug into them.',
     'We don\'t replace your merch partner. We plug into them.'),
    ('Uses the phone\'s built-in NFC — same as Apple Pay.',
     'Uses the phone\'s built-in NFC, same as Apple Pay.'),
    ('NTAG 424 DNA — waterproof, no battery, AES-128 encrypted.',
     'NTAG 424 DNA: waterproof, no battery, AES-128 encrypted.'),
    ('Data is collected through behavior — what they tap, when, where, how often.',
     'Data is collected through behavior: what they tap, when, where, how often.'),
    ('Update instantly — the physical product never changes.',
     'Update instantly. The physical product never changes.'),
    ('Full program launch — including chip provisioning and campaign setup — typically takes weeks, not months.',
     'Full program launch (including chip provisioning and campaign setup) typically takes weeks, not months.'),
    # index
    ('embedded during production by your merch supplier — whoever you already work with.',
     'embedded during production by your merch supplier, whoever you already work with.'),
    ('In Annual Merch — With Zero Data',
     'In Annual Merch, With Zero Data'),
    # contact
    ('20 minutes — we\'ll show you the fan intelligence dashboard',
     '20 minutes. We\'ll show you the fan intelligence dashboard'),
    ('Proving sponsor ROI — sponsors are asking for engagement data',
     'Proving sponsor ROI: sponsors are asking for engagement data'),
    ('challenges — the more context the better.',
     'challenges. The more context the better.'),
    ('What we know about a fan after 3 taps — built from behavior, not forms.',
     'What we know about a fan after 3 taps, built from behavior, not forms.'),
    ('Build and A/B test fan experiences — no code required.',
     'Build and A/B test fan experiences, no code required.'),
    ('"When a fan buys your merch but doesn\'t scan a ticket — what data do you have on them today?"',
     '"When a fan buys your merch but doesn\'t scan a ticket, what data do you have on them today?"'),
    ('book a time directly</a> — it\'s faster.',
     'book a time directly</a>. It\'s faster.'),
    # case-studies / platform specific
    ('Annual licensed merch revenue — zero fan data',
     'Annual licensed merch revenue: zero fan data'),
    # solution-connection
    ('Vonga doesn\'t replace your digital data sources — it adds the physical layer',
     'Vonga doesn\'t replace your digital data sources. It adds the physical layer'),
    # solution-future-ready
    ('The database doesn\'t reset — it compounds.',
     'The database doesn\'t reset. It compounds.'),

    # ── BLOG FILES ───────────────────────────────────────────────────────────
    # blog/app-fatigue
    ('Sponsor value lift from real engagement data — proof that justifies higher renewals',
     'Sponsor value lift from real engagement data: proof that justifies higher renewals'),
    ('there\'s a faster way to prove fan interaction to sponsors — without waiting for downloads.',
     'there\'s a faster way to prove fan interaction to sponsors, without waiting for downloads.'),
    ('NFC does for your program. And if your tap rate is anywhere near the 15-40% industry average, you\'ll have better engagement than your app ever delivered — at a fraction of the cost.',
     'NFC does for your program. And if your tap rate is anywhere near the 15-40% industry average, you\'ll have better engagement than your app ever delivered, at a fraction of the cost.'),
    ('the same engagement, and the same sponsor value—without asking fans to download anything.',
     'the same engagement, and the same sponsor value. No asking fans to download anything.'),
    ('If it works, scale — more units, higher-margin items, more sports.',
     'If it works, scale: more units, higher-margin items, more sports.'),
    ('tools to help athletic programs turn fan engagement into measurable revenue and sponsor ROI—without adding another login screen to fans\' lives.',
     'tools to help athletic programs turn fan engagement into measurable revenue and sponsor ROI, without adding another login screen to fans\' lives.'),
    # blog/first-party-data
    ('That\'s not just engagement — that\'s proof a sponsor can take to their board.',
     'That\'s not just engagement. That\'s proof a sponsor can take to their board.'),
    ('Social media follower counts that don\'t translate to revenue. Or worse — nothing at all.',
     'Social media follower counts that don\'t translate to revenue. Or worse, nothing at all.'),
    # blog/measuring-fan-engagement
    ('they pay for customer actions.',  # already no emdash - context
     'they pay for customer actions.'),
    # These use — in meta description (em dash in description text)
    # blog/measuring-fan-engagement meta desc
    ('what\'s really working with your fan base—and what sponsors care about.',
     'what\'s really working with your fan base, and what sponsors care about.'),
    ('This is the ultimate metric—it combines engagement, loyalty, and revenue into one number.',
     'This is the ultimate metric. It combines engagement, loyalty, and revenue into one number.'),
    ('The difference between amateur and professional marketing isn\'t the size of your budget—it\'s the quality of your measurement.',
     'The difference between amateur and professional marketing isn\'t the size of your budget. It\'s the quality of your measurement.'),
    # blog/merch-revenue meta desc
    ('But the 40,000 fans who bought it — where they live, what they care about — that\'s the real story.',
     'But the 40,000 fans who bought it, where they live, what they care about, that\'s the real story.'),
    # in content
    ('essentially walking advertisements for your brand.',  # no emdash
     'essentially walking advertisements for your brand.'),
    ('physical products that fans buy, wear, and carry around in public — essentially walking advertisements for your brand.',
     'physical products that fans buy, wear, and carry around in public. Essentially walking advertisements for your brand.'),
    # blog/merch-revenue-least-interesting
    ('Ongoing — every tap is a signal',
     'Ongoing: every tap is a signal'),
    ('sell merchandise the same way they always have — counting units, celebrating revenue, and wondering',
     'sell merchandise the same way they always have, counting units, celebrating revenue, and wondering'),
    ('fan identity platform for sports teams. NFC-enabled apparel that turns every item into a data touchpoint — no app required.',
     'fan identity platform for sports teams. NFC-enabled apparel that turns every item into a data touchpoint, no app required.'),
    # merch blog
    ('That\'s not an impression estimate — that\'s a conversion event with a name attached.',
     'That\'s not an impression estimate. That\'s a conversion event with a name attached.'),
    ('fan data assets now will have a structural advantage as third-party data continues to erode.',  # no emdash
     'fan data assets now will have a structural advantage as third-party data continues to erode.'),
    # blog/sponsor-renewal-playbook
    ('They want to stay — they\'re asking you to make it easier to say yes.',
     'They want to stay. They\'re asking you to make it easier to say yes.'),
    ('they\'re not questioning whether they like the partnership — they\'re questioning whether they can defend it',
     'they\'re not questioning whether they like the partnership. They\'re questioning whether they can defend it'),
    ('That\'s actually why this partnership matters more, not less."',  # no emdash
     'That\'s actually why this partnership matters more, not less."'),
    ('"You\'re right — the digital landscape is more competitive than ever.',
     '"You\'re right. The digital landscape is more competitive than ever.'),
    ('You\'re not a logo on a screen — you\'re part of the game-day experience.',
     'You\'re not a logo on a screen. You\'re part of the game-day experience.'),
    ('recall — the more sponsors competing for attention, the less any individual brand is remembered.',
     'recall: the more sponsors competing for attention, the less any individual brand is remembered.'),
    ('don\'t just list the extras — put a dollar value on them',
     'don\'t just list the extras. Put a dollar value on them'),
    ('"I can\'t do 10% off — our rates are consistent across all partners.',
     '"I can\'t do 10% off. Our rates are consistent across all partners.'),
    ('you\'re not just offering value — you\'re giving them the ammunition',
     'you\'re not just offering value. You\'re giving them the ammunition'),
    ('Raise the ceiling — new assets, new activations',
     'Raise the ceiling: new assets, new activations'),
    ('That\'s a different conversation — and it might mean',
     'That\'s a different conversation. It might mean'),
    # blog/sponsor-roi-problem
    ("sponsors demand better ROI data, but traditional measurement can't deliver it. Here's what's broken in athletic sponsorship—and how to fix it.",
     "sponsors demand better ROI data, but traditional measurement can't deliver it. Here's what's broken in athletic sponsorship, and how to fix it."),
    ('You\'re sitting across from a sponsor—maybe it\'s a regional bank',
     'You\'re sitting across from a sponsor, maybe it\'s a regional bank'),
    ('Traditional sponsorship metrics focus on <strong>impressions</strong>—how many people <em>might</em> have seen a logo.',
     'Traditional sponsorship metrics focus on <strong>impressions</strong>, meaning how many people <em>might</em> have seen a logo.'),
    ('Sponsorship budgets aren\'t shrinking—they\'re <strong>getting more scrutinized</strong>.',
     'Sponsorship budgets aren\'t shrinking. They\'re <strong>getting more scrutinized</strong>.'),
    ('if the thing fans <em>want to buy</em> is also the thing that <em>proves sponsor value</em>—you\'ve solved the problem.',
     'if the thing fans <em>want to buy</em> is also the thing that <em>proves sponsor value</em>, you\'ve solved the problem.'),
    # blog/how-to-prove-sponsor-roi
    ("they want clicks, sign-ups, purchases, visits.",  # no emdash
     "they want clicks, sign-ups, purchases, visits."),
    ("Sponsors don't just want awareness—they want clicks, sign-ups, purchases, visits.",
     "Sponsors don't just want awareness. They want clicks, sign-ups, purchases, visits."),
    ("no app required—NFC is built into all modern smartphones",
     "no app required. NFC is built into all modern smartphones"),
    ("No app download required—tap to engage uses native OS NFC reading functionality.",
     "No app download required. Tap to engage uses native OS NFC reading functionality."),
    # blog/index
    ('40,000 fans who bought those items — where they live, what they care about',
     '40,000 fans who bought those items, where they live, what they care about'),
    ("Here's what's actually broken—and how to fix it.",
     "Here's what's actually broken, and how to fix it."),
    # blog/first-party-data
    ('it may be the primary thing brands want.',  # no emdash
     'it may be the primary thing brands want.'),
    ('it may be the primary thing brands want. Your sponsors',  # no emdash
     'it may be the primary thing brands want. Your sponsors'),
    # merch blog 
    ("For everyone else — the mid-major university, the MiLB team, the MLS expansion club — merchandise data lives in Shopify",
     "For everyone else (the mid-major university, the MiLB team, the MLS expansion club) merchandise data lives in Shopify"),
    ("These tools are getting built — and funded — because the demand is already there.",
     "These tools are getting built and funded because the demand is already there."),
    ("It's in the physical world. Teams have gotten reasonably good at tracking digital behavior — app opens, email clicks, ticket purchases online.",
     "It's in the physical world. Teams have gotten reasonably good at tracking digital behavior: app opens, email clicks, ticket purchases online."),
    ("A fan tapping a friend's shoulder and saying \"where'd you get that hoodie?\" — the most authentic marketing that exists?",
     "A fan tapping a friend's shoulder and saying \"where'd you get that hoodie?\" That's the most authentic marketing that exists."),
    ("Not just an email — a verified profile linked to a real person",
     "Not just an email: a verified profile linked to a real person"),
    ("Not where they bought the item — where they use it.",
     "Not where they bought the item, but where they use it."),
    # sponsor-renewal-playbook additional
    ("Your job is to figure out which one and respond to the real question — not the surface ask.",
     "Your job is to figure out which one and respond to the real question, not the surface ask."),
    # solution-measurement additional  
    ("from physical merchandise — the proof they've been asking for.",
     "from physical merchandise. That's the proof they've been asking for."),
    # solution-fan-engagement additional
    ("who taps what, when, where, and how often. That's the intelligence layer that's been missing.",
     "who taps what, when, where, and how often. That's the intelligence layer that's been missing."),
    ("Vonga knows what fans do in the real world — who taps what, when, where, and how often.",
     "Vonga knows what fans do in the real world: who taps what, when, where, and how often."),
    # index
    ("fan data, sponsor proof, engagement you can actually measure.",  # no emdash in isolation
     "fan data, sponsor proof, engagement you can actually measure."),
]

def process_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


FILES = [
    "case-studies.html", "contact.html", "how-it-works.html", "index.html",
    "partner.html", "platform.html", "pricing.html", "solution-connection.html",
    "solution-fan-engagement.html", "solution-future-ready.html",
    "solution-measurement.html", "solution-revenue.html", "sponsor-roi.html",
    "blog/app-fatigue-fan-engagement.html", "blog/first-party-data-new-tv-deal.html",
    "blog/how-to-prove-sponsor-roi-in-college-athletics.html", "blog/index.html",
    "blog/measuring-fan-engagement.html", "blog/merch-revenue-least-interesting.html",
    "blog/sponsor-renewal-playbook.html", "blog/sponsor-roi-problem.html",
]

changed = 0
for f in FILES:
    if process_file(f, REPLACEMENTS):
        changed += 1
        print(f"Modified: {f}")

print(f"\nDone. {changed} files modified.")
