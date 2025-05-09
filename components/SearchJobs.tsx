"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Typography, Button, Tabs, Tab } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter, useSearchParams } from "next/navigation";

import { checkSavedJob, saveJob, unsaveJob } from "@/services/saveJobService";
import { checkJobAppliedOrNot } from "@/services/applyJob";
import axiosInstance from "@/utils/axios";
import { CandidateJobCard } from "./candidateDashboard/candidateJobCard";
import { SkeletonLoader } from "./SkeletonLoader";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  tags: string[];
  appliedAt?: string;
  savedAt?: string;
  matchScore: number;
  matchCount: number;
}

interface SearchJobsProps {
  limit?: number;
}

async function searchJobs(
  candidateId: string,
  search: string,
  type: string,
  page: number,
  limit: number
) {
  const query = new URLSearchParams({
    search,
    type,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();
  const url = `/candidate-dashboard/search/${candidateId}?${query}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("API error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || `Failed to fetch ${type} jobs`
    );
  }
}

export function SearchJobs({ limit }: SearchJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [jobsPerPage, setJobsPerPage] = useState<number>(9);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const type = searchParams.get("type") || "recommended";

  // Fetch candidateId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setCandidateId(id);
    } else {
      setError("You are not logged in. Please log in to view jobs.");
    }
  }, []);

  // Fetch initial saved jobs for the candidate
  const fetchSavedJobsStatus = useCallback(async () => {
    if (!candidateId || jobs.length === 0) return;

    try {
      const savedJobsPromises = jobs.map((job) =>
        checkSavedJob(candidateId, job.id).then((isSaved) =>
          isSaved === 1 ? job.id : null
        )
      );
      const savedJobIds = (await Promise.all(savedJobsPromises)).filter(
        (id) => id !== null
      ) as string[];
      setSavedJobs(savedJobIds);
    } catch (error: any) {
      console.error("Error fetching saved jobs status:", error.message);
      setError("Failed to load saved jobs status. Please try again later.");
    }
  }, [candidateId, jobs]);

  // Call fetchSavedJobsStatus when candidateId or jobs change
  useEffect(() => {
    fetchSavedJobsStatus();
  }, [fetchSavedJobsStatus]);

  // Handle saving/unsaving a job
  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      if (!candidateId) {
        setError("You must be logged in to save jobs.");
        return;
      }

      const isSaved = savedJobs.includes(jobId);
      try {
        if (!isSaved) {
          await saveJob(candidateId, jobId);
          setSavedJobs((prev) => [...prev, jobId]);
        } else {
          await unsaveJob(candidateId, jobId);
          setSavedJobs((prev) => prev.filter((id) => id !== jobId));
          if (type === "saved") {
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
          }
        }
      } catch (error: any) {
        console.error("Error toggling save job:", error.message);
        setError(
          `Failed to ${isSaved ? "unsave" : "save"} job. Please try again.`
        );
      }
    },
    [candidateId, savedJobs, type]
  );

  const fetchJobs = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (!candidateId) {
        setError("No candidate ID found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const data = await searchJobs(
          candidateId,
          searchQuery,
          type,
          pageNum,
          9
        );
        console.log(`Fetched ${type} jobs page ${pageNum}:`, {
          jobIds: data.jobs?.map((job: Job) => job.id) || [],
          totalJobs: data.totalJobs,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        });

        // Handle empty or invalid response
        if (!data.jobs || !Array.isArray(data.jobs)) {
          console.warn("Invalid response: jobs array missing", data);
          setError(
            `No ${type} jobs found for "${searchQuery}". Try a different search.`
          );
          setHasMore(false);
          setJobsPerPage(0);
          setLoading(false);
          return;
        }

        if (data.jobs.length === 0 && pageNum === 1) {
          setError(
            `No ${type} jobs found for "${searchQuery}". Try a different search.`
          );
          setHasMore(false);
          setJobsPerPage(0);
          setLoading(false);
          return;
        }

        // Check application status for each job
        const jobsWithAppliedStatus = await Promise.all(
          data.jobs.map(async (job: Job) => {
            const appliedStatus = await checkJobAppliedOrNot(
              candidateId,
              job.id
            );
            return { ...job, isApplied: appliedStatus === 1 };
          })
        );

        // Update jobs with deduplication
        setJobs((prevJobs) => {
          const newJobs = reset
            ? jobsWithAppliedStatus
            : [...prevJobs, ...jobsWithAppliedStatus];
          const uniqueJobs = Array.from(
            new Set(newJobs.map((job) => job.id))
          ).map((id) => newJobs.find((job) => job.id === id));

          if (!reset && uniqueJobs.length === prevJobs.length) {
            setHasMore(false);
          }

          return uniqueJobs as Job[];
        });

        setJobsPerPage(jobsWithAppliedStatus.length || 9);
        const totalPages = data.totalPages || 1;
        setHasMore(pageNum < totalPages && jobsWithAppliedStatus.length > 0);
      } catch (error: any) {
        const errorMessage =
          error.message ||
          `Failed to load ${type} jobs. Please check your connection or try again later.`;
        setError(errorMessage);
        console.error(`Error fetching ${type} jobs:`, error);
      } finally {
        setLoading(false);
      }
    },
    [candidateId, searchQuery, type]
  );

  // Fetch jobs when candidateId, searchQuery, or type changes
  useEffect(() => {
    if (candidateId) {
      setJobs([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      setJobsPerPage(9);
      fetchJobs(1, true);
    }
  }, [candidateId, searchQuery, type, fetchJobs]);

  // Load more jobs
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  }, [hasMore, loading, page, fetchJobs, jobs.length]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(
      `/cand-dash/search?search=${encodeURIComponent(
        searchQuery
      )}&type=${newValue}`
    );
  };

  // Handle unauthenticated state
  if (!candidateId && !error) {
    return <SkeletonLoader count={jobsPerPage} />;
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1, p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {error}
        </Typography>
        {error.includes("log in") && (
          <Button
            variant="contained"
            onClick={() => {
              localStorage.removeItem("id");
              localStorage.removeItem("role");
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Go to Login
          </Button>
        )}
        {!error.includes("log in") && (
          <Button
            variant="contained"
            onClick={() => {
              setError(null);
              setPage(1);
              setJobs([]);
              setHasMore(true);
              setJobsPerPage(9);
              fetchJobs(1, true);
            }}
          >
            Retry
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Tabs value={type} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Recommended" value="recommended" />
        <Tab label="Saved" value="saved" />
        <Tab label="Applied" value="applied" />
      </Tabs>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : `All ${type} jobs`}
      </Typography>
      <InfiniteScroll
        dataLength={jobs.length}
        next={loadMore}
        hasMore={limit ? false : hasMore}
        loader={<SkeletonLoader count={jobsPerPage} />}
        endMessage={
          jobs.length > 0 && !hasMore ? (
            <Typography
              sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
            >
              No more {type} jobs to show
            </Typography>
          ) : null
        }
      >
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <CandidateJobCard
                job={job}
                savedJobs={savedJobs}
                toggleSaveJob={toggleSaveJob}
                candidateId={candidateId}
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
