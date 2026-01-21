import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ClubOrder } from '@/lib/airtable';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      stripeSessionId,
      organizationName,
      contactName,
      email,
      phone,
      organizationType,
      memberCount,
      starterKit,
      cartItems,
      subtotal,
      depositAmount,
      secondPaymentAmount,
      finalPaymentAmount,
      depositPaymentIntentId
    } = body;

    // Validate required fields
    if (!stripeSessionId || !organizationName || !contactName || !email || !starterKit || !cartItems) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total units
    const totalUnits = cartItems.reduce((total: number, item: any) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
      return total + itemQty;
    }, 0);

    // Insert order into Airtable
    const { createOrder } = await import('@/lib/airtable');
    
    // Map field names to Airtable format
    const airtableOrder = {
      'Order ID': `ORD-${Date.now()}`,
      'Stripe Session ID': stripeSessionId,
      'Organization Name': organizationName,
      'Contact Name': contactName,
      'Email': email,
      'Phone': phone,
      'Organization Type': organizationType,
      'Member Count': memberCount,
      'Starter Kit': (starterKit === 'core' ? 'Core' : 'Pro') as 'Core' | 'Pro',
      'Cart Items': JSON.stringify(cartItems),
      'Total Units': totalUnits,
      'Subtotal': subtotal,
      'Deposit Amount': depositAmount,
      'Second Payment Amount': secondPaymentAmount,
      'Final Payment Amount': finalPaymentAmount,
      'Order Status': 'Deposit Paid' as const,
      'Payment Status': 'Deposit Paid' as const,
      'Created At': new Date().toISOString(),
      'Deposit Payment Intent ID': depositPaymentIntentId,
    };

    try {
      const savedOrder = await createOrder(airtableOrder);
      if (!savedOrder) {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Airtable error:', error);
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      );
    }

    // Send Slack notification about new order
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackMessage = {
          text: `🎉 New Club Vonga Order Received!`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🎉 New Club Vonga Order"
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Organization:*\n${organizationName}`
                },
                {
                  type: "mrkdwn",
                  text: `*Contact:*\n${contactName}`
                },
                {
                  type: "mrkdwn",
                  text: `*Email:*\n${email}`
                },
                {
                  type: "mrkdwn",
                  text: `*Kit Type:*\n${starterKit === 'core' ? 'Core Kit' : 'Pro Kit'}`
                },
                {
                  type: "mrkdwn",
                  text: `*Total Units:*\n${totalUnits}`
                },
                {
                  type: "mrkdwn",
                  text: `*Order Total:*\n$${subtotal.toLocaleString()}`
                },
                {
                  type: "mrkdwn",
                  text: `*Deposit Paid:*\n$${depositAmount.toLocaleString()} (10%)`
                },
                {
                  type: "mrkdwn",
                  text: `*Next Payment:*\n$${secondPaymentAmount.toLocaleString()} (40%)`
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Order Items:*\n${cartItems.map((item: any) => {
                  const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
                  return `• ${item.gearType}: ${itemQty} units`;
                }).join('\n')}`
              }
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "View Order Details"
                  },
                  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/club-orders`,
                  style: "primary"
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
      } catch (slackError) {
        console.error('Slack notification failed:', slackError);
        // Don't fail the request if Slack fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderId = searchParams.get('orderId');

    const { getOrderById, getOrdersByEmail, getAllOrders } = await import('@/lib/airtable');

    if (orderId) {
      // Get specific order
      try {
        const order = await getOrderById(orderId);
        if (!order) {
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ order });
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch order' },
          { status: 500 }
        );
      }
    }

    if (email) {
      // Get orders for specific email
      try {
        const orders = await getOrdersByEmail(email);
        return NextResponse.json({ orders });
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch orders' },
          { status: 500 }
        );
      }
    }

    // Get all orders (admin only)
    try {
      const orders = await getAllOrders();
      return NextResponse.json({ orders });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
