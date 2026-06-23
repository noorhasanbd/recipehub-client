"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Heart, 
  User, 
  Menu,
  Home,
  LogOut,
  Users,
  ShieldAlert,
  CreditCard
} from "lucide-react"; 
import { Button, Drawer } from "@heroui/react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export function DashboardSideBar({userRole}) {
  console.log(userRole, "From sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Updated Admin navigation items with unique icons and "Back to Home" at the end
  const adminNavItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin/overview" },
    { icon: Users, label: "Manage User", href: "/dashboard/admin/manage-users" },
    { icon: BookOpen, label: "Manage Recipes", href: "/dashboard/admin/manage-recipes" },
    { icon: ShieldAlert, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: Home, label: "Back to Home", href: "/" },
  ];

  // Updated User navigation items with unique icons and "Back to Home" at the end
  const userNavItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/user/overview" },
    { icon: BookOpen, label: "My Recipes", href: "/dashboard/user/my-recipes" },
    { icon: PlusCircle, label: "Add Recipes", href: "/dashboard/user/add-recipe" },
    { icon: Heart, label: "My Favorites", href: "/dashboard/user/myfavorites" },
    { icon: CreditCard, label: "My Purchased Recipes", href: "/dashboard/user/purchased-recipes" },
    { icon: User, label: "Profile", href: "/dashboard/my-profile" }, // Correct this path to profile if needed
    { icon: Home, label: "Back to Home", href: "/" },
  ];

  const navlinkMap = {
    admin: adminNavItems, 
    user: userNavItems
  };

  // Replace "admin" dynamically with user role state when available
  const navItems = navlinkMap[userRole] || userNavItems; 

  // Sign out handler function
  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!");
            router.push("/");
            router.refresh();
          }
        }
      });
    } catch (err) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex flex-col h-[calc(100vh-80px)] justify-between">
      {/* Top Navigation Links */}
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

      {/* Bottom Fixed Sign Out Button Area */}
      <div className="px-6 pb-6">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl text-orange-100 hover:text-white hover:bg-red-600/20 transition-all border border-transparent hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5 text-orange-200 group-hover:text-white" />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — Vibrant Solid Orange Theme */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 bg-orange-500 sticky top-0 shadow-lg overflow-hidden">
        <div className="p-6 h-[80px] flex items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-100/80">
            Cookbook Studio
          </span>
        </div>
        {navContent}
      </aside>

      {/* Mobile Drawer Trigger Bar — Keeps header clean but drawer colorful */}
      <div className="lg:hidden p-4 border-b border-slate-100 bg-white flex items-center justify-between w-full">
        <span className="text-sm font-bold text-slate-800">Studio Panel</span>
        
        <Drawer>
          <Drawer.Trigger as={Button} variant="light" isIconOnly className="hover:bg-orange-50 text-slate-700">
              <Menu className="w-6 h-6" />
          </Drawer.Trigger>

          <Drawer.Backdrop>
            <Drawer.Content placement="left" className="bg-orange-500 max-w-[280px]">
              <Drawer.Dialog className="overflow-hidden">
                <Drawer.Header className="text-white border-b border-white/10 font-bold px-6 h-[80px] flex items-center">
                  RecipeHub Studio
                </Drawer.Header>
                <Drawer.Body className="p-0 pt-4 overflow-hidden">
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