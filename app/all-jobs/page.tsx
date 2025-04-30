"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs } from "@/redux/features/jobsSlice";
import JobCard from "@/components/JobCard";
import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  Container,
  Paper,
  Divider,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Select,
  MenuItem,
  IconButton,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import useDebounce from "@/utils/useDebounce";
import axiosInstance from "@/utils/axios";
import FormSkeleton from "@/components/FormSkeleton";

const ViewAllJobsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, totalJobs } = useSelector(
    (state: RootState) => state.jobs
  );

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [experience, setExperience] = useState<number[]>([0, 30]);
  const [appliedFilters, setAppliedFilters] = useState(4);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState({
    locations: [],
    workModes: [],
    jobTypes: [],
    departments: [],
    industryTypes: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    workMode: "",
    jobType: "",
    department: "",
    industryType: "",
  });

  // Use debounced search term and location
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedSearchLocation = useDebounce(searchLocation, 300);

  const fetchFilters = async () => {
    try {
      const response = await axiosInstance.get("/jobs/get-jobs-filter");
      setFilters(response.data.data); // Set the fetched filter options with counts
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  useEffect(() => {
    fetchFilters(); // Fetch filter options when the component mounts
  }, []);

  const loadMore = useCallback(() => {
    if (jobs.length < totalJobs && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [jobs.length, totalJobs, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadMore]);

  // // Function to handle search
  // const handleSearch = () => {
  //   setPage(1); // Reset to page 1 when a new search is performed
  //   dispatch(
  //     fetchAllJobs({
  //       page: 1,
  //       limit: 6,
  //       searchTitle: debouncedSearchTerm,
  //       searchLocation: debouncedSearchLocation,
  //       ...selectedFilters
  //     })
  //   );
  // };

  const fetchJobs = useCallback(() => {
    dispatch(
      fetchAllJobs({
        page,
        limit: 6,
        searchTitle: debouncedSearchTerm,
        searchLocation: selectedFilters.location,
        jobType: selectedFilters.jobType,
        department: selectedFilters.department,
        industryType: selectedFilters.industryType,
      })
    );
  }, [
    dispatch,
    page,
    debouncedSearchTerm,
    debouncedSearchLocation,
    selectedFilters,
  ]);

  useEffect(() => {
    fetchJobs(); // Fetch jobs when filters or search terms change
  }, [
    fetchJobs,
    selectedFilters,
    debouncedSearchTerm,
    debouncedSearchLocation,
    totalJobs,
  ]);

  const handleSearch = () => {
    setPage(1); // Reset to page 1 when a new search is performed
    fetchJobs();
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterName]: prevState[filterName] === value ? "" : value,
    }));
  };

  const handleExperienceChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setExperience(newValue as number[]);
  };

  // Filter sidebar component
  const FiltersPanel = () => (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          All Filters
        </Typography>
        <Chip
          label={`Applied (${
            Object.values(selectedFilters).filter((filter) => filter).length
          })`}
          color="primary"
          variant="outlined"
          size="small"
        />
        {mobileFiltersOpen && (
          <IconButton
            onClick={() => setMobileFiltersOpen(false)}
            sx={{ display: { md: "none" } }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mt: 1, mb: 2 }} />

      {/* Location Filter */}
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ "&:before": { display: "none" }, border: "none", mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Location
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {filters.locations.map((location, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedFilters.location === location._id}
                    onChange={() =>
                      handleFilterChange("location", location._id)
                    }
                  />
                }
                label={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{location._id}</span>
                    <Typography variant="body2" color="text.secondary">
                      ({location.count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Work Mode Filter */}
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ "&:before": { display: "none" }, border: "none", mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Work Mode
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {filters.workModes.map((jobType, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedFilters.jobType === jobType._id}
                    onChange={() => handleFilterChange("jobType", jobType._id)}
                  />
                }
                label={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{jobType._id}</span>
                    <Typography variant="body2" color="text.secondary">
                      ({jobType.count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ "&:before": { display: "none" }, border: "none", mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Department
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {filters.departments && filters.departments.length > 0 ? (
              filters.departments.map((industryType, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={
                        selectedFilters.industryType === industryType._id
                      }
                      onChange={() =>
                        handleFilterChange("industryType", industryType._id)
                      }
                    />
                  }
                  label={
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{industryType._id || "Not Specified"}</span>
                      <Typography variant="body2" color="text.secondary">
                        ({industryType.count})
                      </Typography>
                    </Box>
                  }
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No industry types available
              </Typography>
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* Experience Filter */}
      {/* <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ "&:before": { display: "none" }, border: "none", mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Experience
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Slider
            value={experience}
            onChange={handleExperienceChange}
            valueLabelDisplay="off"
            min={0}
            max={30}
            sx={{
              color: "#4F46E5",
              "& .MuiSlider-thumb": { backgroundColor: "#1a1a1a" },
              "& .MuiSlider-rail": { backgroundColor: "#e0e0e0" },
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <Typography variant="body2">{experience[0]} Yrs</Typography>
            <Typography variant="body2">{experience[1]} Yrs</Typography>
          </Box>
        </AccordionDetails>
      </Accordion> */}

      <Divider sx={{ my: 1 }} />
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
        background: "linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            mt: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}
          textAlign="center"
        >
          <Typography
            variant="h3"
            fontWeight="700"
            color="primary.dark"
            gutterBottom
            sx={{
              mt: "4rem",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Find Your Dream Job
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: { xs: 2, md: 3 },
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Discover thousands of job opportunities with top companies
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 3, sm: 4 },
            borderRadius: { xs: 2, md: 3 },
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(230, 235, 245, 0.9)",
            width: "100%", // Make Paper take full width
          }}
        >
          {/* Use flexDirection to stack elements on small screens */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
            }}
          >
            {/* Search field takes available space */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 70%" },
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                placeholder="search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    height: 56,
                    backgroundColor: "rgba(245, 247, 250, 0.6)",
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Box>

            {/* Button takes just what it needs */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "0 0 auto" },
              }}
            >
              <Button
                fullWidth={false}
                variant="contained"
                color="primary"
                sx={{
                  height: 56,
                  minWidth: { xs: "100%", sm: 140 },
                  borderRadius: 2,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                  background:
                    "linear-gradient(45deg, #4F46E5 30%, #6366F1 90%)",
                }}
                onClick={handleSearch}
                endIcon={<ArrowForwardIcon />}
              >
                Search Jobs
              </Button>
            </Box>
          </Box>
        </Paper>
        {/* Main content with filters and job listings */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Filters Section - Hidden on mobile, visible on desktop */}
          <Box
            sx={{
              width: { md: "280px", lg: "320px" },
              flexShrink: 0,
              display: { xs: "none", md: "block" },
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "#ffffff",
                position: "sticky",
                top: 20,
              }}
            >
              <FiltersPanel />
            </Paper>
          </Box>

          {/* Mobile Filter Button */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
              px: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFiltersOpen(true)}
              sx={{
                borderRadius: 6,
                px: 2,
                borderColor: "rgba(0, 0, 0, 0.12)",
                color: "text.primary",
              }}
            >
              Filters
            </Button>
            <Chip
              label={`${totalJobs} Jobs Available`}
              icon={<WorkIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "85%",
                maxWidth: "320px",
                boxSizing: "border-box",
              },
            }}
          >
            <FiltersPanel />
          </Drawer>

          {/* Job Listings Section */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Job Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              px={{ xs: 1, md: 0 }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                sx={{
                  fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.4rem" },
                }}
              >
                Job Listings
              </Typography>

              <Chip
                label={`Showing ${jobs.length} of ${totalJobs} jobs`}
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: 6,
                  display: { xs: "none", md: "flex" },
                }}
              />
            </Box>

            {/* Job Cards Grid */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {loading
                ? [...Array(6)].map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <FormSkeleton />
                    </Grid>
                  ))
                : jobs.map((job) => (
                    <Grid item xs={12} key={job._id}>
                      <JobCard job={job} />
                    </Grid>
                  ))}
            </Grid>

            {/* Empty state */}
            {jobs.length === 0 && !loading && (
              <Box
                textAlign="center"
                py={{ xs: 4, sm: 6, md: 8 }}
                sx={{
                  backgroundColor: "rgba(245, 247, 250, 0.7)",
                  borderRadius: { xs: 2, md: 4 },
                  border: "1px dashed rgba(0, 0, 0, 0.12)",
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No jobs found matching your criteria
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search terms or location
                </Typography>
              </Box>
            )}

            {/* Load more observer */}
            <div ref={observerRef} />

            {/* Loading Spinner */}
            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={{ xs: 2, md: 4 }}
              >
                <CircularProgress
                  size={34}
                  thickness={4}
                  sx={{ color: "primary.main" }}
                />
                <Typography
                  variant="body1"
                  color="primary"
                  fontWeight={500}
                  ml={2}
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  Loading more jobs...
                </Typography>
              </Box>
            )}

            {/* End of results message */}
            {jobs.length === totalJobs && totalJobs > 0 && (
              <Box mt={{ xs: 3, md: 4 }} textAlign="center">
                <Divider sx={{ mb: 2 }}>
                  <Chip label="End of results" />
                </Divider>
                <Typography variant="body2" color="text.secondary">
                  You've viewed all available job listings
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ViewAllJobsPage;
