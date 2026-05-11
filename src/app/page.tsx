"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Map,
  Compass,
  Wallet,
  CheckSquare,
  StickyNote,
  Route,
  Plane,
  MapPin,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Map,
    title: "Multi-City Routes",
    desc: "Chain unlimited stops across continents with a living timeline.",
    bg: "bg-ocean-500/10",
    iconColor: "text-ocean-600",
  },
  {
    icon: Compass,
    title: "Activity Planner",
    desc: "Organize sightseeing, dining, and adventures per destination.",
    bg: "bg-sunset-500/10",
    iconColor: "text-sunset-600",
  },
  {
    icon: Wallet,
    title: "Smart Budget",
    desc: "Real-time analytics with per-city cost breakdowns.",
    bg: "bg-palm-500/10",
    iconColor: "text-palm-600",
  },
  {
    icon: CheckSquare,
    title: "Packing Lists",
    desc: "Categorized checklists with visual progress tracking.",
    bg: "bg-golden-500/10",
    iconColor: "text-golden-600",
  },
  {
    icon: StickyNote,
    title: "Travel Notes",
    desc: "Attach notes to stops or entire trips instantly.",
    bg: "bg-coral-500/10",
    iconColor: "text-coral-600",
  },
  {
    icon: Route,
    title: "Route Timeline",
    desc: "Visualize your entire journey as a beautiful interactive map.",
    bg: "bg-sky-500/10",
    iconColor: "text-sky-600",
  },
];

const destinations = [
  { name: "Tokyo", emoji: "🗼", badge: "travel-badge-ocean" },
  { name: "Paris", emoji: "🗼", badge: "travel-badge-sunset" },
  { name: "Bali", emoji: "🌴", badge: "travel-badge-palm" },
  { name: "Santorini", emoji: "🏝️", badge: "travel-badge-golden" },
  { name: "New York", emoji: "🗽", badge: "travel-badge-coral" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 40 };

export default function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  // Optimized IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-surface-900">
        {/* ─── Hero ──────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-20 relative">
          {/* Subtle Atmosphere Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-ocean-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-5xl mx-auto relative z-10"
          >
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, ...spring }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-ocean-500/10 text-sm text-ocean-600 mb-10 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-golden-500" />
              <span className="font-semibold tracking-wide">Your 2027 adventure starts here</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] mb-8 text-surface-950">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-gradient-hero block"
              >
                Plan. Explore.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-gradient-sunset block mt-2"
              >
                Loop the World.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Craft premium multi-city itineraries, manage budgets, and organize every
              detail — from first flight to final sunset, in an effortless 2027 design.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-4 flex-wrap mb-16"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                  className="travel-btn travel-btn-primary text-base px-8 py-4"
                >
                  <Globe2 className="w-5 h-5" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/trips">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                  className="travel-btn text-base px-8 py-4"
                >
                  <Map className="w-5 h-5" />
                  View My Trips
                </motion.button>
              </Link>
            </motion.div>

            {/* Destination Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.08, ...spring }}
                  className={`travel-badge ${dest.badge}`}
                >
                  <span>{dest.emoji}</span>
                  {dest.name}
                </motion.div>
              ))}
              <span className="text-text-light text-sm ml-1 font-medium">& 190+ more</span>
            </motion.div>
          </motion.div>

          {/* Clean minimal divider */}
          <div className="max-w-4xl mx-auto my-28 border-t border-surface-700/50" />

          {/* ─── Features Grid ───────────────────────── */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {features.map((f, i) => (
              <div
                key={f.title}
                className="reveal card-3d"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="p-8 group cursor-default h-full bg-white flex flex-col items-start">
                  <div
                    className={`feature-icon-box ${f.bg} mb-6`}
                  >
                    <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-text-main font-bold text-xl mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── CTA Banner ──────────────────────────── */}
          <div className="reveal mt-32 max-w-5xl mx-auto">
            <div className="travel-card-elevated p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-10 relative overflow-hidden bg-white">
              <div className="accent-bar" />
              <div className="text-center sm:text-left relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4 tracking-tight">
                  Ready to start planning?
                </h2>
                <p className="text-text-muted text-lg max-w-md">
                  Create your first trip in seconds. Add stops, activities, and track every dollar.
                </p>
              </div>
              <Link href="/trips" className="relative z-10 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="travel-btn travel-btn-warm text-base px-8 py-4 shadow-lg shadow-sunset-500/20"
                >
                  <MapPin className="w-5 h-5" />
                  Start Planning Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-surface-700/50 pt-10 pb-8 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-text-light font-medium">
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-ocean-500/50" />
              © 2026 Traveloop
            </span>
            <span className="mono-nums text-xs font-bold tracking-widest text-ocean-600/50">v4.0 // ODYSSEY</span>
          </div>
        </footer>
      </main>
    </>
  );
}
