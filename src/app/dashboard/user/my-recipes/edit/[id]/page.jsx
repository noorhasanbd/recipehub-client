"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import RecipeForm from "@/components/admin/RecipeForm";
import { authClient } from "@/app/lib/auth-client";
import { Loader2, ShieldAlert, ArrowLeft, Sparkles } from "lucide-react";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params?.id;

  const { data: session, isPending: authPending } = authClient.useSession();

  const [recipe, setRecipe] = useState(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch the existing recipe details to populate the form fields
  useEffect(() => {
    async function fetchRecipeDetails() {
      if (!id) return;
      try {
        setIsLoadingRecipe(true);
        setError(null);

        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${SERVER_URL}/api/recipes/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Could not locate target recipe document.");

        const result = await res.json();
        if (result?.success && result.data) {
          setRecipe(result.data);
        } else {
          setError("Failed to parse clean recipe data records.");
        }
      } catch (err) {
        console.error("Edit page fetch failure:", err);
        setError(err.message || "Database connection pipeline timed out.");
      } finally {
        setIsLoadingRecipe(false);
      }
    }

    if (session) {
      fetchRecipeDetails();
    }
  }, [id, session]);

  // 2. Handle updating the altered form payload against your Express backend PUT endpoint
  const handleUpdate = async (updatedPayload) => {
    try {
      setIsUpdating(true);
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      // Include clientUser verification context to pass through any auth checks if needed
      const explicitPayload = {
        ...updatedPayload,
        clientUser: session ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        } : null
      };

      const res = await fetch(`${SERVER_URL}/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(explicitPayload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("🎉 Recipe updated successfully inside MongoDB!");
        router.push("/dashboard/user/my-recipes"); // Redirect cleanly back to your management table workspace
      } else {
        alert(`❌ Update rejection error: ${result.error || "Server validation failed."}`);
      }
    } catch (err) {
      console.error("Critical edit save operation crash:", err);
      alert("An unexpected error occurred while modifying the document.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Guard State A: Checking auth tokens
  if (authPending || (isLoadingRecipe && !error && session)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">
          {authPending ? "Verifying security credentials..." : "Plating existing recipe details..."}
        </p>
      </div>
    );
  }

  // Guard State B: User logged out redirect layer
  if (!session) {
    const callbackUrl = encodeURIComponent(pathname);
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-slate-100 p-8 rounded-3xl shadow-xs text-center flex flex-col items-center justify-center gap-4">
        <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">Access Denied</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Please log back in to access the recipe editing workspace.
          </p>
        </div>
        <button 
          onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)} 
          className="w-full mt-2 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-sm shadow-orange-500/10 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Guard State C: Document load error row
  if (error || !recipe) {
    return (
      <div className="p-6 text-center max-w-sm mx-auto my-16 bg-red-50 text-red-700 border border-red-100 rounded-2xl">
        <p className="font-bold text-sm">Record Unavailable</p>
        <p className="text-xs text-red-500 mt-1 mb-4">{error || "Recipe could not be loaded."}</p>
        <button onClick={() => router.push("/dashboard/user/my-recipes")} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
          Return to Table
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      
      {/* Structural Navigation Back-step */}
      <button 
        onClick={() => router.push("/dashboard/user/my-recipes")}
        className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Cancel & Return</span>
      </button>

      {/* Editing Workspace Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/10 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Update Mode</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Modify "{recipe.recipeName}"
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Alter your properties cleanly below. Your database tracking IDs and engagement analytics remain completely untouched.
          </p>
        </div>
      </div>

      {/* Main Recipe Form Wrapper */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs relative">
        {isUpdating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs rounded-3xl flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Saving updated records...</p>
            </div>
          </div>
        )}
        
        {/* Pass initialData to your RecipeForm to display pre-saved values */}
        <RecipeForm 
          initialData={recipe} 
          onSubmit={handleUpdate} 
          onCancel={() => router.push("/dashboard/user/my-recipes")} 
        />
      </div>

    </div>
  );
}