"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, LayoutDashboard, Map, PlaneTakeoff } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Globe },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-md border border-surface-700 shadow-sm"
              : "bg-white/50 backdrop-blur-sm border border-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-600 flex items-center justify-center shadow-sm shadow-ocean-500/20 group-hover:shadow-ocean-500/40 transition-all duration-300 group-hover:scale-105">
              <PlaneTakeoff className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight group-hover:text-ocean-600 transition-colors">
              Traveloop
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200
                    ${
                      isActive
                        ? "text-ocean-600"
                        : "text-text-muted hover:text-text-main hover:bg-surface-800/50"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-ocean-500/10 rounded-xl border border-ocean-500/20"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                  <Icon className="w-4.5 h-4.5 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
