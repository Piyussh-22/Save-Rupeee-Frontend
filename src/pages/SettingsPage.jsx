import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../features/settings/settingsSlice.js";
import { clearUser } from "../features/auth/authSlice.js";
import Modal from "../components/Modal.jsx";
import api from "../services/api.js";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.settings);

  const today = new Date().toISOString().split("T")[0];

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exportError, setExportError] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleDelete = async () => {
    const result = await dispatch(deleteAccount());
    if (!result.error) {
      dispatch(clearUser());
      navigate("/login", { replace: true });
    }
  };

  const handleExport = async () => {
    setExportError("");
    if (!from || !to) return setExportError("Please select both dates.");
    if (
      new Date(from) < new Date("2020-01-01") ||
      new Date(to) < new Date("2020-01-01")
    )
      return setExportError("Dates must be from 2020 onwards.");
    if (new Date(from) > new Date(to))
      return setExportError('"From" cannot be after "To".');
    try {
      setExporting(true);
      const res = await api.get(`/api/export?from=${from}&to=${to}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions_${from}_${to}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setExportError("Failed to export. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Account */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full mt-1 inline-block">
              🔒 {user?.default_currency} — locked
            </span>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Export Transactions
        </h2>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">From</p>
        <input
          type="date"
          value={from}
          min="2020-01-01"
          max={today}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm mb-3 outline-none"
        />

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">To</p>
        <input
          type="date"
          value={to}
          min="2020-01-01"
          max={today}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm mb-4 outline-none"
        />

        {exportError && (
          <p className="text-red-500 text-sm mb-3">{exportError}</p>
        )}

        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {exporting ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
        <h2 className="text-base font-semibold text-red-500 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Deleting your account removes all data. You have 30 days to recover
          it.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full border border-red-400 dark:border-red-700 text-red-500 font-medium py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {/* Delete confirm modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure? All your data will be deleted. You have 30 days to
          recover it.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium py-3 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
