"use client";

import React from "react";
import { authClient } from "@/app/lib/auth-client";
import { Loader2, Sparkles, Utensils, Check } from "lucide-react";

export default function PricingPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const isPremiumUser = session?.user?.isPremium === true;

  if (isSessionPending) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10 py-10">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Unlock unlimited culinary creations, smart filtering utilities, and
          advanced admin capabilities.
        </p>
      </div>

      {/* PRICING GRID CARDS MATRIX */}
      <div className="grid md:grid-cols-2 gap-8 items-start max-w-3xl mx-auto">
        {/* FREE PLAN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 relative shadow-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-slate-400" /> Hobby Cook
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-950">$0</span>
              <span className="text-slate-400 text-sm font-semibold">
                /month
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Perfect for exploring recipes and managing basic menus.
            </p>
          </div>

          <hr className="border-slate-100" />

          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Browse all public database recipes</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Publish up to 3 personal recipes</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Standard community dashboard access</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full py-2.5 bg-slate-100 text-slate-400 font-bold text-sm rounded-xl transition-all cursor-not-allowed text-center"
          >
            {isPremiumUser ? "Free Tier Included" : "Current Active Plan"}
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 space-y-6 relative shadow-md">
          {/* POPULAR BADGE */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
            Recommended
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              Premium Chef
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-950">$5</span>
              <span className="text-slate-500 text-sm font-semibold">
                /month
              </span>
            </div>
            <p className="text-xs text-slate-500">
              For serious cooks who want complete control over their ecosystem.
            </p>
          </div>

          <hr className="border-slate-100" />

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Unlimited Recipe Publishing</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Advanced search matrix filters</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Priority Admin Ticket Support</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-bold">
                Exclusive Premium Badge
              </span>
            </li>
          </ul>

          {/* NATIVE FORM TRIGGER INTEGRATION */}
          {isPremiumUser ? (
            <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl text-center border border-emerald-200">
              ✓ Premium Membership Active
            </div>
          ) : (
            /* 🌟 Absolute cross-origin routing point directly targeting Express container port */
            <form
              action="/api/checkout_sessions"
              method="POST"
              className="w-full"
            >
              {session?.user?.email && (
                <input
                  type="hidden"
                  name="customer_email"
                  value={session.user.email}
                />
              )}

              {/* 🌟 PASSING IMMUTABLE USER ID REFERENCE PIN */}
              {session?.user?.id && (
                <input type="hidden" name="user_id" value={session.user.id} />
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-slate-900/10"
              >
                Upgrade Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
