"use server";

import { revalidatePath } from "next/cache";
import { deleteRecipe } from "./manageRecipes";
// Import your existing recipe deletion action here


const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * FETCH: Pulls all open report entries from the MongoDB document layer
 */
export async function getAllReports() {
  try {
    const response = await fetch(`${BASE_URL}/api/reports?status=pending`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Could not fetch reports dashboard registry.");
    return await response.json();
  } catch (error) {
    console.error("Admin Fetch Reports Error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * UPDATE: Dismiss a report flag safely without deleting anything (Status -> dismissed)
 */
export async function dismissReport(reportId) {
  try {
    const response = await fetch(`${BASE_URL}/api/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "dismissed" }),
    });

    if (!response.ok) throw new Error("Failed updating dashboard index status matrices.");
    
    revalidatePath("/admin/reports");
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * RESOLVE: Leverages your existing deleteRecipe logic to drop content,
 * then marks the report tracking ticket as completely resolved.
 */
export async function resolveReportAndEraseContent(reportId, recipeId) {
  try {
    // 1. Re-use your pre-existing deletion logic from manageRecipes.js
    const recipeDeletionResult = await deleteRecipe(recipeId);
    
    if (!recipeDeletionResult || !recipeDeletionResult.success) {
      throw new Error(recipeDeletionResult?.error || "Your pre-existing deleteRecipe hook failed.");
    }

    // 2. Mark this specific report ticket as successfully resolved in the system logs
    const response = await fetch(`${BASE_URL}/api/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });

    if (!response.ok) throw new Error("Recipe deleted, but updating the report status timed out.");

    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    console.error("Cascade Moderation Settlement Failure:", error.message);
    return { success: false, error: error.message };
  }
}