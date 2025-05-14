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
      <div className="input-group mb-3">
        <select
          name="type"
          value={type}
          id="type"
          onChange={(e) => setType(e.target.value)}
          className="form-select"
          style={{ maxWidth: "120px" }}
        >
          <option value="earn">Earn</option>
          <option value="spend">Spend</option>
        </select>

        <input
          type="text"
          value={text}
          maxLength={30}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder="Enter description"
        />

        <span className="input-group-text">
          <input
            type="number"
            min={0}
            max={999999999999}
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          ></input>
        </span>

        <button
          className="btn btn-outline-secondary text-light"
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
