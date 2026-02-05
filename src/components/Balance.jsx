import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
const Balance = () => {
  const { state } = useContext(GlobalContext);
  return (
    <div className="mb-4 h-[50px] rounded-[10px] bg-[#434a55]">
      <div className="flex h-full w-full items-center justify-between gap-[10%] px-[5%]">
        <div className="flex h-[80%] w-[42.5%] items-center justify-center rounded-full bg-[#d9eafd] text-center font-medium text-[#003366] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          Balance : (
          {state.transactions
            .map((tx) => tx.amount)
            .reduce((totalVal, currVal) => totalVal + currVal, 0)}
          )
        </div>
        <div className="flex h-[80%] w-[42.5%] items-center justify-center rounded-full bg-[#d9eafd] text-center font-medium text-[#003366] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          Transactions : ({state.transactions.length})
        </div>
      </div>
    </div>
  );
};

export default Balance;
