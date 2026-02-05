import { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const AddTransactionForm = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("earn");
  const { dispatch } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() || amount === "") {
      alert("Neither description nor amount can be empty");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text,
      amount: type === "spend" ? -Number(amount) : Number(amount),
      type,
    };

    dispatch({
      type: "ADD_TRANSACTION",
      payload: newTransaction,
    });

    setText("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          name="type"
          value={type}
          id="type"
          onChange={(e) => setType(e.target.value)}
          className="w-full max-w-[120px] rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-black"
        >
          <option value="earn">Earn</option>
          <option value="spend">Spend</option>
        </select>

        <input
          type="text"
          value={text}
          maxLength={30}
          onChange={(e) => setText(e.target.value)}
          className="min-w-[160px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
          placeholder="Enter description"
        />

        <input
          type="number"
          min={0}
          max={999999999999}
          value={amount}
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
          className="w-full max-w-[160px] rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
        />

        <button
          className="rounded-md border border-gray-400 px-4 py-2 text-sm text-white"
          type="submit"
          disabled={!text.trim() || isNaN(amount) || amount === ""}
        >
          Add
        </button>
      </div>
    </form>
  );
};
export default AddTransactionForm;
