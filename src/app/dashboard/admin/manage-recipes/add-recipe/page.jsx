"use client"
import RecipeForm from "@/components/admin/RecipeForm";

export default function AddRecipePage() {
  const handleCreate = async (recipePayload) => {
    // Send directly to server actions or fetch API endpoint router
    console.log("Creating new document record...", recipePayload);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <RecipeForm onSubmit={handleCreate} onCancel={() => router.back()} />
    </div>
  );
}