import FeaturedRecipes from "@/components/homepage/FeaturedRecipeSection";
import Hero from "@/components/homepage/Hero";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <Hero/>
   <FeaturedRecipes/>
   </>
  );
}
