// hooks/useAllJobs.ts

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs } from "@/redux/features/jobsSlice";


export const useAllJobs = (page: number, search: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error, total } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    dispatch(fetchAllJobs({ page, limit: 9, search }));
  }, [dispatch, page, search]);

  return { jobs, loading, error, total };
};
