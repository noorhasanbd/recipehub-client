"use client";

import React, { useState, useEffect } from "react";

import { BookOpen, Heart, Award, Utensils, Loader2, Sparkles, UserX } from "lucide-react";
import { getRecipeByUserId } from "@/app/lib/actions/recipeActions/manageRecipes";
import RecipeCard from "@/components/RecipeCard";
import { authClient } from "@/app/lib/auth-client";

export default function UserOverview() {
  const { data: session, status } = authClient.useSession(); // 🌟 Extract live logged-in session context
  
  const [userStats, setUserStats] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserDashboardData() {
      // Wait for session loading status to resolve completely
      if (status === "loading") return;

      // Guard check: Handle unauthenticated or empty session state gracefully
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 🌟 Query MongoDB using the authenticated user's ID from session payload
        // (Handles next-auth setups fallback to .id or .sub depending on your schema configuration)
        const targetUserId = session.user.id || session.user.sub;
        const result = await getRecipeByUserId(targetUserId);

        console.log(result, "recipe by user id");

        if (result && result.success && Array.isArray(result.data)) {
          const personalRecipes = result.data;
          
          // Calculate Metrics
          const totalCreated = personalRecipes.length;
          
          const totalLikesReceived = personalRecipes.reduce(
            (acc, curr) => acc + (curr.likesCount || curr.likes || 0), 
            0
          );

          const uniqueCategoriesCount = [
            ...new Set(personalRecipes.map((r) => r.category).filter(Boolean))
          ].length;

          setMyRecipes(personalRecipes);

          // Populate UI Cards Matrix
          setUserStats([
            { label: "My Recipes", value: totalCreated, icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Total Appreciations", value: totalLikesReceived, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Cuisines Explored", value: uniqueCategoriesCount, icon: Utensils, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Chef Tier", value: totalCreated > 5 ? "Elite" : "Novice", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
          ]);
        } else {
          setError(result.error || "Failed to parse recipe portfolio fields from database layer.");
        }
      } catch (err) {
        console.error("User overview collection fetch failure:", err);
        setError("Network connection timeout with MongoDB cluster endpoints.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDashboardData();
  }, [session, status]); // Trigger re-run as soon as session changes or mounts

  // 1. Loading State Hook Segment
  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Assembling your culinary workstation...</p>
      </div>
    );
  }

  // 2. Access Guard Denied State Segment
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 max-w-md mx-auto space-y-3">
        <div className="p-3 bg-red-50 text-red-600 rounded-full">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Access Denied</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please log in to view your dashboard system metrics, metrics summaries, and personal recipe catalog entries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      
      {/* Welcome Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="relative space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back to your workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Happy Cooking, <span className="text-orange-400">{session.user.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md leading-relaxed">
            Manage your published recipes, view community metrics tracking, and monitor your global flavor engagements.
          </p>
        </div>
      </div>

      {/* Statistics Card Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {userStats.map((stat, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Personal Submissions Grid Stage */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Published Collections</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your catalog updates synchronously with platform client changes.</p>
        </div>

        {error ? (
          <div className="p-5 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-xs font-semibold max-w-sm text-center">
            {error}
          </div>
        ) : myRecipes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl p-8 max-w-md mx-auto space-y-4">
            <div className="mx-auto w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-xl">
              🍳
            </div>
            <div className="space-y-1">
              <p className="text-slate-800 font-bold">No Personal Creations Yet</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                You haven't added any of your culinary specialties to our shared hub database logs yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} isLoggedIn={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}