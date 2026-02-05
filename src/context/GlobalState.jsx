/*
1. Initial State – starting values

2.  reducer – logic to handle how the state changes

3. Global Context Provider – makes the state/functions available to all components */

import { createContext, useEffect, useMemo, useReducer } from "react";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const initialState = {
    transactions: [],
    loading: false,
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_TRANSACTIONS":
        return {
          ...state,
          transactions: action.payload,
        };
      case "ADD_TRANSACTION":
        return {
          ...state,
          transactions: [action.payload, ...state.transactions],
        };
      case "DELETE_TRANSACTION":
        return {
          ...state,
          transactions: state.transactions.filter(
            (txn) => txn.id !== action.payload
          ),
        };
      case "EDIT_TRANSACTION":
        return {
          ...state,
          transactions: state.transactions.map((txn) =>
            txn.id === action.payload.id
              ? {
                  ...txn,
                  text: action.payload.text,
                  type: action.payload.type,
                  amount:
                    action.payload.type === "spend"
                      ? -Math.abs(action.payload.amount)
                      : Math.abs(action.payload.amount),
                }
              : txn
          ),
        };
      case "SET_LOADING":
        return {
          ...state,
          loading: action.payload,
        };
      case "SET_ERROR":
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const apiBaseUrl = useMemo(() => {
    const base =
      import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000";
    return base.replace(/\/$/, "");
  }, []);

  const apiUrl = `${apiBaseUrl}/api`;

  const normalizeTransaction = (transaction) => {
    if (!transaction) {
      return null;
    }
    const amount = Number(transaction.amount ?? 0);
    return {
      id: transaction.id ?? transaction._id,
      text: transaction.text ?? transaction.description ?? "",
      amount,
      type:
        transaction.type ??
        (amount < 0 ? "spend" : amount > 0 ? "earn" : "earn"),
    };
  };

  const parseResponse = async (res) => {
    if (res.status === 204) {
      return null;
    }
    const text = await res.text();
    if (!text) {
      return null;
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  };

  const request = async (path, options) => {
    const response = await fetch(`${apiUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    if (!response.ok) {
      const data = await parseResponse(response);
      const message =
        typeof data === "string"
          ? data
          : data?.message || "Request failed.";
      throw new Error(message);
    }

    return parseResponse(response);
  };

  const fetchTransactions = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await request("/transactions");
      const list = Array.isArray(data) ? data : data?.transactions ?? [];
      const normalized = list
        .map(normalizeTransaction)
        .filter(Boolean);
      dispatch({ type: "SET_TRANSACTIONS", payload: normalized });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "Unable to load transactions.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addTransaction = async (transaction) => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await request("/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      });
      const normalized = normalizeTransaction(
        data?.transaction ?? data ?? transaction
      );
      if (normalized) {
        dispatch({ type: "ADD_TRANSACTION", payload: normalized });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "Unable to add transaction.",
      });
      throw error;
    }
  };

  const editTransaction = async (id, updates) => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const data = await request(`/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      const normalized = normalizeTransaction(
        data?.transaction ?? { ...updates, id }
      );
      if (normalized) {
        dispatch({ type: "EDIT_TRANSACTION", payload: normalized });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "Unable to update transaction.",
      });
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      await request(`/transactions/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "Unable to delete transaction.",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        state,
        addTransaction,
        editTransaction,
        deleteTransaction,
        refreshTransactions: fetchTransactions,
        apiBaseUrl,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
