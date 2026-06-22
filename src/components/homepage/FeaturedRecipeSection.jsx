"use client";

import { useRef, useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { motion, useScroll, useTransform, useAnimationControls } from "framer-motion";
import { Loader2, Star, Clock, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllRecipes } from "@/app/lib/actions/recipeActions/manageRecipes";

export default function FeaturedRecipes() {
  const sectionRef = useRef(null);
  const carouselConstraintsRef = useRef(null); 
  const sliderTrackRef = useRef(null);

  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // 🌟 Framer Motion Animation Controls for programmatic Cubic Bezier sliding
  const trackControls = useAnimationControls();
  const currentX = useRef(0);

  // 1. Fetch live documents from MongoDB on mount
  useEffect(() => {
    async function loadFeaturedData() {
      try {
        setIsLoading(true);
        const result = await getAllRecipes({ page: 1, limit: 100 });
        
        if (result.success && Array.isArray(result.data)) {
          const onlyFeatured = result.data.filter((recipe) => recipe.isFeatured === true);
          setFeaturedRecipes(onlyFeatured); 
        }
      } catch (err) {
        console.error("Failed to load featured recipes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeaturedData();
  }, []);

  // 2. Compute drag boundary constraints accurately
  useEffect(() => {
    if (!isLoading && featuredRecipes.length > 0 && sliderTrackRef.current && carouselConstraintsRef.current) {
      const computeBounds = () => {
        const trackWidth = sliderTrackRef.current.scrollWidth;
        const containerWidth = carouselConstraintsRef.current.offsetWidth;
        setDragConstraints({
          left: -(trackWidth - containerWidth + 16), 
          right: 0
        });
      };

      computeBounds();
      window.addEventListener("resize", computeBounds);
      return () => window.removeEventListener("resize", computeBounds);
    }
  }, [isLoading, featuredRecipes]);

  // 3. Centralized Slide Action Engine with Custom Cubic Bezier Transition Vector
  const animateToPosition = async (newX) => {
    // Clamp the value within valid structural left/right boundary constraints
    const clampedX = Math.max(dragConstraints.left, Math.min(0, newX));
    currentX.current = clampedX;

    await trackControls.start({
      x: clampedX,
      transition: {
        type: "tween",
        ease: [0.22, 1, 0.36, 1], // 🌟 Custom Quintic Bezier Curve for ultra-smooth easing
        duration: 0.85 // Sightly prolonged for elegant motion glide profiles
      }
    });
  };

  const handleManualSlide = (direction) => {
    setIsAutoPlaying(false); // Halt automation on user engagement
    const cardStep = 344; // Card width (320px) + Gap (24px)
    
    let targetX = direction === "left" ? currentX.current + cardStep : currentX.current - cardStep;

    // Loop cycle checks
    if (direction === "right" && currentX.current <= dragConstraints.left + 10) {
      targetX = 0; // Snap back to the beginning
    } else if (direction === "left" && currentX.current >= -10) {
      targetX = dragConstraints.left; // Jump directly to the final card element
    }

    animateToPosition(targetX);
  };

  // 4. Automated Bezier Slide Effect Interval Loop
  useEffect(() => {
    if (!isAutoPlaying || isLoading || featuredRecipes.length === 0 || dragConstraints.left === 0) return;

    const autoPlayInterval = setInterval(() => {
      const cardStep = 344;
      let targetX = currentX.current - cardStep;

      if (currentX.current <= dragConstraints.left + 10) {
        targetX = 0; 
      }

      animateToPosition(targetX);
    }, 4500); 

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying, isLoading, featuredRecipes, dragConstraints]);

  // Viewport scroll effects mapping
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const trackScale = useTransform(scrollYProgress, [0, 0.8], [0.96, 1]);
  const trackY = useTransform(scrollYProgress, [0, 0.8], [30, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const headingX = useTransform(scrollYProgress, [0.1, 0.6], [-20, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 lg:py-32 overflow-hidden bg-white select-none"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04] mix-blend-luminosity pointer-events-none z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200')` 
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header Row Layout */}
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <motion.div style={{ opacity: headingOpacity, x: headingX }} className="text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
              Weekly Curation
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4 lg:text-4xl tracking-tight">
              Featured Recipes
            </h2>
          </motion.div>

          {/* Action Slide Buttons */}
          {!isLoading && featuredRecipes.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleManualSlide("left")}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleManualSlide("right")}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Display Grid Matrix rendering wrappers */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
            <p className="text-sm text-slate-400 font-medium">Assembling curated list...</p>
          </div>
        ) : featuredRecipes.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12 font-medium">
            No featured items currently marked in the repository.
          </p>
        ) : (
          <div 
            ref={carouselConstraintsRef}
            className="w-full overflow-hidden pb-6"
            onPointerDown={() => setIsAutoPlaying(false)}
          >
            <motion.div 
              ref={sliderTrackRef}
              animate={trackControls} // 🌟 Driven by our custom animate controls engine
              style={{ scale: trackScale, y: trackY }}
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                // Update internal currentX reference post-drag so click buttons sync seamlessly
                currentX.current = info.point.x - e.target.getBoundingClientRect().left;
              }}
              className="flex gap-6 w-max px-2 cursor-grab active:cursor-grabbing"
            >
              {featuredRecipes.map((recipe) => (
                <Link 
                  key={recipe._id} 
                  href={`/recipes/${recipe._id}`}
                  className="w-[280px] sm:w-[320px] block group outline-none pointer-events-auto"
                  draggable="false"
                >
                  <Card className="h-full border border-gray-100/70 bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col pointer-events-none">
                    
                    {/* Card Media Asset Frame */}
                    <Card.Content className="p-0 relative h-48 w-full overflow-hidden bg-slate-100">
                      <span className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs">
                        {recipe.category}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"}
                        alt={recipe.recipeName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable="false"
                      />
                    </Card.Content>

                    <Card.Header className="px-5 pt-5 pb-3 flex flex-col items-start gap-1">
                      <Card.Title className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-1">
                        {recipe.recipeName}
                      </Card.Title>
                      <Card.Description className="text-xs text-slate-400 font-medium">
                        By {recipe.authorName}
                      </Card.Description>
                    </Card.Header>

                    <Card.Footer className="px-5 pb-5 mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{recipe.preparationTime} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
                        <span>{recipe.difficultyLevel}</span>
                      </div>
                      <div className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-700 font-bold">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{recipe.likesCount || 0}</span>
                      </div>
                    </Card.Footer>

                  </Card>
                </Link>
              ))}
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}