import { NextRequest, NextResponse } from 'next/server';
import { hsUpdateDealProps, hsCreateEngagementNote } from '@/lib/hubspot';

const HS_SECRET = process.env.HUBSPOT_WEBHOOK_SECRET!;
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN!;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

async function slack(text: string) {
  await fetch(SLACK_WEBHOOK_URL, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ text })
  });
}

export async function POST(req: NextRequest) {
  // basic auth
  if (req.headers.get('x-hs-secret') !== HS_SECRET) {
    return new NextResponse('unauthorized', { status: 401 });
  }

  const event = await req.json();
  // Expect shape:
  // { type: 'email_reply' | 'meeting_booked' | 'form_resubmitted' | 'checkin_reply', dealId: '...', contactId: '...', meta?: {...} }

  const { type, dealId, contactId, meta } = event || {};
  if (!dealId) return NextResponse.json({ ok: true });

  if (type === 'email_reply') {
    await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
      vonga_nurture_status: 'Re-engaged',
      vonga_stage: 'REVIEW'
    });
    await hsCreateEngagementNote(HUBSPOT_TOKEN, 'Lead replied to nurture email. Moved to REVIEW.', dealId, contactId);
    await slack(`✉️ Reply on nurture lead → moved to REVIEW (deal ${dealId}).`);
  }

  if (type === 'meeting_booked') {
    await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
      vonga_nurture_status: 'Re-engaged',
      vonga_stage: 'BOOK'
    });
    await hsCreateEngagementNote(HUBSPOT_TOKEN, 'Lead booked a meeting. Moved to BOOK.', dealId, contactId);
    await slack(`📅 Meeting booked from nurture → moved to BOOK (deal ${dealId}).`);
  }

  if (type === 'form_resubmitted') {
    await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
      vonga_nurture_status: 'Re-engaged',
      vonga_stage: 'REVIEW'
    });
    await hsCreateEngagementNote(HUBSPOT_TOKEN, 'Lead resubmitted intake form. Moved to REVIEW.', dealId, contactId);
    await slack(`📝 Intake resubmitted → moved to REVIEW (deal ${dealId}).`);
  }

  if (type === 'checkin_reply') {
    // meta.choice expected: 'A'|'B'|'C'|'D'
    const { handleCheckInChoice } = await import('@/lib/nurture');
    const decision = handleCheckInChoice(meta?.choice);
    await hsUpdateDealProps(HUBSPOT_TOKEN, dealId, {
      vonga_nurture_status: decision.status,
      vonga_stage: decision.stage,
      vonga_next_revisit_date: decision.revisitDate || null
    });
    await hsCreateEngagementNote(HUBSPOT_TOKEN, `30-day check-in reply: ${meta?.choice}. ${decision.note}`, dealId, contactId);
    await slack(`🔎 Check-in "${meta?.choice}" → ${decision.stage} (${decision.status}) (deal ${dealId}).`);
  }

  return NextResponse.json({ ok: true });
}
