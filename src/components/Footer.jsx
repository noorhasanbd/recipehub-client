import Link from "next/link";
import Image from "next/image";

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
    <footer className="w-full bg-white border-t border-gray-100 mt-auto py-8">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Top row: Responsive Stack -> Desktop Row */}
        {/* Changed: grid-cols-1 by default, shifts to grid-cols-[auto_1fr_auto] on md screens */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center justify-items-center md:justify-items-stretch gap-6 md:gap-8 pb-6 border-b border-gray-100">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/rhlogo2.png"
              alt="RecipeHub"
              width={110}
              height={32}
              loading="lazy"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Primary nav — centered on desktop, wrapped on mobile */}
          {/* Changed: flex-wrap with gap-y-3 and center alignment for clean mobile grids */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-8">
            {primaryLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-orange-500 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Legal links — right-aligned on desktop, centered on mobile */}
          <ul className="flex items-center justify-center md:justify-end gap-5 shrink-0">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

        </div>

        {/* Bottom row: copyright | tagline */}
        {/* Changed: flex-col items-center on mobile, changing to flex-row justify-between on sm screens */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 pt-5">
          <p className="text-xs text-slate-400">
            &copy; {currentYear}{" "}
            <span className="font-semibold text-slate-600">
              Recipe<span className="text-orange-500">Hub</span>
            </span>
            . Built for the modern culinary community.
          </p>

          <p className="text-xs text-slate-300 hidden sm:block">
            Made with care
          </p>
        </div>

      </div>
    </footer>
  );
}