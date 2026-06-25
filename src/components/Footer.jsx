import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const primaryLinks = [
  { label: "Recipes", href: "/recipes" },
  { label: "Collections", href: "/collections" },
  { label: "Community", href: "/community" },
  { label: "Meal Planner", href: "/planner" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    /* 🌟 Updated to a light brand orange tint background with subtle styling */
    <footer className="w-full bg-orange-50/60 border-t border-orange-100/50 mt-auto py-8">
      <div className="container mx-auto px-6 max-w-6xl space-y-6">

        {/* Top row: Stacked centered on mobile, perfectly aligned inline on desktop */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-orange-100/60">

          {/* 1. Logo */}
          <Link href="/" className="flex items-center justify-center shrink-0">
            <Image
              src="/rhlogo2.png"
              alt="RecipeHub"
              width={110}
              height={32}
              loading="lazy"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* 2. Primary Nav */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-8">
            {primaryLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 3. Social Profile Connections */}
          <div className="flex items-center justify-center gap-2 shrink-0">
            <a
              href="https://www.facebook.com/noor.hasan456"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              aria-label="Follow our Facebook community profile"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/noor.hasan456/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Follow our Instagram dynamic feed updates"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>

          {/* 4. Legal Links */}
          <ul className="flex items-center justify-center gap-5 shrink-0">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

        </div>

        {/* Bottom row: Center-aligned typography */}
        <div className="flex flex-col items-center justify-center text-center gap-2 pt-1">
          <p className="text-xs text-slate-500">
            &copy; {currentYear}{" "}
            <span className="font-bold text-slate-700">
              Recipe<span className="text-orange-600">Hub</span>
            </span>
            . Built for the modern culinary community.
          </p>

          <p className="text-[11px] font-medium text-slate-400">
            Made with care
          </p>
        </div>

      </div>
    </footer>
  );
}