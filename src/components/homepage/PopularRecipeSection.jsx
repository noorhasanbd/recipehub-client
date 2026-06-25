"jsx"
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Flame, Award } from "lucide-react";
 // Adjust this import path to match your layout
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes"; 
import { authClient } from "@/app/lib/auth-client";
import RecipeCard from "../RecipeCard";

export default function PopularRecipes() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPopularRecipes() {
      try {
        setIsLoading(true);
        
        // Fetch recipes with a slightly higher limit so we can pull a pool to filter
        const result = await getAllRecipes({ page: 1, limit: 12 });

        if (result.success && Array.isArray(result.data)) {
          // 🌟 DYNAMIC SORT: Highest likesCount floats to the top, capped at the top 4 items
          const sortedByPopularity = [...result.data]
            .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
            .slice(0, 4);

          setRecipes(sortedByPopularity);
        } else {
          throw new Error(result.error || "Failed to parse system catalog records.");
        }
      } catch (err) {
        console.error("Popular Recipes Client Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularRecipes();
  }, []);

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
        <p className="text-xs font-semibold text-slate-400">Curating community favorites...</p>
      </div>
    );
  }

  // 2. Error fallback state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-8 text-center text-xs font-medium text-slate-400">
        Could not load popular recipes at this time.
      </div>
    );
  }

  // 3. Empty State (If database has no items yet)
  if (recipes.length === 0) {
    return null; 
  }

  // 4. Main Render Pipeline
  return (
    <section className="w-full py-12 bg-slate-50/40 border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl space-y-8">
        
        {/* Header Ribbon Layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100 tracking-wider uppercase">
              <Flame className="w-3 h-3 fill-orange-500 stroke-orange-500" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Most Popular Masterpieces
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              The absolute highest-rated flavor blueprints voted into the spotlight by our global kitchen community.
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-2xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sorted Live by Community Likes</span>
          </div>
        </div>

        {/* Dynamic Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id} 
              recipe={recipe} 
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

      </div>
    </section>
  );
}