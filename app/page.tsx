"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  CardHeader,
  CardActions,
  Divider,
  Pagination,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useCategories } from "@/hooks/useCategories";
import { motion } from "framer-motion";
import { fetchAllJobs } from "@/redux/features/jobsSlice";
import useDebounce from "@/utils/useDebounce";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSkillsCards, setExpandedSkillsCards] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const jobsPerPage = 9;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedSearchLocation = useDebounce(searchLocation, 300);

  const { categories, loading, error } = useCategories();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { jobs, totalJobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    dispatch(
      fetchAllJobs({
        page: currentPage,
        limit: jobsPerPage,
        searchTitle: debouncedSearchTerm,
        searchLocation: debouncedSearchLocation,
      })
    );
  }, [dispatch, currentPage, debouncedSearchTerm, debouncedSearchLocation]);

  const handleSearch = () => {
    setCurrentPage(1);
    dispatch(
      fetchAllJobs({
        page: 1,
        limit: jobsPerPage,
        searchTitle: debouncedSearchTerm,
        searchLocation: debouncedSearchLocation,
      })
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const categoryIcons = {
    "Information Technology": {
      icon: <WorkIcon fontSize="large" />,
      color: "#4F46E5",
    },
    "Marketing & Sales": {
      icon: <TrendingUpIcon fontSize="large" />,
      color: "#E11D48",
    },
    "Finance & Accounting": {
      icon: <BusinessCenterIcon fontSize="large" />,
      color: "#16A34A",
    },
    "Design & Creative": {
      icon: <PeopleIcon fontSize="large" />,
      color: "#EA580C",
    },
    "Healthcare & Medical": {
      icon: <MedicalServicesIcon fontSize="large" />,
      color: "#0F766E",
    },
  };

  const jobCategories = {
    IT: "#4F46E5", // Indigo
    Marketing: "#E11D48", // Rose
    Finance: "#16A34A", // Green
    Design: "#EA580C", // Orange
    Data: "#7C3AED", // Purple
    Engineering: "#0284C7", // Blue
    Remote: "#0F766E", // Teal
  };

  const getJobColor = (title) => {
    if (
      title.includes("Frontend") ||
      title.includes("Backend") ||
      title.includes("DevOps")
    )
      return jobCategories.IT;
    if (title.includes("Product") || title.includes("Marketing"))
      return jobCategories.Marketing;
    if (title.includes("Data")) return jobCategories.Data;
    if (title.includes("Designer") || title.includes("UI/UX"))
      return jobCategories.Design;
    if (title.includes("Remote")) return jobCategories.Remote;
    return jobCategories.Engineering;
  };

  const getCompanyInitial = (companyName) => {
    return companyName.charAt(0).toUpperCase();
  };

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Calculate jobs for current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Full Stack Developer",
      company: "TechCorp",
      avatar: "/avatars/user1.jpg",
      quote:
        "I found my dream job within 2 weeks of signing up. The personalized job recommendations were spot on!",
      rating: 5,
    },
    {
      name: "Rahul Patel",
      role: "UX Designer",
      company: "DesignHub",
      avatar: "/avatars/user2.jpg",
      quote:
        "The platform made it easy to showcase my portfolio and connect with design-focused companies.",
      rating: 5,
    },
    {
      name: "Ananya Singh",
      role: "Data Analyst",
      company: "DataSense",
      avatar: "/avatars/user3.jpg",
      quote:
        "The skill assessment tests helped me stand out to employers and land interviews at top companies.",
      rating: 4,
    },
    {
      name: "Vikram Mehta",
      role: "Product Manager",
      company: "StartX",
      avatar: "/avatars/user4.jpg",
      quote:
        "This platform helped me transition from engineering to product management with targeted job recommendations.",
      rating: 5,
    },
    {
      name: "Neha Gupta",
      role: "Marketing Specialist",
      company: "MarketPro",
      avatar: "/avatars/user5.jpg",
      quote:
        "The interview preparation resources were invaluable. I felt confident and landed multiple offers!",
      rating: 5,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  // Previous slide function
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto-play effect
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)",
          pt: { xs: 6, md: 12 },
          pb: { xs: 6, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
          }}
        >
          <Image
            src="/images/1.png"
            alt="Background pattern"
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            spacing={4}
            sx={{
              minHeight: "60vh", // Full viewport height
              alignItems: "center", // Vertically center
              justifyContent: "center", // Horizontally center
              textAlign: "center",
              px: 2, // Optional horizontal padding
            }}
          >
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                  fontSize: { xs: "2rem", md: "3.5rem" },
                }}
              >
                Find Your Dream Job Instantly
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: "white",
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                Connect with top employers and get hired faster
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 1, md: 2 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Grid container spacing={10}>
                  <Grid item xs={12} sm={5} md={5}>
                    <TextField
                      fullWidth
                      placeholder="title, company, skills, or job type"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#4F46E5" }} />
                          </InputAdornment>
                        ),
                      }}
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Location"
                      variant="outlined"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: "#4F46E5" }} />
                          </InputAdornment>
                        ),
                      }}
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{
                        height: 54,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                      onClick={handleSearch}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Search Jobs
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Popular search chips with better styling */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                sx={{
                  mt: 3,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "white", mr: 1, opacity: 0.9 }}
                >
                  Popular searches:
                </Typography>
                {[
                  "Remote",
                  "Full-time",
                  "Part-time",
                  "Internship",
                  "IT Jobs",
                ].map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      borderRadius: 4,
                      backdropFilter: "blur(4px)",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                        cursor: "pointer",
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Improved illustration display */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: { xs: "none", md: "block" } }}
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 450,
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.18))",
                }}
                component={motion.div}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/job-search-illustration.png"
                  alt="People finding jobs"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          py: 4,
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={4} md={3} textAlign="center">
              <Typography variant="h3" fontWeight="700" color="#4F46E5">
                15,000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Active Job Listings
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3} textAlign="center">
              <Typography variant="h3" fontWeight="700" color="#E11D48">
                4,800+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Companies Hiring
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3} textAlign="center">
              <Typography variant="h3" fontWeight="700" color="#16A34A">
                75K+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Happy Job Seekers
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section with Improved Cards */}
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 6, sm: 8, md: 10 },
          mb: { xs: 6, sm: 5, md: 4 },
          px: 2,
          ml: 10,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ mb: { xs: 5, md: 7 }, textAlign: "center" }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="800"
            gutterBottom
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              background: "linear-gradient(to right, #4F46E5, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Browse Jobs by Category
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto" }}
          >
            Explore opportunities in top industries across India
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {categories.map((category, index) => {
            const { icon, color } = categoryIcons[category.industryType] || {};
            return (
              <Grid
                item
                xs={6}
                sm={4}
                md={15 / 5}
                key={category.industryType}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                      "& .category-icon": {
                        transform: "scale(1.15)",
                        color: "#4F46E5", // Hover color effect
                      },
                    },
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "#4F46E5", // Fixed category color
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2.5,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        className="category-icon"
                        sx={{
                          color: color || "#000", // Use the color from categoryIcons
                          width: 70,
                          height: 70,
                          transition: "all 0.3s",
                        }}
                      >
                        {/* Dynamically rendering the icon */}
                        {icon}
                      </Avatar>
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h3"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        fontWeight: 700,
                        color: "#333",
                      }}
                    >
                      {category.industryType}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      <Box component="span" fontWeight="600" color="#4F46E5">
                        {category.count.toLocaleString()}
                      </Box>{" "}
                      jobs available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Featured Jobs Section with Improved Cards */}
      <Box
        id="job-listings"
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          py: { xs: 6, sm: 8, md: 10 },
          // background: "linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)",
          ml: 10,
        }}
      >
        <Container maxWidth="xl" sx={{ px: 2 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="800"
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                background: "linear-gradient(to right, #4F46E5, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Featured Job Openings
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "800px", mx: "auto" }}
            >
              Handpicked opportunities from top companies
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {jobs.map((job, index) => {
              const jobColor = getJobColor(job.title);
              const isExpanded = expandedSkillsCards[index] || false;
              const displaySkills = isExpanded
                ? job.keySkills
                : job.keySkills.slice(0, 3);
              const remainingSkills =
                !isExpanded && job.keySkills.length > 3
                  ? job.keySkills.length - 3
                  : 0;
              const isJobSaved = savedJobs.includes(job._id);

              // Function to toggle skills expansion for this specific card
              const toggleSkillsExpansion = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedSkillsCards((prev) => ({
                  ...prev,
                  [index]: !prev[index],
                }));
              };

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index * 0.1) % 0.3, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.05)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: jobColor,
                      }}
                    />
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: alpha(jobColor, 0.15),
                            color: jobColor,
                            fontWeight: "bold",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {getCompanyInitial(job.companyName)}
                        </Avatar>
                      }
                      title={
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontSize: { xs: "1.1rem", md: "1.2rem" },
                            fontWeight: 700,
                            color: "#333",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {job.title}
                        </Typography>
                      }
                      subheader={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                          }}
                        >
                          {job.companyName}
                        </Typography>
                      }
                      action={
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveJob(job._id);
                          }}
                          sx={{
                            minWidth: "auto",
                            color: isJobSaved ? jobColor : "text.secondary",
                            "&:hover": { color: jobColor },
                          }}
                        >
                          {isJobSaved ? (
                            <BookmarkAddIcon fontSize="medium" />
                          ) : (
                            <BookmarkBorderIcon fontSize="medium" />
                          )}
                        </Button>
                      }
                      sx={{ pb: 0 }}
                    />
                    <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <BusinessCenterIcon
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {job.salaryRange}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Chip
                          label={job.jobType}
                          size="small"
                          sx={{
                            bgcolor: alpha(jobColor, 0.08),
                            color: jobColor,
                            fontWeight: 600,
                            borderRadius: 1,
                          }}
                        />
                        <Chip
                          label={job.experience}
                          size="small"
                          sx={{
                            bgcolor: "rgba(0,0,0,0.04)",
                            color: "text.secondary",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ mt: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1.5,
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          Key Skills:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                            minHeight: "60px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {displaySkills.map((skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: alpha(jobColor, 0.08),
                                color: jobColor,
                                fontSize: "0.7rem",
                                fontWeight: 500,
                                mb: 0.5,
                                borderRadius: "6px",
                              }}
                            />
                          ))}
                          {remainingSkills > 0 && (
                            <Chip
                              label={`+${remainingSkills} more`}
                              size="small"
                              onClick={toggleSkillsExpansion}
                              sx={{
                                bgcolor: alpha(jobColor, 0.03),
                                color: "text.secondary",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                                fontWeight: 500,
                                borderRadius: "6px",
                                "&:hover": {
                                  bgcolor: alpha(jobColor, 0.12),
                                },
                              }}
                            />
                          )}
                          {isExpanded && (
                            <Button
                              size="small"
                              onClick={toggleSkillsExpansion}
                              sx={{
                                minWidth: "auto",
                                fontSize: "0.75rem",
                                color: jobColor,
                                p: 0,
                                ml: 0.5,
                                fontWeight: 600,
                                "&:hover": {
                                  bgcolor: "transparent",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              Show less
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        p: 2,
                        pt: 0,
                        mt: "auto",
                        borderTop: "1px solid rgba(0,0,0,0.04)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{
                            color: "text.secondary",
                            mr: 0.5,
                            fontSize: "0.9rem",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Posted {job.postedAt}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            color: jobColor,
                            borderColor: jobColor,
                            borderRadius: "8px",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha(jobColor, 0.08),
                              borderColor: jobColor,
                            },
                          }}
                        >
                          Details
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: jobColor,
                            borderRadius: "8px",
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow: `0 4px 12px ${alpha(jobColor, 0.4)}`,
                            "&:hover": {
                              bgcolor: alpha(jobColor, 0.85),
                              boxShadow: `0 6px 15px ${alpha(jobColor, 0.5)}`,
                            },
                          }}
                        >
                          Apply Now
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Improved Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 8,
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Paper
                elevation={2}
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 3,
                  backgroundColor: "white",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#4F46E5 !important",
                      color: "white",
                    },
                  }}
                />
              </Paper>
            </Box>
          )}

          {/* Job count info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstJob + 1}-
              {Math.min(indexOfLastJob, totalJobs)} of {totalJobs} jobs
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section (NEW) */}
      {/* Testimonials Section with Auto-Carousel */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          py: { xs: 6, sm: 8, md: 10 },
          background: "white",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: { xs: 5, md: 6 }, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="800"
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                background: "linear-gradient(to right, #4F46E5, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Success Stories
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "800px", mx: "auto" }}
            >
              See what job seekers have to say about their experiences
            </Typography>
          </Box>

          {/* Auto-Carousel for Testimonials */}
          <Box sx={{ position: "relative", overflow: "hidden", py: 4 }}>
            {/* Add carousel indicators */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                zIndex: 2,
              }}
            >
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  component={motion.div}
                  initial={false}
                  animate={{
                    backgroundColor:
                      currentSlide === index ? "#4F46E5" : "rgba(0,0,0,0.2)",
                    width: currentSlide === index ? 24 : 12,
                  }}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>

            {/* Main carousel content */}
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.8s ease",
                transform: `translateX(-${
                  currentSlide * (100 / testimonials.length)
                }%)`,
                width: `${testimonials.length * 100}%`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    width: `${100 / testimonials.length}%`,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Card
                    sx={{
                      height: { xs: "auto", md: 190 },
                      borderRadius: 3,
                      p: 4,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                      transition: "all 0.3s",
                      border: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 14px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{
                          width: 60,
                          height: 60,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="700">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role} at {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: "italic",
                          fontSize: "1.05rem",
                          color: "#555",
                        }}
                      >
                        {testimonial.quote}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", color: "#FFB400" }}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Box key={i} sx={{ mr: 0.5, fontSize: "1.2rem" }}>
                            {i < testimonial.rating ? "★" : "☆"}
                          </Box>
                        ))}
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Navigation buttons */}
            <Button
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: { xs: -10, md: 10 },
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: "auto",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: "#4F46E5",
                "&:hover": {
                  backgroundColor: "white",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
                zIndex: 2,
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </Button>
            <Button
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: { xs: -10, md: 10 },
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: "auto",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: "#4F46E5",
                "&:hover": {
                  backgroundColor: "white",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
                zIndex: 2,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section (NEW) */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          background: "linear-gradient(120deg, #4F46E5, #7C3AED)",
          py: { xs: 6, sm: 8, md: 10 },

          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            zIndex: 0,
            background: "url('/images/pattern-dots.svg')",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Grid item xs={12}>
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  color: "white",
                  mb: 2,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                }}
              >
                Ready to find your dream job?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                Join thousands who've already found their perfect career match
              </Typography>
              <Link href="/register" passHref>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "#4F46E5",
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  Create Your Profile
                </Button>
              </Link>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mt: 2,
                }}
              >
                It's free and takes less than 2 minutes
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer (NEW) */}
    </>
  );
}
