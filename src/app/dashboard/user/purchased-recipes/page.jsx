"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Loader2, BookOpen, ChefHat, ArrowLeft, Eye, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { getPurchasedRecipes } from "@/app/lib/actions/recipeActions/purchaseActions";

export default function PurchasedRecipesPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSessionPending) return;
    
    if (!session?.user) {
      setError("Please sign in to view your purchased premium catalog vault.");
      setIsLoading(false);
      return;
    }

    async function loadPurchasedContent() {
      try {
        const result = await getPurchasedRecipes(session.user.id);
        if (result.success && Array.isArray(result.data)) {
          
          // 🌟 SMART NORMALIZER: Safely extract variables from both flat and nested objects
          const flattenedRecipes = result.data.map((item) => {
            if (!item) return null;
            
            // Check if backend nested full recipe variables inside a lookup object 'recipeDetails'
            const targetDetails = item.recipeDetails?.[0] || item.recipeDetails || item;
            
            return {
              ...item,
              ...targetDetails,
              // Fallback to guarantee a proper string identity for mapping keys & navigation routes
              _id: targetDetails._id?.toString() || item.recipeId?.toString() || item._id?.toString()
            };
          }).filter(Boolean);

          setRecipes(flattenedRecipes);
        } else {
          setError(result.error || "Failed loading items from your purchased collections database.");
        }
      } catch (err) {
        setError("An unexpected system validation failure occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPurchasedContent();
  }, [session, isSessionPending]);

  if (isSessionPending || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-6 space-y-4 my-10">
        <div className="p-4 bg-rose-50 text-rose-700 text-sm font-semibold rounded-2xl border border-rose-100">
          {error}
        </div>
        <Link href="/recipes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-500 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Recipe Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-orange-500" /> Purchased Library
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Premium cookbook unlocks connected permanently to your profile account tier.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto bg-slate-50/40 space-y-4">
          <ChefHat className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">Your Vault is Empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Premium premium community dishes you purchase on checkout will appear directly in this table framework.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/recipes"
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Browse Premium Recipes
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider uppercase">
                  <th className="py-4 px-6">Recipe</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Category</th>
                  <th className="py-4 px-6 hidden md:table-cell">Prep Time</th>
                  <th className="py-4 px-6 hidden lg:table-cell">Difficulty</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail and Title */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      {/* 🌟 FIX: Updated evaluation to catch 'recipeImage' parameter fallback */}
                      {recipe.recipeImage || recipe.image ? (
                        <img
                          src={recipe.recipeImage || recipe.image}
                          alt={recipe.recipeName || recipe.title || "Recipe Thumbnail"}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                          draggable="false"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-500">
                          <ChefHat className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        {/* 🌟 FIX: Checked for database native 'recipeName' first */}
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {recipe.recipeName || recipe.title || "Untitled Premium Entry"}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 sm:hidden mt-0.5">
                          {recipe.category || "Main"} • {recipe.preparationTime || 0} mins
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg">
                        <Tag className="w-3 h-3" />
                        {recipe.category || "Premium Content"}
                      </span>
                    </td>

                    {/* Prep Time Column */}
                    <td className="py-4 px-6 hidden md:table-cell text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {recipe.preparationTime || 0} mins
                      </span>
                    </td>

                    {/* Difficulty Level Column */}
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md ${
                        recipe.difficultyLevel === "Easy" ? "bg-emerald-50 text-emerald-700" :
                        recipe.difficultyLevel === "Medium" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      }`}>
                        {recipe.difficultyLevel || "Medium"}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/recipes/${recipe._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Recipe</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}