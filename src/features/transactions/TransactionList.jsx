import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "./transactionSlice.js";
import TransactionItem from "./TransactionItem.jsx";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { items, page, hasMore, loading } = useSelector((s) => s.transactions);
  const containerRef = useRef();

  useEffect(() => {
    dispatch(fetchTransactions(1));
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (nearBottom && hasMore && !loading) {
      dispatch(fetchTransactions(page));
    }
  }, [hasMore, loading, page, dispatch]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Transactions
      </h2>

      <div
        ref={containerRef}
        className="flex flex-col gap-2 overflow-y-auto"
        style={{ maxHeight: "420px" }}
      >
        {items.map((t) => (
          <TransactionItem key={t.id} transaction={t} />
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            No more transactions
          </p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
            No transactions yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}
