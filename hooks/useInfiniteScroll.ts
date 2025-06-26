import { useState, useEffect, useCallback } from "react";
import { fetchRecruiterCandidates } from "@/services/recruiter";
import { Candidate } from "@/types/candidate";

interface InfiniteScrollResult {
  candidates: Candidate[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: string | null;
  refresh: () => void;
}

export const useInfiniteScroll = (token: string | null, limit: number = 10): InfiniteScrollResult => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async (pageToFetch: number = page) => {
    if (!token || loading || !hasMore) {
      
      return;
    }

    
    setLoading(true);
    try {
      const response = await fetchRecruiterCandidates(token, pageToFetch, limit);
      

      // Ensure no duplicates by checking _id
      setCandidates((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const newCandidates = response.candidates.filter((c: Candidate) => !existingIds.has(c._id));
        return [...prev, ...newCandidates];
      });

      setHasMore(response.currentPage < response.totalPages);
      setPage((prev) => (pageToFetch >= prev ? pageToFetch + 1 : prev));
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, loading, hasMore]);

  const refresh = useCallback(() => {
    
    setCandidates([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchCandidates(1); // Fetch first page
  }, [fetchCandidates]);

  useEffect(() => {
    fetchCandidates(1); // Initial fetch
  }, [fetchCandidates]);

  // Debounce scroll handler to prevent multiple rapid calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        
        fetchCandidates();
      }
    }, 300), // 300ms debounce
    [fetchCandidates]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { candidates, loading, hasMore, loadMore: fetchCandidates, error, refresh };
};