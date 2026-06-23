"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MoveLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        
        {/* Animated Brand Vector Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-flex items-center justify-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm"
        >
          <span className="text-5xl animate-bounce duration-1000">🍳</span>
          <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-xl shadow-xs">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </motion.div>

        {/* Typographic Error Identifiers */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-7xl font-black text-slate-800 tracking-tighter"
          >
            404
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg font-bold text-slate-800 tracking-tight"
          >
            This Recipe Got Lost in the Kitchen
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs font-medium text-slate-400 max-w-sm mx-auto leading-relaxed"
          >
            The page you are looking for has been moved, renamed, or doesn't exist. Let's get you back somewhere safe!
          </motion.p>
        </div>

        {/* Call to Actions Interaction Grid Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <MoveLeft className="w-4 h-4" /> Go Backward
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-98"
          >
            <Home className="w-4 h-4" /> Back Home
          </Link>
        </motion.div>

        {/* System Diagnostics footer tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-6"
        >
          Matrix Router System Integrity Clear
        </motion.p>

      </div>
    </div>
  );
}