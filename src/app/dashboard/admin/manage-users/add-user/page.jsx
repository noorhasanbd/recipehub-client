"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// SERVER ACTION IMPORT
import { addUser } from "@/app/lib/actions/admin/manageUser"; 
// UNIFIED FORM COMPONENT IMPORT
import UserForm from "@/components/admin/UserForm";

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (formDataValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Passes the clean structured state mapping straight to your Next.js Server Action
      await addUser(formDataValues);

      toast.success(
        `User "${formDataValues.name}" has been registered successfully!`,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );
      
      // Navigate cleanly back to data metrics view
      router.push("/dashboard/admin/manage-users");
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Failed to create user account.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[95vh] items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* CULINARY BACKGROUND IMAGE TEXTURE MASK */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] mix-blend-luminosity pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200')`,
        }}
      />

      {/* FLOATING GLASS SURFACE CARD CONTAINER */}
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md p-8 shadow-xl relative z-10">
        {/* BACK TO DASHBOARD NAVIGATION LINK */}
        <Link
          href="/dashboard/admin/manage-users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors mb-4 group"
        >
          <FiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to User Management
        </Link>

        {/* CARD TOP HEADINGS */}
        <div className="flex flex-col gap-2 text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Administrative Console
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Add New User
          </h1>
          <p className="text-sm text-slate-400">
            Manually provision an account on the RecipeHub platform
          </p>
        </div>

        {/* REUSABLE FORM INJECTION */}
        {isSubmitting ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
            Provisioning profile across database clusters...
          </div>
        ) : (
          <UserForm 
            onSubmit={handleCreateUser} 
            onCancel={() => router.push("/dashboard/admin/manage-users")} 
          />
        )}
      </div>
    </div>
  );
}