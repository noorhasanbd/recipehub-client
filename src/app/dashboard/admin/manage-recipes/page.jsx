"use client";

import React, { useState, useEffect } from "react";
import { Star, Edit2, Trash2, Plus, Loader2, ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";
import Link from "next/link";
import { deleteRecipe, getAllRecipes, updateRecipe } from "@/app/lib/actions/recipeActions/manageRecipes";
import { toast } from "react-toastify"; // 🌟 Import Toastify engine

export default function ManageRecipes() {
  // Master state to store every single record from the database
  const [allRecipes, setAllRecipes] = useState([]);
  // State to hold the final sliced & filtered recipes displayed on the current page
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // 🌟 Loading track for deletion actions
  const [isDeletingId, setIsDeletingId] = useState(null);

  // 1. Initial Load: Grab everything from the database once
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const result = await getAllRecipes({ page: 1, limit: 1000 }); 
      
      if (result.success) {
        setAllRecipes(result.data);

        // Dynamically extract all unique categories from the entire database payload
        if (Array.isArray(result.data)) {
          const uniqueCategories = [
            ...new Set(
              result.data
                .map((recipe) => recipe.category)
                .filter((cat) => cat && cat.trim() !== "")
            )
          ];
          setCategories(uniqueCategories);
        }
      } else {
        setError(result.error || "Failed to pull recipe records from database");
      }
      setIsLoading(false);
    }
    
    loadInitialData();
  }, []);

  // 2. Frontend Filter, Search, and Pagination Engine
  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.recipeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.authorName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 if the search query or category filter changes so results aren't hidden
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate local client-side pagination values
  const totalItems = filteredRecipes.length;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);

  // Chunk the array locally depending on the active page index
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedRecipes(filteredRecipes.slice(indexOfFirstItem, indexOfLastItem));
  }, [allRecipes, searchQuery, selectedCategory, currentPage]);

 const toggleFeatured = async (id) => {
  // 1. Keep a snapshot of the current state for an optimistic UI update
  const previousRecipes = [...allRecipes];
  const targetRecipe = allRecipes.find(r => r._id === id);
  
  if (!targetRecipe) return;

  const nextFeaturedStatus = !targetRecipe.isFeatured;

  // 2. Optimistic Update: Change the UI state instantly so it feels snappy
  setAllRecipes(
    allRecipes.map((r) => (r._id === id ? { ...r, isFeatured: nextFeaturedStatus } : r))
  );
  
  try {
    // 3. Reuse your existing 'updateRecipe' Server Action
    // We pass the ID and only the specific payload property we want to change
    const result = await updateRecipe(id, { isFeatured: nextFeaturedStatus });

    if (result && result.success) {
      toast.success(
        nextFeaturedStatus 
          ? "🌟 Recipe added to featured placement!" 
          : "💼 Recipe moved to regular placement."
      );
    } else {
      // Server rejected it or auth failed -> Roll back UI state
      setAllRecipes(previousRecipes);
      toast.error(`❌ Update failed: ${result.error || "Server rejected transaction."}`);
    }
  } catch (err) {
    console.error("Feature toggle action crash:", err);
    // Network/structural failure -> Roll back UI state
    setAllRecipes(previousRecipes);
    toast.error("❌ An unexpected configuration error occurred.");
  }
};

  // 🌟 REFACTORED TO USE SERVER ACTIONS + REACT TOASTIFY
  const handleDelete = async (id) => {
    if (!confirm("Are you absolutely sure you want to remove this recipe from the catalog permanently?")) return;
    
    try {
      setIsDeletingId(id);
      
      // Execute Server Action
      const result = await deleteRecipe(id);

      if (result && result.success) {
        // Clear item from state list arrays immediately
        setAllRecipes((prev) => prev.filter((r) => r._id !== id));
        
        // Success Toast Notification
        toast.success("🗑️ Recipe successfully deleted from the database!");
      } else {
        // Failure Toast Notification
        toast.error(`❌ Deletion Error: ${result.error || "Server rejected transaction request."}`);
      }
    } catch (err) {
      console.error("[browser] Deletion operation failed:", err);
      toast.error("❌ An unexpected configuration or network error occurred.");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header layout block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Recipes</h1>
          <p className="text-sm text-slate-400">Edit data records, search parameters, and modify items on the homepage.</p>
        </div>
        <Link href="/dashboard/admin/manage-recipes/add-recipe" 
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-98 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Recipe
        </Link>
      </div>

      {/* Search Bar and Category Filter Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search recipes locally by name or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
          />
        </div>

        {/* Dynamic Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 transition-colors bg-white text-slate-700 font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl shadow-xl min-h-[300px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
          <p className="text-sm text-slate-500 font-medium">Loading live layout details...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-100 text-red-700 rounded-2xl shadow-md">
          <p className="font-bold text-sm">Database Sync Error</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                    <th className="p-4">Recipe Summary</th>
                    <th className="p-4">Category / Cuisine</th>
                    <th className="p-4">Metrics & Engagement</th>
                    <th className="p-4">Featured Placement</th>
                    <th className="p-4 text-right">System Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                  {displayedRecipes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 text-sm font-medium">
                        No recipe entries match your current search options.
                      </td>
                    </tr>
                  ) : (
                    displayedRecipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <Link 
                            href={`/dashboard/admin/manage-recipes/${recipe._id}`}
                            className="block group-hover:text-orange-500 transition-colors"
                          >
                            <p className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors decoration-orange-400 decoration-2 hover:underline">
                              {recipe.recipeName}
                            </p>
                            <p className="text-xs text-slate-400">By {recipe.authorName}</p>
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md mr-1">
                            {recipe.category}
                          </span>
                          <span className="inline-block bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                            {recipe.cuisineType}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-500 space-y-0.5">
                          <div>Complexity: <span className="font-semibold text-slate-700">{recipe.difficultyLevel}</span></div>
                          <div>Duration: <span className="font-semibold text-slate-700">{recipe.preparationTime} mins</span></div>
                          <div>Likes: <span className="font-semibold text-orange-600">{recipe.likesCount || 0}</span></div>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleFeatured(recipe._id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                              recipe.isFeatured 
                                ? "bg-orange-50 text-orange-600 border-orange-200 shadow-xs" 
                                : "bg-white text-slate-400 border-slate-200 hover:border-orange-300 hover:text-orange-500"
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${recipe.isFeatured ? "fill-orange-500 text-orange-500" : ""}`} />
                            {recipe.isFeatured ? "Featured" : "Regular"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            <Link 
                              href={`/dashboard/admin/manage-recipes/${recipe._id}`}
                              className="p-2 border border-gray-200 text-slate-500 rounded-xl hover:text-blue-500 hover:border-blue-200 bg-white transition-all active:scale-95"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <Link 
                              href={`/dashboard/admin/manage-recipes/edit/${recipe._id}`}
                              className="p-2 border border-gray-200 text-slate-500 rounded-xl hover:text-orange-500 hover:border-orange-200 bg-white transition-all active:scale-95" 
                              title="Edit Recipe"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            
                            {/* 🌟 Dynamic Deletion Button Frame with Spinner UI status checks */}
                            <button 
                              disabled={isDeletingId !== null}
                              onClick={() => handleDelete(recipe._id)} 
                              className="p-2 border border-gray-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 bg-white transition-all active:scale-95 min-w-[34px] flex items-center justify-center disabled:opacity-40" 
                              title="Delete Recipe"
                            >
                              {isDeletingId === recipe._id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* UI Pagination Controls */}
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-4 shadow-md">
            <p className="text-xs font-medium text-slate-400">
              Showing <span className="text-slate-700 font-bold">{displayedRecipes.length}</span> of <span className="text-slate-700 font-bold">{totalItems}</span> filtered results.
            </p>
            <div className="inline-flex gap-1.5 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="text-xs font-bold text-slate-600 px-3">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}