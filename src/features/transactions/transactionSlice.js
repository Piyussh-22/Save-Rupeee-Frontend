import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async (page, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/transactions?page=${page}&limit=10`);
      return { ...res.data, page };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch transactions",
      );
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/transactions/${id}`, data);
      return res.data.transaction;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update transaction",
      );
    }
  },
);

export const removeTransaction = createAsyncThunk(
  "transactions/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete transaction",
      );
    }
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    addTransaction: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const { transactions, hasMore, page } = action.payload;
        state.items =
          page === 1 ? transactions : [...state.items, ...transactions];
        state.hasMore = hasMore;
        state.page = page + 1;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
