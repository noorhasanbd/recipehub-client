"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const targetRef = useRef(null);

  // Tracks the scroll progress of the entire Hero section container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Modern Scroll Transformations:
  // 1. Shrinks the background image slightly on scroll (from 100% width to 92%)
  const scaleX = useTransform(scrollYProgress, [0, 0.4], ["100%", "92%"]);
  // 2. Rounds the image corners smoothly as it shrinks
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "24px"]);
  // 3. Adds a parallax fade effect to the typography content
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section 
      ref={targetRef} 
      className="relative w-full min-h-[140vh] bg-white"
    >
      {/* STICKY VISUAL CONTAINER */}
      <div className="sticky top-24 left-0 right-0 w-full h-[80vh] overflow-hidden flex items-center justify-center">
        
        {/* SCROLL-ANIMATED BACKGROUND IMAGE WRAPPER */}
        <motion.div
          style={{
            width: scaleX,
            borderRadius: borderRadius,
          }}
          className="absolute inset-0 h-full mx-auto overflow-hidden bg-slate-900 shadow-2xl"
        >
          {/* BACKGROUND IMAGE WITH DARK LAYER OVERLAY */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ 
              // Replace this URL with your chosen stock culinary/cooking image asset
              backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        {/* HERO TYPOGRAPHY CONTENT (Fades out beautifully on scroll) */}
        <motion.div 
          style={{ opacity, y }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6 flex flex-col items-center"
        >
          {/* Mini Accent Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-md mb-6 border border-white/10 uppercase tracking-widest">
            🍳 The Modern Kitchen Ecosystem
          </span>

          {/* Main Statement Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl">
            Engineering the Future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Curated Cooking
            </span>
          </h1>

          {/* Descriptive Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed">
            Discover, scale, and organize stunning recipe collections engineered by world-class creators. Say goodbye to cluttered cooking cards.
          </p>

          {/* Action Callouts */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/recipes"
              className="w-full sm:w-auto bg-orange-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-98 text-center text-sm"
            >
              Explore Recipes
            </Link>
            <Link
              href="/chefs"
              className="w-full sm:w-auto bg-white/10 text-white font-medium px-8 py-4 rounded-xl backdrop-blur-md transition-colors hover:bg-white/20 border border-white/20 text-center text-sm"
            >
              Meet Our Chefs
            </Link>
          </div>
        </motion.div>

      </div>
      
      {/* INVISIBLE spacer buffer to give scroll room for the animations */}
      <div className="h-[60vh]" />
    </section>
  );
}