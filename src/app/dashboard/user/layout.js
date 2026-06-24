"use client";

import React, { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

export default function ProtectedUserLayout({ children }) {
  const router = useRouter();
  
  // Stream live credentials and session status vectors
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    // 🛑 Evaluation Gate: Wait for network operations to fully resolve
    if (!isPending) {
      // Scenario A: Guest access attempt (Not logged in at all)
      if (!user) {
        router.push("/sign-in");
      } 
      // Scenario B: Logged in, but they are an admin or manager trying to enter a user-exclusive zone
      else if (user.role !== "user") {
        router.push("/unauthorized");
      }
    }
  }, [user, isPending, router]);

  // 🌀 High fidelity loader while verifying authorization claims
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 text-center animate-pulse">
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl mb-3 shadow-xs">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Verifying Permissions</h3>
        <p className="text-xs text-slate-400 mt-0.5">Confirming secure user route clearance...</p>
      </div>
    );
  }

  // 🛡️ Fail-Safe Leak Gate: Instantly shorts DOM rendering if role metrics break down
  if (!user || user.role !== "user") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 text-center">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl mb-3 border border-red-100">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Restricted Route</h3>
        <p className="text-xs text-slate-400 mt-0.5">Redirecting to verified interface...</p>
      </div>
    );
  }

  // ✅ Verified User Account: Safely mount layout tree nodes
  return <>{children}</>;
}