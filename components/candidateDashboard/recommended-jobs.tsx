"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";
import { CandidateJobCard } from "./candidateJobCard";
import axiosInstance from "@/utils/axios";
import { checkSavedJob, saveJob, unsaveJob } from "@/services/saveJobService";
import { checkJobAppliedOrNot } from "@/services/applyJob";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  tags: string[];
  matchScore: number;
  industryType?: string;
}

interface RecommendedJobsProps {
  limit?: number;
}

export function RecommendedJobs({ limit }: RecommendedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([
    "all",
  ]);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [jobsPerPage, setJobsPerPage] = useState<number>(9);
  const router = useRouter();

  // Fetch candidateId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setCandidateId(id);
    } else {
      setError(
        "You are not logged in. Please log in to view recommended jobs."
      );
    }
  }, []);

  // Fetch initial saved jobs for the candidate
  const fetchSavedJobs = useCallback(async () => {
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
      console.error("Error fetching saved jobs:", error.message);
      setError("Failed to load saved jobs status. Please try again later.");
    }
  }, [candidateId, jobs]);

  // Call fetchSavedJobs when candidateId or jobs change
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

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
          // Save the job
          await saveJob(candidateId, jobId);
          setSavedJobs((prev) => [...prev, jobId]);
        } else {
          // Unsaving (local state only, as no unsave API is provided)
          await unsaveJob(candidateId, jobId);
          setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        }
      } catch (error: any) {
        console.error("Error toggling save job:", error.message);
        setError(
          `Failed to ${isSaved ? "unsave" : "save"} job. Please try again.`
        );
      }
    },
    [candidateId, savedJobs]
  );

  const fetchJobs = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (!candidateId) {
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/candidate-dashboard/recommended/${candidateId}?page=${pageNum}&limit=9`
        );
        const data = response.data;
       

        if (!data.jobs || !Array.isArray(data.jobs)) {
          throw new Error("Invalid response format: jobs array missing");
        }

        if (data.jobs.length === 0 && pageNum === 1) {
          setError(
            "No matching jobs found. Try updating your profile or check back later."
          );
          setHasMore(false);
          setJobsPerPage(0);
          return;
        }

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
            setHasMore(false); // No new jobs, stop fetching
          }

          return uniqueJobs as Job[];
        });

        // Update jobsPerPage
        setJobsPerPage(jobsWithAppliedStatus.length || 9);

        // Update available industries
        const industries = Array.from(
          new Set(
            jobsWithAppliedStatus.map((job: Job) => job.industryType || "Other")
          )
        );
        setAvailableIndustries((prev) =>
          Array.from(new Set([...prev, ...industries])).sort()
        );

        // Update pagination
        const totalPages = data.totalPages || 1;
        setHasMore(
          (prev) =>
            prev && pageNum < totalPages && jobsWithAppliedStatus.length > 0
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load jobs. Please try again later.";
        setError(errorMessage);
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    },
    [candidateId]
  );

  // Fetch jobs when candidateId is available
  useEffect(() => {
    if (candidateId) {
      setJobs([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      setAvailableIndustries(["all"]);
      setJobsPerPage(9);
      fetchJobs(1, true);
    }
  }, [candidateId, fetchJobs]);

  // Handle industry filter change
  const handleIndustryFilterChange = (event: any) => {
    const newFilter = event.target.value;
    setIndustryFilter(newFilter);
    setJobs([]);
    setPage(1);
    setHasMore(true);
    setJobsPerPage(9);
    fetchJobs(1, true);
  };

  // Load more jobs
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  }, [hasMore, loading, page, fetchJobs, jobs.length]);

  // Filter jobs by industry type (client-side)
  const displayedJobs = (limit ? jobs.slice(0, limit) : jobs).filter(
    (job) =>
      industryFilter === "all" ||
      (job.industryType || "Other") === industryFilter
  );

  // Skeleton loader
  const SkeletonLoader = ({ count }: { count: number }) => (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={28}
                      sx={{ mb: 1 }}
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                    >
                      <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                        sx={{ mr: 0.5 }}
                      />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                        sx={{ mr: 0.5 }}
                      />
                      <Skeleton variant="text" width="50%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={20}
                  sx={{ mt: 2 }}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  gap: 1,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1, flex: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{ borderRadius: 1, flex: 1 }}
                />
                <Skeleton variant="circular" width={36} height={36} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
      <InfiniteScroll
        dataLength={displayedJobs.length}
        next={loadMore}
        hasMore={limit ? false : hasMore}
        loader={<SkeletonLoader count={jobsPerPage} />}
        endMessage={
          displayedJobs.length > 0 && !hasMore ? (
            <Typography
              sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
            >
              No more jobs to show
            </Typography>
          ) : null
        }
      >
        <Grid container spacing={2}>
          {displayedJobs.map((job) => (
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
