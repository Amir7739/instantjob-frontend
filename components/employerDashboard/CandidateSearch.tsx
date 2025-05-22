"use client";

import { useState } from "react";
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
  ButtonBase,
  Drawer,
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

// Mock candidate data (unchanged)
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior React Developer",
    experience: "5 years",
    location: "New York, NY",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    education: "BS Computer Science",
    rating: 4.8,
    available: true,
    salary: "$120k - $140k",
    lastActive: "2 days ago",
    profileViews: 156,
    matchScore: 95,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Full Stack Developer",
    experience: "3 years",
    location: "San Francisco, CA",
    skills: ["Python", "Django", "React", "PostgreSQL"],
    education: "MS Software Engineering",
    rating: 4.6,
    available: false,
    salary: "$100k - $120k",
    lastActive: "1 week ago",
    profileViews: 89,
    matchScore: 87,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Frontend Developer",
    experience: "2 years",
    location: "Remote",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    education: "BS Web Design",
    rating: 4.7,
    available: true,
    salary: "$80k - $100k",
    lastActive: "1 day ago",
    profileViews: 134,
    matchScore: 82,
  },
  {
    id: 4,
    name: "Amir Alam",
    title: "Full stack Developer",
    experience: "2 years",
    location: "Remote",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    education: "BS Web Design",
    rating: 4.7,
    available: true,
    salary: "$80k - $100k",
    lastActive: "1 day ago",
    profileViews: 134,
    matchScore: 82,
  },
  {
    id: 5,
    name: "Amir Alam",
    title: "Full stack Developer",
    experience: "2 years",
    location: "Remote",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    education: "BS Web Design",
    rating: 4.7,
    available: true,
    salary: "$80k - $100k",
    lastActive: "1 day ago",
    profileViews: 134,
    matchScore: 82,
  },
  {
    id: 6,
    name: "Amir Alam",
    title: "Full stack Developer",
    experience: "2 years",
    location: "Remote",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    education: "BS Web Design",
    rating: 4.7,
    available: true,
    salary: "$80k - $100k",
    lastActive: "1 day ago",
    profileViews: 134,
    matchScore: 82,
  },
  {
    id: 7,
    name: "Amir Alam",
    title: "Full stack Developer",
    experience: "2 years",
    location: "Remote",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    education: "BS Web Design",
    rating: 4.7,
    available: true,
    salary: "$80k - $100k",
    lastActive: "1 day ago",
    profileViews: 134,
    matchScore: 82,
  },
];

// Mock search stats (unchanged)
const searchStats = {
  totalCandidates: 15420,
  newThisWeek: 234,
  activeSearches: 8,
  resumesDownloaded: 45,
};

const CandidateSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [salaryRange, setSalaryRange] = useState<number[]>([50, 200]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Filter logic would go here
    }, 1500);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("");
    setLocationFilter("");
    setExperienceFilter("");
    setSalaryRange([50, 200]);
    setAvailableOnly(false);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "#10B981";
    if (score >= 75) return "#F59E0B";
    return "#6B7280";
  };

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

      {/* Search Bar - Top */}
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
      startIcon={isSearching ? undefined : <SearchIcon />}
      onClick={handleSearch}
      disabled={isSearching}
      sx={{
        bgcolor: "#4F46E5",
        "&:hover": { bgcolor: "#4338CA" },
        px: { xs: 2, md: 4 },
        py: { xs: 1.5, md: 2 },
        borderRadius: 2,
        minWidth: { xs: "100%", md: "150px" },
      }}
    >
      {isSearching ? "Searching..." : "Search"}
    </Button>

    {/* Mobile filter button only visible on small screens */}
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

  {isSearching && (
    <Box sx={{ mt: 2 }}>
      <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
    </Box>
  )}
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
        {/* Left Sidebar - Filters (Desktop) */}
        <Box
          sx={{
            width: "300px",
            flexShrink: 0,
            display: { xs: "none", md: "block" }, // Hide on mobile
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
              >
                Clear
              </Button>
            </Box>

            {/* Basic Filters */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  value={skillFilter}
                  label="Skills"
                  onChange={(e) => setSkillFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
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
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="San Francisco">San Francisco</MenuItem>
                  <MenuItem value="London">London</MenuItem>
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
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#4F46E5",
                        },
                    }}
                  />
                }
                label="Available candidates only"
              />
            </Box>

            {/* Statistics */}
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

        {/* Mobile Filter Drawer */}
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
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="San Francisco">San Francisco</MenuItem>
                  <MenuItem value="London">London</MenuItem>
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
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#4F46E5",
                        },
                    }}
                  />
                }
                label="Available candidates only"
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
                  flexDirection: { xs: "column", sm: "row" }, // column on phones, row on tablets+
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" }, // align left on phones, center on tablets+
                  gap: 2, // spacing between items when stacked
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1F2937",
                    textAlign: { xs: "left", sm: "inherit" }, // left on small screens
                  }}
                >
                  Search Results ({mockCandidates.length} candidates found)
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: "#10B981",
                    borderColor: "#10B981",
                    "&:hover": { borderColor: "#059669", color: "#059669" },
                    borderRadius: 2,
                    alignSelf: { xs: "flex-start", sm: "auto" }, // align left on small screens
                  }}
                >
                  Downloaded ({searchStats.resumesDownloaded})
                </Button>
              </Box>
            </Box>

            {mockCandidates.length > 0 ? (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {mockCandidates.map((candidate) => (
                    <Grid item xs={12} lg={6} key={candidate.id}>
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
                                {candidate.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {candidate.title}
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
                            label={`${candidate.matchScore}% Match`}
                            sx={{
                              bgcolor: `${getMatchColor(
                                candidate.matchScore
                              )}20`,
                              color: getMatchColor(candidate.matchScore),
                              fontWeight: "bold",
                            }}
                          />
                          <Chip
                            label={
                              candidate.available
                                ? "Available"
                                : "Not Available"
                            }
                            sx={{
                              bgcolor: candidate.available
                                ? "#D1FAE5"
                                : "#FEE2E2",
                              color: candidate.available
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
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ bgcolor: "#F1F5F9", color: "#475569" }}
                            />
                          ))}
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
                            {candidate.location}
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
                            {candidate.experience} • {candidate.salary}
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
                          <Typography variant="caption" color="text.secondary">
                            Active {candidate.lastActive}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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
                  Try adjusting your search filters to find more candidates.
                </Typography>
                <Button variant="outlined" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidateSearch;
