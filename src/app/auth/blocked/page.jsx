"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, Home, LogOut } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function BlockedPage() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const handleLoginDifferentId = async () => {
    try {
      setIsClearing(true);
      await authClient.signOut();
      toast.info("Session cleared. You can now log in with an alternative profile.");
      router.push("/auth/signin");
    } catch (err) {
      console.error("Signout sequence failed:", err);
      router.push("/auth/signin");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex min-h-[95vh] items-center justify-center bg-slate-50/50 px-4 py-12 relative overflow-hidden">
      
      {/* CULINARY BACKGROUND IMAGE TEXTURE MASK */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] mix-blend-luminosity pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200')`,
        }}
      />

      {/* FLOATING GLASS SURFACE CARD CONTAINER */}
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md p-8 text-center shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* RecipeHub Branded Accent Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-6 border border-orange-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Messaging Headers */}
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Administrative Notice
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Account Suspended
        </h1>
        
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          Your RecipeHub profile has been deactivated or suspended by system administrators due to a violation of our community guidelines or terms of service.
        </p>

        {/* Warm Custom Context Box */}
        <div className="my-6 rounded-xl bg-orange-50/30 p-4 text-left border border-orange-50">
          <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            Access Restrained
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            If you believe this restriction is an administrative error, please reach out to operations to submit a formal appeal request profile review.
          </p>
        </div>

        {/* CORE ACTIONS DIRECTORY STACK */}
        <div className="space-y-3">
          
          {/* PATHWAY 1: CONTACT ADMIN (Primary Project Color) */}
          <a
            href="mailto:admin@recipehub.com?subject=Account Appeal Request"
            className="inline-flex w-full items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition-all hover:shadow-orange-500/10 active:scale-98"
          >
            <Mail className="w-4 h-4" />
            Contact Admin
          </a>

          <div className="grid grid-cols-2 gap-3">
            {/* PATHWAY 2: RETURN TO HOME */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 rounded-xl transition-all active:scale-98"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>

            {/* PATHWAY 3: LOGIN WITH DIFFERENT ID */}
            <button
              onClick={handleLoginDifferentId}
              disabled={isClearing}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 rounded-xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {isClearing ? "Clearing..." : "Switch ID"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}