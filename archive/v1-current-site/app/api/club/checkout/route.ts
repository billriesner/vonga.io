import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering - don't pre-render this API route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, starterKit, depositAmount, organizationName, email, subtotal, memberCount } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    // Initialize Stripe inside the function to ensure env vars are available
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    });

    // Calculate total units across all cart items
    const totalUnits = cartItems.reduce((total: number, item: any) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
      return total + itemQty;
    }, 0);

    // Create summary of product types and quantities
    const productSummary = cartItems.map((item: any) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
      return `${item.gearType}:${itemQty}`;
    }).join(', ');

    // Create line items from cart
    const lineItems = cartItems.map((item: any) => {
      const itemQty = Object.values(item.sizeRun).reduce((sum: number, qty: any) => sum + qty, 0);
      const gearLabel = item.gearType.charAt(0).toUpperCase() + item.gearType.slice(1);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${starterKit === 'core' ? 'Core' : 'Pro'} Kit - ${gearLabel}`,
            description: `${itemQty} units with NFC technology`,
          },
          unit_amount: Math.round((depositAmount / cartItems.length) * 100), // Split deposit across items
        },
        quantity: 1,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/club/get-started`,
      customer_email: email,
      payment_method_options: {
        // Enable Apple Pay and Google Pay
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      // Automatically show Apple Pay and Google Pay when available
      ui_mode: 'hosted',
      metadata: {
        // Organization info
        organizationName,
        customerEmail: email,
        
        // Order classification
        type: 'club_deposit',
        kitType: starterKit, // 'core' or 'pro'
        
        // Quantities
        totalUnits: totalUnits.toString(),
        memberCount: memberCount?.toString() || '0',
        itemCount: cartItems.length.toString(),
        
        // Pricing breakdown (10% / 40% / 50% payment structure)
        depositAmount: depositAmount.toString(),
        depositPercentage: '10',
        subtotalAmount: subtotal?.toString() || (depositAmount * 10).toString(),
        secondPayment: subtotal ? (subtotal * 0.4).toFixed(2) : (depositAmount * 4).toFixed(2),
        finalPayment: subtotal ? (subtotal * 0.5).toFixed(2) : (depositAmount * 5).toFixed(2),
        
        // Product details
        products: productSummary, // e.g. "tshirt:100, hoodie:50"
        
        // Additional data (JSON for detailed analysis)
        cartItemsJson: JSON.stringify(cartItems).substring(0, 490), // Stripe max 500 chars
      },
    });

    // Send Slack notification about payment initiated
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: '💳 Club Vonga Deposit Payment Initiated',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '💳 Club Vonga Deposit Payment Initiated'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Organization:*\n${organizationName}`
              },
              {
                type: 'mrkdwn',
                text: `*Email:*\n${email}`
              },
              {
                type: 'mrkdwn',
                text: `*Kit:*\n${starterKit === 'core' ? 'Core' : 'Pro'}`
              },
              {
                type: 'mrkdwn',
                text: `*Deposit:*\n$${depositAmount.toLocaleString()}`
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Session ID: ${session.id}`
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

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorMessage,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY
      },
      { status: 500 }
    );
  }
}

