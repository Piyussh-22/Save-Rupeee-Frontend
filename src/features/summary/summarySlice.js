import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchSummary = createAsyncThunk(
  "summary/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/summary");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch summary",
      );
    }
  },
);

export const fetchFilteredSummary = createAsyncThunk(
  "summary/fetchFiltered",
  async (filter, { rejectWithValue }) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      let url = "/api/summary";
      if (filter === "year")
        url = `/api/summary?from=${year}-01-01&to=${year}-12-31`;
      if (filter === "month") {
        const lastDay = new Date(year, month, 0).getDate();
        const m = String(month).padStart(2, "0");
        url = `/api/summary?from=${year}-${m}-01&to=${year}-${m}-${lastDay}`;
      }

      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch filtered summary",
      );
    }
  },
);

export const fetchMonthlySummary = createAsyncThunk(
  "summary/fetchMonthly",
  async (year, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/summary/monthly?year=${year}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch monthly summary",
      );
    }
  },
);

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    total_earned: 0,
    total_spent: 0,
    total_invested: 0,
    net_balance: 0,
    filtered_earned: 0,
    filtered_spent: 0,
    filtered_invested: 0,
    filtered_balance: 0,
    monthly: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.total_earned = action.payload.total_earned;
        state.total_spent = action.payload.total_spent;
        state.total_invested = action.payload.total_invested;
        state.net_balance = action.payload.net_balance;
        state.error = null;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchFilteredSummary.fulfilled, (state, action) => {
        state.filtered_earned = action.payload.total_earned;
        state.filtered_spent = action.payload.total_spent;
        state.filtered_invested = action.payload.total_invested;
        state.filtered_balance = action.payload.net_balance;
        state.error = null;
      })
      .addCase(fetchFilteredSummary.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.monthly = action.payload.months;
        state.loading = false;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default summarySlice.reducer;
