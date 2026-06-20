"use client";

import React from "react";
import { Users, BookOpen, Crown, ShieldAlert, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminOverview() {
  // Mock data for analytics cards
  const stats = [
    { label: "Total Users", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Recipes", value: "3,420", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Premium Members", value: "412", icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Reports", value: "14", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
  ];

  // Mock data for transactions log (Req 114)
  const transactions = [
    { id: "TXN-98210", user: "Jane Doe", email: "jane@example.com", amount: "$9.99", date: "2026-06-18", status: "Successful" },
    { id: "TXN-98209", user: "Alex Smith", email: "alex@example.com", amount: "$9.99", date: "2026-06-17", status: "Successful" },
    { id: "TXN-98208", user: "Michael R.", email: "mikey@example.com", amount: "$9.99", date: "2026-06-15", status: "Failed" },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-sm text-slate-500">Monitor live cooking hub statistics and payments.</p>
      </div>

      {/* Grid Layout for Analytics Cards */}
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

      {/* Transactions Table (Requirement 114) */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" /> Recent Premium Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 division-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0 transition-colors">
                  <td className="p-4 font-mono font-medium text-slate-800">{txn.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{txn.user}</p>
                    <p className="text-xs text-slate-400">{txn.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{txn.amount}</td>
                  <td className="p-4 text-slate-500">{txn.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      txn.status === "Successful" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}