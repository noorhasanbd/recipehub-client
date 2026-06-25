"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Sliders, Clock } from "lucide-react";

const features = [
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: "Curate Your Cookbook",
    description: "Save your favorite community dishes to a dedicated personal collection with a single click. Access them instantly, anytime.",
    bgColor: "bg-rose-50",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    title: "Unlock Premium Recipes",
    description: "Upgrade to premium to access secret, hand-tested formulas from world-class chefs and step-by-step masterclasses.",
    bgColor: "bg-amber-50",
  },
  {
    icon: <Sliders className="w-6 h-6 text-emerald-500" />,
    title: "Granular Smart Filters",
    description: "Filter down by dietary restrictions, precise preparation time, difficulty level, and cuisine origins in real-time.",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-500" />,
    title: "Time-Optimized Steps",
    description: "Every recipe is broken down into structured, high-efficiency checkpoints designed to get you from prep to plate faster.",
    bgColor: "bg-blue-50",
  },
];

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Creates the sequential waterfall animation effect
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

export default function HomeFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full"
          >
            Why Choose RecipeHub
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4 mb-4"
          >
            Your ultimate culinary companion
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed"
          >
            We combine high-performance engineering with a vibrant food community to make cooking fluid, creative, and completely rewarding.
          </motion.p>
        </div>

        {/* Features Interactive Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)" 
              }}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-shadow duration-200 flex flex-col items-start group cursor-pointer"
            >
              {/* Icon Badging Box */}
              <div className={`p-3.5 ${feature.bgColor} rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>

              {/* Title Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-500 transition-colors duration-200">
                {feature.title}
              </h3>

              {/* Description Body */}
              <p className="text-sm font-medium text-slate-500 leading-relaxed mt-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}