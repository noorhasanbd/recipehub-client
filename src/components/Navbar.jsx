"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button, Spinner } from "@heroui/react";
import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userRole = user?.role;
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close user profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Signs the user out and clean-redirects them to signin
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { label: "Browse Recipes", href: "/recipes" },
    { label: "Top Chefs", href: "/chefs" },
    { label: "Pricing", href: "/pricing" },
  ];

  // Dynamic dashboard destination helper
  const dashboardHref =
    userRole === "admin"
      ? "/dashboard/admin/overview"
      : "/dashboard/user/overview";
  const profileHref =
    userRole === "admin"
      ? "/dashboard/admin/profile"
      : "/dashboard/user/profile";

  return (
    <nav className="sticky top-0 z-50 bg-white w-full border-b border-gray-100 py-3">
      <div className="mx-auto container max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 h-20 flex items-center justify-between">
          {/* Logo Wrapper */}
          <Link href="/" className="flex items-center h-full py-1.5 gap-2">
            <Image
              src="/rhlogo2.png"
              alt="RecipeHub Logo"
              width={160}
              height={160}
              loading="eager"
              priority
              className="h-full w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 md:flex">
              {/* Main Navigation Links */}
              <ul className="flex items-center gap-1 rounded-full border border-gray-200/70 bg-gray-100/70 px-3 py-1.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-orange-500 hover:text-white hover:shadow-xs"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="h-6 w-px bg-gray-200" />

              {/* Action Auth Links / User Control Menu */}
              <div className="flex items-center gap-4">
                {isPending ? (
                  <Spinner size="sm" color="warning" />
                ) : user ? (
                  /* DESKTOP PROFILE AVATAR MENU CONTAINER */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white rounded-full transition-transform hover:scale-105"
                    >
                      <Image
                        src={user.image || "/default-avatar.png"}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="rounded-full border border-gray-200 object-cover"
                      />
                    </button>

                    {/* DROPDOWN MENU PANEL */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-slate-400 truncate">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {user.name}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href={profileHref}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>

                          <Link
                            href={dashboardHref}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                              />
                            </svg>
                            Dashboard
                          </Link>
                        </div>

                        <div className="py-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleSignOut();
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
                    >
                      Sign Im
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-orange-50 hover:text-orange-500 md:hidden transition-colors"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMenuOpen && (
        <div className="mx-auto container max-w-7xl px-4 mt-2 md:hidden">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-600 hover:text-orange-500 text-base font-medium py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
              {isPending ? (
                <div className="flex justify-center py-2">
                  <Spinner size="sm" color="warning" />
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                    <Image
                      src={user.image || "/default-avatar.png"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-semibold text-sm">
                        {user.name}
                      </span>
                      <span className="text-slate-400 text-xs truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={profileHref}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>

                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-left text-red-500 hover:text-red-600 text-sm font-medium transition-colors pt-2 border-t border-gray-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-orange-500 hover:text-orange-600 font-medium text-center py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button
                    as={Link}
                    href="/auth/signup"
                    radius="lg"
                    className="w-full bg-slate-900 text-white font-bold shadow-sm hover:bg-slate-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
