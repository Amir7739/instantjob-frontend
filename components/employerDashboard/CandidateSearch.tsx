"use client";

import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  Card,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Bookmark as BookmarkIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  SearchOff as SearchOffIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";
import CandSearchFilter from "./CandSearchFilter";

// Define interfaces
interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  city?: string;
  state?: string;
  skills: string[];
  status: "Active" | "In-Active";
  education: any[];
  experience: any[];
  projects?: any[];
  createdAt: string;
  updatedAt: string;
  totalExperience?: string; // Made optional to match API response
  expectedSalary?: string; // Made optional to match API response
  preferredJobType?: string; // Made optional to match API response
  __v?: number;
}

interface ApiResponse {
  message: string;
  candidates: Candidate[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCandidates: number;
    candidatesPerPage: number;
  };
}

interface FilterOptions {
  skills: string[];
  cities: string[];
  states: string[];
  experienceRanges: string[];
  jobTypes: string[];
  salaryRanges: string[];
}

// Search stats
const searchStats = {
  totalCandidates: 0,
  newThisWeek: 234,
  activeSearches: 8,
  resumesDownloaded: 45,
};

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    skills: [],
    cities: [],
    states: [],
    experienceRanges: [],
    jobTypes: [],
    salaryRanges: [],
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await axiosInstance.get<FilterOptions>(
        "/candidates/filter-options"
      );
      setFilterOptions(response.data.filters);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, []);

  // Fetch candidates with filters
  const fetchCandidates = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      try {
        const params = {
          page: pageNum,
          search: searchQuery || undefined,
          skills: skillFilter.length > 0 ? skillFilter : undefined,
          city: cityFilter.length > 0 ? cityFilter : undefined,
          state: stateFilter.length > 0 ? stateFilter : undefined,
          experience:
            experienceFilter.length > 0 ? experienceFilter : undefined,
          jobType: jobTypeFilter.length > 0 ? jobTypeFilter : undefined,
          salary: salaryFilter.length > 0 ? salaryFilter : undefined,
          status: availableOnly ? "Active" : undefined,
        };

        const response = await axiosInstance.get<ApiResponse>(
          "/candidates/all-candidate",
          {
            params,
          }
        );
        const data = response.data;
        

        // Validate response
        if (!data.candidates || !Array.isArray(data.candidates)) {
          console.warn("Invalid candidates array:", data.candidates);
          setHasMore(false);
          return;
        }

        // Sanitize candidates to ensure skills is an array
        const sanitizedCandidates = data.candidates.map((candidate) => ({
          ...candidate,
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          totalExperience: candidate.totalExperience || "0 years",
          expectedSalary: candidate.expectedSalary || "Not specified",
          preferredJobType: candidate.preferredJobType || "Not specified",
        }));

        setCandidates((prev) =>
          pageNum === 1
            ? sanitizedCandidates
            : [...prev, ...sanitizedCandidates]
        );

        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setHasMore(pageNum < data.pagination.totalPages);
          searchStats.totalCandidates =
            data.pagination.totalCandidates || sanitizedCandidates.length;

        } else {
          console.warn("Pagination data missing:", data);
          setTotalPages(1);
          setHasMore(false);
          searchStats.totalCandidates = sanitizedCandidates.length;
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      searchQuery,
      skillFilter,
      cityFilter,
      stateFilter,
      experienceFilter,
      jobTypeFilter,
      salaryFilter,
      availableOnly,
    ]
  );

  // Trigger fetchCandidates when page changes
  useEffect(() => {
    fetchCandidates(page);
  }, [page, fetchCandidates]);

  // Initial fetch for filter options
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const loadMore = () => {
    
    if (page < totalPages && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearch = () => {
    
    setPage(1);
    setCandidates([]);
    fetchCandidates(1);
  };

  const getMatchColor = (mockMatchScore: () => number) => {
    const score = mockMatchScore();
    if (score >= 90) return "#10B981";
    if (score >= 75) return "#F59E0B";
    return "#6B7280";
  };

  const calculateExperience = (experience: any[]) => {
    return experience.length > 0
      ? experience[0].currentlyWorking
        ? "Current"
        : "Past"
      : "0 years";
  };

  const formatLocation = (candidate: Candidate) => {
    return candidate.city && candidate.state
      ? `${candidate.city}, ${candidate.state}`
      : candidate.city || "Remote";
  };

  const mockSalary = () => "$60k - $80k";

  const mockMatchScore = () => Math.floor(Math.random() * (100 - 70) + 70);

  const CandidateSkeleton = () => (
    <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="rounded" width={60} height={20} />
        <Skeleton variant="rounded" width={60} height={20} />
      </Box>
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton variant="text" width="30%" />
      </Box>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "100vh",
        m: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          px: { xs: 2, md: 0 },
        }}
      >
        <Avatar sx={{ bgcolor: "#4F46E5", width: 48, height: 48 }}>
          <SearchIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1F2937" }}
          >
            Candidate Search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find and connect with top talent for your positions
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 3, mb: 2, mx: { xs: 2, md: 0 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <TextField
            fullWidth
            label="Search by name, skills, or keywords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6B7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              bgcolor: "#4F46E5",
              "&:hover": { bgcolor: "#4338CA" },
              px: { xs: 2, md: 4 },
              py: { xs: 1.5, md: 2 },
              borderRadius: 2,
              minWidth: { xs: "100%", md: "150px" },
            }}
          >
            Search
          </Button>
          <Button
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#4F46E5",
              alignSelf: "flex-end",
            }}
            onClick={() => setMobileFilterOpen(true)}
          >
            <FilterIcon />
          </Button>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flex: 1,
          overflow: "hidden",
          mx: { xs: 2, md: 0 },
        }}
      >
        <CandSearchFilter
          filterOptions={filterOptions}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          experienceFilter={experienceFilter}
          setExperienceFilter={setExperienceFilter}
          jobTypeFilter={jobTypeFilter}
          setJobTypeFilter={setJobTypeFilter}
          salaryFilter={salaryFilter}
          setSalaryFilter={setSalaryFilter}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          setPage={setPage}
          setCandidates={setCandidates}
          fetchCandidates={fetchCandidates}
          searchStats={searchStats}
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
        />

        <Box sx={{ flex: 1, overflowY: "auto", height: "calc(100vh - 80px)" }}>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                bgcolor: "#F8FAFC",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1F2937",
                    textAlign: { xs: "left", sm: "inherit" },
                  }}
                >
                  Search Results ({searchStats.totalCandidates.toLocaleString()}{" "}
                  candidates found)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: "#10B981",
                    borderColor: "#10B981",
                    "&:hover": { borderColor: "#059669", color: "#059669" },
                    borderRadius: 2,
                    alignSelf: { xs: "flex-start", sm: "auto" },
                  }}
                >
                  Downloaded ({searchStats.resumesDownloaded})
                </Button>
              </Box>
            </Box>

            <InfiniteScroll
              dataLength={candidates.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <Box sx={{ p: 3 }}>
                  <Typography>Loading more candidates...</Typography>
                  <CandidateSkeleton />
                  <CandidateSkeleton />
                </Box>
              }
              scrollableTarget="scrollableDiv"
              endMessage={
                <Typography
                  sx={{ textAlign: "center", p: 3, color: "#6B7280" }}
                >
                  No more candidates to show
                </Typography>
              }
            >
              <Box
                id="scrollableDiv"
                sx={{
                  p: 3,
                  maxHeight: "calc(100vh - 200px)",
                  overflowY: "auto",
                }}
              >
                {candidates.length > 0 ? (
                  <Grid container spacing={3}>
                    {candidates.map((candidate) => (
                      <Grid item xs={12} lg={6} key={candidate._id}>
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                              width: {
                                xs: "23rem",
                                sm: "16rem",
                                md: "22rem",
                                lg: "22rem",
                                xl: "22rem",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: "#4F46E5",
                                }}
                              >
                                <PersonIcon />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: "bold", color: "#1F2937" }}
                                >
                                  {candidate.full_name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {candidate.email}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton sx={{ color: "#6B7280" }}>
                              <BookmarkIcon />
                            </IconButton>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Chip
                              label={`${mockMatchScore()}% Match`}
                              sx={{
                                bgcolor: `${getMatchColor(mockMatchScore)}20`,
                                color: getMatchColor(mockMatchScore),
                                fontWeight: "bold",
                              }}
                            />
                            <Chip
                              label={candidate.status}
                              sx={{
                                bgcolor:
                                  candidate.status === "Active"
                                    ? "#D1FAE5"
                                    : "#FEE2E2",
                                color:
                                  candidate.status === "Active"
                                    ? "#065F46"
                                    : "#991B1B",
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            {candidate.skills.length > 0 ? (
                              candidate.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    sx={{
                                      bgcolor: "#F1F5F9",
                                      color: "#475569",
                                    }}
                                  />
                                ))
                            ) : (
                              <Chip
                                label="No Skills"
                                size="small"
                                sx={{ bgcolor: "#F1F5F9", color: "#475569" }}
                              />
                            )}
                            {candidate.skills.length > 3 && (
                              <Chip
                                label={`+${candidate.skills.length - 3}`}
                                size="small"
                                sx={{ bgcolor: "#E0E7FF", color: "#4338CA" }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <LocationIcon
                              sx={{ fontSize: 16, color: "#6B7280" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {formatLocation(candidate)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <WorkIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                            <Typography variant="body2" color="text.secondary">
                              {candidate.totalExperience ||
                                calculateExperience(candidate.experience)}{" "}
                              • {candidate.expectedSalary || mockSalary()}
                            </Typography>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                sx={{ bgcolor: "#EEF2FF", color: "#4F46E5" }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ bgcolor: "#F0FDF4", color: "#16A34A" }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ bgcolor: "#FEF3C7", color: "#D97706" }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Active{" "}
                              {new Date(
                                candidate.updatedAt
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : isLoading ? (
                  <Box sx={{ p: 3 }}>
                    <CandidateSkeleton />
                    <CandidateSkeleton />
                  </Box>
                ) : (
                  <Box sx={{ p: 6, textAlign: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: "#F3F4F6",
                        mx: "auto",
                        mb: 3,
                        width: 80,
                        height: 80,
                      }}
                    >
                      <SearchOffIcon sx={{ fontSize: 40, color: "#9CA3AF" }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: "#374151", mb: 1 }}>
                      No candidates found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Try adjusting your filters or search terms.
                    </Typography>
                  </Box>
                )}
              </Box>
            </InfiniteScroll>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidateSearch;
