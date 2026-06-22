"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { 
  Clock, Heart, Utensils, Award, ChevronLeft, 
  Printer, Share2, CheckCircle2, User, Mail, Loader2 
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [recipe, setRecipe] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    async function fetchRecipeDetails() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch target single recipe record from your Express Node endpoint setup
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${SERVER_URL}/api/recipes/${id}`, {
          cache: "no-store"
        });

        if (!res.ok) throw new Error("Could not extract destination food documentation records.");
        
        const result = await res.json();
        if (result?.success && result.data) {
          setRecipe(result.data);
          setLikes(result.data.likesCount || 0);
        } else {
          setError("Failed to parse clean database object values.");
        }
      } catch (err) {
        console.error("Detail load runtime failure:", err);
        setError(err.message || "Cluster connection pipeline timeout.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipeDetails();
  }, [id]);

  const handleLikeIncrement = async () => {
    if (hasLiked) return;
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/recipes/${id}/like`, {
        method: "PATCH"
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likesCount ?? (likes + 1));
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Error patching live atomic interaction:", err);
    }
  };

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-semibold">Plating your presentation deck...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-16 bg-red-50 text-red-700 border border-red-100 rounded-3xl shadow-xs">
        <p className="font-black text-lg">Dish Unavailable</p>
        <p className="text-xs text-red-500/80 mt-1 mb-4">{error || "Recipe data signature could not be verified."}</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Navigation & Action Controls Breadcrumb */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Feed</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl shadow-xs hover:text-slate-800 transition-colors" title="Share Recipe">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => window.print()} className="p-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl shadow-xs hover:text-slate-800 transition-colors" title="Print Guide">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Media & Context Frame Group */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
          <Image 
            src={recipe.recipeImage || "/api/placeholder/800/600"} 
            alt={recipe.recipeName}
            fill
            priority
            className="object-cover"
          />
          {recipe.category && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-slate-800 text-xs font-black tracking-wide rounded-full shadow-sm uppercase">
              {recipe.category}
            </span>
          )}
        </div>

        {/* Recipe Title Box Context Descriptor Container */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight tracking-tight">
              {recipe.recipeName}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {recipe.description || "Indulge in this carefully crafted gastronomic creation assembled and formatted directly from our platform global culinary network."}
            </p>
          </div>

          {/* Quick Metrics Badge Dashboard Element */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-center space-y-1">
              <div className="flex justify-center text-orange-500"><Clock className="w-4 h-4" /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prep Time</p>
              <p className="text-sm font-black text-slate-700">{recipe.preparationTime || "20"} min</p>
            </div>
            <div className="text-center space-y-1 border-x border-slate-200/60">
              <div className="flex justify-center text-amber-500"><Award className="w-4 h-4" /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
              <p className="text-sm font-black text-slate-700 capitalize">{recipe.difficultyLevel || "Medium"}</p>
            </div>
            <div className="text-center space-y-1">
              <div className="flex justify-center text-emerald-500"><Utensils className="w-4 h-4" /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuisine</p>
              <p className="text-sm font-black text-slate-700 truncate capitalize px-1">{recipe.cuisineType || "General"}</p>
            </div>
          </div>

          {/* Atomic Like Component Matrix Trigger */}
          <button 
            onClick={handleLikeIncrement}
            disabled={hasLiked}
            className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 font-bold rounded-2xl transition-all duration-200 border transform active:scale-[0.99] ${
              hasLiked 
                ? "bg-rose-50 text-rose-600 border-rose-100 cursor-not-allowed" 
                : "bg-slate-900 text-white border-transparent hover:bg-slate-800 shadow-sm shadow-slate-900/10"
            }`}
          >
            <Heart className={`w-5 h-5 transition-transform ${hasLiked ? "fill-rose-500 text-rose-500 scale-110" : "group-hover:scale-110"}`} />
            <span>{hasLiked ? "Added to Appreciated Collections" : "Appreciate This Recipe"}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${hasLiked ? "bg-rose-200/50" : "bg-white/20"}`}>
              {likes}
            </span>
          </button>

          {/* Author Validation Profile Block Footer */}
          <div className="flex items-center gap-3.5 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-sm rounded-full flex items-center justify-center shadow-inner">
              {recipe.authorName ? recipe.authorName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Published By</p>
              <p className="text-sm font-black text-slate-800 truncate">{recipe.authorName || "Anonymous Chef"}</p>
              {recipe.authorEmail && (
                <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 flex-shrink-0" /> {recipe.authorEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 my-8" />

      {/* Main Preparation Ingredients and Steps Architecture Column Set */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Ingredients Card Blueprint Component Layout */}
        <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            🛒 Ingredients Matrix
          </h3>
          <p className="text-xs text-slate-400 font-medium">Click on items to cross them out while cooking.</p>
          <div className="divide-y divide-slate-50">
            {(recipe.ingredients || ["Ingredient entry data sequence missing"]).map((item, index) => (
              <label 
                key={index} 
                onClick={() => toggleIngredientCheck(index)}
                className={`flex items-start gap-3 py-3 cursor-pointer group transition-colors select-none ${
                  checkedIngredients[index] ? "text-slate-400" : "text-slate-700"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <CheckCircle2 className={`w-4 h-4 transition-colors ${
                    checkedIngredients[index] ? "text-emerald-500 fill-emerald-50/50" : "text-slate-200 group-hover:text-slate-300"
                  }`} />
                </div>
                <span className={`text-sm font-medium leading-tight ${checkedIngredients[index] ? "line-through decoration-slate-300 decoration-1.5" : ""}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Step-by-Step Directions Column Panel Component */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              🍳 Execution Instructions
            </h3>
            <p className="text-xs text-slate-400">Follow the steps chronologically for optimal results.</p>
          </div>

          <div className="space-y-4">
            {(recipe.instructions || ["Instruction documentation mapping strings missing from destination registry document."]).map((step, index) => (
              <div 
                key={index} 
                className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-200/80 hover:shadow-xs transition-all duration-200"
              >
                <div className="flex-shrink-0 w-7 h-7 bg-orange-50 border border-orange-100 text-orange-600 font-black text-xs rounded-lg flex items-center justify-center shadow-xs">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}