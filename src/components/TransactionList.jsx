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
      <div className="d-flex align-items-center gap-2 p-1">
        <label htmlFor="filter">Filter Transactions: </label>
        <select
          value={filterType}
          id="filter"
          onChange={(e) => setFilterType(e.target.value)}
          className="form-select"
          style={{ maxWidth: "120px" }}
        >
          <option value="all">All</option>
          <option value="earn">Earn</option>
          <option value="spend">Spend</option>
        </select>
      </div>

      <ul className="list-group p-1">
        {filteredTransactions.map((transactions) => (
          <li
            key={transactions.id}
            style={{ color: transactions.type === "spend" ? "red" : "green" }}
            className="list-group-item d-flex justify-content-between align-items-center rounded-pill m-1"
          >
            <div className="d-flex w-100">
              <div className="d-flex align-items-center flex-grow-1">
                {editID === transactions.id ? (
                  <>
                    <input
                      type="text"
                      maxLength={30}
                      value={editText}
                      onChange={(e) => {
                        setEditText(e.target.value);
                      }}
                      className="form-control me-2"
                      style={{ maxWidth: "120px" }}
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
                      className="form-control"
                      style={{ maxWidth: "100px" }}
                    />

                    <div style={{ marginLeft: "8px" }}>
                      <select
                        className="form-select me-2"
                        style={{ maxWidth: "100px" }}
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                      >
                        <option value="earn">Earn</option>
                        <option value="spend">Spend</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-sm btn-warning ms-2"
                      onClick={() => setEditID(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "1.1rem", lineHeight: "1" }}>
                      {transactions.text}
                    </span>
                    <span
                      className="badge text-bg-primary rounded-pill ms-2"
                      style={{ fontSize: "1.1rem", lineHeight: "1" }}
                    >
                      ₹{transactions.amount}
                    </span>
                  </>
                )}
              </div>

              <div className="d-flex align-items-center ms-auto">
                <button
                  className="btn  btn-sm btn-outline-secondary"
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
                  className="btn btn-sm btn-danger ms-2"
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
