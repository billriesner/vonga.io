import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Send Slack notification for invoice request
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: '📋 Club Vonga Invoice Request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📋 Club Vonga Invoice Request'
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
                text: `*Units:*\n${body.memberCount}`
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `⚡ Action Required: Send invoice within 24 hours`
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
      { message: 'Invoice request sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing invoice request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

