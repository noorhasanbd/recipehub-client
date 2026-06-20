"use client";

import React, { useState } from "react";
import { Shield, ShieldAlert, Search, ShieldCheck } from "lucide-react";

export default function ManageUsers() {
  // Mock accounts database state
  const [users, setUsers] = useState([
    { id: "1", name: "Chef Marcus", email: "marcus@studio.com", role: "user", isBlocked: false },
    { id: "2", name: "Sarah Jenkins", email: "sarah@recipes.com", role: "user", isBlocked: true },
    { id: "3", name: "Admin David", email: "david@admin.com", role: "admin", isBlocked: false },
  ]);

  // Toggle dynamic structural block statuses (Req 102 / 103)
  const toggleBlockStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-sm text-slate-500">Monitor system access, verify profiles, and manage active blocks.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-orange-500" />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
              <th className="p-4">Account Information</th>
              <th className="p-4">System Access Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    user.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                    user.isBlocked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => toggleBlockStatus(user.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        user.isBlocked 
                          ? "border-emerald-200 text-emerald-600 bg-emerald-50/20 hover:bg-emerald-50" 
                          : "border-red-200 text-red-600 bg-red-50/20 hover:bg-red-50"
                      }`}
                    >
                      {user.isBlocked ? "Unblock Account" : "Block User"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}