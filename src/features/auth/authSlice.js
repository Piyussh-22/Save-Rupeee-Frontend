import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch (err) {
      // Pass actual error message instead of null so you can debug in production
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initialized: false, // Tracks whether fetchMe has been attempted at least once
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true; // Even on failure, we know auth has been attempted
      });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
