import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/app/lib/stripe';

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const formData = await req.formData();
    
    const customerEmail = formData.get('customer_email');
    // 1. Grab the dynamic parameters your form is sending
    const userId = formData.get('user_id'); 
    const recipeId = formData.get('recipe_id');
    const recipeName = formData.get('recipe_name') || 'Premium Recipe Access';
    const recipeImage = formData.get('recipe_image');
    const recipePrice = parseFloat(formData.get('recipe_price') || '4.99');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide dynamic dynamic price parameters built matching inline Stripe pricing schema
          price_data: {
            currency: 'usd',
            product_data: {
              name: recipeName,
              ...(recipeImage && { images: [recipeImage] }),
            },
            unit_amount: Math.round(recipePrice * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ...(customerEmail && { customer_email: customerEmail }),
      // 2. Attach variables to metadata mirroring structural data patterns exactly
      metadata: {
        userId: userId, 
        recipeId: recipeId,
        type: 'single_recipe_purchase',
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}&recipe_id=${recipeId}`,
      cancel_url: `${origin}/recipes/${recipeId}?canceled=true`,
    });

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}