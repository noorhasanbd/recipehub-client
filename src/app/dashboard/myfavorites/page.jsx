import React from "react";
import Link from "next/link";
import { FolderHeart, Utensils, ArrowRight } from "lucide-react";
import { getUserFavorites } from "@/app/lib/actions/recipeActions/favoriteActions";
import RecipeCard from "@/components/RecipeCard"; // Adjust this path to match your file structure

// Forces Next.js to fetch fresh database states on every layout hit
export const dynamic = "force-dynamic";

export default async function MyFavoritesPage() {
  // 1. Fetch data directly from your new dedicated favorites collection on the server
  const response = await getUserFavorites();
  const favoriteRecipes = response.success ? response.data : [];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FolderHeart className="w-7 h-7 text-amber-500" />
              My Saved Favorites
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Your curated collection of handpicked culinary masterpieces.
            </p>
          </div>
          
          <div className="text-xs sm:text-sm font-bold bg-white px-4 py-2 border border-slate-100 rounded-xl shadow-xs text-slate-600 self-start md:self-auto">
            Total Saved: <span className="text-amber-500 text-base ml-1">{favoriteRecipes.length}</span>
          </div>
        </div>

        {/* Empty State Layout */}
        {favoriteRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-12 shadow-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-full mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your cookbook is empty</h3>
            <p className="text-sm text-slate-400 font-medium max-w-xs mt-2 mb-6">
              You haven't added any recipes to your favorites collection yet. Explore our community recipes to start saving!
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-500 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <span>Browse Community Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Grid Content Layer Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe} 
                isLoggedIn={true} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}