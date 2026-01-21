import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, orderNumber, items, reason } = body;

    // Validate required fields
    if (!name || !email || !orderNumber || !items) {
      return NextResponse.json(
        { error: 'Name, email, order number, and items are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Store in Airtable
    try {
      const { createReturnRequest } = await import('@/lib/airtable');
      await createReturnRequest({
        'Order Number': orderNumber,
        'Email': email,
        'Name': name,
        'Reason': reason || 'Not specified',
        'Submitted At': new Date().toISOString()
      });
    } catch (airtableError) {
      console.error('Airtable error:', airtableError);
      // Continue even if Airtable fails - Slack notification is primary
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage: any = {
        text: '🔄 New Return Request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🔄 New Return Request'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Name:*\n${name}`
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${email}`
              },
              {
                type: 'mrkdwn',
                text: `*Order Number:*\n${orderNumber}`
              },
              {
                type: 'mrkdwn',
                text: `*Items:*\n${items}`
              }
            ]
          }
        ]
      };

      // Add reason if provided
      if (reason) {
        slackMessage.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Reason:*\n${reason}`
          }
        });
      }

      // Add timestamp
      slackMessage.blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
          }
        ]
      });

      const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slackMessage)
      });

      if (!slackResponse.ok) {
        console.error('Slack notification failed:', await slackResponse.text());
      }
    }

    return NextResponse.json(
      { message: 'Return request submitted successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing return request:', error);
    return NextResponse.json(
      { error: 'Failed to process return request' },
      { status: 500 }
    );
  }
}

