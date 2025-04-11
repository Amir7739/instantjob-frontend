import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import categoryReducer from "./features/industryStatsSlice";
import jobsReducer from "./features/jobsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    jobs: jobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
