"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Crown,
  ShieldAlert,
  DollarSign,
  Loader2,
  CreditCard,
} from "lucide-react";
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes";
import { getAllUser } from "@/app/lib/actions/admin/manageUser";
import { getAllTransactions } from "@/app/lib/actions/transectionAction";
// 🌟 Import your specific report management actions here
import { getAllReports } from "@/app/lib/actions/recipeActions/adminReportAction";

export default function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLiveMongoDBData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch datasets concurrently including your new live Reports stream
        const [recipeResult, userResult, trxResult, reportResult] = await Promise.all([
          getAllRecipes({ page: 1, limit: 1000 }),
          getAllUser(),
          getAllTransactions(),
          getAllReports() // 🌟 Fetch your real reports registry
        ]);

        // 1. Calculate Recipe Statistics
        let totalRecipesCount = 0;
        if (recipeResult?.success && Array.isArray(recipeResult.data)) {
          totalRecipesCount = recipeResult.pagination?.totalItems || recipeResult.data.length;
        }

        // 2. Calculate Real Flagged Reports Count
        let flaggedReportsCount = 0;
        if (reportResult?.success && Array.isArray(reportResult.data)) {
          flaggedReportsCount = reportResult.data.length;
        } else if (Array.isArray(reportResult)) {
          flaggedReportsCount = reportResult.length;
        }

        // 3. Calculate User Statistics
        let totalUsersCount = 0;
        let premiumUsersCount = 0;
        let rawUsersArray = [];
        if (Array.isArray(userResult)) {
          rawUsersArray = userResult;
        } else if (userResult?.success && Array.isArray(userResult.data)) {
          rawUsersArray = userResult.data;
        } else if (userResult && Array.isArray(userResult.users)) {
          rawUsersArray = userResult.users;
        }

        totalUsersCount = rawUsersArray.length;
        premiumUsersCount = rawUsersArray.filter(
          (u) =>
            u.tier === "premium" ||
            u.isPremium === true ||
            u.role === "premium" ||
            u.role === "admin",
        ).length;

        // 4. Process Live Transaction Ledger Analytics
        let rawTrxArray = [];
        if (trxResult?.success && Array.isArray(trxResult.data)) {
          rawTrxArray = trxResult.data;
        } else if (Array.isArray(trxResult)) {
          rawTrxArray = trxResult;
        }

        setTransactions(rawTrxArray);

        // Calculate aggregated platform billing returns
        const totalRev = rawTrxArray.reduce((acc, current) => {
          if (
            current.paymentStatus === "paid" ||
            current.paymentStatus === "succeeded"
          ) {
            return acc + (Number(current.amountTotal) || 0);
          }
          return acc;
        }, 0);
        setTotalRevenue(totalRev);

        // 5. Update core UI analytics metrics state vector
        setStats([
          {
            label: "Total Users",
            value: totalUsersCount.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Recipes",
            value: totalRecipesCount.toLocaleString(),
            icon: BookOpen,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Premium Members",
            value: premiumUsersCount.toLocaleString(),
            icon: Crown,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Active Reports",
            value: flaggedReportsCount.toLocaleString(),
            icon: ShieldAlert,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ]);
      } catch (err) {
        console.error("Dashboard calculation handshake exception:", err);
        setError(
          "Failed to stream live statistics from your database server routes.",
        );
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
        <p className="text-sm text-slate-500 font-medium">
          Querying live backend route segments...
        </p>
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
        <p className="text-sm text-slate-500">
          Monitor live cooking hub statistics directly from MongoDB collections.
        </p>
      </div>

      {/* Live Analytics Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {stat.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Financial Matrix Division Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stripe Card Layout Container */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden h-fit lg:h-full min-h-[180px]">
          <div className="absolute right-[-15px] bottom-[-30px] z-0 pointer-events-none opacity-[0.04] text-slate-900">
            <DollarSign className="w-40 h-40 stroke-[2.5]" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex items-center gap-2 text-slate-400">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Stripe Gross Revenue
                </span>
              </div>
              <h2 className="text-4xl font-black mt-4 tracking-tight text-slate-800">
                $
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>

            <p className="text-xs text-slate-400 mt-6 border-t border-slate-100 pt-3">
              Live volume calculated directly across {transactions.length}{" "}
              processed invoices.
            </p>
          </div>
        </div>

        {/* Transaction Ledger Table Container */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-400">
                Audit logs matching transactions index.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg">
              {transactions.length} Total Logs
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-100 rounded-xl">
              <p className="text-sm text-slate-400 font-medium">
                No system subscription logs currently written to database profile.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">User Name</th>
                    <th className="pb-3 font-semibold">Customer Email</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                  {transactions.slice(0, 5).map((trx) => (
                    <tr
                      key={trx._id || trx.stripeSessionId}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">
                          {trx.userName || "Unknown User"}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 max-w-[120px] truncate">
                          ID: {trx.userId}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-slate-600">
                        {trx.customerEmail || "N/A"}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800">
                        ${Number(trx.amountTotal).toFixed(2)}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {trx.currency}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            trx.paymentStatus === "paid" ||
                            trx.paymentStatus === "succeeded"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {trx.paymentStatus || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}