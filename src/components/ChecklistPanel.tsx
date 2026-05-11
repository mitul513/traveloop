"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, Package, CheckSquare } from "lucide-react";
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "@/lib/actions";

interface ChecklistItem { id: string; itemName: string; category: string; isPacked: boolean; }

const CHECKLIST_CATEGORIES = ["Essentials","Clothing","Toiletries","Electronics","Documents","Medicine","Accessories","Other"];
const categoryEmojis: Record<string, string> = { Essentials: "🔑", Clothing: "👕", Toiletries: "🧴", Electronics: "📱", Documents: "📄", Medicine: "💊", Accessories: "🎒", Other: "📦" };

export default function ChecklistPanel({ tripId, items }: { tripId: string; items: ChecklistItem[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  // Circular progress
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const grouped: Record<string, ChecklistItem[]> = {};
  items.forEach((item) => { if (!grouped[item.category]) grouped[item.category] = []; grouped[item.category].push(item); });

  return (
    <div className="space-y-6">
      {/* Progress Card with Circular Ring */}
      <div className="card-3d p-6 sm:p-8 stagger-enter border border-surface-700/50 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-ocean-50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-8">
          {/* SVG Ring */}
          <div className="relative w-28 h-28 shrink-0 drop-shadow-sm">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="50" cy="50" r={radius} fill="none"
                stroke={pct === 100 ? "#10b981" : pct > 0 ? "#0ea5e9" : "#e2e8f0"}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-black tracking-tight ${pct === 100 ? "text-palm-500" : pct > 0 ? "text-ocean-600" : "text-text-light"}`}>
                {pct.toFixed(0)}%
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-ocean-50 border border-ocean-100 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-ocean-500" />
              </div>
              <span className="text-xs font-bold text-text-light uppercase tracking-wider">Packing Progress</span>
            </div>
            <p className="text-base font-bold text-text-muted">{packedCount} of {totalCount} items packed</p>
            {pct === 100 && totalCount > 0 && (
              <p className="text-sm font-bold text-palm-500 mt-2 bg-palm-50 px-3 py-1 rounded-full border border-palm-100 inline-block">✓ All packed! Ready to go 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Item */}
      <div className="card-3d p-6 sm:p-8 stagger-enter border border-surface-700/50 shadow-sm" style={{ animationDelay: "0.05s" }}>
        {showForm ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <form action={async (fd) => {
              setSubmitting(true);
              await addChecklistItem(fd);
              setShowForm(false);
              setSubmitting(false);
              startTransition(() => router.refresh());
            }} className="space-y-4">
              <input type="hidden" name="tripId" value={tripId} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="itemName" required placeholder="Item name (e.g. Passport)" className="travel-input" />
                <select name="category" required className="travel-input bg-white">
                  {CHECKLIST_CATEGORIES.map((c) => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="travel-btn travel-btn-primary flex-1 justify-center disabled:opacity-50">
                  {submitting ? <div className="travel-spinner" /> : <><Plus className="w-4 h-4" /> Add Item</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="travel-btn font-bold">Cancel</button>
              </div>
            </form>
          </motion.div>
        ) : (
          <button onClick={() => setShowForm(true)} className="travel-btn travel-btn-primary w-full justify-center py-3 text-base shadow-md">
            <Plus className="w-5 h-5" /> Add Item to Checklist
          </button>
        )}
      </div>

      {/* Grouped Items */}
      {Object.keys(grouped).length === 0 ? (
        <div className="travel-card p-16 text-center stagger-enter bg-white shadow-sm border border-surface-700/50" style={{ animationDelay: "0.1s" }}>
          <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700/50 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-text-light" />
          </div>
          <p className="text-lg font-bold text-text-main">No items yet</p>
          <p className="text-text-muted mt-1">Add items to start tracking your packing progress.</p>
        </div>
      ) : (
        CHECKLIST_CATEGORIES.filter((cat) => grouped[cat]?.length > 0).map((cat, catIdx) => {
          const catItems = grouped[cat];
          const catPacked = catItems.filter((i) => i.isPacked).length;
          return (
            <div key={cat} className="card-3d p-6 stagger-enter" style={{ animationDelay: `${0.1 + catIdx * 0.04}s` }}>
              <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-2 text-base font-bold text-text-main">
                  <span className="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700/50 flex items-center justify-center text-sm">{categoryEmojis[cat]}</span>
                  {cat}
                </span>
                <span className="text-sm font-bold text-text-muted bg-surface-900 px-3 py-1 rounded-lg border border-surface-700/50">{catPacked}/{catItems.length} packed</span>
              </div>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${item.isPacked ? "opacity-60 bg-surface-800/30 border-transparent" : "bg-white border-surface-700/50 shadow-sm hover:border-ocean-200"}`}>
                    <form action={async () => { await toggleChecklistItem(item.id, tripId); startTransition(() => router.refresh()); }} className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group">
                      <button type="submit"
                        className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${
                          item.isPacked
                            ? "bg-ocean-500 border-ocean-500 shadow-sm"
                            : "border-surface-400 bg-white group-hover:border-ocean-400"
                        }`}>
                        {item.isPacked && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span className={`text-base font-medium truncate transition-all duration-200 ${item.isPacked ? "line-through text-text-light" : "text-text-main group-hover:text-ocean-700"}`}>
                        {item.itemName}
                      </span>
                    </form>
                    <form action={async () => { await deleteChecklistItem(item.id, tripId); startTransition(() => router.refresh()); }}>
                      <button type="submit" className="w-8 h-8 rounded-lg flex items-center justify-center text-text-light hover:text-red-500 hover:bg-red-50 transition-all ml-2 border border-transparent hover:border-red-200">
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
