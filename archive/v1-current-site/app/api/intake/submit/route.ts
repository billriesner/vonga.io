// /app/api/intake/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { scoreLead, ownerToApptUrl } from '@/lib/score';
import { fitInsight } from '@/lib/fit';
import { hsUpsert, hsUpdateDealProps } from '@/lib/hubspot';
import { postReviewLeadToSlack } from '@/lib/slack';
import { nextRevisitDate } from '@/lib/nurture';

export async function POST(req: NextRequest) {
  try {
    console.log('API route called');
    const body = await req.json();
    console.log('Intake submission received:', JSON.stringify(body, null, 2));

    // Minimal validation (replace with zod in your form)
    const {
      name, email, org, website, role, vertical, audienceBand, moqBand,
      timeline, decisionRole, goals = [], successStory
    } = body;

    // Validate required fields
    if (!name || !email || !vertical || !audienceBand || !moqBand || !timeline || !decisionRole) {
      console.log('Missing required fields:', { name, email, vertical, audienceBand, moqBand, timeline, decisionRole });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Score & route
    console.log('Scoring lead...');
    const { score, owner } = scoreLead({ vertical, audienceBand, moqBand, timeline, decisionRole, goals });
    console.log('Score result:', { score, owner });

    // Compute fit insight
    console.log('Computing fit insight...');
    const { fitCategory, fitMessage } = fitInsight({ audienceBand, moqBand, timeline, goals });
    console.log('Fit insight:', { fitCategory, fitMessage });

    // HubSpot upsert
    const [firstname, ...rest] = (name || '').split(' ');
    const lastname = rest.join(' ') || '—';
    const companyDomain = (website || '').replace(/^https?:\/\//,'').split('/')[0] || undefined;

    let hs;
    try {
      console.log('HUBSPOT_TOKEN exists:', !!process.env.HUBSPOT_TOKEN);
      console.log('HUBSPOT_TOKEN length:', process.env.HUBSPOT_TOKEN?.length);
      
      hs = await hsUpsert({
        token: process.env.HUBSPOT_TOKEN!,
        contact: { email, firstname, lastname },
        companyDomain,
        deal: { name: `Inbound — ${org || email}`, pipeline: 'default', stage: 'appointmentscheduled' },
        payload: { name, email, org, website, role, vertical, audienceBand, moqBand, timeline, decisionRole, goals, successStory, score, owner }
      });
      console.log('HubSpot integration successful:', hs);
      
      // Add fit properties to the deal
      const tier: 'BOOK'|'REVIEW'|'NURTURE' = score >= 14 ? 'BOOK' : score >= 10 ? 'REVIEW' : 'NURTURE';
      try {
        await hsUpdateDealProps(process.env.HUBSPOT_TOKEN!, hs.dealId, {
          vonga_fit_score: score,
          vonga_fit_category: fitCategory,
          vonga_fit_message: fitMessage,
          vonga_stage: tier
        });
        console.log('HubSpot deal properties updated successfully');
      } catch (fitError) {
        console.error('HubSpot fit properties update failed:', fitError);
        // Continue with the flow even if fit properties fail
      }

      // Add NURTURE flow properties if needed
      if (tier === 'NURTURE') {
        try {
          await hsUpdateDealProps(process.env.HUBSPOT_TOKEN!, hs.dealId, {
            vonga_nurture_status: 'Active',
            vonga_last_touch_type: 'T1',
            vonga_next_revisit_date: nextRevisitDate(new Date(), 30)
          });
          console.log('NURTURE flow properties added successfully');
        } catch (nurtureError) {
          console.error('NURTURE properties update failed:', nurtureError);
          // Continue with the flow even if nurture properties fail
        }
      }
    } catch (hsError) {
      console.error('HubSpot integration failed:', hsError);
      // Continue with the flow even if HubSpot fails
      hs = { contactId: 'error', dealId: 'error', companyId: undefined };
    }

    // Determine tier
    const tier: 'BOOK'|'REVIEW'|'NURTURE' = score >= 14 ? 'BOOK' : score >= 10 ? 'REVIEW' : 'NURTURE';

    // Post review message to Slack with fit insight (always; reviewers see all leads)
    try {
      await postReviewLeadToSlack(process.env.SLACK_BOT_TOKEN!, {
        score,
        tier,
        org: org || email,
        vertical,
        audienceBand,
        moqBand,
        timeline,
        goals,
        fitCategory,
        fitMessage,
        hubspotDealUrl: `https://app.hubspot.com/contacts/deals/${hs.dealId}`
      });
      console.log('Review message posted to Slack successfully');
    } catch (slackError) {
      console.error('Slack review message failed:', slackError);
      // Continue with the flow even if Slack fails
    }

    // Get appointment URL for all cases
    const appointmentUrl = ownerToApptUrl(owner as any);
    console.log('Appointment URL:', appointmentUrl);

    // Slack Bot now handles all notifications with interactive buttons

    return NextResponse.json({ 
      score, 
      owner, 
      outcome: tier, 
      appointmentUrl: tier === 'BOOK' ? appointmentUrl : undefined,
      fitCategory, 
      fitMessage 
    });
  } catch (error) {
    console.error('Intake submission error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
