/*
1. Initial State – starting values

2.  reducer – logic to handle how the state changes

3. Global Context Provider – makes the state/functions available to all components */

import { createContext, useReducer } from "react";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const initialState = {
    transactions: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
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
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
