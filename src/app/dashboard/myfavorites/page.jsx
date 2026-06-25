import React from "react";
import Link from "next/link";
import { FolderHeart, Utensils, ArrowRight, Clock, BarChart3, Bookmark, ShoppingBag, Coins } from "lucide-react";
import { getUserFavorites } from "@/app/lib/actions/recipeActions/favoriteActions";

// Forces Next.js to fetch fresh database states on every layout hit
export const dynamic = "force-dynamic";

export default async function MyFavoritesPage() {
  // 1. Fetch data directly from your server action
  const response = await getUserFavorites();
  const rawFavorites = response.success ? response.data : [];

  // 2. 🌟 SMART DATA NORMALIZER: Extracts nested MongoDB data right to the root level
  const favoriteRecipes = rawFavorites.map((item) => {
    if (!item) return null;

    // Scenario A: Data trapped inside an un-unwound pipeline array
    if (item.recipeDetails && Array.isArray(item.recipeDetails) && item.recipeDetails.length > 0) {
      const actualRecipe = item.recipeDetails[0];
      return { ...item, ...actualRecipe, _id: actualRecipe._id?.toString() };
    }

    // Scenario B: Data lives inside a single nested object
    if (item.recipeDetails && typeof item.recipeDetails === "object" && !Array.isArray(item.recipeDetails)) {
      return { ...item, ...item.recipeDetails, _id: item.recipeDetails._id?.toString() };
    }

    // Scenario C: Already flat
    return { ...item, _id: item._id?.toString() };
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/70 pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FolderHeart className="w-8 h-8 text-amber-500" />
              My Saved Favorites
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Your curated cookbook of saved community recipes and master culinary layouts.
            </p>
          </div>
          
          <div className="text-xs sm:text-sm font-bold bg-white px-4 py-2.5 border border-slate-200 rounded-xl shadow-xs text-slate-600 self-start md:self-auto flex items-center gap-2">
            Total Saved: 
            <span className="text-white text-xs bg-amber-500 px-2.5 py-0.5 rounded-full font-black">
              {favoriteRecipes.length}
            </span>
          </div>
        </div>

        {/* Empty State vs Grid Renderer */}
        {favoriteRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-16 shadow-xs">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl mb-5">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your custom cookbook is empty</h3>
            <p className="text-sm text-slate-400 font-medium max-w-xs mt-2 mb-8 leading-relaxed">
              You haven't bookmarked any recipes yet. Explore shared community profiles to populate this timeline!
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-amber-500 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <span>Explore Active Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Pure Tailwind CSS Grid Layer Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <div 
                key={recipe._id} 
                className="group bg-white border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full relative"
              >
                {/* Clickable Image & Title Area Link */}
                <Link href={`/recipes/${recipe._id}`} className="block flex-1 flex flex-col">
                  {/* Recipe Image Wrapper */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <span className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs">
                      {recipe.category || "Recipe"}
                    </span>
                    
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"}
                      alt={recipe.recipeName || "Recipe"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable="false"
                    />
                  </div>

                  {/* Text Information Headers */}
                  <div className="p-5 flex flex-col flex-1 items-start gap-1">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-1">
                      {recipe.recipeName || "Untitled Recipe"}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      By {recipe.authorName || "Expert Chef"}
                    </p>
                  </div>
                </Link>

                {/* Card Action Controls & Metrics Footer */}
                <div className="mt-auto bg-slate-50/50 border-t border-slate-100 flex flex-col">
                  
                  {/* Meta Details Row */}
                  <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{recipe.preparationTime || "20"} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
                      <span>{recipe.difficultyLevel || "Medium"}</span>
                    </div>
                  </div>

                  {/* Actions Row Buttons Grid */}
                  <div className="px-5 pb-4 pt-1 flex gap-1.5">
                    {/* Saved Status Indicator */}
                    <div className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold bg-amber-500 border border-amber-500 text-white shadow-xs">
                      <Bookmark className="w-3 h-3 fill-white" />
                      <span>Saved</span>
                    </div>

                    {/* Quick Purchase Link Wrapper */}
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all duration-200"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>View</span>
                    </Link>

                    {/* Support Button Link */}
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold bg-emerald-600 border border-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
                    >
                      <Coins className="w-3 h-3" />
                      <span>Tip $2</span>
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}