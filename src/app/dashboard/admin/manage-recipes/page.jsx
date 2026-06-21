"use client";

import React, { useState } from "react";
import { Star, Edit2, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function ManageRecipes({ onNavigateToAdd, onNavigateToEdit }) {
  // Mock data utilizing your exact schema structural layout
  const [recipes, setRecipes] = useState([
    { 
      id: "r1", 
      recipeName: "Authentic Tonkotsu Ramen", 
      authorName: "Chef Kenji", 
      category: "Noodles", 
      cuisineType: "Japanese",
      difficultyLevel: "Hard",
      preparationTime: "720", // in minutes
      isFeatured: true 
    },
    { 
      id: "r2", 
      recipeName: "Fluffy Souffle Pancakes", 
      authorName: "Aria Montgomery", 
      category: "Breakfast", 
      cuisineType: "Japanese",
      difficultyLevel: "Medium",
      preparationTime: "30",
      isFeatured: false 
    },
  ]);

  const toggleFeatured = (id) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure you want to completely erase this recipe?")) {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Recipes</h1>
          <p className="text-sm text-slate-400">Edit data records, erase system policy violations, and feature items on the homepage.</p>
        </div>
        <Link href= "manage-recipes/add-recipe" 
          // onClick={onNavigateToAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-98 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Recipe
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <th className="p-4">Recipe Summary</th>
                <th className="p-4">Category / Cuisine</th>
                <th className="p-4">Metrics</th>
                <th className="p-4">Featured Placement</th>
                <th className="p-4 text-right">System Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-slate-50/50 transition-colors">
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
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleFeatured(recipe.id)}
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
                        onClick={() => onNavigateToEdit(recipe.id)}
                        className="p-2 border border-gray-200 text-slate-500 rounded-xl hover:text-orange-500 hover:border-orange-200 bg-white transition-all active:scale-95" 
                        title="Edit Recipe"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(recipe.id)} 
                        className="p-2 border border-gray-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 bg-white transition-all active:scale-95" 
                        title="Delete Recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}