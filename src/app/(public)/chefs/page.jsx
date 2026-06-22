"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, Search, Trophy, Utensils, Heart, 
  Sparkles, Award, Medal, TrendingUp, UserCheck 
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes";
// import { getAllUsers } from "@/app/lib/actions/userActions/manageUsers";

export default function ChefLeaderboardPage() {
  const [chefs, setChefs] = useState([]);
  const [filteredChefs, setFilteredChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalRecipes: 0, totalLikes: 0, activeChefs: 0 });

  useEffect(() => {
    async function compileChefAnalytics() {
      try {
        setIsLoading(true);

        // 1. Concurrent Fetch Simulation
        const [recipesResult] = await Promise.all([
          getAllRecipes({ page: 1, limit: 10000 }),
          // getAllUsers({ page: 1, limit: 10000 })
        ]);

        if (recipesResult.success) {
          const allRecipes = Array.isArray(recipesResult.data) ? recipesResult.data : [];
          const chefMap = {};
          let globalLikes = 0;

          allRecipes.forEach((recipe) => {
            const chefIdentifier = recipe.authorName || "Anonymous Chef";
            const likes = recipe.likesCount || 0;
            globalLikes += likes;
            
            if (!chefMap[chefIdentifier]) {
              chefMap[chefIdentifier] = {
                name: chefIdentifier,
                avatar: recipe.authorAvatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200", 
                totalLikes: 0,
                recipeCount: 0,
                specialties: new Set(),
                mostPopularRecipe: { name: "", likes: -1 }
              };
            }

            chefMap[chefIdentifier].totalLikes += likes;
            chefMap[chefIdentifier].recipeCount += 1;
            
            if (recipe.category) {
              chefMap[chefIdentifier].specialties.add(recipe.category);
            }

            if (likes > chefMap[chefIdentifier].mostPopularRecipe.likes) {
              chefMap[chefIdentifier].mostPopularRecipe = {
                name: recipe.recipeName,
                likes: likes
              };
            }
          });

          // Form array and slice top tags
          const calculatedChefs = Object.values(chefMap).map(chef => ({
            ...chef,
            specialties: Array.from(chef.specialties).slice(0, 2)
          }));

          // 2. Sort by total likes descending
          calculatedChefs.sort((a, b) => b.totalLikes - a.totalLikes);

          setStats({
            totalRecipes: allRecipes.length,
            totalLikes: globalLikes,
            activeChefs: calculatedChefs.length
          });

          setChefs(calculatedChefs);
          setFilteredChefs(calculatedChefs);
        } else {
          toast.error("❌ Failed to pull analytics stream matrix layers.");
        }
      } catch (err) {
        console.error("Leaderboard component crash:", err);
        toast.error("❌ An unexpected tracking pipe configuration error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    compileChefAnalytics();
  }, []);

  // Filter Engine
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") {
      setFilteredChefs(chefs);
    } else {
      setFilteredChefs(chefs.filter(c => c.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, chefs]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-sm text-slate-400 font-semibold tracking-wide">Aggregating Global Creator Metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header Banner Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-orange-100" /> Platform Leaderboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Meet Our Master Chefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Discover and follow the creators driving community engagement. Ranked dynamically based on aggregate recipe likes.
          </p>
        </div>

        {/* Live Counter Analytics Blocks */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto min-w-[320px]">
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-center">
            <UserCheck className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider scale-90">Chefs</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{stats.activeChefs}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-center">
            <Utensils className="w-4 h-4 mx-auto text-orange-500 mb-1" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider scale-90">Recipes</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{stats.totalRecipes}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-center">
            <Heart className="w-4 h-4 mx-auto text-rose-500 mb-1 fill-rose-50 font-bold" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider scale-90">Likes</p>
            <p className="text-base font-black text-slate-800 mt-0.5">{stats.totalLikes}</p>
          </div>
        </div>
      </div>

      {/* 2. Actions Filter Bar Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search matching chef names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium shadow-xs"
          />
        </div>
        
        <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Sorting Real-Time Performance Matrix
        </div>
      </div>

      {/* 3. Grid Layout Matrix Card Pipeline */}
      {filteredChefs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl max-w-md mx-auto p-8 shadow-xs">
          <div className="text-2xl mb-2 text-slate-300">👨‍🍳</div>
          <p className="text-slate-700 text-sm font-bold">No Chefs Match Search Criteria</p>
          <p className="text-slate-400 text-xs mt-1">Refine your spelling parameters or clear inputs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChefs.map((chef, index) => {
            const isTop3 = index < 3;
            
            return (
              <div 
                key={chef.name}
                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-md group flex flex-col justify-between"
              >
                {/* Visual Accent for Podium Winners */}
                {index === 0 && <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500" />}
                
                {/* Ranking Ribbon Badge overlays */}
                <div className="absolute top-4 right-4 z-10">
                  {index === 0 ? (
                    <div className="bg-amber-500 text-white p-1.5 rounded-xl shadow-sm" title="Grand Champion">
                      <Trophy className="w-4 h-4 fill-amber-100" />
                    </div>
                  ) : index === 1 ? (
                    <div className="bg-slate-300 text-slate-800 p-1.5 rounded-xl shadow-sm" title="Silver Medalist">
                      <Award className="w-4 h-4" />
                    </div>
                  ) : index === 2 ? (
                    <div className="bg-amber-700 text-white p-1.5 rounded-xl shadow-sm" title="Bronze Runner-Up">
                      <Medal className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-[11px] font-black tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Profile Core Column Elements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`relative w-16 h-16 rounded-2xl overflow-hidden shadow-xs border-2 shrink-0 ${
                      index === 0 ? "border-amber-400" :
                      index === 1 ? "border-slate-300" :
                      index === 2 ? "border-amber-600" : "border-slate-100"
                    }`}>
                      <Image 
                        src={chef.avatar} 
                        alt={chef.name} 
                        fill 
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1 pr-6">
                      <h3 className="font-extrabold text-slate-800 text-sm tracking-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                        {chef.name}
                      </h3>
                      
                      {/* Dynamic tags mapping array blocks */}
                      <div className="flex flex-wrap gap-1">
                        {chef.specialties.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                        {chef.specialties.length === 0 && (
                          <span className="text-[9px] font-medium text-slate-400 italic">No Tags Listed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Most Popular Recipe Sub-Panel widget */}
                  {chef.mostPopularRecipe.name && (
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">🔥 Signature Dish</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{chef.mostPopularRecipe.name}</p>
                    </div>
                  )}
                </div>

                {/* Card Aggregate Statistics Footing Section */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100/70 text-center">
                  <div className="bg-rose-50/50 rounded-2xl p-2 border border-rose-100/20">
                    <div className="flex items-center justify-center gap-1 text-rose-500 mb-0.5">
                      <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Likes</span>
                    </div>
                    <p className="text-sm font-black text-slate-800">{chef.totalLikes.toLocaleString()}</p>
                  </div>

                  <div className="bg-orange-50/50 rounded-2xl p-2 border border-orange-100/20">
                    <div className="flex items-center justify-center gap-1 text-orange-500 mb-0.5">
                      <Utensils className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipes</span>
                    </div>
                    <p className="text-sm font-black text-slate-800">{chef.recipeCount}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}