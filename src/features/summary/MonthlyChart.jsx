import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlySummary } from "./summarySlice.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthlyChart() {
  const dispatch = useDispatch();
  const { monthly, loading } = useSelector((s) => s.summary);
  const { mode } = useSelector((s) => s.theme);
  const [year, setYear] = useState(new Date().getFullYear());

  // Dynamic years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2020; y <= currentYear; y++) years.push(y);

  useEffect(() => {
    dispatch(fetchMonthlySummary(year));
  }, [dispatch, year]);

  const data = monthly.map((m, i) => ({
    name: MONTH_NAMES[i],
    Earned: m.earned,
    Spent: m.spent,
    Invested: m.invested,
  }));

  const isDark = mode === "dark";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#f3f4f6";
  const bgColor = isDark ? "#1f2937" : "#ffffff";
  const borderColor = isDark ? "#374151" : "#f3f4f6";

  return (
    <div
      className="rounded-2xl border shadow-sm p-4 mb-6"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Monthly Overview
        </h2>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-2 py-1 outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={8}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: bgColor,
                borderColor: gridColor,
                color: axisColor,
              }}
            />
            <Legend />
            <Bar dataKey="Earned" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Invested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
