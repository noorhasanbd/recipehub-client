"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* BACKGROUND GRAPHIC TEXTURE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.02] mix-blend-luminosity pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200')`,
        }}
      />

      {/* CARD CONTAINER */}
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-md p-8 shadow-xl relative z-10 text-center">
        {/* SHIELD ICON WITH LOCK ANCHOR */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-6 relative animate-pulse">
          <ShieldAlert className="h-10 w-10" />
          <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full border-2 border-white">
            <Lock className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* ERROR HEADINGS */}
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Error 403 • Access Denied
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2 mb-3">
          Kitchen Area Restricted
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto mb-8">
          Oops! You don't have the required credentials or subscription
          permissions to view this dashboard recipe node. Let's get you back to
          safe waters.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:bg-orange-600 hover:shadow-orange-500/10 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
          >
            Sign In with Another Account
          </Link>

          <button
            onClick={ () =>
              typeof window !== "undefined" && window.history.go(-2)
            }
            className="w-full border border-slate-200 bg-white text-slate-700 font-semibold py-3 rounded-xl transition-all hover:bg-slate-50 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* FOOTER SHORTCUT LINK */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-orange-500 transition-colors"
          >
            Return to RecipeHub Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
