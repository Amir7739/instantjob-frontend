// redux/features/jobsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import axiosInstance from "../../utils/axios";

export type Job = {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobType: string;
  experience: string;
  minExp: number;
  maxExp: number;
  keySkills: string[];
  industryType: string;
  category: string;
  postedAt: string;
  createdAt: string;
  companyLogo?: string;
  applyBy?: string;
  openings?: number;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  companyDescription?: string;
};

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalJobs: number;
  currentPage: number;
  jobById: Job | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
  jobById: null
};

// Async thunk with search & pagination
export const fetchAllJobs = createAsyncThunk<{
  jobs: Job[];
  totalJobs: number;
}>(
  "jobs/fetchAll",
  async (
    { page, limit, searchTitle, searchLocation, jobType, department, industryType }, 
    { dispatch }
  ) => {
    // Update the query string to remove `workMode` and use `jobType`
    const query = `?page=${page}&limit=${limit}&title=${searchTitle || ''}&location=${searchLocation || ''}&jobType=${jobType ||''}&department=${department || ''}&industryType=${industryType || ''}`;

    const response = await axiosInstance.get(`/jobs/get-all-jobs${query}`);
    dispatch(setCurrentPage(page)); // Update the current page
    return {
      jobs: response.data.data,
      totalJobs: response.data.totalJobs,
    };
  }
);

export const fetchJobById = createAsyncThunk<Job, string>(
  "jobs/fetchById",
  async (jobId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/jobs/get/${jobId}`);
      console.log("✅ [Thunk] API Success:", response.data.job);
      return response.data.job;
    } catch (err: any) {
      console.log("❌ [Thunk] API Error:", err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
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
        state.jobs = state.currentPage === 1
          ? action.payload.jobs
          : [...state.jobs, ...action.payload.jobs];
        state.totalJobs = action.payload.totalJobs;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        console.log("✅ [Reducer] Setting jobById", action.payload);
        state.loading = false;
        state.jobById = action.payload;
      })
      
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch job details";
      });
  },
});

export const { setCurrentPage } = jobsSlice.actions;
export default jobsSlice.reducer;
