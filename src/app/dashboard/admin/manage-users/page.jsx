"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { toast } from "react-toastify";

// SERVER ACTIONS
import { getAllUser, toggleBlockUser, deleteUser, updateUser } from "@/app/lib/actions/admin/manageUser";
// FORM COMPONENT
import UserForm from "@/components/admin/UserForm";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit State Triggers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // 1. READ ALL USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUser();
        setUsers(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error("Error loading users:", err);
        toast.error("Failed to load user directory from backend.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. TOGGLE ACC_SUSPENSION (PATCH)
  const handleToggleBlock = async (id, currentIsBlocked) => {
    try {
      const response = await toggleBlockUser(id, currentIsBlocked);
      if (response.success) {
        setUsers(users.map(user => {
          const targetId = user._id || user.id;
          if (targetId === id) {
            return { ...user, isBlocked: !currentIsBlocked };
          }
          return user;
        }));
        toast.success(`User status successfully changed.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not alter status profile.");
    }
  };

  // 3. EDIT ALL CORE DETAILS (PUT HANDLER CLOSURE)
  const handleEditFormSubmit = async (updatedFields) => {
    const userId = userToEdit._id || userToEdit.id;
    try {
      const response = await updateUser(userId, updatedFields);
      if (response.success) {
        setUsers(users.map((user) => {
          const targetId = user._id || user.id;
          if (targetId === userId) {
            return { 
              ...user, 
              name: updatedFields.name, 
              role: updatedFields.role, 
              image: updatedFields.photoUrl 
            };
          }
          return user;
        }));
        toast.success("User configuration updated perfectly!");
        setIsEditModalOpen(false);
        setUserToEdit(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed saving metadata updates.");
    }
  };

  // 4. ERASE USER PROFILE ROW (DELETE)
  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Are you completely sure you want to delete account: "${name}"?`)) return;
    try {
      const response = await deleteUser(id);
      if (response.success) {
        setUsers(users.filter(user => (user.id || user._id) !== id));
        toast.success(`Account entry cleanly unmapped.`);
      }
    } catch (error) {
      toast.error("Failed to safely destroy registry data row.");
    }
  };

  // Filtration Engine
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "blocked" && user.isBlocked === true) || 
      (statusFilter === "active" && !user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-sm text-slate-500">Oversee system roles, inspect verification accounts, or suspend profiles.</p>
        </div>
        <Link 
          href="/dashboard/admin/manage-users/add-user"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New User
        </Link>
      </div>

      <hr className="border-slate-100" />

      {/* SEARCH AND FILTERS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        >
          <option value="all">All System Roles</option>
          <option value="admin">Administrators</option>
          <option value="user">Standard Users</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        >
          <option value="all">All Status Profiles</option>
          <option value="active">Active System Accounts</option>
          <option value="blocked">Suspended / Blocked</option>
        </select>
      </div>

      {/* DATA HOUSING LIST TABLE */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
              <th className="p-4">User Details</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">System Status</th>
              <th className="p-4 text-right">Administrative Interventions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading directory maps...</td></tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((account) => {
                const currentId = account._id || account.id;
                return (
                  <tr key={currentId} className={`hover:bg-slate-50/40 transition-colors ${account.isBlocked ? "bg-red-50/10" : ""}`}>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{account.name}</p>
                      <p className="text-xs text-slate-400">{account.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${account.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${account.isBlocked ? "text-red-500 font-semibold" : "text-emerald-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${account.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                        {account.isBlocked ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button 
                          onClick={() => handleToggleBlock(currentId, account.isBlocked)}
                          className={`p-1.5 border rounded-lg transition-colors ${account.isBlocked ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 bg-white"}`}
                          title={account.isBlocked ? "Unblock" : "Block"}
                        >
                          {account.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </button>

                        <button 
                          onClick={() => { setUserToEdit(account); setIsEditModalOpen(true); }}
                          className="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:text-orange-500 hover:border-orange-200 bg-white transition-colors" 
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleDeleteUser(currentId, account.name)}
                          className="p-1.5 border border-slate-200 text-slate-400 rounded-lg hover:text-red-600 hover:border-red-200 bg-white transition-colors" 
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">No matching user records.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* UNIFIED MODAL WINDOW SHELL COUPLING ENTRY INPUT FORMS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Edit User Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Modifying active values for: {userToEdit?.email}</p>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setUserToEdit(null); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <UserForm 
                initialData={userToEdit} 
                onSubmit={handleEditFormSubmit} 
                onCancel={() => { setIsEditModalOpen(false); setUserToEdit(null); }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}