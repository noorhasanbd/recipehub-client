import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { stripe } from "@/app/lib/stripe";

// Initialize the MongoDB client locally for this route handler
const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
  // 🌟 Next.js App Router requires reading the raw body as text for Stripe verification
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    // Validate that the request came directly from Stripe securely
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the successful checkout event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Pull the userId out of the metadata object we appended in checkout_sessions
    const userId = session.metadata?.userId;
    const stripeSubscriptionId = session.subscription;

    if (userId) {
      try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || "recipehub-db");

        // 🌟 Update the user record directly in MongoDB to unlock Premium features
        await db.collection("users").updateOne(
          {
            $or: [
              { _id: userId },
              { _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null }
            ].filter(Boolean)
          },
          { 
            $set: { 
              isPremium: true, 
              stripeSubscriptionId: stripeSubscriptionId,
              updatedAt: new Date() 
            } 
          }
        );
        
        console.log(`[Stripe Webhook Success] User ${userId} updated to Premium.`);
      } catch (dbError) {
        console.error("Database sync failed inside webhook:", dbError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      } finally {
        await client.close();
      }
    }
  }

  // Return a clean 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}