"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiImage, FiLock, FiArrowRight } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  // Redirect users if a session is active
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Optionally avoid flashing the form while session is resolving / redirecting
  if (isPending || session) {
    return null; // or a loading spinner
  }

  // Social Login handler
  const handleGoogleSignin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google Sign-In initialization failed.");
    }
  };

  // Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.photoUrl,

      role: "user",
      isPremium: false,
      isBlocked: false,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(
        error.message || "Registration failed. Please check your inputs.",
        {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        },
      );
    } else if (data) {
      toast.success(
        "Welcome to RecipeHub! Your account was created successfully.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        },
      );
      router.push("/");
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
        {/* CARD TOP HEADINGS */}
        <div className="flex flex-col gap-2 text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Join Our Culinary Ecosystem
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Create an account
          </h1>
          <p className="text-sm text-slate-400">
            Join RecipeHub to curate and share your cooking creations
          </p>
        </div>

        {/* STRUCTURED FORM ELEMENTS */}
        <form className="space-y-5" onSubmit={onSubmit}>
          {/* FULL NAME FORM GROUP */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Full Name
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all w-full bg-white">
              <FiUser className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                type="text"
                name="name"
                required
                disabled={isSubmitting || isPending}
                className="grow text-sm bg-transparent placeholder:text-slate-300 text-slate-800 outline-none w-full disabled:cursor-not-allowed"
                placeholder="Chef John Doe"
              />
            </div>
          </div>

          {/* EMAIL FORM GROUP */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all w-full bg-white">
              <FiMail className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                type="email"
                name="email"
                required
                disabled={isSubmitting || isPending}
                className="grow text-sm bg-transparent placeholder:text-slate-300 text-slate-800 outline-none w-full disabled:cursor-not-allowed"
                placeholder="you@recipehub.com"
              />
            </div>
          </div>

          {/* PHOTO URL FORM GROUP */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Photo URL
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all w-full bg-white">
              <FiImage className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                type="url"
                name="photoUrl"
                required
                disabled={isSubmitting || isPending}
                className="grow text-sm bg-transparent placeholder:text-slate-300 text-slate-800 outline-none w-full disabled:cursor-not-allowed"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* PASSWORD FORM GROUP */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Password
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all w-full bg-white">
              <FiLock className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                type="password"
                name="password"
                required
                disabled={isSubmitting || isPending}
                className="grow text-sm bg-transparent placeholder:text-slate-300 text-slate-800 outline-none w-full disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all hover:bg-orange-600 hover:shadow-orange-500/10 active:scale-98 flex items-center justify-center gap-2 text-sm mt-4 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
            {!isSubmitting && (
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>

        {/* OR CROSS-BAR BREAK STRIP */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">
            or
          </span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* OAUTH GOOGLE ALTERNATIVE SIGNUP BUTTON */}
        <button
          onClick={handleGoogleSignin}
          disabled={isSubmitting || isPending}
          className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 w-full bg-white text-slate-700 text-sm font-semibold transition-all hover:bg-slate-50 shadow-xs active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.386 6.614l3.88 3.151z"
            />
            <path
              fill="#4285F4"
              d="M23.519 12.214c0-.796-.068-1.608-.205-2.393H12v4.537h6.477a5.534 5.534 0 0 1-2.4 3.632l3.725 2.89c2.177-2.01 3.717-4.973 3.717-8.666z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235L1.386 17.386A11.947 11.947 0 0 0 12 24c2.936 0 5.764-.995 7.795-2.73l-3.725-2.89a7.13 7.13 0 0 1-4.07 1.129 7.08 7.08 0 0 1-6.734-5.274z"
            />
            <path
              fill="#34A853"
              d="M1.386 6.614A11.947 11.947 0 0 0 0 12c0 1.923.455 3.74 1.259 5.357l4.007-3.122a7.16 7.16 0 0 1-.223-2.235c0-.773.127-1.523.363-2.236L1.386 6.614z"
            />
          </svg>
          Continue with Google
        </button>

        {/* BOTTOM REDIRECT LINKS */}
        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
