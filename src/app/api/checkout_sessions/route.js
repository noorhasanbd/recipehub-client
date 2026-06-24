import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/app/lib/stripe';



export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const formData = await req.formData();
    const customerEmail = formData.get('customer_email');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1TlNeQJkZEwDCtQcDHRbZZkz',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      ...(customerEmail && { customer_email: customerEmail }),
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}