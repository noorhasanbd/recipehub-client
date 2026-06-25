"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Spinner } from "@heroui/react";
import { Clock, BarChart3, Heart, Bookmark, MoreVertical, ShieldAlert, Ban, AlertTriangle, Coins, ShoppingBag } from "lucide-react";
import { authClient } from "@/app/lib/auth-client"; // 🌟 Importing your auth framework
import { createRecipeReport } from "@/app/lib/actions/recipeActions/UserRecipeReport";
import { toggleFavoriteRecipe, getUserFavorites } from "@/app/lib/actions/recipeActions/favoriteActions";
import { getUserPurchases } from "@/app/lib/actions/recipeActions/purchaseActions";

export default function RecipeCard({ recipe, isLoggedIn = false }) {
  // 🌟 Fetch session context directly inside the card to auto-grab id and email
  const { data: session } = authClient.useSession();
  const activeUserId = session?.user?.id;
  const activeUserEmail = session?.user?.email;

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe.likesCount || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  
  // Track purchase/ownership validation status
  const [isPurchased, setIsPurchased] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const menuRef = useRef(null);

  // Fetch initial interaction data arrays on component mount
  useEffect(() => {
    if (!isLoggedIn) return;

    async function checkCardValidationData() {
      try {
        // 1. Evaluate Favorites Status
        const favRes = await getUserFavorites();
        if (favRes.success && Array.isArray(favRes.data)) {
          const matchFound = favRes.data.some((fav) => fav._id === recipe._id);
          setIsFavorited(matchFound);
        }

        // 2. Evaluate Purchased Collection Status
        const purchaseRes = await getUserPurchases();
        if (purchaseRes.success && Array.isArray(purchaseRes.data)) {
          const ownershipFound = purchaseRes.data.some((p) => p.recipeId === recipe._id || p._id === recipe._id);
          setIsPurchased(ownershipFound);
        }
      } catch (err) {
        console.error("Failed fetching initial card validation database matrices:", err);
      }
    }

    checkCardValidationData();
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

    setIsFavorited((prev) => !prev);
    setIsFavoriting(true);

    try {
      const result = await toggleFavoriteRecipe(recipe._id);
      if (!result.success) {
        setIsFavorited((prev) => !prev);
        alert(`Failed to save favorite: ${result.error}`);
      }
    } catch (err) {
      setIsFavorited((prev) => !prev);
      alert("Network exception updating bookmark metrics.");
    } finally {
      setIsFavoriting(false);
    }
  };

  // Launches Stripe Checkout for flat rate tipping via client endpoint
  const handleDonationClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDonating(true);

    try {
      const response = await fetch("/api/checkout/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe._id,
          recipeName: recipe.recipeName,
          recipeImage: recipe.recipeImage,
          price: 2.00,
          userId: activeUserId || "anonymous",
          type: "recipe_donation"
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Could not generate transaction window.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to reach Stripe checkout right now.");
    } finally {
      setIsDonating(false);
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

          {/* Three-dot menu option */}
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

          {/* THREE-COLUMN ACTIONS GRID */}
          <div className="px-5 pb-4 pt-1 flex gap-1.5">
            
            {/* Button 1: Save / Favorite Item */}
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 outline-hidden tracking-wide disabled:opacity-70 border ${
                isFavorited 
                  ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:border-amber-600 shadow-xs" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
              }`}
            >
              <Bookmark className={`w-3 h-3 ${isFavorited ? "fill-white" : ""}`} />
              <span>{isFavorited ? "Saved" : "Save"}</span>
            </button>

            {/* Button 2: Recipe Checkout Form Container */}
            <form 
              action="/api/purchase-recipe/checkout_sessions" 
              method="POST"
              onClick={(e) => e.stopPropagation()} 
              className="flex-1"
            >
              {/* 🌟 Automatically passing active session variables to form fields */}
              {activeUserId && <input type="hidden" name="user_id" value={activeUserId} />}
              {activeUserEmail && <input type="hidden" name="customer_email" value={activeUserEmail} />}
              
              <input type="hidden" name="recipe_id" value={recipe._id} />
              <input type="hidden" name="recipe_name" value={recipe.recipeName || "Premium Recipe Access"} />
              <input type="hidden" name="recipe_price" value={recipe.price || "4.99"} />
              {recipe.recipeImage && <input type="hidden" name="recipe_image" value={recipe.recipeImage} />}

              <button
                type="submit"
                disabled={isPurchased || !isLoggedIn}
                className={`w-full h-full flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 outline-hidden tracking-wide border ${
                  isPurchased 
                    ? "bg-orange-500 border-orange-500 text-white cursor-default" 
                    : !isLoggedIn
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500"
                }`}
              >
                <ShoppingBag className={`w-3 h-3 ${isPurchased ? "fill-white" : ""}`} />
                <span>{isPurchased ? "Owned" : `Buy`}</span>
              </button>
            </form>

            {/* Button 3: Tip / Support */}
            <button
              onClick={handleDonationClick}
              disabled={isDonating}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 outline-hidden tracking-wide bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700 shadow-xs disabled:opacity-75"
            >
              {isDonating ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  <Coins className="w-3 h-3" />
                  <span>Tip $2</span>
                </>
              )}
            </button>

          </div>

        </div>

      </Card>
    </Link>
  );
}