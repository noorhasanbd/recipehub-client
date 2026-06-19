"use client"; // ⚠️ MUST add this at the very top since you are using hooks!

import { DashboardSideBar } from "@/components/dashboard/DashboardSideBar";
import React, { useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { usePathname, useRouter } from "next/navigation"; // 1. Import useRouter

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const currentPath = usePathname();
  const { data: session, isPending } = authClient.useSession();
  
  useEffect(() => {
    
    if (!isPending && !session) {
      const callbackUrl = encodeURIComponent(currentPath);
      router.push(`/auth/signin?callbackURL=${callbackUrl}`);
    }
  }, [session, isPending, router]);

  
  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">Verifying session...</p>
      </div>
    );
  }

  // If no session exists, keep returning null until useEffect kicks them out
  if (!session) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/50">
      <DashboardSideBar />
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children} 
      </main>
    </div>
  );
}