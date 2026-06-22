"use client";

import { React, useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation"; 
import RecipeForm from "@/components/admin/RecipeForm";
import { getAllRecipes, updateRecipe } from "@/app/lib/actions/recipeActions/manageRecipes"; // 🌟 Ensure updateRecipe is imported
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function EditRecipePage() {
  const router = useRouter();
  const pathname = usePathname(); 
  const params = useParams();
  const recipeId = params.id; // Extract the ID from the URL matrix

  // 🌟 Read live client session details from Better Auth
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [initialData, setInitialData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. Fetch the single recipe record on component mount
  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        setIsDataLoading(true);
        // Using your existing getAllRecipes action or a dedicated getRecipeById if you have one
        const result = await getAllRecipes({ page: 1, limit: 1000 });
        
        if (result.success && Array.isArray(result.data)) {
          const match = result.data.find((r) => r._id === recipeId);
          if (match) {
            setInitialData(match);
          } else {
            toast.error("❌ Recipe record could not be located in database.");
          }
        } else {
          toast.error("❌ Failed to pull workspace catalog streams.");
        }
      } catch (err) {
        console.error("Error loading profile configuration details:", err);
        toast.error("Critical error reading database inventory records.");
      } finally {
        setIsDataLoading(false);
      }
    }

    if (recipeId) fetchRecipeDetails();
  }, [recipeId]);

  const handleUpdate = async (recipePayload) => {
    // Setup the wrapper promise for Toastify execution
    const runUpdate = async () => {
      console.log("Form fields updated inside layout payload wrapper:", recipePayload);

      // Explicitly attach client session metadata into the final data block
      const explicitPayload = {
        ...recipePayload,
        clientUser: session ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        } : null
      };

      // 🌟 Invoke your update server action, passing the target ID and current payload
      const result = await updateRecipe(recipeId, explicitPayload);

      if (result && result.success) {
        // Send user back to the workspace panel on victory
        router.back();
        return result;
      } else {
        // Force the promise into a rejected state to catch the error string
        throw new Error(result.error || "Database rejected row updates.");
      }
    };

    // Fire the asynchronous reactive promise layout
    toast.promise(runUpdate(), {
      pending: "Saving structural edits to MongoDB...",
      success: "🎉 Recipe successfully updated!",
      error: {
        render({ data }) {
          return `❌ Modification error: ${data.message}`;
        }
      }
    });
  };

  // 1. Loading state while checking security tokens or streaming row details
  if (isAuthPending || isDataLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Verifying structural workspace layout details...
        </p>
      </div>
    );
  }

  // 2. Redirect guard loop if logged out
  if (!session) {
    const callbackUrl = encodeURIComponent(pathname);
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center min-h-[300px] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-semibold">Access Denied</p>
        <p className="text-slate-600 text-sm">Please log back in to access the recipe workspace.</p>
        <button 
          onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)} 
          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // 3. Render the form with default/initial values if data loaded successfully
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      {initialData ? (
        <RecipeForm 
          initialData={initialData} // Ensure RecipeForm accepts and populates defaultValues using this prop
          onSubmit={handleUpdate} 
          onCancel={() => router.back()} 
        />
      ) : (
        <div className="text-center py-6 text-sm text-slate-400 font-medium">
          Unable to edit: Target entry record missing.
        </div>
      )}
    </div>
  );
}