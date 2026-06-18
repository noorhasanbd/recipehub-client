"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  ChefHat, 
  Bookmark, 
  Settings, 
  Menu 
} from "lucide-react"; 
import { Button, Drawer } from "@heroui/react";

export function DashboardSideBar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: BookOpen, label: "My Recipes", href: "/dashboard/recipes" },
    { icon: ChefHat, label: "Meal Planner", href: "/dashboard/planner" },
    { icon: Bookmark, label: "Saved Recipes", href: "/dashboard/saved" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const navContent = (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`
              relative flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all
              ${isActive 
                ? "bg-white text-orange-600 font-bold shadow-sm" 
                : "text-orange-100 hover:text-white hover:bg-white/10"}
            `}
          >
            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-orange-600" : "text-orange-200"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar — Vibrant Solid Orange Theme */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 bg-orange-500 overflow-y-auto sticky top-0 shadow-lg">
        <div className="p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-100/80">
            Cookbook Studio
          </span>
        </div>
        <div className="py-2">
           {navContent}
        </div>
      </aside>

      {/* Mobile Drawer Trigger Bar — Keeps header clean but drawer colorful */}
      <div className="lg:hidden p-4 border-b border-slate-100 bg-white flex items-center justify-between w-full">
        <span className="text-sm font-bold text-slate-800">Studio Panel</span>
        
        <Drawer>
          <Drawer.Trigger as={Button} variant="light" isIconOnly className="hover:bg-orange-50 text-slate-700">
              <Menu className="w-6 h-6" />
          </Drawer.Trigger>

          <Drawer.Backdrop>
            {/* Swapped mobile content drawer wrapper to bg-orange-500 */}
            <Drawer.Content placement="left" className="bg-orange-500 max-w-[280px]">
              <Drawer.Dialog>
                <Drawer.Header className="text-white border-b border-white/10 font-bold px-6 py-5">
                  RecipeHub Studio
                </Drawer.Header>
                <Drawer.Body className="p-0 pt-4">
                  {navContent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}