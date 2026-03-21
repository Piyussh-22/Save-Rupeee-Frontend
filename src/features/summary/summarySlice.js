import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchSummary = createAsyncThunk("summary/fetch", async () => {
  const res = await api.get("/api/summary");
  return res.data;
});

export const fetchFilteredSummary = createAsyncThunk(
  "summary/fetchFiltered",
  async (filter) => {
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
  },
);

export const fetchMonthlySummary = createAsyncThunk(
  "summary/fetchMonthly",
  async (year) => {
    const res = await api.get(`/api/summary/monthly?year=${year}`);
    return res.data;
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.total_earned = action.payload.total_earned;
        state.total_spent = action.payload.total_spent;
        state.total_invested = action.payload.total_invested;
        state.net_balance = action.payload.net_balance;
      })
      .addCase(fetchFilteredSummary.fulfilled, (state, action) => {
        state.filtered_earned = action.payload.total_earned;
        state.filtered_spent = action.payload.total_spent;
        state.filtered_invested = action.payload.total_invested;
        state.filtered_balance = action.payload.net_balance;
      })
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.monthly = action.payload.months;
        state.loading = false;
      });
  },
});

export default summarySlice.reducer;
