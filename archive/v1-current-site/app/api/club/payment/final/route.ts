import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email } = body;

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'Missing orderId or email' },
        { status: 400 }
      );
    }

    // Initialize Stripe inside the function to ensure env vars are available
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });

    // Get order from Airtable
    const { getOrderById } = await import('@/lib/airtable');
    
    const order = await getOrderById(orderId);

    if (!order || order['Email'] !== email) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is ready for final payment
    if (order['Payment Status'] !== 'Final Payment Due') {
      return NextResponse.json(
        { error: 'Order is not ready for final payment' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session for final payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Club Vonga - Final Payment`,
              description: `50% final payment for ${order['Organization Name']} order (${order['Total Units']} units)`,
            },
            unit_amount: Math.round(order['Final Payment Amount'] * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/payment/success?type=final&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/order/${orderId}`,
      customer_email: order['Email'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      ui_mode: 'hosted',
      metadata: {
        type: 'club_final_payment',
        orderId: orderId,
        paymentType: 'final_payment',
        organizationName: order['Organization Name'],
        customerEmail: order['Email'],
        amount: order['Final Payment Amount'].toString(),
        kitType: order['Starter Kit'],
        totalUnits: order['Total Units'].toString(),
      },
    });

    // Update order with payment intent ID
    const { updateOrder } = await import('@/lib/airtable');
    await updateOrder(orderId, {
      'Final Payment Intent ID': session.id
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Final payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
