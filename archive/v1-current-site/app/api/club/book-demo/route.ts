import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // High-value lead notification
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: '🚨 HIGH VALUE LEAD: Club Vonga Demo Request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 HIGH VALUE LEAD: Club Vonga Demo Request'
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Trigger:* ${body.memberCount >= 500 ? '500+ units' : '$10k+ order'}`
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
                text: `*Units:*\n${body.memberCount}`
              },
              {
                type: 'mrkdwn',
                text: `*Kit:*\n${body.starterKit === 'core' ? 'Core' : 'Pro'}`
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `⚡ *PRIORITY LEAD* - Contact within 1 hour`
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

    return NextResponse.json(
      { message: 'Demo request sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

