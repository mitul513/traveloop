"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Calendar, Plus, Trash2, X,
  ChevronDown, ChevronRight, Clock, DollarSign,
  GripVertical, StickyNote, Send, Plane, Route,
} from "lucide-react";
import {
  addStop, deleteStop, addActivity, deleteActivity, addNote, deleteNote,
} from "@/lib/actions";
import BudgetPanel from "@/components/BudgetPanel";
import ChecklistPanel from "@/components/ChecklistPanel";

interface Activity { id: string; name: string; category: string; cost: number; duration: number; }
interface NoteItem { id: string; content: string; timestamp: Date; stopId: string | null; }
interface Stop { id: string; cityName: string; country: string; arrival: Date; departure: Date; orderIndex: number; activities: Activity[]; notes: NoteItem[]; }
interface ChecklistItem { id: string; itemName: string; category: string; isPacked: boolean; }
interface TripDetail { id: string; name: string; startDate: Date; endDate: Date; description: string | null; stops: Stop[]; checklists: ChecklistItem[]; notes: NoteItem[]; }

function formatDate(d: Date) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function formatDateFull(d: Date) { return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }

const ACTIVITY_CATEGORIES = ["Sightseeing","Food & Dining","Transportation","Accommodation","Shopping","Entertainment","Adventure","Culture","Wellness","Other"];

const categoryColors: Record<string, string> = {
  Sightseeing: "bg-ocean-50 text-ocean-600 border-ocean-100",
  "Food & Dining": "bg-sunset-50 text-sunset-600 border-sunset-100",
  Transportation: "bg-purple-50 text-purple-600 border-purple-100",
  Accommodation: "bg-sky-50 text-sky-600 border-sky-100",
  Shopping: "bg-coral-50 text-coral-600 border-coral-100",
  Entertainment: "bg-golden-50 text-golden-600 border-golden-100",
  Adventure: "bg-red-50 text-red-600 border-red-100",
  Culture: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Wellness: "bg-palm-50 text-palm-600 border-palm-100",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

const categoryLeftBorder: Record<string, string> = {
  Sightseeing: "border-l-ocean-400", "Food & Dining": "border-l-sunset-400",
  Transportation: "border-l-purple-400", Accommodation: "border-l-sky-400",
  Shopping: "border-l-coral-400", Entertainment: "border-l-golden-400",
  Adventure: "border-l-red-400", Culture: "border-l-indigo-400",
  Wellness: "border-l-palm-400", Other: "border-l-gray-400",
};

export default function TripDetailContent({ trip }: { trip: TripDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showStopForm, setShowStopForm] = useState(false);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set(trip.stops.map((s) => s.id)));
  const [activityFormStop, setActivityFormStop] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "checklist" | "notes">("itinerary");
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);

  function toggleStop(id: string) {
    const next = new Set(expandedStops);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedStops(next);
  }

  const totalCost = trip.stops.reduce((s, st) => s + st.activities.reduce((a, act) => a + act.cost, 0), 0);

  const tabs = [
    { key: "itinerary" as const, label: "Itinerary", icon: Route },
    { key: "budget" as const, label: "Budget", icon: DollarSign },
    { key: "checklist" as const, label: "Checklist", icon: MapPin },
    { key: "notes" as const, label: "Notes", icon: StickyNote },
  ];

  const spring = { type: "spring" as const, stiffness: 400, damping: 40 };

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-ocean-600 transition-colors mb-4 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to trips
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ocean-50 to-sunset-50 border border-ocean-100 flex items-center justify-center shadow-sm">
                <Plane className="w-5 h-5 text-ocean-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-text-main tracking-tight">{trip.name}</h1>
            </div>
            {trip.description && <p className="text-text-muted text-base mb-3 ml-[52px]">{trip.description}</p>}
            <div className="flex items-center gap-4 text-sm font-medium text-text-light ml-[52px] flex-wrap">
              <span className="flex items-center gap-1.5 bg-surface-800/50 px-2 py-1 rounded-lg border border-surface-700/50"><Calendar className="w-4 h-4 text-ocean-500" />{formatDateFull(trip.startDate)} → {formatDateFull(trip.endDate)}</span>
              <span className="flex items-center gap-1.5 bg-surface-800/50 px-2 py-1 rounded-lg border border-surface-700/50"><MapPin className="w-4 h-4 text-sunset-500" />{trip.stops.length} stop{trip.stops.length !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1.5 bg-ocean-50 px-2 py-1 rounded-lg border border-ocean-100 text-ocean-600 font-bold"><DollarSign className="w-4 h-4" />{totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-1 mb-8 p-1.5 bg-surface-900 rounded-2xl w-fit border border-surface-700/50 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 ${activeTab === tab.key ? "text-ocean-600" : "text-text-muted hover:text-text-main"}`}>
            {activeTab === tab.key && (
              <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white rounded-xl border border-surface-700/50 shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            )}
            <tab.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* ─── ITINERARY TAB ──────────────────────────── */}
      {activeTab === "itinerary" && (
        <motion.div key="itinerary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Route className="w-5 h-5 text-ocean-500" /> Route Timeline
            </h2>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowStopForm(true)} className="travel-btn travel-btn-primary shadow-md shadow-ocean-500/20">
              <Plus className="w-4 h-4" /> Add Stop
            </motion.button>
          </div>

          {/* Add Stop Modal */}
          <AnimatePresence>
            {showStopForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm">
                <div className="absolute inset-0" onClick={() => setShowStopForm(false)} />
                <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={spring} className="travel-card-elevated p-8 w-full max-w-lg relative z-10">
                  <div className="accent-bar" />
                  <button onClick={() => setShowStopForm(false)} className="absolute top-5 right-5 text-text-muted hover:text-text-main transition-colors p-2 hover:bg-surface-800 rounded-full"><X className="w-5 h-5" /></button>
                  <div className="flex items-center gap-4 mb-8 mt-2">
                    <div className="w-12 h-12 rounded-2xl bg-ocean-50 border border-ocean-100 flex items-center justify-center"><Plane className="w-6 h-6 text-ocean-500" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-text-main">Add a Destination</h2>
                      <p className="text-sm text-text-muted font-medium">Next stop on the journey 🌍</p>
                    </div>
                  </div>
                  <form action={async (fd) => { setSubmitting("stop"); await addStop(fd); setShowStopForm(false); setSubmitting(null); startTransition(() => router.refresh()); }} className="space-y-6">
                    <input type="hidden" name="tripId" value={trip.id} />
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm font-bold text-text-main mb-2 block">City</label><input name="cityName" required placeholder="e.g. Paris" className="travel-input" /></div>
                      <div><label className="text-sm font-bold text-text-main mb-2 block">Country</label><input name="country" required placeholder="e.g. France" className="travel-input" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm font-bold text-text-main mb-2 block">Arrival</label><input name="arrival" type="date" required className="travel-input" /></div>
                      <div><label className="text-sm font-bold text-text-main mb-2 block">Departure</label><input name="departure" type="date" required className="travel-input" /></div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" disabled={submitting === "stop"} className="travel-btn travel-btn-primary flex-1 justify-center disabled:opacity-50 text-base py-3 shadow-md">
                        {submitting === "stop" ? <div className="travel-spinner" /> : <><Plus className="w-5 h-5" /> Add Stop</>}
                      </button>
                      <button type="button" onClick={() => setShowStopForm(false)} className="travel-btn py-3 text-base font-bold">Cancel</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline */}
          {trip.stops.length === 0 ? (
            <div className="travel-card p-24 text-center relative overflow-hidden bg-white shadow-sm border border-surface-700/50">
              <div className="absolute inset-0 opacity-[0.03]">
                <svg viewBox="0 0 400 200" className="w-full h-full" fill="none"><path d="M50 150 Q150 50 200 100 Q250 150 350 50" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 6" /></svg>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-ocean-50 border border-ocean-100 flex items-center justify-center mx-auto mb-5 animate-float"><MapPin className="w-10 h-10 text-ocean-400" /></div>
              <p className="text-text-main text-xl font-bold mb-2">No stops yet</p>
              <p className="text-text-muted text-base max-w-sm mx-auto">Add your first destination to start building your route and itinerary.</p>
            </div>
          ) : (
            <div className="relative pl-2">
              <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-ocean-200 via-sunset-200 to-transparent" />
              <div className="space-y-6">
                {trip.stops.map((stop, i) => {
                  const isExpanded = expandedStops.has(stop.id);
                  const stopCost = stop.activities.reduce((a, act) => a + act.cost, 0);
                  return (
                    <div key={stop.id} className="relative pl-12" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="absolute left-[11px] top-8 w-4 h-4 rounded-full bg-white border-4 border-ocean-400 shadow-sm z-10 shadow-ocean-500/20" />
                      <div className="card-3d overflow-hidden group">
                        <div onClick={() => toggleStop(stop.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleStop(stop.id); }}
                          className="w-full p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-900/50 transition-colors cursor-pointer gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center border border-surface-700/50 shrink-0 group-hover:border-ocean-200 transition-colors">
                              <MapPin className="w-5 h-5 text-ocean-500" />
                            </div>
                            <div className="text-left min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-text-main truncate tracking-tight">{stop.cityName}</h3>
                                <span className="text-sm font-bold text-text-light shrink-0 px-2 py-0.5 bg-surface-800 rounded-md border border-surface-700/50">{stop.country}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm font-medium text-text-muted mt-2 flex-wrap">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-text-light" />{formatDate(stop.arrival)} → {formatDate(stop.departure)}</span>
                                <span className="flex items-center gap-1.5 text-text-light"><Clock className="w-4 h-4" />{stop.activities.length} activit{stop.activities.length !== 1 ? "ies" : "y"}</span>
                                {stopCost > 0 && <span className="flex items-center gap-1 text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded-md border border-ocean-100 font-bold"><DollarSign className="w-3.5 h-3.5" />{stopCost.toFixed(0)}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <form action={async () => { await deleteStop(stop.id, trip.id); startTransition(() => router.refresh()); }} onClick={(e) => e.stopPropagation()}>
                              <button type="submit" className="w-10 h-10 rounded-xl bg-white border border-surface-700/50 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-text-light transition-all shadow-sm"><Trash2 className="w-4.5 h-4.5" /></button>
                            </form>
                            <div className="w-10 h-10 rounded-xl bg-white border border-surface-700/50 flex items-center justify-center shadow-sm">
                              {isExpanded ? <ChevronDown className="w-5 h-5 text-text-main" /> : <ChevronRight className="w-5 h-5 text-text-main" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded — CSS max-height transition */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="p-6 pt-0 border-t border-surface-700/50 mt-2 bg-surface-950/30">
                            <div className="space-y-3 mt-6 mb-6">
                              {stop.activities.map((act) => (
                                <div key={act.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-surface-700/50 border-l-4 ${categoryLeftBorder[act.category] || "border-l-gray-400"} shadow-sm gap-3`}>
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${categoryColors[act.category] || categoryColors["Other"]}`}>{act.category}</span>
                                    <span className="text-base font-medium text-text-main truncate">{act.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 shrink-0 text-sm font-medium text-text-muted">
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-text-light" />{act.duration}m</span>
                                    <span className="flex items-center gap-1 text-text-main font-bold"><DollarSign className="w-4 h-4 text-text-light" />{act.cost.toFixed(2)}</span>
                                    <form action={async () => { await deleteActivity(act.id, trip.id); startTransition(() => router.refresh()); }}>
                                      <button type="submit" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-text-light transition-all border border-transparent hover:border-red-200"><X className="w-4 h-4" /></button>
                                    </form>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {activityFormStop === stop.id ? (
                              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                                <form action={async (fd) => { setSubmitting("activity"); await addActivity(fd); setActivityFormStop(null); setSubmitting(null); startTransition(() => router.refresh()); }} className="space-y-4 p-5 rounded-2xl bg-white border border-surface-700/50 shadow-sm relative">
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ocean-400 to-sunset-400 rounded-t-2xl" />
                                  <h4 className="font-bold text-text-main mb-2">New Activity</h4>
                                  <input type="hidden" name="stopId" value={stop.id} />
                                  <input type="hidden" name="tripId" value={trip.id} />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="name" required placeholder="Activity name (e.g. Louvre Museum)" className="travel-input" />
                                    <select name="category" required className="travel-input bg-white">
                                      {ACTIVITY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-bold text-text-main mb-1.5 block">Cost ($)</label>
                                      <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" /><input name="cost" type="number" step="0.01" placeholder="0.00" className="travel-input pl-9" /></div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-text-main mb-1.5 block">Duration (min)</label>
                                      <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" /><input name="duration" type="number" placeholder="60" className="travel-input pl-9" /></div>
                                    </div>
                                  </div>
                                  <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={submitting === "activity"} className="travel-btn travel-btn-primary flex-1 justify-center disabled:opacity-50">
                                      {submitting === "activity" ? <div className="travel-spinner" /> : "Add Activity"}
                                    </button>
                                    <button type="button" onClick={() => setActivityFormStop(null)} className="travel-btn font-bold">Cancel</button>
                                  </div>
                                </form>
                              </motion.div>
                            ) : (
                              <button onClick={() => setActivityFormStop(stop.id)} className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-ocean-600 transition-colors py-2">
                                <Plus className="w-4 h-4" /> Add new activity
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── BUDGET TAB ─────────────────────────────── */}
      {activeTab === "budget" && (
        <motion.div key="budget" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <BudgetPanel stops={trip.stops} />
        </motion.div>
      )}

      {/* ─── CHECKLIST TAB ──────────────────────────── */}
      {activeTab === "checklist" && (
        <motion.div key="checklist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <ChecklistPanel tripId={trip.id} items={trip.checklists} />
        </motion.div>
      )}

      {/* ─── NOTES TAB ──────────────────────────────── */}
      {activeTab === "notes" && (
        <motion.div key="notes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="card-3d p-6 mb-8">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><StickyNote className="w-5 h-5 text-ocean-500" /> Travel Notes</h3>
            <form action={async (fd) => { setSubmitting("note"); await addNote(fd); setNoteText(""); setSubmitting(null); startTransition(() => router.refresh()); }} className="flex flex-col sm:flex-row gap-4">
              <input type="hidden" name="tripId" value={trip.id} />
              <div className="flex-1 relative">
                <input name="content" required value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type a note, reminder, or thought..." className="travel-input py-4" />
              </div>
              <button type="submit" disabled={submitting === "note"} className="travel-btn travel-btn-primary shrink-0 disabled:opacity-50 px-8">
                {submitting === "note" ? <div className="travel-spinner" /> : <><Send className="w-4 h-4 mr-2" /> Post Note</>}
              </button>
            </form>
          </div>

          {trip.notes.length === 0 ? (
            <div className="travel-card p-16 text-center bg-white border border-surface-700/50 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700/50 flex items-center justify-center mx-auto mb-4"><StickyNote className="w-8 h-8 text-text-light" /></div>
              <p className="text-text-main text-lg font-bold">No notes yet</p>
              <p className="text-text-muted mt-1">Jot down important details, booking references, or daily journals here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trip.notes.map((note, i) => (
                <div key={note.id} className="travel-card p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white border border-surface-700/50 shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className="min-w-0">
                    <p className="text-base text-text-main font-medium leading-relaxed mb-3">{note.content}</p>
                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">{new Date(note.timestamp).toLocaleString()}</p>
                  </div>
                  <form action={async () => { await deleteNote(note.id, trip.id); startTransition(() => router.refresh()); }} className="shrink-0">
                    <button type="submit" className="w-10 h-10 rounded-xl bg-surface-900 border border-surface-700/50 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-text-light transition-all shadow-sm"><Trash2 className="w-4.5 h-4.5" /></button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
