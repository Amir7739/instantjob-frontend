"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Card,
  Grid,
  Avatar,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Drawer,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Bookmark as BookmarkIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  SearchOff as SearchOffIcon,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";

// Define the Candidate interface based on API response
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
  __v?: number;
}

// Define the API response interface
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

// Mock search stats (updated dynamically from API)
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

  // Placeholder state for filters (disabled for now)
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [salaryRange, setSalaryRange] = useState<number[]>([50, 200]);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchCandidates = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      console.log("Fetching candidates with URL:", `/candidates/all-candidate?page=${pageNum}`);
      const response = await axiosInstance.get<ApiResponse>("/candidates/all-candidate", {
        params: { page: pageNum },
      });
      console.log("API Response:", response.data);
      const data = response.data;
      setCandidates((prev) =>
        pageNum === 1 ? data.candidates : [...prev, ...data.candidates]
      );
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setHasMore(pageNum < (data.pagination.totalPages));
        searchStats.totalCandidates = data.pagination.totalCandidates || data.candidates.length;
      } else {
        console.warn("Pagination data missing, defaulting to single page");
        setTotalPages(1);
        setHasMore(false);
        searchStats.totalCandidates = data.candidates.length;
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates(page);
  }, [page, fetchCandidates]);

  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  // Placeholder handlers for filters (to be implemented later)
  const handleSearch = () => {
    // Disabled for now
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("");
    setLocationFilter("");
    setExperienceFilter("");
    setSalaryRange([50, 200]);
    setAvailableOnly(true);
    setPage(1);
    setCandidates([]);
    fetchCandidates(1);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "#10B981";
    if (score >= 75) return "#F59E0B";
    return "#6B7280";
  };

  // Calculate experience years (mocked since experience array is empty)
  const calculateExperience = (experience: any[]) => {
    return "0 years"; // Since experience is empty in API response
  };

  // Format location
  const formatLocation = (candidate: Candidate) => {
    return candidate.city && candidate.state
      ? `${candidate.city}, ${candidate.state}`
      : candidate.city || "Remote";
  };

  // Mock salary range (since no experience data)
  const mockSalary = () => "$60k - $80k"; // Default since experience is empty

  // Mock match score
  const mockMatchScore = () => Math.floor(Math.random() * (100 - 70) + 70);

  // Skeleton component for loading state
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
      }}
    >
      {/* Header Section */}
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

      {/* Search Bar - Top (Disabled) */}
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
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6B7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled
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
            disabled
          >
            <FilterIcon />
          </Button>
        </Box>
      </Paper>

      {/* Main Content Layout */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flex: 1,
          overflow: "hidden",
          mx: { xs: 2, md: 0 },
        }}
      >
        {/* Left Sidebar - Filters (Disabled) */}
        <Box
          sx={{
            width: "300px",
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, position: "sticky", top: 20 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#1F2937",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FilterIcon sx={{ color: "#4F46E5" }} />
                Filters
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ color: "#6B7280" }}
                disabled
              >
                Clear
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  value={skillFilter}
                  label="Skills"
                  onChange={(e) => setSkillFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Skills</MenuItem>
                  <MenuItem value="React">React</MenuItem>
                  <MenuItem value="Node.js">Node.js</MenuItem>
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="TypeScript">TypeScript</MenuItem>
                  <MenuItem value="Vue.js">Vue.js</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  label="Location"
                  onChange={(e) => setLocationFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="Delhi">Delhi</MenuItem>
                  <MenuItem value="Mumbai">Mumbai</MenuItem>
                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                  <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                  <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={experienceFilter}
                  label="Experience"
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Experience</MenuItem>
                  <MenuItem value="0-2">0-2 Years</MenuItem>
                  <MenuItem value="2-5">2-5 Years</MenuItem>
                  <MenuItem value="5+">5+ Years</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: "#374151" }}>
                  Salary Range (Annual)
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={salaryRange}
                    onChange={(_, newValue) =>
                      setSalaryRange(newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}k`}
                    min={30}
                    max={300}
                    sx={{
                      color: "#4F46E5",
                      "& .MuiSlider-thumb": { width: 20, height: 20 },
                    }}
                    disabled
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      ${salaryRange[0]}k
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${salaryRange[1]}k
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#4F46E5",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#4F46E5",
                      },
                    }}
                    disabled
                  />
                }
                label="Active candidates only"
              />
            </Box>

            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 2, color: "#1F2937" }}
              >
                Search Statistics
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Candidates
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {searchStats.totalCandidates.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    New This Week
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#10B981" }}
                  >
                    {searchStats.newThisWeek}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Active Searches
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#4F46E5" }}
                  >
                    {searchStats.activeSearches}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Mobile Filter Drawer (Disabled) */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sx={{
            "& .MuiDrawer-paper": { width: "80%", maxWidth: "300px", p: 2 },
          }}
        >
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1F2937" }}
              >
                Filters
              </Typography>
              <IconButton onClick={() => setMobileFilterOpen(false)}>
                <ClearIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  value={skillFilter}
                  label="Skills"
                  onChange={(e) => setSkillFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Skills</MenuItem>
                  <MenuItem value="React">React</MenuItem>
                  <MenuItem value="Node.js">Node.js</MenuItem>
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="TypeScript">TypeScript</MenuItem>
                  <MenuItem value="Vue.js">Vue.js</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  label="Location"
                  onChange={(e) => setLocationFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="Delhi">Delhi</MenuItem>
                  <MenuItem value="Mumbai">Mumbai</MenuItem>
                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                  <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                  <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={experienceFilter}
                  label="Experience"
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  disabled
                >
                  <MenuItem value="">All Experience</MenuItem>
                  <MenuItem value="0-2">0-2 Years</MenuItem>
                  <MenuItem value="2-5">2-5 Years</MenuItem>
                  <MenuItem value="5+">5+ Years</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: "#374151" }}>
                  Salary Range (Annual)
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={salaryRange}
                    onChange={(_, newValue) =>
                      setSalaryRange(newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}k`}
                    min={30}
                    max={300}
                    sx={{
                      color: "#4F46E5",
                      "& .MuiSlider-thumb": { width: 20, height: 20 },
                    }}
                    disabled
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      ${salaryRange[0]}k
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${salaryRange[1]}k
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#4F46E5",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#4F46E5",
                      },
                    }}
                    disabled
                  />
                }
                label="Active candidates only"
              />
            </Box>

            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 2, color: "#1F2937" }}
              >
                Search Statistics
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Candidates
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {searchStats.totalCandidates.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    New This Week
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#10B981" }}
                  >
                    {searchStats.newThisWeek}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Active Searches
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#4F46E5" }}
                  >
                    {searchStats.activeSearches}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ color: "#6B7280", mt: 2 }}
              disabled
            >
              Clear Filters
            </Button>
          </Box>
        </Drawer>

        {/* Right Content - Search Results */}
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
                  Search Results ({candidates.length} candidates found)
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
                sx={{ p: 3, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
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
                                sx={{ width: 48, height: 48, bgcolor: "#4F46E5" }}
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
                                bgcolor: `${getMatchColor(mockMatchScore())}20`,
                                color: getMatchColor(mockMatchScore()),
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
{/* 
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            {candidate.skills.length > 0 ? (
                              candidate.skills.slice(0, 3).map((skill, index) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  sx={{ bgcolor: "#F1F5F9", color: "#475569" }}
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
                          </Box> */}

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
                              {calculateExperience(candidate.experience)} •{" "}
                              {mockSalary()}
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
                              {new Date(candidate.updatedAt).toLocaleDateString()}
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
                      No candidates available at the moment.
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