"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/app/lib/auth"; // Adjust this path to point to your auth.js configuration file

// Initialize MongoClient 
const client = new MongoClient(process.env.MONGODB_URI);

/**
 * BACKENDLESS PROFILE UPDATE
 * Direct MongoDB cluster modification powered by Next.js Server Components
 */
export async function updateUserProfile({ name, image }) {
  try {
    // 1. Authenticate the active session using Better Auth's official server-side context fetcher
    const sessionContext = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionContext || !sessionContext.user) {
      return { 
        success: false, 
        error: "Authentication Error: Expired, missing, or invalid user session tokens." 
      };
    }

    const currentUserId = sessionContext.user.id;

    // 2. Client-side Input Sanitization and Validation Guardrails
    if (!name || name.trim() === "") {
      return { 
        success: false, 
        error: "Validation Error: Full profile name field cannot be submitted blank." 
      };
    }

    // 3. Open MongoDB connection safely
    await client.connect();
    const db = client.db(process.env.DB_NAME || "recipehub-db");
    const userCollection = db.collection("user");

    // 4. Update Document Execution using an alternate ID filter configuration to support both String/Object IDs
    const updateResult = await userCollection.updateOne(
      {
        $or: [
          { _id: currentUserId },
          { _id: currentUserId.length === 24 ? new ObjectId(currentUserId) : null }
        ].filter(Boolean)
      },
      {
        $set: {
          name: name.trim(),
          image: image || "",
          updatedAt: new Date()
        }
      }
    );

    // 5. Explicitly log state to server terminal (Replaces previous 'undefined' logs)
    console.log(`\n=== PROFILE UPDATE SUCCESSFUL ===`);
    console.log(`User ID Targeted: ${currentUserId}`);
    console.log(`Documents Found:  ${updateResult.matchedCount}`);
    console.log(`Documents Changed: ${updateResult.modifiedCount}`);
    console.log(`==================================\n`);

    // 6. Purge Next.js Client-Side Dynamic Server-Component Cache grids
    revalidatePath("/dashboard/my-profile");

    return { 
      success: true,
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount
    };

  } catch (error) {
    console.error("CRITICAL: Direct Profile Mutation Server Error:", error);
    return { 
      success: false, 
      error: error.message || "Internal network database cluster write exception." 
    };
  }
}