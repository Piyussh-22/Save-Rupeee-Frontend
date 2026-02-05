import Header from "./components/Header";
import Balance from "./components/Balance";
import Rates from "./components/Rates";
import TransactionList from "./components/TransactionList";
import AddTransactionForm from "./components/AddTransactionForm";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-black px-3 pb-2 pt-3 text-white">
      <div className="h-[60px] shrink-0">
        <Header />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <Balance />
        <AddTransactionForm />
        <TransactionList />
      </div>
      <div className="h-[60px] shrink-0">
        <Rates />
      </div>
    </div>
  );
}

export default App;
