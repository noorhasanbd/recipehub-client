import { DashboardSideBar } from "@/components/dashboard/DashboardSideBar";
import React from "react";


// Crucial: Make sure "children" is destructured here!
export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50/50">
      <DashboardSideBar />

      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Crucial: This variable prints your page.jsx content! */}
        {children} 
      </main>
    </div>
  );
}