import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  // Initialize Stripe inside the function to ensure env vars are available
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
  });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Get payment type from metadata
    const paymentType = session.metadata?.type;
    
    // Only process Club Vonga orders
    if (!paymentType || !['club_deposit', 'club_second_payment', 'club_final_payment'].includes(paymentType)) {
      return NextResponse.json({ received: true });
    }
    
    // Handle second and final payments
    if (paymentType === 'club_second_payment' || paymentType === 'club_final_payment') {
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        console.error('Missing orderId in session metadata');
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
      }
      
      try {
        const { getOrderById, updateOrder } = await import('@/lib/airtable');
        const order = await getOrderById(orderId);
        
        if (!order) {
          console.error('Order not found:', orderId);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        
        // Update order based on payment type
        if (paymentType === 'club_second_payment') {
          await updateOrder(orderId, {
            'Payment Status': 'Final Payment Due',
            'Second Payment Intent ID': session.payment_intent as string
          });
          console.log('Second payment completed for order:', orderId);
        } else if (paymentType === 'club_final_payment') {
          await updateOrder(orderId, {
            'Order Status': 'Shipped',
            'Payment Status': 'Fully Paid',
            'Final Payment Intent ID': session.payment_intent as string,
            'Shipped At': new Date().toISOString()
          });
          console.log('Final payment completed for order:', orderId);
          
          // Send order complete email
          try {
            const { sendOrderCompleteEmail } = await import('@/lib/email');
            await sendOrderCompleteEmail({
              organizationName: order['Organization Name'],
              contactName: order['Contact Name'],
              email: order['Email'],
              orderId: orderId,
              totalUnits: order['Total Units'],
              subtotal: order['Subtotal'],
              starterKit: order['Starter Kit'],
            });
            console.log('Order complete email sent to:', order['Email']);
          } catch (emailError) {
            console.error('Failed to send order complete email:', emailError);
          }
          
          // Send Slack notification for order completion
          if (process.env.SLACK_WEBHOOK_URL) {
            try {
              const slackMessage = {
                text: `🎉 Order Complete - Fully Paid!`,
                blocks: [
                  {
                    type: "header",
                    text: {
                      type: "plain_text",
                      text: "🎉 Order Complete - Fully Paid!"
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
                        text: `*Total Amount:*\n$${order['Subtotal'].toLocaleString()}`
                      }
                    ]
                  }
                ]
              };
              
              await fetch(process.env.SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slackMessage),
              });
            } catch (slackError) {
              console.error('Failed to send Slack notification:', slackError);
            }
          }
        }
        
        return NextResponse.json({ received: true });
      } catch (error) {
        console.error('Error processing payment webhook:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }
    
    // Handle initial deposit (existing code below)
    if (paymentType !== 'club_deposit') {
      return NextResponse.json({ received: true });
    }

    try {
      // Extract order data from session metadata
      const organizationName = session.metadata?.organizationName || '';
      const customerEmail = session.metadata?.customerEmail || '';
      const kitType = session.metadata?.kitType || '';
      const totalUnits = session.metadata?.totalUnits || '';
      const memberCount = session.metadata?.memberCount || '';
      const itemCount = session.metadata?.itemCount || '';
      const depositAmount = session.metadata?.depositAmount || '';
      const depositPercentage = session.metadata?.depositPercentage || '';
      const subtotalAmount = session.metadata?.subtotalAmount || '';
      const secondPayment = session.metadata?.secondPayment || '';
      const finalPayment = session.metadata?.finalPayment || '';
      const products = session.metadata?.products || '';
      const cartItemsJson = session.metadata?.cartItemsJson || '';

      // Parse cart items
      const cartItems = JSON.parse(cartItemsJson || '[]');

      // Save order to Airtable
      const { createOrder } = await import('@/lib/airtable');
      
      const orderData = {
        'Order ID': `ORD-${Date.now()}`,
        'Stripe Session ID': session.id,
        'Organization Name': organizationName,
        'Contact Name': session.customer_details?.name || 'Unknown',
        'Email': customerEmail,
        'Phone': session.customer_details?.phone || undefined,
        'Member Count': parseInt(memberCount || '0'),
        'Starter Kit': (kitType === 'core' ? 'Core' : 'Pro') as 'Core' | 'Pro',
        'Cart Items': JSON.stringify(cartItems),
        'Total Units': parseInt(totalUnits || '0'),
        'Subtotal': parseFloat(subtotalAmount || '0'),
        'Deposit Amount': parseFloat(depositAmount || '0'),
        'Second Payment Amount': parseFloat(secondPayment || '0'),
        'Final Payment Amount': parseFloat(finalPayment || '0'),
        'Order Status': 'Deposit Paid' as const,
        'Payment Status': 'Deposit Paid' as const,
        'Created At': new Date().toISOString(),
        'Deposit Payment Intent ID': session.payment_intent as string,
      };

      const savedOrder = await createOrder(orderData);

      if (!savedOrder) {
        console.error('Failed to save order to Airtable');
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
      }

      console.log('Order saved successfully to Airtable:', savedOrder.id);

      // Send order confirmation email to customer
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email');
        await sendOrderConfirmationEmail({
          organizationName,
          contactName: session.customer_details?.name || 'Customer',
          email: customerEmail,
          orderId: savedOrder.id,
          totalUnits: parseInt(totalUnits || '0'),
          subtotal: parseFloat(subtotalAmount || '0'),
          depositAmount: parseFloat(depositAmount || '0'),
          starterKit: (kitType === 'core' ? 'Core' : 'Pro') as 'Core' | 'Pro',
        });
        console.log('Order confirmation email sent to:', customerEmail);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the webhook if email fails
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
                  text: "🎉 New Club Vonga Order - Deposit Paid!"
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
                    text: `*Contact:*\n${session.customer_details?.name || 'Unknown'}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Email:*\n${customerEmail}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Kit Type:*\n${kitType === 'core' ? 'Core Kit' : 'Pro Kit'}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Total Units:*\n${totalUnits}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Order Total:*\n$${parseFloat(subtotalAmount || '0').toLocaleString()}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Deposit Paid:*\n$${parseFloat(depositAmount || '0').toLocaleString()} (10%)`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Next Payment:*\n$${parseFloat(secondPayment || '0').toLocaleString()} (40%)`
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
          // Don't fail the webhook if Slack fails
        }
      }

    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
