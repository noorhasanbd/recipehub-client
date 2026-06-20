"use client";

import React, { useState } from "react";
import { Star, Edit2, Trash2, Eye } from "lucide-react";

export default function ManageRecipes() {
  // Mock recipes array database response
  const [recipes, setRecipes] = useState([
    { id: "r1", title: "Authentic Tonkotsu Ramen", creator: "Chef Kenji", category: "Japanese", isFeatured: true },
    { id: "r2", title: "Fluffy Souffle Pancakes", creator: "Aria Montgomery", category: "Breakfast", isFeatured: false },
    { id: "r3", title: "Smoked Wagyu Brisket", creator: "Barbecue Bob", category: "BBQ", isFeatured: false },
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Recipes</h1>
        <p className="text-sm text-slate-500">Edit info, erase policy violations, and feature items on the homepage.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
              <th className="p-4">Recipe Summary</th>
              <th className="p-4">Category</th>
              <th className="p-4">Featured Placement</th>
              <th className="p-4 text-right">System Configuration Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{recipe.title}</p>
                  <p className="text-xs text-slate-400">By {recipe.creator}</p>
                </td>
                <td className="p-4 text-slate-500 font-medium">{recipe.category}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleFeatured(recipe.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      recipe.isFeatured 
                        ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" 
                        : "bg-white text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${recipe.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                    {recipe.isFeatured ? "Featured" : "Regular"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    <button className="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:text-orange-500 hover:border-orange-200 bg-white transition-colors" title="Edit Recipe">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(recipe.id)} className="p-1.5 border border-slate-200 text-slate-400 rounded-lg hover:text-red-600 hover:border-red-200 bg-white transition-colors" title="Delete Recipe">
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
  );
}