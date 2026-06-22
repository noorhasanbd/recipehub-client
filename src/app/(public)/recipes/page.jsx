"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes";
import RecipeCard from "@/components/RecipeCard";


export default function BrowseRecipesPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        const result = await getAllRecipes({ page: 1, limit: 1000 });

        if (result && result.success && Array.isArray(result.data)) {
          setAllRecipes(result.data);
          setFilteredRecipes(result.data);

          const uniqueCategories = [
            ...new Set(
              result.data.map((r) => r.category).filter((cat) => cat && cat.trim() !== "")
            )
          ];
          setCategories(uniqueCategories);
        } else {
          setError("Data field array wrapper missing from API response.");
        }
      } catch (err) {
        setError("Database communication error.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = allRecipes.filter((recipe) => {
      const name = (recipe.recipeName || "").toLowerCase();
      const author = (recipe.authorName || "").toLowerCase();
      
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        author.includes(searchQuery.toLowerCase()) ||
        (Array.isArray(recipe.ingredients) && 
          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === "" || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "" || recipe.difficultyLevel === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    setFilteredRecipes(filtered);
  }, [searchQuery, selectedCategory, selectedDifficulty, allRecipes]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Explore <span className="text-orange-500">Culinary Creations</span>
          </h1>
          <p className="text-base text-slate-500">Search hundreds of designer recipes compiled globally.</p>
        </div>

        {/* Search and Advanced Controls Filter Bar */}
        <div className="bg-white border border-slate-100 p-4 sm:p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by recipe, chef, or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm font-medium transition-all"
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider px-2 hidden lg:flex">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Filters</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-44 px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full sm:w-44 px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Render Switch */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
            <p className="text-sm text-slate-500 font-medium">Gathering our world recipes collection...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-bold">Catalog Sync Interrupted</p>
            <p className="text-xs text-red-500/80 mt-1">{error}</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl max-w-lg mx-auto p-8 space-y-5">
            <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-2xl">🔍</div>
            <p className="text-slate-800 font-bold text-lg">No Recipes Match Your Filters</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedDifficulty(""); }}
              className="bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Render Loop passing properties clean down to our modular card */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}