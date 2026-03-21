import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMonthlySummary } from "../features/summary/summarySlice.js";
import MonthlyChart from "../features/summary/MonthlyChart.jsx";
import SummaryCards from "../features/summary/SummaryCards.jsx";

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMonthlySummary(new Date().getFullYear()));
  }, [dispatch]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Filter pill */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
        {[
          { label: "All Time", value: "all" },
          { label: "This Year", value: "year" },
          { label: "This Month", value: "month" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition cursor-pointer
              ${
                activeFilter === f.value
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <SummaryCards filter={activeFilter} />
      <MonthlyChart />
    </div>
  );
}
