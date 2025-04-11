// redux/features/jobsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export type Job = {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobType: string;
  experience: string;
  keySkills: string[];
  industryType: string;
  category: string;
  postedAt: string;
  createdAt: string;
};

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalJobs: number;
  currentPage: number;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
};

// Async thunk with search & pagination
export const fetchAllJobs = createAsyncThunk<{
  jobs: Job[];
  totalJobs: number;
}>(
  "jobs/fetchAll",
  async ({
    page = 1,
    limit = 9,
    searchTitle = "",
    searchLocation = "",
  }: { page: number; limit: number; searchTitle: string; searchLocation: string }) => {
    const query = `?page=${page}&limit=${limit}&title=${searchTitle}&location=${searchLocation}`;
    const response = await axios.get(`/jobs/get-all-jobs${query}`);
    return {
      jobs: response.data.data,
      totalJobs: response.data.totalJobs, // Using totalJobs from response
    };
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalJobs = action.payload.totalJobs; // Update totalJobs in state
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setCurrentPage } = jobsSlice.actions;
export default jobsSlice.reducer;
