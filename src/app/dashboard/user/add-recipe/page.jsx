"use client";

import { useRouter, usePathname } from "next/navigation"; 
import RecipeForm from "@/components/admin/RecipeForm";
import { createRecipe } from "@/app/lib/actions/recipeActions/manageRecipes";
import { authClient } from "@/app/lib/auth-client";
import { Loader2, ShieldAlert, Sparkles, ArrowLeft } from "lucide-react";

export default function AddRecipePage() {
  const router = useRouter();
  const pathname = usePathname(); 
  
  // Read live client session details from Better Auth
  const { data: session, isPending } = authClient.useSession();

  const handleCreate = async (recipePayload) => {
    try {
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

      if (result.success) {
        alert("🎉 Recipe successfully published to MongoDB!");
        router.push("/dashboard/user/my-recipes"); // Redirect cleanly back to their catalog
      } else {
        alert(`❌ Database submission error: ${result.error}`);
      }
    } catch (error) {
      console.error("Critical submission failure:", error);
      alert("An unexpected error occurred while saving the recipe.");
    }
  };

  // 1. Loading state while checking security tokens
  if (isPending) {
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

  // 3. Render the workspace if verification clears
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
            Fill out the structured configuration properties below. Your dish will instantly sync with the core platform data cluster.
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