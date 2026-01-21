import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET!;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN!;

import { hsUpdateDealProps } from '@/lib/hubspot';

function verifySlack(req: NextRequest, bodyRaw: string) {
  const timestamp = req.headers.get('x-slack-request-timestamp') || '';
  const sig = req.headers.get('x-slack-signature') || '';
  const base = `v0:${timestamp}:${bodyRaw}`;
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(base, 'utf8').digest('hex');
  const expected = `v0=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(sig, 'utf8'));
}

async function fetchMessage(channel: string, ts: string) {
  const res = await fetch('https://slack.com/api/conversations.history', {
    method:'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded', 'Authorization': `Bearer ${SLACK_BOT_TOKEN}`},
    body: new URLSearchParams({ channel, latest: ts, inclusive: 'true', limit: '1' })
  });
  const json = await res.json();
  if (!json.ok || !json.messages?.length) throw new Error('Unable to load Slack message');
  return json.messages[0].text as string;
}

function parseDealIdFromText(text: string): string | null {
  // Expect "HubSpot → https://app.hubspot.com/contacts/deals/<dealId>"
  const m = text.match(/https:\/\/app\.hubspot\.com\/contacts\/deals\/(\d+)/);
  return m ? m[1] : null;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();

  // URL verification challenge
  try {
    const json = JSON.parse(raw);
    if (json.type === 'url_verification') {
      return NextResponse.json({ challenge: json.challenge });
    }
  } catch { /* not JSON yet, continue */ }

  // Verify signature
  if (!verifySlack(req, raw)) {
    return new NextResponse('Bad signature', { status: 401 });
  }

  const event = JSON.parse(raw).event;
  if (!event) return NextResponse.json({ ok: true });

  // Handle button clicks
  if (event.type === 'block_actions') {
    const actions = event.actions;
    if (!actions || !actions.length) return NextResponse.json({ ok: true });

    const action = actions[0];
    const hubspotDealUrl = action.value;
    const dealId = parseDealIdFromText(hubspotDealUrl);
    
    if (!dealId) return NextResponse.json({ ok: true });

    // Map button action -> props
    if (action.action_id === 'approve_lead') {
      await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
        vonga_stage: 'BOOK',
        vonga_fit_status: 'Approved'
      });
    } else if (action.action_id === 'decline_lead') {
      await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
        vonga_stage: 'NURTURE',
        vonga_fit_status: 'Deferred'
      });
    }

    return NextResponse.json({ ok: true });
  }

  // Only react on reaction_added events in the review channel
  if (event.type === 'reaction_added') {
    const channel = event.item?.channel;
    const ts = event.item?.ts;
    const reaction = event.reaction; // e.g., 'white_check_mark', 'x'
    if (!channel || !ts) return NextResponse.json({ ok: true });

    // Fetch the message to parse the HubSpot URL
    let text = '';
    try {
      text = await fetchMessage(channel, ts);
    } catch (e) {
      return NextResponse.json({ ok: true });
    }
    const dealId = parseDealIdFromText(text);
    if (!dealId) return NextResponse.json({ ok: true });

    // Map reaction -> props
    if (['white_check_mark','heavy_check_mark','ballot_box_with_check'].includes(reaction)) {
      await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
        vonga_stage: 'BOOK',
        vonga_fit_status: 'Approved'
      });
    } else if (['x','no_entry','negative_squared_cross_mark'].includes(reaction)) {
      await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
        vonga_stage: 'NURTURE',
        vonga_fit_status: 'Deferred'
      });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
