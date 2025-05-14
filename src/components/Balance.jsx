import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
const Balance = () => {
  const { state } = useContext(GlobalContext);
  return (
    <div className="balance-container-bg mb-4">
      <div className="container-md d-flex justify-content-between align-items-center balance-bar">
        <div className="pill ">
          Balance : (
          {state.transactions
            .map((tx) => tx.amount)
            .reduce((totalVal, currVal) => totalVal + currVal, 0)}
          )
        </div>
        <div className="pill ">
          Transactions : ({state.transactions.length})
        </div>
      </div>
    </div>
  );
};

export default Balance;
