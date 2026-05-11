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
