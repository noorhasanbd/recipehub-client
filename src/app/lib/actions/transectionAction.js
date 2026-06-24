"use server";

export async function getAllTransactions() {
  try {
    const expressUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Create an endpoint in express or fetch directly from an admin data sync endpoint
    const response = await fetch(`${expressUrl}/api/all-transactions`, {
      method: 'GET',
      cache: 'no-store' // Avoid caching financial information
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transaction profiles from Express.");
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error("❌ Action getAllTransactions Failed:", error);
    return { success: false, data: [], error: error.message };
  }
}