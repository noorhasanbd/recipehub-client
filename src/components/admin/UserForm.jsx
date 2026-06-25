"use client";

import React, { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";

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

  // 🌟 Real-time evaluation states using criteria regex maps for creation mode
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isPasswordValid = hasLowercase && hasUppercase && hasNumberOrSpecial && formData.password.length >= 6;

  // Form block control flag
  const isSubmitDisabled = !isEditMode && !isPasswordValid;

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
    if (isSubmitDisabled) return;
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

      {/* 3. PASSWORD FIELD (Hidden or Optional during edits with Integrated Requirements) */}
      {!isEditMode && (
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Account Password</label>
          <input
            type="password"
            name="password"
            required={!isEditMode}
            value={formData.password}
            onChange={handleChange}
            className={`w-full bg-white border rounded-xl py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
              formData.password.length === 0
                ? "border-slate-200 focus:border-orange-500"
                : isPasswordValid
                  ? "border-emerald-500 focus:border-emerald-500"
                  : "border-rose-400 focus:border-rose-500"
            }`}
          />

          {/* 🌟 Dynamic checklist panel that expands when user interacts with the password field */}
          {formData.password.length > 0 && (
            <div className="mt-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Complexity Requirements</p>
              
              <div className="flex items-center gap-2 text-xs font-semibold">
                {hasLowercase ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                <span className={hasLowercase ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One lowercase letter (a-z)</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                {hasUppercase ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                <span className={hasUppercase ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One uppercase letter (A-Z)</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                {hasNumberOrSpecial ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                <span className={hasNumberOrSpecial ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One number or special symbol</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-semibold">
                {formData.password.length >= 6 ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                <span className={formData.password.length >= 6 ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>At least 6 characters</span>
              </div>
            </div>
          )}
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
          disabled={isSubmitDisabled}
          className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
        >
          {isEditMode ? "Save Profile Changes" : "Provision New User"}
        </button>
      </div>
    </form>
  );
}