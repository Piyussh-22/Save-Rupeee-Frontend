import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORIES } from "../../utils/categories.utils.js";
import api from "../../services/api.js";
import { addTransaction } from "./transactionSlice.js";
import { fetchSummary } from "../summary/summarySlice.js";

export default function TransactionForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "expense",
    category: "food",
    amount: "",
    note: "",
    date: today,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type) => {
    setForm({ ...form, type, category: CATEGORIES[type][0] });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      return setError("Please enter a valid amount.");
    if (parseFloat(form.amount) > 99999999.99)
      return setError("Amount exceeds maximum limit.");
    if (form.note.length > 20)
      return setError("Note must be 20 characters or less.");
    if (
      form.date &&
      (new Date(form.date) < new Date("2020-01-01") ||
        new Date(form.date) > new Date())
    )
      return setError("Date must be between 2020-01-01 and today.");
    try {
      setLoading(true);
      const res = await api.post("/api/transactions", {
        ...form,
        amount: parseFloat(form.amount),
      });
      dispatch(addTransaction(res.data.transaction));
      dispatch(fetchSummary());
      setForm({
        type: "expense",
        category: CATEGORIES["expense"][0],
        amount: "",
        note: "",
        date: today,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {["expense", "earn", "invest"].map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition cursor-pointer
              ${
                form.type === t
                  ? t === "expense"
                    ? "bg-rose-500 text-white"
                    : t === "earn"
                      ? "bg-emerald-500 text-white"
                      : "bg-sky-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 capitalize"
      >
        {CATEGORIES[form.type].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Amount */}
      <input
        type="number"
        placeholder={`Amount (${user?.default_currency || "INR"})`}
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
      />

      {/* Note */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Note (optional)"
          value={form.note}
          maxLength={20}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 pr-12"
        />
        <span className="absolute right-3 top-2 text-xs text-gray-400">
          {form.note.length}/20
        </span>
      </div>

      {/* Date */}
      <input
        type="date"
        value={form.date}
        min="2020-01-01"
        max={today}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
      />

      {error && <p className="text-rose-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </div>
  );
}
