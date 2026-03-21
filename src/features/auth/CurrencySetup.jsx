import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "./authSlice.js";
import api from "../../services/api.js";

const CURRENCIES = [
  { code: "INR", label: "🇮🇳 Indian Rupee (INR)" },
  { code: "USD", label: "🇺🇸 US Dollar (USD)" },
  { code: "EUR", label: "🇪🇺 Euro (EUR)" },
  { code: "GBP", label: "🇬🇧 British Pound (GBP)" },
  { code: "AED", label: "🇦🇪 UAE Dirham (AED)" },
  { code: "SGD", label: "🇸🇬 Singapore Dollar (SGD)" },
  { code: "AUD", label: "🇦🇺 Australian Dollar (AUD)" },
];

export default function CurrencySetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [selected, setSelected] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await api.patch("/api/users/me", { default_currency: selected });
      await dispatch(fetchMe());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Choose your currency.{" "}
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
            This cannot be changed later.
          </span>
        </p>

        <div className="flex flex-col gap-2 mb-6">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelected(c.code)}
              className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition cursor-pointer
                ${
                  selected === c.code
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : `Confirm — ${selected}`}
        </button>
      </div>
    </div>
  );
}
