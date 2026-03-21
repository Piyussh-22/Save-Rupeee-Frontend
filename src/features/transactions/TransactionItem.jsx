import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeTransaction } from "./transactionSlice.js";
import { fetchSummary } from "../summary/summarySlice.js";
import Modal from "../../components/Modal.jsx";
import EditTransactionForm from "./EditTransactionForm.jsx";

export default function TransactionItem({ transaction }) {
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const typeColors = {
    expense: "bg-red-100 text-red-600",
    earn: "bg-green-100 text-green-600",
    invest: "bg-blue-100 text-blue-600",
  };

  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(removeTransaction(transaction.id));
    dispatch(fetchSummary());
    setShowDelete(false);
    setDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1 min-w-0 ">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${typeColors[transaction.type]}`}
          >
            {transaction.type}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
              {transaction.category}
            </p>
            {transaction.note && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {transaction.note}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-sm font-semibold ${
                transaction.type === "earn"
                  ? "text-green-600"
                  : transaction.type === "expense"
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            >
              {transaction.type === "earn" ? "+" : "-"}
              {parseFloat(transaction.amount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setShowEdit(true)}
            className="cursor-pointer p-1"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6366f1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={() => setShowDelete(true)}
            className="cursor-pointer p-1"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ef4444"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Transaction"
      >
        <EditTransactionForm
          transaction={transaction}
          onClose={() => setShowEdit(false)}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Transaction"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this transaction? This cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDelete(false)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
