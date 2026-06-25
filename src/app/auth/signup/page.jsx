"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiX, FiUploadCloud, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  
  // 🌟 ImgBB file uploading state hooks
  const [imgUploading, setImgUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgStatus, setImgStatus] = useState("idle"); // idle | success | error

  const { data: session, isPending } = authClient.useSession();

  // Real-time evaluation states using criteria regex maps
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasLowercase && hasUppercase && hasNumberOrSpecial && password.length >= 6;

  // Redirect users if a session is active
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Handle client-side ImgBB uploads asynchronously
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgPreview(URL.createObjectURL(file));
    setImgUploading(true);
    setImgStatus("idle");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY inside your .env file environment");
      }

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImgUrl(result.data.url);
        setImgStatus("success");
        toast.success("Avatar uploaded successfully to storage!");
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setImgStatus("error");
      toast.error("Image upload to cloud repository failed.");
    } finally {
      setImgUploading(false);
    }
  };

  if (isPending || session) {
    return null; 
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
    if (isSubmitting || imgUploading) return;

    if (!isPasswordValid) {
      toast.error("Please satisfy all password compatibility requirements first!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.photoUrl, // Sent cleanly from the hidden input field matrix state
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
          
          {/* 🌟 HIDDEN FIELD FOR INTEGRATING IMGBB STRING INTO NATIVE FORMDATA ENTRIES */}
          <input type="hidden" name="photoUrl" value={imgUrl} />

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

          {/* 🌟 PHOTO DROPAZONE FIELD UPGRADED VIA IMGBB API */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Profile Avatar Image
            </label>
            <div className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all bg-white min-h-[76px] ${
              imgStatus === "success" 
                ? "border-emerald-500 bg-emerald-50/5" 
                : imgStatus === "error" 
                  ? "border-rose-400 bg-rose-50/5" 
                  : "border-gray-200 hover:border-orange-500"
            }`}>
              {imgPreview ? (
                <div className="flex items-center gap-4 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgPreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">Image Selected</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {imgUploading ? "Uploading to ImgBB clouds..." : "Hosted securely on ImgBB"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <FiUploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-600">Click to upload photo file</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                required
                onChange={handleImageUpload} 
                disabled={isSubmitting || isPending || imgUploading} 
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
              <div className="absolute top-3 right-3">
                {imgUploading && <FiLoader className="w-4 h-4 text-orange-500 animate-spin" />}
                {imgStatus === "success" && !imgUploading && <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
                {imgStatus === "error" && !imgUploading && <FiAlertCircle className="w-4 h-4 text-rose-500" />}
              </div>
            </div>
          </div>

          {/* PASSWORD FORM GROUP WITH INTEGRATED REQUIREMENTS */}
          <div className="w-full">
            <label className="block font-semibold text-xs text-slate-700 uppercase tracking-wider pb-2">
              Password
            </label>
            <div className={`flex items-center gap-3 border rounded-xl px-3.5 py-3 focus-within:ring-2 transition-all w-full bg-white ${
              password.length === 0 
                ? "border-gray-200 focus-within:border-orange-500 focus-within:ring-orange-500/10" 
                : isPasswordValid 
                  ? "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-500/10" 
                  : "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/10"
            }`}>
              <FiLock className="text-slate-400 w-4 h-4 shrink-0" />
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || isPending}
                className="grow text-sm bg-transparent placeholder:text-slate-300 text-slate-800 outline-none w-full disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            {/* Dynamic checklist panel */}
            {password.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Complexity Requirements</p>
                
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {hasLowercase ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                  <span className={hasLowercase ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One lowercase letter (a-z)</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  {hasUppercase ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                  <span className={hasUppercase ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One uppercase letter (A-Z)</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  {hasNumberOrSpecial ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                  <span className={hasNumberOrSpecial ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>One number (0-9) or special symbol</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {password.length >= 6 ? <FiCheck className="text-emerald-500 shrink-0" /> : <FiX className="text-slate-300 shrink-0" />}
                  <span className={password.length >= 6 ? "text-emerald-600 line-through decoration-emerald-500/40" : "text-slate-500"}>At least 6 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || isPending || !isPasswordValid || imgUploading || !imgUrl}
            className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all hover:bg-orange-600 hover:shadow-orange-500/10 active:scale-98 flex items-center justify-center gap-2 text-sm mt-4 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100"
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