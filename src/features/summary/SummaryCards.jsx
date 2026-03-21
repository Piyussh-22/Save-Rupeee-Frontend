import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { fetchSummary, fetchFilteredSummary } from "./summarySlice.js";

export default function SummaryCards({ filter }) {
  const dispatch = useDispatch();
  const {
    total_earned,
    total_spent,
    total_invested,
    net_balance,
    filtered_earned,
    filtered_spent,
    filtered_invested,
    filtered_balance,
  } = useSelector((s) => s.summary);
  const { user } = useSelector((s) => s.auth);
  const currency = user?.default_currency || "INR";

  const isFiltered = filter && filter !== "all";

  useEffect(() => {
    if (!filter || filter === "all") {
      dispatch(fetchSummary());
    } else {
      dispatch(fetchFilteredSummary(filter));
    }
  }, [filter, dispatch]);

  const earned = isFiltered ? filtered_earned : total_earned;
  const spent = isFiltered ? filtered_spent : total_spent;
  const invested = isFiltered ? filtered_invested : total_invested;
  const balance = isFiltered ? filtered_balance : net_balance;

  const fmt = (val) =>
    parseFloat(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const cards = [
    {
      label: "Earned",
      value: fmt(earned),
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Spent",
      value: fmt(spent),
      icon: TrendingDown,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-900/20",
      valueColor: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Invested",
      value: fmt(invested),
      icon: PiggyBank,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-50 dark:bg-sky-900/20",
      valueColor: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Cash Left",
      value: fmt(balance),
      icon: Wallet,
      iconColor: balance >= 0 ? "text-violet-500" : "text-orange-500",
      iconBg:
        balance >= 0
          ? "bg-violet-50 dark:bg-violet-900/20"
          : "bg-orange-50 dark:bg-orange-900/20",
      valueColor:
        balance >= 0
          ? "text-violet-600 dark:text-violet-400"
          : "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="mb-6">
      <p className="text-center text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
        {currency}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(
          ({ label, value, icon: Icon, iconColor, iconBg, valueColor }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
                >
                  <Icon size={14} className={iconColor} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {label}
                </p>
              </div>
              <p className={`text-base font-bold ${valueColor}`}>{value}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
