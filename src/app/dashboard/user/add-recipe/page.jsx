"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import RecipeForm from "@/components/admin/RecipeForm";
import { createRecipe } from "@/app/lib/actions/recipeActions/manageRecipes";
import { authClient } from "@/app/lib/auth-client";
import { Loader2, ShieldAlert, Sparkles, ArrowLeft, Crown, AlertTriangle } from "lucide-react";

export default function AddRecipePage() {
  const router = useRouter();
  const pathname = usePathname(); 
  
  // Read live client session details from Better Auth
  const { data: session, isPending } = authClient.useSession();

  // Track state for user's existing recipe counts
  const [existingCount, setExistingCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  // Fetch current count if user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      // 🌟 FIX 1: Use your production environment variable instead of hardcoded localhost
      const serverBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      fetch(`${serverBase}/api/recipes/user/${session.user.id}`)
        .then((res) => res.json())
        .then((resData) => {
          // Robust parsing to capture count regardless of object wrappers
          if (resData.success) {
            setExistingCount(resData.count ?? (Array.isArray(resData.data) ? resData.data.length : 0));
          } else if (Array.isArray(resData)) {
            setExistingCount(resData.length);
          }
        })
        .catch((err) => console.error("Error evaluating subscription thresholds:", err))
        .finally(() => setIsLoadingCount(false));
    } else if (!isPending) {
      setIsLoadingCount(false);
    }
  }, [session, isPending]);

  const handleCreate = async (recipePayload) => {
    try {
      console.log("Form content fields gathered from RecipeForm:", recipePayload);

      const explicitPayload = {
        ...recipePayload,
        clientUser: session ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          isPremium: session.user.isPremium // Pass flag along to sync with backend changes
        } : null
      };

      const result = await createRecipe(explicitPayload);

      if (result.success) {
        alert("🎉 Recipe successfully published!");
        router.push("/dashboard/user/my-recipes"); 
      } else {
        alert(`❌ Database submission error: ${result.error}`);
      }
    } catch (error) {
      console.error("Critical submission failure:", error);
      alert("An unexpected error occurred while saving the recipe.");
    }
  };

  // 1. Loading state while checking security tokens & calculating counts
  if (isPending || isLoadingCount) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // 2. Redirect guard loop if logged out
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
            Please log back in to access the shared culinary recipe building workspace.
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

  // 🌟 FIX 2: Solidify verification evaluation checks
  const isPremium = session.user.isPremium === true;
  const hasReachedLimit = !isPremium && existingCount >= 3;

  if (hasReachedLimit) {
    return (
      <div className="max-w-md mx-auto my-24 bg-white border border-slate-200/60 p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-5 shadow-xs">
        <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recipe Limit Reached</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Hobby Cook plans are limited to 3 published recipes. You currently have{" "}
            <span className="font-bold text-slate-800">{existingCount}</span> items live in your catalog.
          </p>
        </div>
        <div className="w-full pt-2 flex flex-col gap-2">
          <button
            onClick={() => router.push("/dashboard/billing")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Upgrade to Premium ($5/mo)
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 py-1 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      
      {/* Structural Navigation Back-step */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Cancel & Return</span>
      </button>

      {/* Decorative Creation Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="relative space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/10 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Recipe Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Share Your Secret Flavor Blueprint
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Fill out the structured configuration properties below. 
            {!isPremium && ` Free Tier usage: (${existingCount}/3 slots occupied).`}
          </p>
        </div>
      </div>

      {/* Main Recipe Form Wrapper */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs">
        <RecipeForm onSubmit={handleCreate} onCancel={() => router.back()} />
      </div>

    </div>
  );
}