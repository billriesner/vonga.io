import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
      const { createContactSubmission } = await import('@/lib/airtable');
      await createContactSubmission({
        'Name': name,
        'Email': email,
        'Company': company,
        'Message': message,
        'Submitted At': new Date().toISOString()
      });
    } catch (airtableError) {
      console.error('Airtable error:', airtableError);
      // Continue even if Airtable fails - Slack notification is primary
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      // Determine submission type
      const isFAQ = company === 'FAQ Submission';
      const isPrivacy = company === 'Privacy Question';
      const isTerms = company === 'Terms Question';
      const title = isPrivacy ? '🔒 New Privacy Question' : 
                    (isFAQ ? '❓ New FAQ Question' : 
                    (isTerms ? '📜 New Terms Question' : 
                    '🚀 New Contact Form Submission'));
      
      // Build fields array - exclude company field for FAQ, Privacy, and Terms submissions
      const fields = [
        {
          type: 'mrkdwn',
          text: `*Name:*\n${name}`
        },
        {
          type: 'mrkdwn',
          text: `*Email:*\n${email}`
        }
      ];
      
      // Only add company field if not FAQ, Privacy, or Terms
      if (!isFAQ && !isPrivacy && !isTerms) {
        fields.push({
          type: 'mrkdwn',
          text: `*Company:*\n${company}`
        });
      }
      
      // Add message/question field with appropriate label
      const messageLabel = isPrivacy ? 'Privacy Question' : 
                          (isFAQ ? 'Question' : 
                          (isTerms ? 'Terms Question' : 
                          'Message'));
      fields.push({
        type: 'mrkdwn',
        text: `*${messageLabel}:*\n${message}`
      });

      const slackMessage = {
        text: title,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: title
            }
          },
          {
            type: 'section',
            fields: fields
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
      { message: 'Form submitted successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}

