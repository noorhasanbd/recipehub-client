"use client";

import React, { useState, useEffect } from "react";
import { Star, Edit2, Trash2, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
// Import your server actions here:

import { getAllRecipes, updateRecipeAction, deleteRecipeAction } from "@/app/lib/actions/recipeActions/manageRecipes"; 

export default function ManageRecipes({ onNavigateToAdd, onNavigateToEdit }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // Calls the Server Action when the page changes
  useEffect(() => {
    async function loadRecipes() {
      setIsLoading(true);
      const result = await getAllRecipes({ page: currentPage, limit: itemsPerPage });
      
      if (result.success) {
        setRecipes(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalItems(result.pagination.totalItems);
      } else {
        setError(result.error || "Failed to pull live recipe records from database");
      }
      setIsLoading(false);
    }
    
    loadRecipes();
  }, [currentPage]);

  const toggleFeatured = async (id) => {
    const previousRecipes = [...recipes];
    const targetRecipe = recipes.find(r => r._id === id);
    if (!targetRecipe) return;
    const updatedFeaturedState = !targetRecipe.isFeatured;

    // Optimistic UI update
    setRecipes(recipes.map(r => r._id === id ? { ...r, isFeatured: updatedFeaturedState } : r));
    
    try {
      // Call your Server Action here instead of fetch()
      // await updateRecipeAction(id, { isFeatured: updatedFeaturedState });
    } catch (err) {
      setRecipes(previousRecipes);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to completely erase this recipe?")) {
      const previousRecipes = [...recipes];
      setRecipes(recipes.filter(r => r._id !== id));
      try {
        // Call your Server Action here instead of fetch()
        // await deleteRecipeAction(id);
        
        if (recipes.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (err) {
        setRecipes(previousRecipes);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Recipes</h1>
          <p className="text-sm text-slate-400">Edit data records, erase system policy violations, and feature items on the homepage.</p>
        </div>
        <Link href="manage-recipes/add-recipe" 
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-98 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Recipe
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl shadow-xl min-h-[300px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
          <p className="text-sm text-slate-500 font-medium">Connecting to MongoDB ecosystem...</p>
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
                  {recipes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 text-sm font-medium">
                        No documents found in the cluster collection.
                      </td>
                    </tr>
                  ) : (
                    recipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{recipe.recipeName}</p>
                          <p className="text-xs text-slate-400">By {recipe.authorName}</p>
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
                            <button 
                              onClick={() => onNavigateToEdit(recipe._id)}
                              className="p-2 border border-gray-200 text-slate-500 rounded-xl hover:text-orange-500 hover:border-orange-200 bg-white transition-all active:scale-95" 
                              title="Edit Recipe"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(recipe._id)} 
                              className="p-2 border border-gray-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 bg-white transition-all active:scale-95" 
                              title="Delete Recipe"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* UI Pagination Element Controls */}
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-4 shadow-md">
            <p className="text-xs font-medium text-slate-400">
              Showing <span className="text-slate-700 font-bold">{recipes.length}</span> of <span className="text-slate-700 font-bold">{totalItems}</span> total recipe documents.
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