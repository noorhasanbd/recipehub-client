"use client";

import React, { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    // 🛑 If loading is complete, but they aren't an admin -> send to unauthorized page
    if (!isPending && user && user.role !== "admin") {
      router.push("/unauthorized"); // 🚀 Routing to your brand-new page
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
        <p className="text-sm font-medium text-slate-400">Verifying administrative access...</p>
      </div>
    );
  }

  // Double-gate protection string safety check
  if (user?.role !== "admin") return null;

  return <>{children}</>;
}