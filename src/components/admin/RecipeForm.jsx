"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image, Clock } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
// 🌟 THE FIX: Import your frontend Better Auth client instance


export default function RecipeForm({ initialData = null, onSubmit, onCancel }) {
  // Check if we are modifying an existing recipe or staging a blank canvas
  const isEditMode = !!initialData;

  // Track dynamic list configurations inside decoupled client arrays
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  
  // Local state to safely hold user session attributes on the client side
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch the active user session data cleanly on mount
  useEffect(() => {
    async function fetchUserSession() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setCurrentUser(session.data.user);
      }
    }
    fetchUserSession();
  }, []);

  // Pre-seed array contexts if data is supplied via editing wrappers
  useEffect(() => {
    if (initialData?.ingredients?.length) setIngredients(initialData.ingredients);
    if (initialData?.instructions?.length) setInstructions(initialData.instructions);
  }, [initialData]);

  // Ingredient dynamic field mutators
  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  // Instruction dynamic step mutators
  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleRemoveInstruction = (index) => {
    if (instructions.length > 1) setInstructions(instructions.filter((_, i) => i !== index));
  };
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Assembles your exact schema blueprint structure smoothly
    const payload = {
      recipeName: formData.get("recipeName"),
      recipeImage: formData.get("recipeImage"),
      category: formData.get("category"),
      cuisineType: formData.get("cuisineType"),
      difficultyLevel: formData.get("difficultyLevel"),
      preparationTime: Number(formData.get("preparationTime")),
      ingredients: ingredients.filter(i => i.trim() !== ""),
      instructions: instructions.filter(i => i.trim() !== ""),
      
      // Preserves state parameters instead of losing them on updates
      isFeatured: initialData ? initialData.isFeatured : false,
      status: initialData ? initialData.status : "Published",
      likesCount: initialData ? initialData.likesCount : 0,

      // 🌟 THE CRITICAL SECURITY CORRECTION:
      // Uses the active user profile data, falling back to admin only if no session exists.
      authorId: initialData?.authorId || currentUser?.id || "usr_admin_77",
      authorName: initialData?.authorName || currentUser?.name || "Chef Administrator",
      authorEmail: initialData?.authorEmail || currentUser?.email || "admin@recipehub.com",

      // Pass down user session mapping to backend payload for validation
      clientUser: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      } : null
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      
      {/* Core Fields Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
            Recipe Title
          </label>
          <input 
            type="text" 
            required 
            name="recipeName" 
            defaultValue={initialData?.recipeName || ""}
            placeholder="e.g., Creamy Tuscan Chicken"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none"
          />
        </div>

        <div className="w-full">
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
            Recipe Asset Image URL
          </label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all bg-white">
            <Image className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="url" 
              required 
              name="recipeImage" 
              defaultValue={initialData?.recipeImage || ""}
              placeholder="https://example.com/image.jpg"
              className="grow text-sm bg-transparent outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Meta Specs Directory Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">Category</label>
          <input type="text" required name="category" defaultValue={initialData?.category || ""} placeholder="Dessert, Pasta..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-orange-500 outline-none"/>
        </div>

        <div>
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">Cuisine Origin</label>
          <input type="text" required name="cuisineType" defaultValue={initialData?.cuisineType || ""} placeholder="Italian, Mexican..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-orange-500 outline-none"/>
        </div>

        <div>
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">Complexity</label>
          <select name="difficultyLevel" defaultValue={initialData?.difficultyLevel || "Medium"} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-orange-500 outline-none bg-white">
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">Prep Time (Mins)</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
            <Clock className="w-4 h-4 text-slate-400" />
            <input type="number" required min="1" name="preparationTime" defaultValue={initialData?.preparationTime || ""} placeholder="45" className="w-full text-sm outline-none bg-transparent"/>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Dynamic Ingredients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-bold text-xs text-slate-700 uppercase tracking-wider">Ingredients List</label>
          <button type="button" onClick={handleAddIngredient} className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Ingredient
          </button>
        </div>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2">
            <input 
              type="text" required value={ingredient} placeholder={`Ingredient #${index + 1}`}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-orange-500 outline-none"
            />
            <button 
              type="button" disabled={ingredients.length === 1} onClick={() => handleRemoveIngredient(index)}
              className="p-2.5 text-slate-300 hover:text-red-500 rounded-xl border border-transparent hover:border-red-100 transition-all disabled:opacity-30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Preparation Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-bold text-xs text-slate-700 uppercase tracking-wider">Preparation Steps</label>
          <button type="button" onClick={handleAddInstruction} className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>
        {instructions.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="bg-slate-100 text-slate-500 font-bold text-xs h-9 w-9 flex items-center justify-center rounded-xl shrink-0 mt-0.5">
              {index + 1}
            </span>
            <textarea 
              rows="2" required value={step} placeholder={`Describe conversion details processing...`}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-orange-500 outline-none resize-none"
            />
            <button 
              type="button" disabled={instructions.length === 1} onClick={() => handleRemoveInstruction(index)}
              className="p-2.5 text-slate-300 hover:text-red-500 rounded-xl border border-transparent hover:border-red-100 transition-all disabled:opacity-30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Form Submission Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button 
          type="button" onClick={onCancel}
          className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-orange-500/10 transition-all active:scale-98"
        >
          {isEditMode ? "Save Changes" : "Publish Recipe"}
        </button>
      </div>

    </form>
  );
}