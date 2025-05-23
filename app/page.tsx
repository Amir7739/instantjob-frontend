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
  CircularProgress,
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
import JobCard from "@/components/JobCard";
import FormSkeleton from "@/components/FormSkeleton";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSkillsCards, setExpandedSkillsCards] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoadingAllJobs, setIsLoadingAllJobs] = useState(false);

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
      rating: 4,
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
    pt: { xs: 10, md: 16 },  // Increased padding top
    pb: { xs: 6, md: 12 },
    position: "relative",
    overflow: "hidden",
    minHeight: { xs: "40vh", md: "60vh" }, // Added minHeight for better breathing space
  }}
>
  {/* Background Image */}
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

  {/* Main Content */}
  <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
    <Grid
      container
      spacing={4}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: { xs: 0, md: 2 }, // No side padding on mobile, add on desktop
      }}
    >
      {/* Text Content */}
      <Grid item xs={12} md={7}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "white",
            fontSize: { xs: "2.5rem", md: "3.5rem" }, // Slightly bigger on mobile
            mt: { xs: 4, sm: 6, md: 8, lg: 10 },
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

        {/* Search Form */}
<Paper
  elevation={3}
  sx={{
    p: { xs: 2, md: 3 },
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: {
      xs: "80%",
      sm: "100%",
      md: "100%",
      lg: "100%",
      xl: "100%",
    },
    mx: "auto",
  }}
>
  <Grid container spacing={2}>
    <Grid
      item
      xs={12}
      sm={6}
      md={5}
      sx={{
        mb: { xs: 2, md: 0 },
      }}
    >
      <TextField
        fullWidth
        placeholder="Title, company, skills, or job type"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#4F46E5" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: { xs: "100%", sm: "100%" },
        }}
      />
    </Grid>

    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      sx={{
        mb: { xs: 2, md: 0 },
      }}
    >
      <TextField
        fullWidth
        placeholder="Location"
        variant="outlined"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: "#4F46E5" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: { xs: "100%", sm: "100%" },
        }}
      />
    </Grid>

    <Grid item xs={12} sm={12} md={3}>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{
          minHeight: 54,
          borderRadius: 2,
          fontSize: "1rem",
          fontWeight: 600,
          py: { xs: 1.5, md: 0 },
        }}
        onClick={handleSearch}
        endIcon={<ArrowForwardIcon />}
      >
        Search Jobs
      </Button>
    </Grid>
  </Grid>
</Paper>



        {/* Popular Searches */}
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

          {["Remote", "Full-time", "Part-time", "Internship", "IT Jobs"].map(
            (term) => (
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
            )
          )}
        </Box>
      </Grid>

      {/* Image Section */}
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
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
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
    px: { xs: 2, md: 4 },  // <-- instead of ml, use px for side padding
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

    {isLoadingAllJobs ? (
      <Grid container spacing={2}>
        {[...Array(9)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FormSkeleton />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>
    )}

    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={4}
      mb={2}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={
          isLoadingAllJobs ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <WorkIcon />
          )
        }
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          padding: "10px 24px",
          borderRadius: "8px",
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "#1565c0",
            boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)",
            transform: "translateY(-2px)",
          },
          "&:disabled": {
            backgroundColor: "#1976d2",
            opacity: 0.7,
          },
        }}
        onClick={() => {
          setIsLoadingAllJobs(true);
          setTimeout(() => {
            window.location.href = "/all-jobs";
          }, 2000); // Simulate loading delay
        }}
        disabled={isLoadingAllJobs}
      >
        {isLoadingAllJobs ? "Loading..." : "View All Jobs"}
      </Button>
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
          background: "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)",
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