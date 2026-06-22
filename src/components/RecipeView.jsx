"use client";

import React from "react";
import { 
  Clock, 
  BarChart, 
  Heart, 
  User, 
  Mail, 
  Calendar, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Utensils 
} from "lucide-react";

export default function RecipeView({ recipe, onBack, backText = "Back" }) {
  if (!recipe) return null;

  const formattedDate = recipe.createdAt 
    ? new Date(recipe.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Recently Added";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Reusable Action Back Button */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {backText}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Media Container & Core Metadata Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-video sm:aspect-square bg-slate-200 rounded-3xl overflow-hidden border border-slate-100 shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"} 
                alt={recipe.recipeName}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              {recipe.isFeatured && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white" /> Featured Recipe
                </div>
              )}
              <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm border border-white/20">
                <span className={`w-2 h-2 rounded-full ${recipe.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                {recipe.status ? recipe.status.toUpperCase() : "ACTIVE"}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center p-2 border-r border-slate-100">
                <Clock className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-400 font-medium">Prep Time</span>
                <span className="text-sm font-bold text-slate-800">{recipe.preparationTime} mins</span>
              </div>
              <div className="flex flex-col items-center p-2 border-r border-slate-100">
                <BarChart className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-400 font-medium">Difficulty</span>
                <span className="text-sm font-bold text-slate-800">{recipe.difficultyLevel}</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10 mb-1" />
                <span className="text-xs text-slate-400 font-medium">Likes</span>
                <span className="text-sm font-bold text-slate-800">{recipe.likesCount || 0}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content Matrices */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-lg">
                    {recipe.category}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-lg">
                    {recipe.cuisineType}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {recipe.recipeName}
                </h1>
              </div>

              <hr className="border-slate-100" />

              {/* Author Metadata Cards */}
              <div className="bg-slate-50/70 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Author: <strong className="text-slate-800">{recipe.authorName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">Email: <span className="text-slate-700">{recipe.authorEmail}</span></span>
                  </div>
                </div>
                <div className="space-y-2 sm:border-l sm:border-slate-200/60 sm:pl-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-slate-400" />
                    <span>ID Reference: <span className="text-slate-500 font-mono">{recipe.authorId}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Created: <span className="text-slate-700">{formattedDate}</span></span>
                  </div>
                </div>
              </div>

              {/* Ingredients Mapping */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-orange-500 rounded-sm"></span>
                  Ingredients Required
                </h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50/40 border border-slate-100 p-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No explicit raw ingredients parameters specified.</p>
                )}
              </div>

              {/* Instructions Ordered Array List */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-orange-500 rounded-sm"></span>
                  Preparation Instructions
                </h2>
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-4 items-start group">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-slate-400 italic">No structured recipe steps mapped for this record item.</p>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}