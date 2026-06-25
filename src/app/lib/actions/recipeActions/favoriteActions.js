"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SERVER_BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Shared Helper to extract request metadata and build header structures.
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value || "";

  return {
    "Content-Type": "application/json",
    "Cookie": rawCookies,
    "Authorization": `Bearer ${sessionToken}`
  };
}

/**
 * 1. TOGGLE FAVORITE 
 * Targets: POST /api/recipes/:id/favorite
 */
export async function toggleFavoriteRecipe(recipeId) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SERVER_BASE}/api/recipes/${recipeId}/favorite`, {
      method: "POST",
      headers
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed handling favorite toggle execution.");

    // Purge cached tracks to force immediate visual component updates
    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/dashboard/user/favorites");

    return { success: true, isFavorited: result.isFavorited };
  } catch (error) {
    console.error("Action Toggle Favorite Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 2. EXPLICIT REMOVE FROM FAVORITES
 * Targets: DELETE /api/recipes/:id/favorite
 */
export async function removeFavoriteRecipe(recipeId) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SERVER_BASE}/api/recipes/${recipeId}/favorite`, {
      method: "DELETE",
      headers
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to execute explicit delete execution.");

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/dashboard/user/favorites");

    return { success: true };
  } catch (error) {
    console.error("Action Remove Favorite Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 3. GET CURRENT USER'S FAVORITES
 * Targets: GET /api/recipes/favorites/my-list
 */
export async function getUserFavorites() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${SERVER_BASE}/api/recipes/favorites/my-list`, {
      method: "GET",
      headers,
      cache: "no-store" // Bypasses Next.js caching layers to load fresh database lookups
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to retrieve personal collections.");

    return { success: true, data: result.favorites || [] };
  } catch (error) {
    console.error("Action Get Favorites Error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
}