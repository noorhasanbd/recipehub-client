"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, Plus, Edit3, Trash2, Eye, 
  Clock, Heart, Loader2, AlertCircle, ArrowUpDown
} from "lucide-react";
import { getRecipeByUserId } from "@/app/lib/actions/recipeActions/manageRecipes";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";
import { toast } from "react-toastify"; // 🌟 Import Toastify engine

export default function MyRecipesPage() {
  const router = useRouter();
  const { data: session, status } = authClient.useSession();
  
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Operational Layout States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Options: newest, oldest, likes
  const [isDeletingId, setIsDeletingId] = useState(null);

  useEffect(() => {
    async function loadUserInventory() {
      if (status === "loading") return;
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const targetUserId = session.user.id || session.user.sub;
        const result = await getRecipeByUserId(targetUserId);

        if (result && result.success && Array.isArray(result.data)) {
          setRecipes(result.data);
          setFilteredRecipes(result.data);
        } else {
          setError(result.error || "Failed to load your custom creations catalog.");
        }
      } catch (err) {
        console.error("Inventory tracking layer crashed:", err);
        setError("Database transaction pipeline timed out.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserInventory();
  }, [session, status]);

  // Combined Search and Sort processing pipeline engine
  useEffect(() => {
    let output = [...recipes];

    // 1. Apply Search Query Filter Match
    if (searchQuery.trim() !== "") {
      output = output.filter((r) =>
        r.recipeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Apply Dynamic State Ordering Constraints
    output.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "likes") {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      return 0;
    });

    setFilteredRecipes(output);
  }, [searchQuery, sortBy, recipes]);

  // 🌟 Clean Asynchronous Toastify Eviction Wrapper
  const handleRecipeEviction = async (recipeId) => {
    // Custom inline confirmation check (can optionally swap for a custom modal layout later)
    if (!confirm("Are you absolutely sure you want to remove this recipe from the catalog permanently?")) return;
    
    // Create the Promise container Toastify hooks into
    const performEviction = async () => {
      setIsDeletingId(recipeId);
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      
      const res = await fetch(`${SERVER_URL}/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Drop rows immediately from memory matrix coordinates
        setRecipes(prev => prev.filter(item => item._id !== recipeId));
        return data;
      } else {
        throw new Error(data.error || "Server rejected data row eviction.");
      }
    };

    // Fire the reactive toast cycle interface
    toast.promise(performEviction(), {
      pending: "Processing deletion request...",
      success: "🗑️ Recipe permanently removed from catalog.",
      error: {
        render({ data }) {
          return `❌ Error: ${data.message}`;
        }
      }
    }).finally(() => {
      setIsDeletingId(null);
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Streaming your workspace details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Recipe Management Workspace</h1>
          <p className="text-xs text-slate-400 mt-0.5">Filter, audit, or alter records directly inside your system inventory.</p>
        </div>
        <Link 
          href="/dashboard/user/add-recipe" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shadow-orange-500/10"
        >
          <Plus className="w-4 h-4" /> Add New Recipe
        </Link>
      </div>

      {/* Simplified Filter Section with Search Bar and Sorting Options Only */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        
        {/* Search Text Block Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search matching recipes or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
          />
        </div>

        {/* Sort Select Dropdown Menu Frame */}
        <div className="relative w-full sm:w-48 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 font-bold focus:outline-hidden focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option value="newest">Newest Uploaded</option>
            <option value="oldest">Oldest Uploaded</option>
            <option value="likes">Most Appreciated</option>
          </select>
        </div>

      </div>

      {/* Main Table Interface Component Layer */}
      {error ? (
        <div className="p-5 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-xs font-semibold max-w-sm mx-auto text-center">
          <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-500" />
          {error}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl p-8 max-w-md mx-auto space-y-3">
          <div className="text-xl">📊</div>
          <p className="text-slate-800 text-sm font-bold">No Records Located</p>
          <p className="text-slate-400 text-xs">No entries found matching your search values.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold tracking-wider uppercase">
                  <th className="py-3.5 px-4 w-[380px]">Recipe Core Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Cooking Time</th>
                  <th className="py-3.5 px-4">Stats</th>
                  <th className="py-3.5 px-4 text-right pr-6">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-slate-50/70 transition-colors group">
                    
                    {/* Column 1: Image & Name Description */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-11 h-11 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <Image
                          src={recipe.recipeImage || "/api/placeholder/400/300"}
                          alt={recipe.recipeName || "Recipe snapshot"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate max-w-[280px]">
                        <p className="font-bold text-slate-800 truncate group-hover:text-orange-500 transition-colors">
                          {recipe.recipeName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">ID: {recipe._id}</p>
                      </div>
                    </td>

                    {/* Column 2: Category Badge Tag */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                        {recipe.category || "General"}
                      </span>
                    </td>

                    {/* Column 3: Prep Timing */}
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>{recipe.preparationTime || "30"} mins</span>
                      </div>
                    </td>

                    {/* Column 4: Likes Analytics Counter */}
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-50" />
                        <span>{recipe.likesCount || 0}</span>
                      </div>
                    </td>

                    {/* Column 5: Operational Action Elements */}
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link 
                          href={`/recipes/${recipe._id}`}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
                          title="Preview Entry"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/dashboard/user/my-recipes/edit/${recipe._id}`}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                          title="Modify Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        
                        {/* Interactive Deletion Button Frame */}
                        <button 
                          disabled={isDeletingId !== null}
                          onClick={() => handleRecipeEviction(recipe._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-40 min-w-[32px] flex items-center justify-center"
                          title="Drop Item"
                        >
                          {isDeletingId === recipe._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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