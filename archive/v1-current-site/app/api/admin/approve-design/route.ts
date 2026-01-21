import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Get order from Airtable
    const { getOrderById, updateOrder } = await import('@/lib/airtable');
    
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is ready for design approval
    if (order['Order Status'] !== 'Deposit Paid' || order['Payment Status'] !== 'Deposit Paid') {
      return NextResponse.json(
        { error: 'Order is not ready for design approval' },
        { status: 400 }
      );
    }

    // Update order status
    try {
      await updateOrder(orderId, {
        'Order Status': 'Design Approved',
        'Payment Status': 'Second Payment Due',
        'Design Approved At': new Date().toISOString()
      });
    } catch (updateError) {
      console.error('Airtable update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Send payment request email to customer
    try {
      const { sendPaymentRequestEmail } = await import('@/lib/email');
      await sendPaymentRequestEmail({
        organizationName: order['Organization Name'],
        contactName: order['Contact Name'],
        email: order['Email'],
        orderId: orderId,
        totalUnits: order['Total Units'],
        subtotal: order['Subtotal'],
        paymentAmount: order['Second Payment Amount'],
        paymentType: 'second',
        starterKit: order['Starter Kit'],
      });
      console.log('Second payment request email sent to:', order['Email']);
    } catch (emailError) {
      console.error('Failed to send payment request email:', emailError);
      // Don't fail the request if email fails
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackMessage = {
          text: `✅ Design Approved - Second Payment Due`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "✅ Design Approved - Second Payment Due"
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Organization:*\n${order['Organization Name']}`
                },
                {
                  type: "mrkdwn",
                  text: `*Order ID:*\n${orderId}`
                },
                {
                  type: "mrkdwn",
                  text: `*Customer Email:*\n${order['Email']}`
                },
                {
                  type: "mrkdwn",
                  text: `*Second Payment Due:*\n$${order['Second Payment Amount'].toLocaleString()}`
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Next Steps:*\n• Customer will receive email with payment link\n• 40% payment due before production begins\n• Payment link: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/payment/second?orderId=${orderId}&email=${order['Email']}`
              }
            }
          ]
        };

        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMessage)
        });
      } catch (slackError) {
        console.error('Slack notification failed:', slackError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Design approved successfully',
      paymentLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/payment/second?orderId=${orderId}&email=${order['Email']}`
    });

  } catch (error) {
    console.error('Design approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
