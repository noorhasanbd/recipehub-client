"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BootScreen() {
  const [mounted, setMounted] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mount guard: ensures nothing renders on the server
    setMounted(true);

    // 1. Trigger the bottom-to-top color fill shortly after mount
    const fillTimeout = setTimeout(() => setIsFilling(true), 50);

    // 2. Begin fade-out at exactly 3 seconds
    const exitTimeout = setTimeout(() => setIsExiting(true), 3000);

    // 3. Unmount after fade transition completes (500ms fade)
    const removeTimeout = setTimeout(() => setIsVisible(false), 3500);

    return () => {
      clearTimeout(fillTimeout);
      clearTimeout(exitTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  // Render nothing on server, and nothing after animation completes
  if (!mounted || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">

        {/* Layer 1: Gray Background Silhouette */}
        <div className="absolute inset-0 grayscale opacity-20 contrast-50">
          <Image
            src="/rhlogo2.png"
            alt="RecipeHub Loader Back"
            width={192}
            height={192}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* Layer 2: Color-Filling Foreground (bottom-to-top reveal) */}
        <div
          className="absolute inset-0 overflow-hidden transition-all duration-[2500ms] ease-in-out"
          style={{
            clipPath: isFilling
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0% 0% 0%)",
          }}
        >
          <Image
            src="/rhlogo2.png"
            alt="RecipeHub Loader Front"
            width={192}
            height={192}
            priority
            className="w-full h-full object-contain"
          />
        </div>

      </div>

      {/* Loading Text */}
      <p
        className={`mt-4 text-xs font-bold tracking-widest text-slate-400 uppercase transition-all duration-700 delay-300 ${
          isFilling ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Initializing RecipeHub...
      </p>
    </div>
  );
}