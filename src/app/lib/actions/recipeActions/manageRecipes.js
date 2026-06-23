"use server";

import { revalidatePath } from "next/cache";
// 🌟 FIX 1: Statically import both cookies and headers at the top of the file
import { cookies, headers } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/recipes";

/**
 * Secure Helper: Extracts Better Auth session token from server cookies
 * and reconstructs standard Cookie headers for the Express server middleware.
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();
  
  // 🌟 FIX 2: Safely read the host header via our static top-level import
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const frontendUrl = `http://${host}`;

  const headersObj = {
    "Content-Type": "application/json",
    // 🌟 FIX 3: Inject dynamic origin indicators so Better Auth accepts the cross-origin cookie payload
    "Origin": frontendUrl,
    "Referer": `${frontendUrl}/`,
  };

  // Pass the ENTIRE cookie jar string untouched
  if (rawCookies) {
    headersObj["Cookie"] = rawCookies;
  }

  // Extract any session token present to populate the Authorization Bearer header safely
  const token = 
    cookieStore.get("better-auth.session_token")?.value || 
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  if (token) {
    headersObj["Authorization"] = `Bearer ${token}`;
  }

  return headersObj;
}

/**
 * 1. CREATE: Add a new recipe using explicit client session mapping
 */
export async function createRecipe(recipeData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(recipeData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to deploy new recipe.");
    }

    revalidatePath("/dashboard/admin/manage-recipes");
    revalidatePath("/dashboard/user/my-recipes");
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Action Create Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. READ: Fetch all recipes with API-based pagination
 */
export async function getAllRecipes(filters = {}) {
  try {
    const queryParams = new URLSearchParams();

    const cleanFilters = {
      page: 1,
      limit: 5,
      ...filters,
    };

    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const response = await fetch(url, { cache: "no-store" });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to retrieve recipe pages.");
    }

    return {
      success: true,
      data: result.data || [],
      pagination: result.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
    };
  } catch (error) {
    console.error("Action Fetch All Error:", error);
    return {
      success: false,
      error: error.message,
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  }
}

/**
 * 3. READ: Fetch single recipe by ID
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Recipe record not found.");
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Action Fetch Single Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 4. UPDATE: Modify an existing recipe record
 */
export async function updateRecipe(id, updatedFields) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(updatedFields),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed modifying recipe.");

    revalidatePath("/dashboard/admin/manage-recipes");
    revalidatePath("/dashboard/user/my-recipes");
    revalidatePath(`/dashboard/admin/manage-recipes/edit/${id}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Action Update Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 5. UPDATE: Increment likes counter
 */
export async function likeRecipe(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/like`, {
      method: "PATCH",
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Increment request failed.");
    return { success: true, likesCount: result.likesCount };
  } catch (error) {
    console.error("Action Like Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 6. DELETE: Permanent Eviction
 */
export async function deleteRecipe(id) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed removing document.");

    revalidatePath("/dashboard/admin/manage-recipes");
    revalidatePath("/dashboard/user/my-recipes");
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Action Delete Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 7. READ: Gather recipes attached to a specific userId
 */
export const getRecipeByUserId = async (userId) => {
  try {
    if (!userId) {
      console.warn("Action [getRecipeByUserId] Warning: No userId provided.");
      return { success: false, data: [] };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/recipes/user/${userId}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Server returned a ${res.status} error code.`);
    }

    const result = await res.json();

    if (result && Array.isArray(result)) {
      return { success: true, data: result };
    }

    if (result && result.success && Array.isArray(result.data)) {
      return result;
    }

    return { success: true, data: result.recipes || [] };
  } catch (error) {
    console.error(
      `Action [getRecipeByUserId] Error for ID ${userId}:`,
      error.message,
    );
    return { success: false, data: [], error: error.message };
  }
};