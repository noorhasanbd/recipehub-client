"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, Crown, ShieldAlert, DollarSign, Loader2 } from "lucide-react";
// Import your exact action names
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes";
import { getAllUser } from "@/app/lib/actions/admin/manageUser";


export default function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLiveMongoDBData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user and recipe datasets using your server actions
        const [recipeResult, userResult] = await Promise.all([
          getAllRecipes({ page: 1, limit: 1000 }),
          getAllUser() // Using your exact action name here
        ]);

        // 1. Calculate Recipe Statistics
        let totalRecipesCount = 0;
        let flaggedReportsCount = 0;
        if (recipeResult?.success && Array.isArray(recipeResult.data)) {
          totalRecipesCount = recipeResult.pagination?.totalItems || recipeResult.data.length;
          
          flaggedReportsCount = recipeResult.data.filter(
            (r) => r.isFlagged === true || (r.reports && r.reports.length > 0) || r.status === "flagged"
          ).length;
        }

        // 2. Calculate User Statistics (Handling both array directly or { success, data } object)
        let totalUsersCount = 0;
        let premiumUsersCount = 0;
        
        // Resolve raw user array based on how your express backend returns it
        let rawUsersArray = [];
        if (Array.isArray(userResult)) {
          rawUsersArray = userResult;
        } else if (userResult?.success && Array.isArray(userResult.data)) {
          rawUsersArray = userResult.data;
        } else if (userResult && Array.isArray(userResult.users)) {
          rawUsersArray = userResult.users;
        }

        totalUsersCount = rawUsersArray.length;
        
        // Count premium accounts based on your schema's user properties
        premiumUsersCount = rawUsersArray.filter(
          (u) => u.tier === "premium" || u.isPremium === true || u.role === "premium" || u.role === "admin"
        ).length;

        // 3. Update UI metric cards layout matrix
        setStats([
          { label: "Total Users", value: totalUsersCount.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Recipes", value: totalRecipesCount.toLocaleString(), icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Premium Members", value: premiumUsersCount.toLocaleString(), icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Reports", value: flaggedReportsCount.toLocaleString(), icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
        ]);

      } catch (err) {
        console.error("Dashboard calculation handshake exception:", err);
        setError("Failed to stream live statistics from your database server routes.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveMongoDBData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Querying live backend route segments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-center max-w-md mx-auto my-12">
        <p className="font-bold">Database Error</p>
        <p className="text-xs text-red-500/80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-sm text-slate-500">Monitor live cooking hub statistics directly from MongoDB collections.</p>
      </div>

      {/* Live Analytics Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Gateway Placeholder Alert */}
      <div className="bg-amber-50/60 border border-amber-100 p-6 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900">Transaction Ledger Offline</h3>
          <p className="text-xs text-amber-700/90 mt-1 max-w-xl">
            The transaction history ledger is currently disconnected. Recent premium subscription payments will display here automatically once your payment system implementation is configured.
          </p>
        </div>
      </div>
    </div>
  );
}