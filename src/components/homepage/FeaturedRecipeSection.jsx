"use client";

import { useRef } from "react";
import { Card } from "@heroui/react";
import { motion, useScroll, useTransform } from "framer-motion";

const RECIPES = [
  {
    id: 1,
    title: "Crispy Pan-Seared Salmon",
    description: "By Chef Marcus Vance",
    time: "25 mins",
    difficulty: "Medium",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600",
    category: "Seafood"
  },
  {
    id: 2,
    title: "Authentic Sourdough Bread",
    description: "By Baker Elena Rostova",
    time: "18 hrs",
    difficulty: "Hard",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
    category: "Baking"
  },
  {
    id: 3,
    title: "Zesty Avocado Salad Bowl",
    description: "By GreenKitchen",
    time: "10 mins",
    difficulty: "Easy",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    category: "Vegan"
  },
  {
    id: 4,
    title: "Slow-Braised Beef Short Ribs",
    description: "By Chef Marcus Vance",
    time: "3.5 hrs",
    difficulty: "Hard",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    category: "Dinner"
  }
];

export default function FeaturedRecipes() {
  const sectionRef = useRef(null);

  // Hook into the scroll progress specifically for this featured element transition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"], // Starts when top of section hits bottom of screen
  });

  // Dynamic values synchronized to mirror the Hero's ease metrics
  // As the section scrolls into view:
  const gridScale = useTransform(scrollYProgress, [0, 0.8], [0.95, 1]); // Expands out gently
  const gridY = useTransform(scrollYProgress, [0, 0.8], [60, 0]);        // Slides up to break into place
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]); 
  const headingX = useTransform(scrollYProgress, [0.1, 0.6], [-30, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 lg:py-32 overflow-hidden bg-white"
    >
      {/* BACKGROUND MATCHER TIE-IN */}
      {/* Using an overlay texture that mirrors the cooking layout style of the hero background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04] mix-blend-luminosity pointer-events-none z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200')` 
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* SCROLL-SYNCHRONIZED SECTION HEADER */}
        <motion.div 
          style={{ opacity: headingOpacity, x: headingX }}
          className="mb-12 lg:mb-16 text-center sm:text-left"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
            Weekly Curation
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-4 lg:text-4xl tracking-tight">
            Featured Recipes
          </h2>
        </motion.div>

        {/* SCROLL-SYNCHRONIZED RESPONSIVE GRID */}
        <motion.div 
          style={{ 
            scale: gridScale,
            y: gridY
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {RECIPES.map((recipe, index) => (
            <div key={recipe.id} className="w-full select-none">
              
              {/* HERO UI V3 STANDARD CARD STRUCTURE */}
              <Card className="h-full border border-gray-100/70 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group">
                
                {/* CARD CONTENT */}
                <Card.Content className="p-0 relative h-48 w-full overflow-hidden bg-slate-100">
                  <span className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs">
                    {recipe.category}
                  </span>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable="false"
                  />
                </Card.Content>

                {/* CARD HEADER */}
                <Card.Header className="px-5 pt-5 pb-3 flex flex-col items-start gap-1">
                  <Card.Title className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-1">
                    {recipe.title}
                  </Card.Title>
                  <Card.Description className="text-xs text-slate-400 font-medium">
                    {recipe.description}
                  </Card.Description>
                </Card.Header>

                {/* CARD FOOTER */}
                <Card.Footer className="px-5 pb-5 mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/50">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500">⏱</span>
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500">📊</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-700">
                    <span>★</span>
                    <span>{recipe.rating}</span>
                  </div>
                </Card.Footer>

              </Card>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}