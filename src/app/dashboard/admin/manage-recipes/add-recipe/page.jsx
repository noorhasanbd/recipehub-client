"use client";

import { useRouter, usePathname } from "next/navigation"; 
import RecipeForm from "@/components/admin/RecipeForm";
import { createRecipe } from "@/app/lib/actions/recipeActions/manageRecipes";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify"; // 🌟 Import Toastify engine

export default function AddRecipePage() {
  const router = useRouter();
  const pathname = usePathname(); 
  
  // 🌟 Read live client session details from Better Auth
  const { data: session, isPending } = authClient.useSession();

  const handleCreate = async (recipePayload) => {
    // 1. Setup the wrapper promise for Toastify execution
    const runSubmission = async () => {
      console.log("Form content fields gathered from RecipeForm:", recipePayload);

      // Explicitly attach client session metadata into the final data block
      const explicitPayload = {
        ...recipePayload,
        clientUser: session ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        } : null
      };

      const result = await createRecipe(explicitPayload);

      if (result && result.success) {
        // Send user back to the workspace panel on victory
        router.back();
        return result;
      } else {
        // Force the promise into a rejected state to catch the error string
        throw new Error(result.error || "Database rejected row insertion.");
      }
    };

    // 2. Fire the asynchronous reactive promise layout
    toast.promise(runSubmission(), {
      pending: "Publishing your new recipe to MongoDB...",
      success: "🎉 Recipe successfully published!",
      error: {
        render({ data }) {
          return `❌ Submission error: ${data.message}`;
        }
      }
    });
  };

  // 1. Loading state while checking security tokens
  if (isPending) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center justify-center min-h-[300px]">
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Verifying security credentials...
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

  // 3. Render the form if validation clears
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <RecipeForm onSubmit={handleCreate} onCancel={() => router.back()} />
    </div>
  );
}