import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSummary } from "../features/summary/summarySlice.js";
import SummaryCards from "../features/summary/SummaryCards.jsx";
import TransactionList from "../features/transactions/TransactionList.jsx";
import TransactionForm from "../features/transactions/TransactionForm.jsx";
import FABButton from "../components/FABButton.jsx";
import Modal from "../components/Modal.jsx";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-6">
        <SummaryCards />
        <TransactionList />
      </div>

      <FABButton onClick={() => setShowAdd(true)} />

      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Transaction"
      >
        <TransactionForm onSuccess={() => setShowAdd(false)} />
      </Modal>
    </>
  );
}
