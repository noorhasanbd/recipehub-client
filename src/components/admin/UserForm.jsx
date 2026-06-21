"use client";

import React, { useState, useEffect } from "react";

export default function UserForm({ initialData = null, onSubmit, onCancel }) {
  const isEditMode = !!initialData; // true if initialData is provided

  // Unified Form Fields State Map
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoUrl: "",
    role: "user",
  });

  // Populate fields if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Leave blank on edit for security purposes
        photoUrl: initialData.image || initialData.photoUrl || "",
        role: initialData.role || "user",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. NAME FIELD */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* 2. EMAIL FIELD (Disabled during edits) */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          required
          disabled={isEditMode} // Usually, we don't let admins change the unique auth email identifier directly
          value={formData.email}
          onChange={handleChange}
          className={`w-full border rounded-xl py-2 px-3 text-sm focus:outline-none ${
            isEditMode ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed" : "bg-white text-slate-800 border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          }`}
        />
      </div>

      {/* 3. PASSWORD FIELD (Hidden or Optional during edits) */}
      {!isEditMode && (
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Account Password</label>
          <input
            type="password"
            name="password"
            required={!isEditMode}
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      )}

      {/* 4. PHOTO URL FIELD */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Photo URL String</label>
        <input
          type="text"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* 5. PRIVILEGE ROLE SELECTION */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">System Role Permissions</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="user">Standard User</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      {/* ACTION CONTROLS FOOTER */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all"
        >
          {isEditMode ? "Save Profile Changes" : "Provision New User"}
        </button>
      </div>
    </form>
  );
}