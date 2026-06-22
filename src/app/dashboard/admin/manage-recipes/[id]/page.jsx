"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RecipeView from "@/components/RecipeView";


export default function AdminRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRecipe() {
      const response = await fetch(`http://localhost:5000/api/recipes/${params.id}`);
      const result = await response.json();
      if (result.success) setRecipe(result.data);
      setIsLoading(false);
    }
    if (params.id) getRecipe();
  }, [params.id]);

  if (isLoading) return <div className="p-12 text-center text-sm text-slate-400">Loading admin view...</div>;

  return (
    <RecipeView 
      recipe={recipe} 
      onBack={() => router.push("/dashboard/admin/manage-recipes")} 
      backText="Back to Admin Dashboard" 
    />
  );
}