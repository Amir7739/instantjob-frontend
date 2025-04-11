import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/features/industryStatsSlice";

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return { categories, loading, error };
};
