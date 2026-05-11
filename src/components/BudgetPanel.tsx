"use client";

import { DollarSign, TrendingUp, BarChart3, MapPin } from "lucide-react";

interface Activity { id: string; name: string; category: string; cost: number; duration: number; }
interface Stop { id: string; cityName: string; country: string; activities: Activity[]; }

const categoryGradients: Record<string, string> = {
  Sightseeing: "from-ocean-400 to-sky-400", "Food & Dining": "from-sunset-400 to-golden-400",
  Transportation: "from-purple-400 to-indigo-400", Accommodation: "from-sky-400 to-ocean-400",
  Shopping: "from-coral-400 to-sunset-400", Entertainment: "from-golden-400 to-sunset-400",
  Adventure: "from-red-400 to-coral-400", Culture: "from-indigo-400 to-purple-400",
  Wellness: "from-palm-400 to-ocean-400", Other: "from-gray-400 to-gray-300",
};

const categoryBadgeColors: Record<string, string> = {
  Sightseeing: "text-ocean-600", "Food & Dining": "text-sunset-600",
  Transportation: "text-purple-600", Accommodation: "text-sky-600",
  Shopping: "text-coral-600", Entertainment: "text-golden-600",
  Adventure: "text-red-600", Culture: "text-indigo-600",
  Wellness: "text-palm-600", Other: "text-gray-600",
};

export default function BudgetPanel({ stops }: { stops: Stop[] }) {
  const allActivities = stops.flatMap((s) => s.activities);
  const totalBudget = allActivities.reduce((s, a) => s + a.cost, 0);
  const categoryMap: Record<string, number> = {};
  allActivities.forEach((a) => { categoryMap[a.category] = (categoryMap[a.category] || 0) + a.cost; });
  const categories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a);
  const cityBreakdown = stops.map((s) => ({ city: s.cityName, country: s.country, total: s.activities.reduce((sum, a) => sum + a.cost, 0), count: s.activities.length }));
  const avgPerCity = stops.length > 0 ? totalBudget / stops.length : 0;
  const mostExpensiveCity = cityBreakdown.reduce((max, c) => (c.total > max.total ? c : max), { city: "-", country: "", total: 0, count: 0 });

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { icon: DollarSign, iconCls: "text-ocean-500", label: "Total Budget", value: `$${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, valueCls: "text-ocean-600", bg: "bg-ocean-50 border-ocean-100" },
          { icon: TrendingUp, iconCls: "text-sunset-500", label: "Avg / City", value: `$${avgPerCity.toFixed(0)}`, valueCls: "text-sunset-600", bg: "bg-sunset-50 border-sunset-100" },
          { icon: BarChart3, iconCls: "text-golden-500", label: "Top City", value: mostExpensiveCity.city, valueCls: "text-text-main", sub: `$${mostExpensiveCity.total.toFixed(0)}`, bg: "bg-golden-50 border-golden-100" },
        ].map((card, i) => (
          <div key={card.label} className="card-3d p-6 stagger-enter flex flex-col items-start" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.bg} border flex items-center justify-center shadow-sm`}>
                <card.icon className={`w-5 h-5 ${card.iconCls}`} />
              </div>
              <span className="text-xs text-text-light font-bold uppercase tracking-wider">{card.label}</span>
            </div>
            <p className={`text-3xl font-black tracking-tight ${card.valueCls}`}>{card.value}</p>
            {card.sub && <p className="text-sm font-bold text-text-light mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="card-3d p-6 sm:p-8 mb-6 stagger-enter" style={{ animationDelay: "0.15s" }}>
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-ocean-400" /> Spending by Category</h3>
        {categories.length === 0 ? (
          <div className="bg-surface-800/30 rounded-xl p-8 text-center border border-surface-700/50">
            <p className="text-text-muted text-base font-medium">No expenses tracked yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {categories.map(([cat, amount], i) => {
              const pct = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
              return (
                <div key={cat} className="stagger-enter" style={{ animationDelay: `${0.2 + i * 0.04}s` }}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={`font-bold ${categoryBadgeColors[cat] || "text-text-muted"}`}>{cat}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-text-light bg-surface-900 px-2 py-0.5 rounded-md border border-surface-700/50">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-black text-text-main">${amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-surface-800 rounded-full overflow-hidden border border-surface-700/50 shadow-inner">
                    <div className={`h-full bg-gradient-to-r ${categoryGradients[cat] || "from-gray-400 to-gray-300"}`} style={{ width: `${pct}%`, transition: `width 0.8s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.05}s` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Per-City Breakdown */}
      <div className="card-3d p-6 sm:p-8 stagger-enter" style={{ animationDelay: "0.25s" }}>
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-sunset-400" /> Spending by City</h3>
        {cityBreakdown.length === 0 ? (
          <div className="bg-surface-800/30 rounded-xl p-8 text-center border border-surface-700/50">
            <p className="text-text-muted text-base font-medium">Add destinations to see city breakdown</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cityBreakdown.map((city, i) => {
              const pct = totalBudget > 0 ? (city.total / totalBudget) * 100 : 0;
              return (
                <div key={city.city + i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white border border-surface-700/50 shadow-sm stagger-enter" style={{ animationDelay: `${0.3 + i * 0.04}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-ocean-50 border border-ocean-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-ocean-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-text-main truncate">{city.city}</span>
                      <span className="text-base font-black text-text-main shrink-0 bg-surface-900 px-3 py-1 rounded-lg border border-surface-700/50">${city.total.toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-surface-800 rounded-full overflow-hidden border border-surface-700/50 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-ocean-400 to-sunset-400" style={{ width: `${pct}%`, transition: `width 0.8s cubic-bezier(.16,1,.3,1) ${0.4 + i * 0.05}s` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
