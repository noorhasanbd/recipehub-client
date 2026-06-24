"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { CheckCircle2, Sparkles, ArrowRight, ChefHat, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Fetch session parameters to instantly sync client-side states
  const { data: session, isPending } = authClient.useSession();
  const [countdown, setCountdown] = useState(8);

  // Optional: Automatic redirect fallback safety loop
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/dashboard/recipes/new");
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Updating account matrix layers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-6 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        
        {/* Background ambient lighting glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Animated Indicator Graphic */}
        <div className="relative mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 animate-bounce">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Messaging Text Area */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            <Sparkles className="w-3 h-3 fill-amber-400 text-amber-400" /> Premium Active
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            Thank you for upgrading, <span className="text-slate-800 font-bold">{session?.user?.name || "Chef"}</span>! Your deployment tier limitations are wiped clean. You now have unlimited access.
          </p>
        </div>

        {/* Meta Transaction Footprint Reference box */}
        {sessionId && (
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-mono text-slate-400 break-all select-all">
            <span className="font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Stripe Token Context</span>
            {sessionId}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Action Button Navigation Controls */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard/recipes/new")}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md shadow-slate-950/10 transition-colors group"
          >
            <ChefHat className="w-4 h-4 text-orange-400" />
            <span>Create Your Next Recipe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/dashboard/user/my-recipes")}
            className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors block"
          >
            Go to My Catalog
          </button>
        </div>

        {/* Automatic Counter Notification Indicator text */}
        <p className="text-[10px] text-slate-300 font-medium">
          Redirecting to recipe design studio automatically in <span className="font-bold text-slate-400">{countdown}s</span>...
        </p>

      </div>
    </div>
  );
}