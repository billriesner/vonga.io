import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: '🎯 New Club Vonga Starter Kit Request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎯 New Club Vonga Starter Kit Request'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Organization:*\n${body.organizationName}`
              },
              {
                type: 'mrkdwn',
                text: `*Contact:*\n${body.contactName}`
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${body.email}`
              },
              {
                type: 'mrkdwn',
                text: `*Phone:*\n${body.phone}`
              },
              {
                type: 'mrkdwn',
                text: `*Type:*\n${body.organizationType}`
              },
              {
                type: 'mrkdwn',
                text: `*Units:*\n${body.memberCount}`
              },
              {
                type: 'mrkdwn',
                text: `*Kit:*\n${body.starterKit === 'core' ? 'Core' : 'Pro'}`
              },
              {
                type: 'mrkdwn',
                text: `*Gear:*\n${body.gearType}`
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
              }
            ]
          }
        ]
      };

      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });
    }

    // Store in database (Supabase)
    if (typeof window === "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      await fetch(`${supabaseUrl}/rest/v1/club_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ...body,
          created_at: new Date().toISOString()
        })
      });
    }

    return NextResponse.json(
      { message: 'Request submitted successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing club submission:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

