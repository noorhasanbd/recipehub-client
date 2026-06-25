"use server";

/**
 * Server Action to fetch all premium recipes purchased by a specific user from the backend
 * @param {string} userId - The authenticated user's ID
 */
export async function getPurchasedRecipes(userId) {
  if (!userId) {
    return { success: false, error: "Authenticated user reference context is required." };
  }

  try {
    // Uses server-side environment variables first, then public, then fallback
    const expressUrl = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    
    const response = await fetch(`${expressUrl}/api/payments/user-recipes/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Ensure real-time library synchronization after new checkouts
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Failed to fetch purchased recipes from Express." };
    }

    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("❌ Server Action failure fetching user purchases:", error);
    return { success: false, error: "Unable to reach database connection layout." };
  }
}