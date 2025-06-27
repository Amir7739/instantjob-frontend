"use client";

import { useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import { FilterList as FilterIcon, Clear as ClearIcon } from "@mui/icons-material";

interface FilterOptions {
  skills: string[];
  cities: string[];
  states: string[];
  experienceRanges: string[];
  jobTypes: string[];
  salaryRanges: string[];
}

interface SearchStats {
  totalCandidates: number;
  newThisWeek: number;
  activeSearches: number;
}

interface CandSearchFilterProps {
  filterOptions: FilterOptions;
  skillFilter: string[];
  setSkillFilter: (skills: string[]) => void;
  cityFilter: string[];
  setCityFilter: (cities: string[]) => void;
  stateFilter: string[];
  setStateFilter: (states: string[]) => void;
  experienceFilter: string[];
  setExperienceFilter: (experience: string[]) => void;
  jobTypeFilter: string[];
  setJobTypeFilter: (jobTypes: string[]) => void;
  salaryFilter: string[];
  setSalaryFilter: (salaries: string[]) => void;
  availableOnly: boolean;
  setAvailableOnly: (available: boolean) => void;
  setPage: (page: number) => void;
  setCandidates: (candidates: any[]) => void;
  fetchCandidates: (page: number) => void;
  searchStats: SearchStats;
  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
}

const CandSearchFilter: React.FC<CandSearchFilterProps> = ({
  filterOptions,
  skillFilter,
  setSkillFilter,
  cityFilter,
  setCityFilter,
  stateFilter,
  setStateFilter,
  experienceFilter,
  setExperienceFilter,
  jobTypeFilter,
  setJobTypeFilter,
  salaryFilter,
  setSalaryFilter,
  availableOnly,
  setAvailableOnly,
  setPage,
  setCandidates,
  fetchCandidates,
  searchStats,
  mobileFilterOpen,
  setMobileFilterOpen,
}) => {
  const clearFilters = useCallback(() => {
    setSkillFilter([]);
    setCityFilter([]);
    setStateFilter([]);
    setExperienceFilter([]);
    setJobTypeFilter([]);
    setSalaryFilter([]);
    setAvailableOnly(true);
    setPage(1);
    setCandidates([]);
    fetchCandidates(1);
  }, [
    setSkillFilter,
    setCityFilter,
    setStateFilter,
    setExperienceFilter,
    setJobTypeFilter,
    setSalaryFilter,
    setAvailableOnly,
    setPage,
    setCandidates,
    fetchCandidates,
  ]);

  const handleFilterChange = useCallback(
    (setter: (value: string[]) => void) => (e: any) => {
      setter(e.target.value as string[]);
      setPage(1);
      setCandidates([]);
      fetchCandidates(1);
    },
    [setPage, setCandidates, fetchCandidates]
  );

  const handleDeleteChip = useCallback(
    (setter: (value: string[]) => void, value: string[], chipToDelete: string) => () => {
      const updatedValues = value.filter((val) => val !== chipToDelete);
      setter(updatedValues);
      setPage(1);
      setCandidates([]);
      fetchCandidates(1);
    },
    [setPage, setCandidates, fetchCandidates]
  );

  const renderFilterSelect = useCallback(
    (label: string, value: string[], options: string[], setter: (value: string[]) => void) => (
      <FormControl fullWidth sx={{ mb: 2 }} key={label}>
        <InputLabel sx={{ fontWeight: 500, color: "#1F2937" }}>{label}</InputLabel>
        <Select
          multiple
          value={value}
          onChange={handleFilterChange(setter)}
          label={label}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((val) => (
                <Chip
                  key={`${label}-${val}`}
                  label={val}
                  onDelete={handleDeleteChip(setter, value, val)}
                  deleteIcon={
                    <ClearIcon
                      sx={{
                        fontSize: 18,
                        color: "#6B7280",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "#EF4444",
                          transform: "scale(1.3)",
                        },
                      }}
                    />
                  }
                  sx={{
                    bgcolor: "linear-gradient(45deg, #E0E7FF, #F3E8FF)",
                    color: "#4338CA",
                    fontWeight: 500,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#C7D2FE" },
                    "& .MuiChip-deleteIcon": {
                      marginRight: 0.5,
                    },
                  }}
                />
              ))}
            </Box>
          )}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#E2E8F0" },
              "&:hover fieldset": { borderColor: "#4F46E5" },
              "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={`${label}-${option}`} value={option} sx={{ "&:hover": { bgcolor: "#F1F5F9" } }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    [handleFilterChange, handleDeleteChip]
  );

  const filterContent = useCallback(
    () => (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {renderFilterSelect("Skills", skillFilter, filterOptions.skills, setSkillFilter)}
        {renderFilterSelect("City", cityFilter, filterOptions.cities, setCityFilter)}
        {renderFilterSelect("State", stateFilter, filterOptions.states, setStateFilter)}
        {renderFilterSelect("Experience", experienceFilter, filterOptions.experienceRanges, setExperienceFilter)}
        {renderFilterSelect("Job Type", jobTypeFilter, filterOptions.jobTypes, setJobTypeFilter)}
        {renderFilterSelect("Salary Range", salaryFilter, filterOptions.salaryRanges, setSalaryFilter)}
        {/* <FormControlLabel
          control={
            <Switch
              checked={availableOnly}
              onChange={(e) => {
                setAvailableOnly(e.target.checked);
                setPage(1);
                setCandidates([]);
                fetchCandidates(1);
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4F46E5" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#4F46E5",
                  transition: "background-color 0.3s ease",
                },
                "& .MuiSwitch-switchBase": {
                  transition: "transform 0.3s ease",
                },
              }}
            />
          }
          label="Active candidates only"
          sx={{ color: "#1F2937", fontWeight: 500 }}
        /> */}
      </Box>
    ),
    [
      skillFilter,
      cityFilter,
      stateFilter,
      experienceFilter,
      jobTypeFilter,
      salaryFilter,
      availableOnly,
      filterOptions,
      setSkillFilter,
      setCityFilter,
      setStateFilter,
      setExperienceFilter,
      setJobTypeFilter,
      setSalaryFilter,
      setAvailableOnly,
      setPage,
      setCandidates,
      fetchCandidates,
      renderFilterSelect,
    ]
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <Box
        sx={{
          width: "300px",
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            position: "sticky",
            top: 20,
            bgcolor: "#F9FAFB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.3s ease",
            "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.08)" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <FilterIcon sx={{ color: "#4F46E5", fontSize: 24 }} />
              Filters
            </Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon sx={{ fontSize: 18 }} />}
              onClick={clearFilters}
              sx={{
                color: "#6B7280",
                fontWeight: 500,
                "&:hover": { color: "#4F46E5", bgcolor: "#F1F5F9" },
                transition: "all 0.2s ease",
              }}
            >
              Clear
            </Button>
          </Box>

          {filterContent()}

          <Divider sx={{ my: 3, borderColor: "#E2E8F0" }} />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 3, color: "#1F2937" }}
            >
              Search Statistics
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  Total Candidates
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                  {searchStats.totalCandidates.toLocaleString()}
                </Typography>
              </Box>
              {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  New This Week
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#10B981" }}
                >
                  {searchStats.newThisWeek}
                </Typography>
              </Box> */}
              
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: "320px",
            p: 3,
            bgcolor: "#F9FAFB",
            borderRadius: "0 16px 16px 0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <FilterIcon sx={{ color: "#4F46E5", fontSize: 24 }} />
              Filters
            </Typography>
            <IconButton
              onClick={() => setMobileFilterOpen(false)}
              sx={{
                color: "#6B7280",
                "&:hover": { color: "#4F46E5", bgcolor: "#F1F5F9" },
              }}
            >
              <ClearIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>

          {filterContent()}

          <Divider sx={{ my: 3, borderColor: "#E2E8F0" }} />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 3, color: "#1F2937" }}
            >
              Search Statistics
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  Total Candidates
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                  {searchStats.totalCandidates.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  New This Week
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#10B981" }}
                >
                  {searchStats.newThisWeek}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  Active Searches
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#4F46E5" }}
                >
                  {searchStats.activeSearches}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="medium"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            sx={{
              mt: 3,
              bgcolor: "#4F46E5",
              color: "#FFFFFF",
              fontWeight: 500,
              borderRadius: 2,
              "&:hover": { bgcolor: "#4338CA", transform: "scale(1.02)" },
              transition: "all 0.2s ease",
              width: "100%",
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CandSearchFilter;