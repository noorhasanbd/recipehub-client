import CulinaryMetrics from "@/components/homepage/CulinaryMetrics";
import FeaturedRecipes from "@/components/homepage/FeaturedRecipeSection";
import Hero from "@/components/homepage/Hero";
import HomeFeatures from "@/components/homepage/HomeFeatures";
import PopularRecipes from "@/components/homepage/PopularRecipeSection";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <Hero/>
   <FeaturedRecipes/>
   <PopularRecipes/>
   <CulinaryMetrics/>
   <HomeFeatures/>
   </>
  );
}
