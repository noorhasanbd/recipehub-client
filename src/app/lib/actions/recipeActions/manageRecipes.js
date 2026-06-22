"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/recipes";

/**
 * 1. CREATE: Add a new recipe using explicit client session mapping
 * @param {Object} recipeData - Complete data block containing form inputs and clientUser details
 */
export async function createRecipe(recipeData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData), 
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to deploy new recipe.");
    }

    revalidatePath("/dashboard/admin/manage-recipes");
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
    // 1. Map parameters to an elegant query string setup
    const queryParams = new URLSearchParams();
    
    // Fallback pagination parameter defaults if not supplied by UI component
    const cleanFilters = {
      page: 1,
      limit: 5,
      ...filters
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

    // Assumes your backend API maps output to structured envelopes matching your frontend:
    // result.data -> array of documents
    // result.pagination -> { currentPage, totalPages, totalItems, limit }
    return { 
      success: true, 
      data: result.data || [], 
      pagination: result.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 } 
    };

  } catch (error) {
    console.error("Action Fetch All Error:", error);
    return { 
      success: false, 
      error: error.message, 
      data: [], 
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } 
    };
  }
}

/**
 * 3. READ: Fetch single recipe by ID
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Recipe record not found.");
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields), 
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed modifying recipe.");

    revalidatePath("/dashboard/admin/manage-recipes");
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
    const response = await fetch(`${API_BASE_URL}/${id}/like`, { method: "PATCH" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Increment request failed.");
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
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed removing document.");

    revalidatePath("/dashboard/admin/manage-recipes");
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Action Delete Error:", error);
    return { success: false, error: error.message };
  }
}