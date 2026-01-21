import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendWilliamsRacingSampleRequestEmail, sendWilliamsRacingSampleRequestConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      organization, 
      size,
      street, 
      city, 
      state, 
      zip, 
      country, 
      notes 
    } = body;

    // Validate required fields (state is optional for international addresses)
    if (!name || !email || !organization || !size || !street || !city || !zip || !country) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate size is one of the allowed values
    const validSizes = ['S', 'M', 'L', 'XL', '2XL'];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Invalid size selected' },
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

    // Send email to bill@vonga.io
    try {
      const emailResult = await sendWilliamsRacingSampleRequestEmail({
        name,
        email,
        phone,
        organization,
        size,
        street,
        city,
        state,
        zip,
        country,
        notes,
      });
      
      if (emailResult.success) {
        console.log('Successfully sent email to bill@vonga.io');
      } else {
        console.error('Email to bill@vonga.io failed:', emailResult.error);
        // Log more details if available
        if (emailResult.error instanceof Error) {
          console.error('Email error details:', emailResult.error.message, emailResult.error.stack);
        } else {
          console.error('Email error object:', JSON.stringify(emailResult.error, null, 2));
        }
      }
    } catch (emailError) {
      console.error('Email exception:', emailError);
      if (emailError instanceof Error) {
        console.error('Email exception details:', emailError.message, emailError.stack);
      }
      // Continue even if email fails - Slack notification is primary
    }

    // Send confirmation email to the submitter
    try {
      const confirmationResult = await sendWilliamsRacingSampleRequestConfirmationEmail({
        name,
        email,
        phone,
        organization,
        size,
        street,
        city,
        state,
        zip,
        country,
        notes,
      });
      
      if (confirmationResult.success) {
        console.log('Successfully sent confirmation email to:', email);
      } else {
        console.error('Confirmation email failed:', confirmationResult.error);
        // Log more details if available
        if (confirmationResult.error instanceof Error) {
          console.error('Confirmation email error details:', confirmationResult.error.message, confirmationResult.error.stack);
        } else {
          console.error('Confirmation email error object:', JSON.stringify(confirmationResult.error, null, 2));
        }
      }
    } catch (confirmationError) {
      console.error('Confirmation email exception:', confirmationError);
      if (confirmationError instanceof Error) {
        console.error('Confirmation email exception details:', confirmationError.message, confirmationError.stack);
      }
      // Continue even if confirmation email fails
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: '🎁 New Williams Racing Sample Request',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎁 New Williams Racing Sample Request'
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
                text: `*Organization:*\n${organization}`
              },
              {
                type: 'mrkdwn',
                text: `*Size:*\n${size}`
              },
              {
                type: 'mrkdwn',
                text: `*Phone:*\n${phone || 'Not provided'}`
              },
              {
                type: 'mrkdwn',
                text: `*Shipping Address:*\n${street}\n${city}${state ? `, ${state}` : ''} ${zip}\n${country}`
              },
              {
                type: 'mrkdwn',
                text: `*Notes:*\n${notes || 'None'}`
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
      { message: 'Sample request submitted successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing sample request:', error);
    return NextResponse.json(
      { error: 'Failed to process sample request' },
      { status: 500 }
    );
  }
}
