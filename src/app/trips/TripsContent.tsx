"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
  Route,
  Trash2,
  X,
  Plane,
  AlertTriangle,
} from "lucide-react";
import { createTrip, deleteTrip } from "@/lib/actions";

interface TripData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  stops: { id: string; cityName: string; country: string }[];
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const spring = { type: "spring" as const, stiffness: 400, damping: 40 };

export default function TripsContent({ trips }: { trips: TripData[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCreate(formData: FormData) {
    setCreating(true);
    try {
      await createTrip(formData);
      setShowForm(false);
      startTransition(() => router.refresh());
    } catch {
      /* empty */
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTrip(id);
      startTransition(() => router.refresh());
    } catch {
      /* empty */
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sunset-500/10 to-coral-500/10 border border-sunset-500/20 flex items-center justify-center">
              <Route className="w-6 h-6 text-sunset-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-text-main tracking-tight">
              My Trips
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-[60px] font-medium">
            {trips.length} trip{trips.length !== 1 && "s"} planned
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          onClick={() => setShowForm(true)}
          className="travel-btn travel-btn-primary shadow-lg shadow-ocean-500/20"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </motion.button>
      </motion.div>

      {/* ─── Create Form Modal ───────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              className="travel-card-elevated p-8 w-full max-w-lg relative"
            >
              <div className="accent-bar" />

              <button
                onClick={() => setShowForm(false)}
                className="absolute top-5 right-5 text-text-muted hover:text-text-main transition-colors p-2 hover:bg-surface-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-ocean-50 border border-ocean-100 flex items-center justify-center">
                  <Plane className="w-6 h-6 text-ocean-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main">
                    Plan a New Trip
                  </h2>
                  <p className="text-sm text-text-muted font-medium">
                    Where to next? ✈️
                  </p>
                </div>
              </div>

              <form action={handleCreate} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-text-main mb-2 block">
                    Trip Name
                  </label>
                  <input
                    name="name"
                    required
                    className="travel-input"
                    placeholder="e.g. European Adventure 2027"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text-main mb-2 block">
                    Description <span className="text-text-light font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="travel-input resize-none"
                    placeholder="A brief overview of your journey"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-text-main mb-2 block">
                      Start Date
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      className="travel-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-text-main mb-2 block">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      required
                      className="travel-input"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="travel-btn travel-btn-primary flex-1 justify-center disabled:opacity-50 text-base py-3 shadow-md"
                  >
                    {creating ? (
                      <div className="travel-spinner" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Trip
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="travel-btn py-3 text-base font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation ──────────────── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              className="travel-card-elevated p-8 w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Delete Trip?</h3>
              <p className="text-sm text-text-muted mb-8 leading-relaxed">
                This will permanently remove the trip and all its stops, activities, and notes.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={deletingId === confirmDeleteId}
                  className="travel-btn travel-btn-danger flex-1 justify-center py-3"
                >
                  {deletingId === confirmDeleteId ? (
                    <div className="travel-spinner" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="travel-btn flex-1 justify-center py-3 font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Empty State ─────────────────────── */}
      {trips.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="travel-card p-24 text-center relative overflow-hidden bg-white shadow-sm border border-surface-700/50"
        >
          <div className="absolute inset-0 opacity-[0.03]">
            <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
              <path d="M50 150 Q150 50 200 100 Q250 150 350 50" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>
          <div className="w-24 h-24 rounded-3xl bg-ocean-50 border border-ocean-100 flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-ocean-400" />
          </div>
          <p className="text-text-main text-2xl font-bold mb-3 tracking-tight">
            No trips planned yet
          </p>
          <p className="text-text-muted text-base mb-8 max-w-sm mx-auto">
            Create your first trip and start adding stops, activities, and budgets to loop the world.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="travel-btn travel-btn-primary px-6 py-3 text-base shadow-md"
          >
            <Plus className="w-5 h-5" />
            Plan Your First Trip
          </button>
        </motion.div>
      ) : (
        /* ─── Trip Cards ───────────────────────── */
        <div className="space-y-5">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ...spring }}
            >
              <div className="card-3d p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    {trip.stops.length > 0 && (
                      <div className="flex -space-x-2">
                        {trip.stops.slice(0, 3).map((s, si) => (
                          <div
                            key={s.id}
                            className="w-8 h-8 rounded-full bg-surface-800 border-2 border-white flex items-center justify-center text-xs shadow-sm"
                            style={{ zIndex: 3 - si }}
                          >
                            🌍
                          </div>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-text-main group-hover:text-ocean-600 transition-colors truncate tracking-tight">
                      {trip.name}
                    </h3>
                  </div>
                  {trip.description && (
                    <p className="text-text-muted text-base mt-1 truncate max-w-2xl">
                      {trip.description}
                    </p>
                  )}
                  <div className="flex items-center gap-6 mt-4 text-sm font-medium text-text-light flex-wrap">
                    <span className="flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg border border-surface-700/50">
                      <Calendar className="w-4 h-4 text-ocean-500" />
                      {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                    </span>
                    <span className="flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg border border-surface-700/50">
                      <MapPin className="w-4 h-4 text-sunset-500" />
                      {trip.stops.length} stop{trip.stops.length !== 1 && "s"}
                    </span>
                    {trip.stops.length > 0 && (
                      <div className="flex items-center gap-2 text-ocean-600 font-semibold bg-ocean-50 px-3 py-1.5 rounded-lg border border-ocean-100">
                        <Route className="w-4 h-4" />
                        {trip.stops.map((s) => s.cityName).join(" → ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-surface-700/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDeleteId(trip.id)}
                    className="travel-btn bg-white hover:bg-red-50 border-surface-700 hover:border-red-200 text-text-light hover:text-red-500 p-3 !rounded-xl"
                    aria-label="Delete trip"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </motion.button>
                  <Link href={`/trips/${trip.id}`} className="flex-1 sm:flex-none">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="travel-btn travel-btn-primary p-3 !rounded-xl w-full flex justify-center items-center shadow-md shadow-ocean-500/20"
                      aria-label="View trip"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
