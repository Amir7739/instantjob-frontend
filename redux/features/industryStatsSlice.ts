import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";
import axiosInstance from "@/utils/axios";

// Type for a job category
export type JobCategory = {
  count: number;
  industryType: string;
};

// Async thunk
export const fetchCategories = createAsyncThunk<JobCategory[]>(
  "categories/fetch",
  async () => {
    const response = await axiosInstance.get("/jobs/get-jobs-category");
    return response.data.data; // ✅ Assuming { success: true, data: [...] }
  }
);

// State type
interface CategoryState {
  categories: JobCategory[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<JobCategory[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categorySlice.reducer;
