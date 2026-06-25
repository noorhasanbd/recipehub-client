"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Heart, Sparkles, ChefHat } from "lucide-react";

const metrics = [
  { 
    id: 1, 
    icon: BookOpen, 
    value: "12,480+", 
    title: "Verified Blueprints", 
    desc: "Archived operational flavor guides curated carefully by real creators.",
    color: "bg-orange-50 text-orange-500 border-orange-100" 
  },
  { 
    id: 2, 
    icon: Users, 
    value: "85K+", 
    title: "Active Palates", 
    desc: "Home cooks and professional culinary directors interacting globally daily.",
    color: "bg-blue-50 text-blue-500 border-blue-100" 
  },
  { 
    id: 3, 
    icon: Heart, 
    value: "1.2M+", 
    title: "Platform Appreciations", 
    desc: "Sustained community likes and bookmark nodes anchoring trending formulas.",
    color: "bg-rose-50 text-rose-500 border-rose-100" 
  },
];

export default function CulinaryMetrics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="w-full py-20 bg-white relative overflow-hidden">
      {/* Structural Floating Ambient Nodes */}
      <div className="absolute top-1/4 left-0 -translate-x-12 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 translate-x-12 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl space-y-16 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>Platform Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
            Our Kitchen by the Numbers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            We are redefining how operational restaurant-grade kitchen data layouts are stored, executed, and celebrated globally.
          </p>
        </div>

        {/* Animated Metrics Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-2xs hover:shadow-xl hover:border-slate-200/60 transition-shadow duration-300 relative group flex flex-col h-full"
              >
                <div className={`p-3 w-fit rounded-2xl border ${metric.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <div className="space-y-2 mt-auto">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    {metric.value}
                  </h3>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                    {metric.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {metric.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}