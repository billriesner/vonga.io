import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: 'Variant ID and quantity are required' },
        { status: 400 }
      );
    }

    const checkout = await createCheckout(variantId, quantity);
    
    return NextResponse.json(checkout);
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

