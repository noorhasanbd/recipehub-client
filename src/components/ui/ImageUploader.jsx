"use client";

import React, { useState } from "react";
import { FiUploadCloud, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ImageUploader({ onUploadSuccess, defaultImageUrl = "" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImageUrl);
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local client-side preview instantly
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setStatus("idle");

    // Prepare Multipart Form Data for ImgBB API requirements
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedUrl = result.data.url;
        setPreview(uploadedUrl);
        setStatus("success");
        // Pass the fresh permanent hosting URL back up to the parent form state
        onUploadSuccess(uploadedUrl);
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("ImgBB Upload Exception:", err);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all bg-slate-50/50 ${
        status === "success" 
          ? "border-emerald-500 bg-emerald-50/10" 
          : status === "error" 
            ? "border-rose-400 bg-rose-50/10" 
            : "border-slate-200 hover:border-orange-500"
      }`}>
        
        {preview ? (
          <div className="flex items-center gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Preview" 
              className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-xs" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">Image Attached</p>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {uploading ? "Uploading to ImgBB clouds..." : "Hosted securely on ImgBB"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <FiUploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Click to upload avatar</p>
            <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 32MB</p>
          </div>
        )}

        {/* Hidden File Input overlaying container context */}
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
        />

        {/* Floating status badges */}
        <div className="absolute top-3 right-3">
          {uploading && <FiLoader className="w-4 h-4 text-orange-500 animate-spin" />}
          {status === "success" && !uploading && <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
          {status === "error" && !uploading && <FiAlertCircle className="w-4 h-4 text-rose-500" />}
        </div>
      </div>
    </div>
  );
}