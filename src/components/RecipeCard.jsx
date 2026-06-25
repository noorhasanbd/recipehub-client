"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@heroui/react";
import { Clock, BarChart3, Heart, Bookmark, MoreVertical, ShieldAlert, Ban, AlertTriangle } from "lucide-react";
import { createRecipeReport } from "@/app/lib/actions/recipeActions/UserRecipeReport";
// 🌟 UPDATED: Imports your server actions to fetch lists and toggle entries
import { toggleFavoriteRecipe, getUserFavorites } from "@/app/lib/actions/recipeActions/favoriteActions";

export default function RecipeCard({ recipe, isLoggedIn = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likesCount || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 🌟 NEW: Fetch the user's favorites catalog on mount to determine the active state
  useEffect(() => {
    if (!isLoggedIn) return;

    async function checkFavoriteStatus() {
      try {
        const res = await getUserFavorites();
        if (res.success && Array.isArray(res.data)) {
          // Check if this recipe's ID exists inside the returned favorites collection list
          const matchFound = res.data.some((fav) => fav._id === recipe._id);
          setIsFavorited(matchFound);
        }
      } catch (err) {
        console.error("Failed fetching initial card favorite validation data:", err);
      }
    }

    checkFavoriteStatus();
  }, [recipe._id, isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Please log in to save recipes to your favorites catalog!");
      return;
    }

    if (isFavoriting) return;

    // Optimistic UI update
    setIsFavorited((prev) => !prev);
    setIsFavoriting(true);

    try {
      // Targets the new dedicated collection route on your Express server
      const result = await toggleFavoriteRecipe(recipe._id);
      if (!result.success) {
        setIsFavorited((prev) => !prev); // Revert status if server mutation fails
        alert(`Failed to save favorite: ${result.error}`);
      }
    } catch (err) {
      setIsFavorited((prev) => !prev); // Revert status on crash
      alert("Network exception updating bookmark metrics.");
    } finally {
      setIsFavoriting(false);
    }
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReportRecipe = async (e, reportReason) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    
    try {
      const result = await createRecipeReport(recipe._id, recipe.recipeName, reportReason);
      if (result.success) {
        alert("Thank you for keeping our platform safe. This recipe has been flagged for review.");
      } else {
        alert(`Report failed: ${result.error}`);
      }
    } catch (err) {
      alert("Network exception occurred sending report parameters down context lines.");
    }
  };

  return (
    <Link 
      href={`/recipes/${recipe._id}`}
      className="block group outline-hidden relative"
    >
      <Card className="h-full border border-gray-100/70 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Recipe Image Wrapper */}
        <Card.Content className="p-0 relative h-48 w-full overflow-hidden bg-slate-100">
          
          {/* Category Tag */}
          <span className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs">
            {recipe.category || "Recipe"}
          </span>

          {/* Display three-dot menu option if user is logged in */}
          {isLoggedIn && (
            <div className="absolute top-3 right-3 z-20" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="p-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-slate-600 hover:text-slate-900 shadow-xs transition-colors outline-hidden focus:ring-2 focus:ring-orange-500/20"
                aria-label="Recipe options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                    Report Recipe
                  </div>

                  <button
                    onClick={(e) => handleReportRecipe(e, "Spam")}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2 transition-colors outline-hidden"
                  >
                    <Ban className="w-3.5 h-3.5 text-slate-400" />
                    <span>Spam</span>
                  </button>

                  <button
                    onClick={(e) => handleReportRecipe(e, "Offensive Content")}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2 transition-colors outline-hidden"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>Offensive Content</span>
                  </button>

                  <button
                    onClick={(e) => handleReportRecipe(e, "Copyright Issue")}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2 transition-colors outline-hidden"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copyright Issue</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"}
            alt={recipe.recipeName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable="false"
          />
        </Card.Content>

        {/* Text Header Metadata Section */}
        <Card.Header className="px-5 pt-5 pb-3 flex flex-col items-start gap-1">
          <Card.Title className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-1">
            {recipe.recipeName}
          </Card.Title>
          <Card.Description className="text-xs text-slate-400 font-medium">
            By {recipe.authorName || "Expert Chef"}
          </Card.Description>
        </Card.Header>

        {/* Card bottom footer content area container */}
        <div className="mt-auto bg-slate-50/50 border-t border-gray-50 flex flex-col">
          
          {/* Metadata Grid Specs Row */}
          <Card.Footer className="px-5 pt-3.5 pb-2.5 flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{recipe.preparationTime || "20"} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
              <span>{recipe.difficultyLevel || "Medium"}</span>
            </div>
            
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors border outline-hidden ${
                isLiked 
                  ? "bg-rose-50 border-rose-100 text-rose-600" 
                  : "bg-slate-100/70 border-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? "fill-rose-600 stroke-rose-600" : ""}`} 
              />
              <span>{likesCount}</span>
            </button>
          </Card.Footer>

          {/* ACTION BUTTON PANEL */}
          <div className="px-5 pb-4 pt-1">
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-200 outline-hidden tracking-wide disabled:opacity-70 border ${
                isFavorited 
                  ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:border-amber-600 shadow-xs" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorited ? "fill-white" : ""}`} />
              <span>{isFavorited ? "Saved to Favorites" : "Add to Favorites"}</span>
            </button>
          </div>

        </div>

      </Card>
    </Link>
  );
}