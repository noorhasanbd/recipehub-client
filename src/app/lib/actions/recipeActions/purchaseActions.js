"use server";

import { revalidatePath } from "next/cache";

const EXPRESS_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

/**
 * 1. GET USER PURCHASES
 * Fetches all purchased recipes for a specific user from the Express database.
 */
export async function getUserPurchases() {
  try {
    // We send a request to your Express server to fetch the user's purchased collection.
    // Note: If your Express backend uses session cookies/tokens, pass them along in the headers.
    const response = await fetch(`${EXPRESS_URL}/api/payments/user-purchases`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Failed to retrieve purchase history from Express" };
    }

    // Assumes Express returns an array of objects structured as: { _id, recipeId, userId }
    return { success: true, data: data.purchases || [] };
  } catch (error) {
    console.error("❌ Server Action failure getting user purchases from Express:", error);
    return { success: false, error: "Network connection error loading purchases" };
  }
}

/**
 * 2. TOGGLE PURCHASE RECIPE
 * Manually logs or deletes a local purchase record inside your Express database fallback systems.
 */
export async function togglePurchaseRecipe(recipeId) {
  if (!recipeId) {
    return { success: false, error: "Missing recipe ID parameter" };
  }

  try {
    const response = await fetch(`${EXPRESS_URL}/api/payments/toggle-purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Express server purchase mutation failed" };
    }

    // Purge Next.js router cache layer to update button states immediately
    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Server Action failure updating purchase status via Express:", error);
    return { success: false, error: "Network connection error toggling purchase" };
  }
}