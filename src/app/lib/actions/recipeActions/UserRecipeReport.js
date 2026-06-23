"use server";

import { cookies } from "next/headers";

/**
 * HELPER: Safely bundles browser cookies into the Server Action request 
 * so the Express 'isAuthenticated' middleware can read the session.
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();
  
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (rawCookies) {
    headers["Cookie"] = rawCookies;
  }
  
  return headers;
}

/**
 * ACTION: Create a new recipe report
 * Triggered directly by the 3-dot dropdown inside your RecipeCard
 */
export async function createRecipeReport(recipeId, recipeName, reason) {
  try {
    const authHeaders = await getAuthHeaders();

    // 🌟 DYNAMIC ENV VARIABLE: Fallback dynamically to localhost if the variable isn't configured
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    const EXPRESS_API_URL = `${BASE_URL}/api/reports`;

    const response = await fetch(EXPRESS_API_URL, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        targetType: "recipe",
        targetId: recipeId,
        targetName: recipeName,
        reason: reason,
        details: `User flagged this recipe via the UI dropdown.`,
      }),
    });

    // Safeguard check if the response is valid JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { 
        success: false, 
        error: "Backend served HTML instead of JSON. Check your NEXT_PUBLIC_SERVER_URL setting." 
      };
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error("Action error creating report:", error.message);
    return { success: false, error: error.message };
  }
}