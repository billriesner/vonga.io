#!/usr/bin/env python3
"""Second pass - fix remaining emdashes (HTML entity apostrophes etc.)"""
import os
os.chdir('/Users/bob/clawd/vonga.io')

REPLACEMENTS = [
    # platform.html
    ("every fan profile, every tap event, every insight — it's yours.",
     "every fan profile, every tap event, every insight. It's yours."),

    # solution-fan-engagement
    ('around real engagement profiles — "here\'s who your activation actually reached" instead of demographic estimates.',
     'around real engagement profiles: "here\'s who your activation actually reached," instead of demographic estimates.'),

    # blog/app-fatigue (uses &#39;)
    ("here&#39;s the thing — you don&#39;t have to commit",
     "here&#39;s the thing: you don&#39;t have to commit"),
    ("there&#39;s a faster way to prove fan interaction to sponsors — without waiting for downloads.",
     "there&#39;s a faster way to prove fan interaction to sponsors, without waiting for downloads."),
    ("you&#39;ll have better engagement than your app ever delivered — at a fraction of the cost.",
     "you&#39;ll have better engagement than your app ever delivered, at a fraction of the cost."),
    ("turn fan engagement into measurable revenue and sponsor ROI—without adding another login screen to fans&#39; lives.",
     "turn fan engagement into measurable revenue and sponsor ROI, without adding another login screen to fans&#39; lives."),

    # blog/first-party-data
    ("Or worse — nothing at all.",
     "Or worse, nothing at all."),

    # blog/index
    ("where they live, what they care about, how often they wear your gear — that's the real story.",
     "where they live, what they care about, how often they wear your gear. That's the real story."),

    # blog/measuring-fan-engagement (uses &#39; and — or —)
    ("Sponsors don&#39;t pay for &quot;awareness&quot;—they pay for customer actions.",
     "Sponsors don&#39;t pay for &quot;awareness.&quot; They pay for customer actions."),
    ("isn&#39;t the size of your budget—it&#39;s the quality of your measurement.",
     "isn&#39;t the size of your budget. It&#39;s the quality of your measurement."),

    # blog/merch-revenue-least-interesting
    ("carry around in public — essentially walking advertisements for your brand.",
     "carry around in public, essentially walking advertisements for your brand."),
    ("who are desperate for fan data — your partnerships team, your analytics group, your CMO — aren&#39;t even in the merch conversation.",
     "who are desperate for fan data (your partnerships team, your analytics group, your CMO) aren&#39;t even in the merch conversation."),
    ("fan profiles with over 250 attributes per person — aggregating data from tickets, broadcasts, fantasy, merchandise, and more.",
     "fan profiles with over 250 attributes per person, aggregating data from tickets, broadcasts, fantasy, merchandise, and more."),
    ("not just an integral part of sponsorship agreements — it may be the primary thing brands want.",
     "not just an integral part of sponsorship agreements. It may be the primary thing brands want."),
    ("Teams have gotten reasonably good at tracking digital behavior — app opens, email clicks, ticket purchases online. But the physical touchpoints — the ones that actually define fandom — remain a black hole.",
     "Teams have gotten reasonably good at tracking digital behavior: app opens, email clicks, ticket purchases online. But the physical touchpoints, the ones that actually define fandom, remain a black hole."),
    ('saying &quot;where&#39;d you get that hoodie?&quot; — the most authentic marketing that exists? Completely unmeasured.',
     'saying &quot;where&#39;d you get that hoodie?&quot; That&#39;s the most authentic marketing that exists. Completely unmeasured.'),
    ("When a physical product can communicate digitally — through NFC embedded in a woven label, a heat-pressed badge, or an integrated tag — every item becomes a persistent data touchpoint.",
     "When a physical product can communicate digitally (through NFC embedded in a woven label, a heat-pressed badge, or an integrated tag) every item becomes a persistent data touchpoint."),
    ("That&#39;s not an impression estimate — that&#39;s a conversion event with a name attached.",
     "That&#39;s not an impression estimate. That&#39;s a conversion event with a name attached."),
    ("the same way they always have — counting units, celebrating revenue, and wondering",
     "the same way they always have, counting units, celebrating revenue, and wondering"),
    ("The team that hands them verified engagement data — not estimates, not impression counts — wins the renewal.",
     "The team that hands them verified engagement data (not estimates, not impression counts) wins the renewal."),

    # blog/sponsor-renewal-playbook (uses &#39;)
    ("They want to stay — they&#39;re asking you to make it easier to say yes.",
     "They want to stay. They&#39;re asking you to make it easier to say yes."),
    ("they&#39;re not questioning whether they like the partnership — they&#39;re questioning whether they can defend it internally against digital alternatives.",
     "they&#39;re not questioning whether they like the partnership. They&#39;re questioning whether they can defend it internally against digital alternatives."),
    ("&quot;You&#39;re right — the digital landscape is more competitive than ever.",
     "&quot;You&#39;re right. The digital landscape is more competitive than ever."),
    ("You&#39;re not a logo on a screen — you&#39;re part of the game-day experience.",
     "You&#39;re not a logo on a screen. You&#39;re part of the game-day experience."),
    ("High-Value, Low-Cost</strong> assets — things that are extremely valuable to your sponsor but cost you almost nothing:",
     "High-Value, Low-Cost</strong> assets: things that are extremely valuable to your sponsor but cost you almost nothing:"),
    ("Don&#39;t just list the extras — put a dollar value on them so your contact can take it straight to finance.",
     "Don&#39;t just list the extras. Put a dollar value on them so your contact can take it straight to finance."),
    ("&quot;I can&#39;t do 10% off — our rates are consistent across all partners.",
     "&quot;I can&#39;t do 10% off. Our rates are consistent across all partners."),
    ("that&#39;s $30,000 in media value — double what a discount would save you.",
     "that&#39;s $30,000 in media value, double what a discount would save you."),
    ("You&#39;re not just offering value — you&#39;re giving them the ammunition to win the internal argument.",
     "You&#39;re not just offering value. You&#39;re giving them the ammunition to win the internal argument."),
    ("That escalator is a real cost to the sponsor — and a real negotiating chip for you.",
     "That escalator is a real cost to the sponsor, and a real negotiating chip for you."),
    ("That&#39;s a different conversation — and it might mean the partnership genuinely isn&#39;t the right fit at this price.",
     "That&#39;s a different conversation. It might mean the partnership genuinely isn&#39;t the right fit at this price."),

    # blog/sponsor-roi-problem (uses — in meta and content)
    ("Here&#39;s what&#39;s broken in athletic sponsorship—and how to fix it.",
     "Here&#39;s what&#39;s broken in athletic sponsorship, and how to fix it."),
    # meta descriptions (no HTML entities there)
    ("Here's what's broken in athletic sponsorship—and how to fix it.",
     "Here's what's broken in athletic sponsorship, and how to fix it."),
    ("You&#39;re sitting across from a sponsor—maybe it&#39;s a regional bank, a car dealership, or a local healthcare system.",
     "You&#39;re sitting across from a sponsor, maybe a regional bank, a car dealership, or a local healthcare system."),
    ("Traditional sponsorship metrics focus on <strong>impressions</strong>—how many people <em>might</em> have seen a logo.",
     "Traditional sponsorship metrics focus on <strong>impressions</strong>: how many people <em>might</em> have seen a logo."),
    ("Sponsorship budgets aren&#39;t shrinking—they&#39;re <strong>getting more scrutinized</strong>.",
     "Sponsorship budgets aren&#39;t shrinking. They&#39;re <strong>getting more scrutinized</strong>."),
    ("if the thing fans <em>want to buy</em> is also the thing that <em>proves sponsor value</em>—you&#39;ve solved the problem.",
     "if the thing fans <em>want to buy</em> is also the thing that <em>proves sponsor value</em>, you&#39;ve solved the problem."),

    # blog/how-to-prove-sponsor-roi
    ("Sponsors don't just want awareness—they want clicks, sign-ups, purchases, visits.",
     "Sponsors don't just want awareness. They want clicks, sign-ups, purchases, visits."),
    ("no app required—NFC is built into all modern smartphones",
     "no app required. NFC is built into all modern smartphones"),
    ("No app download required—tap to engage uses native OS NFC reading functionality.",
     "No app download required. Tap to engage uses native OS NFC reading functionality."),
]


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
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    original = content
    for old, new in REPLACEMENTS:
        if old in content:
            content = content.replace(old, new)
    if content != original:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)
        changed += 1
        print(f"Modified: {f}")

print(f"\nDone. {changed} files modified.")
