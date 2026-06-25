import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { stripe } from "@/app/lib/stripe";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(req) {
  // 🌟 Read the raw body as text for Stripe signature validation
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
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
    
    // Pull the accurate metadata properties matching your Express payload
    const userId = session.metadata?.userId;
    const recipeId = session.metadata?.recipeId;
    const purchaseType = session.metadata?.type; // 'single_recipe_purchase' vs 'subscription'
    const stripeSubscriptionId = session.subscription;

    if (userId) {
      try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || "recipehub-db");

        // 🎯 FIX 1: Explicitly match user collection name schema ("user", NOT "users")
        const userCollection = db.collection("user");
        const recipePurchaseCollection = db.collection("recipepurchase");
        const transactionCollection = db.collection("transactions");

        // 🎯 FIX 2: BetterAuth specific safe lookup schema target
        const queryTarget = {
          $or: [
            { id: String(userId) }, 
            { _id: String(userId) },
            { _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null }
          ].filter(Boolean)
        };

        // -----------------------------------------------------------------
        // ROUTE A: ONE-TIME SINGLE RECIPE ACCESS PROVISIONS
        // -----------------------------------------------------------------
        if (purchaseType === "single_recipe_purchase") {
          if (!recipeId) {
            console.error("❌ Missing recipeId in Next.js webhook metadata context");
            return NextResponse.json({ error: "Missing recipeId metadata" }, { status: 400 });
          }

          await recipePurchaseCollection.updateOne(
            { userId: String(userId), recipeId: String(recipeId) },
            { 
              $set: { 
                userId: String(userId), 
                recipeId: String(recipeId), 
                purchasedAt: new Date() 
              } 
            },
            { upsert: true }
          );
          console.log(`💾 Next.js Webhook Success. Recipe ${recipeId} unlocked for User ${userId}.`);

        // -----------------------------------------------------------------
        // ROUTE B: SUBSCRIPTION TIER MEMBER ELEVATION
        // -----------------------------------------------------------------
        } else {
          await userCollection.updateOne(
            queryTarget,
            { 
              $set: { 
                isPremium: true, 
                stripeSubscriptionId: stripeSubscriptionId || "",
                updatedAt: new Date() 
              } 
            }
          );
          console.log(`💾 Next.js Webhook Success. User ${userId} upgraded to Premium.`);
        }

        // -----------------------------------------------------------------
        // COMPREHENSIVE TRANSACTIONS AUDITING LEDGER
        // -----------------------------------------------------------------
        const transactionRecord = {
          userId: String(userId),
          recipeId: recipeId ? String(recipeId) : null, 
          purchaseType: purchaseType || "subscription",
          customerEmail: session.customer_details?.email || session.customer_email || "unknown@email.com",
          stripeSessionId: session.id,
          stripeSubscriptionId: session.subscription || null,
          amountTotal: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency ? session.currency.toUpperCase() : "USD",
          paymentStatus: session.payment_status,
          createdAt: new Date(),
        };

        await transactionCollection.updateOne(
          { stripeSessionId: session.id },
          { $set: transactionRecord },
          { upsert: true }
        );
        console.log(`💾 Next.js Transaction Ledger compiled successfully for session: ${session.id}`);

      } catch (dbError) {
        console.error("❌ Database sync failed inside Next.js webhook:", dbError);
        return NextResponse.json({ error: "Database sync failed" }, { status: 500 });
      } finally {
        await client.close();
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}