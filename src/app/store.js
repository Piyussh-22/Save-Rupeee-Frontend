import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import transactionReducer from "../features/transactions/transactionSlice.js";
import summaryReducer from "../features/summary/summarySlice.js";
import settingsReducer from "../features/settings/settingsSlice.js";
import themeReducer from "../features/settings/themeSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    summary: summaryReducer,
    settings: settingsReducer,
    theme: themeReducer,
  },
});

export default store;
