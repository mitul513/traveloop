"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Calendar, ArrowRight, TrendingUp, Route,
  Globe2, Plus, Plane, DollarSign,
} from "lucide-react";

interface TripWithRelations {
  id: string; name: string; startDate: Date; endDate: Date;
  description: string | null; isPublic: boolean;
  stops: { id: string; cityName: string; country: string; activities: { id: string; cost: number }[] }[];
  checklists: { id: string; isPacked: boolean }[];
  notes: { id: string }[];
}

function formatDate(d: Date) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function getDaysUntil(d: Date) { return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)); }

export default function DashboardContent({ trips }: { trips: TripWithRelations[] }) {
  const totalStops = trips.reduce((s, t) => s + t.stops.length, 0);
  const totalActivities = trips.reduce((s, t) => s + t.stops.reduce((a, st) => a + st.activities.length, 0), 0);
  const totalBudget = trips.reduce((s, t) => s + t.stops.reduce((a, st) => a + st.activities.reduce((b, act) => b + act.cost, 0), 0), 0);
  const countries = new Set(trips.flatMap((t) => t.stops.map((s) => s.country)));

  const stats = [
    { label: "Total Trips", value: trips.length, icon: Route, gradient: "from-ocean-500/15 to-sky-500/15", iconColor: "text-ocean-400", valueColor: "text-ocean-300" },
    { label: "Cities Visited", value: totalStops, icon: MapPin, gradient: "from-sunset-500/15 to-coral-500/15", iconColor: "text-sunset-400", valueColor: "text-sunset-300" },
    { label: "Activities", value: totalActivities, icon: TrendingUp, gradient: "from-golden-500/15 to-sunset-500/15", iconColor: "text-golden-400", valueColor: "text-golden-300" },
    { label: "Countries", value: countries.size, icon: Globe2, gradient: "from-palm-500/15 to-ocean-500/15", iconColor: "text-palm-400", valueColor: "text-palm-300" },
  ];

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ocean-500/20 to-sky-500/20 border border-ocean-500/10 flex items-center justify-center">
            <Plane className="w-5 h-5 text-ocean-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gradient-clean">Dashboard</h1>
        </div>
        <p className="text-white/30 text-sm ml-[52px]">Your travel overview at a glance</p>
      </motion.div>

      {/* Stats — CSS stagger instead of per-card framer-motion */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={stat.label} className="travel-card p-6 group stagger-enter" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/[0.04] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <p className={`text-3xl font-black mono-nums ${stat.valueColor}`}>{stat.value}</p>
            <p className="text-xs text-white/30 mt-1.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      <div className="travel-card-glow p-7 mb-10 relative overflow-hidden stagger-enter" style={{ animationDelay: "0.25s" }}>
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-ocean-500/5 blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2.5"><DollarSign className="w-5 h-5 text-palm-400" /><span className="text-sm text-white/40 font-semibold">Total Estimated Budget</span></div>
          <span className="text-2xl font-black mono-nums text-gradient-ocean">${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden relative z-10">
          <motion.div initial={{ width: 0 }} animate={{ width: totalBudget > 0 ? "100%" : "0%" }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-ocean-600 via-ocean-400 to-sky-400" />
        </div>
      </div>

      {/* Trip Cards */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white/60">Your Trips</h2>
        <Link href="/trips"><button className="travel-btn travel-btn-primary text-sm"><Plus className="w-4 h-4" /> New Trip</button></Link>
      </div>

      {trips.length === 0 ? (
        <div className="travel-card p-16 text-center stagger-enter" style={{ animationDelay: "0.3s" }}>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ocean-500/8 to-sunset-500/8 border border-white/[0.04] flex items-center justify-center mx-auto mb-6 animate-float"><Globe2 className="w-10 h-10 text-white/10" /></div>
          <p className="text-white/30 text-lg mb-2 font-semibold">No trips yet</p>
          <p className="text-white/15 text-sm mb-8">Start planning your first adventure</p>
          <Link href="/trips"><button className="travel-btn travel-btn-primary"><Plus className="w-4 h-4" /> Create Your First Trip</button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, i) => {
            const daysUntil = getDaysUntil(trip.startDate);
            const tripCost = trip.stops.reduce((s, st) => s + st.activities.reduce((a, act) => a + act.cost, 0), 0);
            const packedCount = trip.checklists.filter((c) => c.isPacked).length;
            const totalItems = trip.checklists.length;
            return (
              <div key={trip.id} className="stagger-enter" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                <Link href={`/trips/${trip.id}`}>
                  <div className="travel-card-glow p-6 h-full cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`travel-badge ${daysUntil < 0 ? "travel-badge-muted" : daysUntil <= 7 ? "travel-badge-sunset" : "travel-badge-ocean"}`}>
                        {daysUntil < 0 ? "Completed" : daysUntil === 0 ? "Today!" : `${daysUntil}d away`}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-ocean-400 group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-ocean-300 transition-colors">{trip.name}</h3>
                    {trip.description && <p className="text-white/20 text-sm mb-4 line-clamp-2">{trip.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-white/30 mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(trip.startDate)}</span>
                      <span className="text-white/10">→</span>
                      <span>{formatDate(trip.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs pt-4 border-t border-white/[0.04]">
                      <span className="flex items-center gap-1.5 text-white/30"><MapPin className="w-3.5 h-3.5" />{trip.stops.length} stops</span>
                      <span className="mono-nums text-ocean-400 font-semibold">${tripCost.toFixed(0)}</span>
                      {totalItems > 0 && <span className="text-white/20">{packedCount}/{totalItems} packed</span>}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
