"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Clock, Link2, Upload, Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

// Securely pull the environment API key
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RecipeForm({ initialData = null, onSubmit, onCancel }) {
  const isEditMode = !!initialData;

  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [currentUser, setCurrentUser] = useState(null);

  // 🌟 Core state managers for the image selector toggle switch
  const [recipeImage, setRecipeImage] = useState("");
  const [imageInputMode, setImageInputMode] = useState("url"); // 'url' or 'upload'
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Fetch active user session
  useEffect(() => {
    async function fetchUserSession() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setCurrentUser(session.data.user);
      }
    }
    fetchUserSession();
  }, []);

  // Pre-seed arrays AND the image state if editing initial values
  useEffect(() => {
    if (initialData?.ingredients?.length) setIngredients(initialData.ingredients);
    if (initialData?.instructions?.length) setInstructions(initialData.instructions);
    if (initialData?.recipeImage) setRecipeImage(initialData.recipeImage);
  }, [initialData]);

  // ImgBB Upload Pipeline
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMGBB_API_KEY) {
      alert("Missing NEXT_PUBLIC_IMGBB_API_KEY environment configuration variable.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file format.");
      return;
    }

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success && data.data?.url) {
        setRecipeImage(data.data.url);
      } else {
        alert("Failed to parse response payload from cloud asset bucket.");
      }
    } catch (err) {
      console.error("ImgBB background process failure:", err);
      alert("Error sending image asset to ImgBB cloud cluster.");
    } finally {
      setIsUploadingFile(false);
    }
  };

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
    
    const payload = {
      recipeName: formData.get("recipeName"),
      // 🌟 Matches your state string value whether it was written or uploaded
      recipeImage: recipeImage, 
      category: formData.get("category"),
      cuisineType: formData.get("cuisineType"),
      difficultyLevel: formData.get("difficultyLevel"),
      preparationTime: Number(formData.get("preparationTime")),
      ingredients: ingredients.filter(i => i.trim() !== ""),
      instructions: instructions.filter(i => i.trim() !== ""),
      
      isFeatured: initialData ? initialData.isFeatured : false,
      status: initialData ? initialData.status : "Published",
      likesCount: initialData ? initialData.likesCount : 0,

      authorId: initialData?.authorId || currentUser?.id || "usr_admin_77",
      authorName: initialData?.authorName || currentUser?.name || "Chef Administrator",
      authorEmail: initialData?.authorEmail || currentUser?.email || "admin@recipehub.com",

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

        {/* 🌟 REFACTOR: IMAGE INPUT TOGGLE MODULE */}
        <div className="w-full space-y-2">
          <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider">
            Recipe Cover Image
          </label>
          
          {/* Segmented Control Buttons */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/40">
            <button
              type="button"
              onClick={() => setImageInputMode("url")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                imageInputMode === "url" 
                  ? "bg-white text-slate-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" /> Direct URL Link
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode("upload")}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                imageInputMode === "upload" 
                  ? "bg-white text-slate-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Local File Upload
            </button>
          </div>

          {/* Conditional Input UI Display Fields */}
          {imageInputMode === "url" ? (
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all bg-white animate-in fade-in duration-200">
              <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="url" 
                required={!recipeImage} // Mandatory only if an asset does not exist yet
                value={recipeImage}
                onChange={(e) => setRecipeImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="grow text-sm bg-transparent outline-none w-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl py-3 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors relative h-[46px]">
                {isUploadingFile ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    <span className="text-xs font-medium">Uploading to ImgBB...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">Choose file</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={isUploadingFile}
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>

              {recipeImage && (
                <img 
                  src={recipeImage} 
                  alt="Asset Preview" 
                  className="w-12 h-[46px] object-cover rounded-xl border border-gray-200 shrink-0"
                />
              )}
            </div>
          )}
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
          disabled={isUploadingFile}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold text-sm rounded-xl shadow-md shadow-orange-500/10 transition-all active:scale-98"
        >
          {isUploadingFile ? "Uploading image..." : isEditMode ? "Save Changes" : "Publish Recipe"}
        </button>
      </div>

    </form>
  );
}