"use client";

import React, { useState, useEffect } from "react"; // 1. Added useEffect
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  // 2. Safe Redirect handled inside useEffect
  useEffect(() => {
    if (session && !isPending) {
      router.push("/");
    }
  }, [session, isPending, router]);

  // 3. Return a loading state or null while checking/redirecting
  if (isPending || session) {
    return (
      <div className="flex min-h-[90vh] items-center justify-center bg-slate-50/50">
        <div className="animate-pulse text-sm font-medium text-slate-400">
          Loading...
        </div>
      </div>
    );
  }

  // Google OAuth Login handler
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Failed to initialize Google Sign-In.");
    }
  };

  // Form Email/Password submission handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Invalid email or password.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
    } else if (data) {
      toast.success("Welcome back to RecipeHub!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      router.push("/");
      router.refresh();
    }
  };

  return (
    // ... rest of your JSX remains exactly the same
    <div className="flex min-h-[90vh] items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
       {/* Keep all the form markup here */}
    </div>
  );
}