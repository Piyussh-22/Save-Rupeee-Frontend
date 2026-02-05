import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";

const TransactionList = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [filterType, setFilterType] = useState("all");
  const [editID, setEditID] = useState(null);
  const [editType, setEditType] = useState("earn");
  const [editText, setEditText] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const filteredTransactions = state.transactions.filter((transactions) => {
    if (filterType === "all") {
      return true;
    }
    return transactions.type === filterType;
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Confirm Delete");
    if (confirmDelete) {
      dispatch({
        type: "DELETE_TRANSACTION",
        payload: id,
      });
    }
  };

  const isEditValid =
    editText.trim() !== "" && !isNaN(editAmount) && parseFloat(editAmount) > 0;

  return (
    <>
      <div className="flex items-center gap-2 p-1">
        <label htmlFor="filter">Filter Transactions: </label>
        <select
          value={filterType}
          id="filter"
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full max-w-[120px] rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-black"
        >
          <option value="all">All</option>
          <option value="earn">Earn</option>
          <option value="spend">Spend</option>
        </select>
      </div>

      <ul className="space-y-2 p-1">
        {filteredTransactions.map((transactions) => (
          <li
            key={transactions.id}
            style={{ color: transactions.type === "spend" ? "red" : "green" }}
            className="flex items-center justify-between rounded-full bg-white px-3 py-2"
          >
            <div className="flex w-full items-center">
              <div className="flex flex-1 items-center">
                {editID === transactions.id ? (
                  <>
                    <input
                      type="text"
                      maxLength={30}
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                      }}
                      className="mr-2 w-full max-w-[120px] rounded-md border border-gray-300 px-2 py-1 text-sm text-black"
                    />

                    <input
                      type="number"
                      min={0}
                      max={999999999999}
                      value={editAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        const num = parseFloat(value);

                        if (
                          value === "" ||
                          (!isNaN(num) && num <= 999999999999)
                        ) {
                          setEditAmount(value);
                        }
                      }}
                      className="w-full max-w-[100px] rounded-md border border-gray-300 px-2 py-1 text-sm text-black"
                    />

                    <div className="ml-2">
                      <select
                        className="w-full max-w-[100px] rounded-md border border-gray-300 px-2 py-1 text-sm text-black"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                      >
                        <option value="earn">Earn</option>
                        <option value="spend">Spend</option>
                      </select>
                    </div>
                    <button
                      className="ml-2 rounded-md border border-amber-500 bg-amber-400 px-3 py-1 text-xs font-semibold text-black"
                      onClick={() => setEditID(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[1.1rem] leading-none">
                      {transactions.text}
                    </span>
                    <span
                      className="ml-2 rounded-full bg-blue-600 px-2 py-1 text-[1.1rem] leading-none text-white"
                    >
                      ₹{transactions.amount}
                    </span>
                  </>
                )}
              </div>

              <div className="ml-auto flex items-center">
                <button
                  className="rounded-md border border-gray-400 px-3 py-1 text-xs text-gray-700"
                  type="button"
                  disabled={editID === transactions.id && !isEditValid}
                  onClick={() => {
                    if (editID === transactions.id) {
                      if (
                        !editText.trim() ||
                        isNaN(editAmount) ||
                        editAmount === ""
                      ) {
                        alert("Please fill in both text and amount.");
                        return;
                      }
                      dispatch({
                        type: "EDIT_TRANSACTION",
                        payload: {
                          id: editID,
                          type: editType,
                          text: editText,
                          amount:
                            editType === "spend"
                              ? -Math.abs(parseFloat(editAmount))
                              : Math.abs(parseFloat(editAmount)),
                        },
                      });
                      setEditID(null);
                    } else {
                      setEditID(transactions.id);
                      setEditText(transactions.text);
                      setEditAmount(Math.abs(transactions.amount));
                      setEditType(transactions.type);
                    }
                  }}
                >
                  {editID === transactions.id ? "Done" : "Edit"}
                </button>

                <button
                  className="ml-2 rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                  type="button"
                  onClick={() => handleDelete(transactions.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TransactionList;
