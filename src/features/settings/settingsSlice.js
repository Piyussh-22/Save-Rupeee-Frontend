import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/users/me", data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update settings.",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "settings/delete",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/api/users/me");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete account.",
      );
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateSettings.fulfilled, (state) => {
        state.loading = false;
        state.success = "Settings updated successfully!";
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = settingsSlice.actions;
export default settingsSlice.reducer;
