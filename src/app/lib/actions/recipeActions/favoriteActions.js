"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 🌟 UPDATED: Targets your custom NEXT_PUBLIC_SERVER_URL environment configuration mapping
const SERVER_BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Toggles the favorite status of a specific recipe for the currently logged-in user
 */
export async function toggleFavoriteRecipe(recipeId) {
  try {
    const cookieStore = await cookies();
    const rawCookies = cookieStore.toString();

    const response = await fetch(`${SERVER_BASE}/api/recipes/${recipeId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": rawCookies,
        "Authorization": `Bearer ${cookieStore.get("better-auth.session_token")?.value || ""}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to alter recipe bookmark configurations.");
    }

    // Refresh structural paths cache to dynamically update client indicators
    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/dashboard/user/favorites");

    return { success: true, isFavorited: result.isFavorited };
  } catch (error) {
    console.error("Action Toggle Favorite Error:", error.message);
    return { success: false, error: error.message };
  }
}