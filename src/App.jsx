import Header from "./components/Header";
import Balance from "./components/Balance";
import Rates from "./components/Rates";
import TransactionList from "./components/TransactionList";
import AddTransactionForm from "./components/AddTransactionForm";
import { useContext } from "react";
import { GlobalContext } from "./context/GlobalState";

function App() {
  const { state } = useContext(GlobalContext);
  return (
    <div className="background p-3 mb-2 bg-black bg-gradient text-white">
      <div className="header-fixed">
        <Header />
      </div>
      <div className="scrollable-content">
        {state.error ? (
          <div className="alert alert-danger mb-3" role="alert">
            {state.error}
          </div>
        ) : null}
        <Balance />
        <AddTransactionForm />
        <TransactionList />
      </div>
      <div className="rates-fixed">
        <Rates />
      </div>
    </div>
  );
}

export default App;
