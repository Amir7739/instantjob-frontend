"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchJobById } from "@/redux/features/jobsSlice";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Skeleton,
  Snackbar,
  Alert,
  Tooltip,
  Divider,
  IconButton,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import {
  BusinessCenter,
  LocationOn,
  CalendarMonth,
  Payments,
  Work,
  CheckCircle,
  School,
  LocalOffer,
  Bookmark,
  Share,
  SendOutlined,
  Star,
  Verified,
  TrendingUp,
  AccessTime,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Navbar from "@/components/Navbar";
import Link from "next/link";

import axiosInstance from "@/utils/axios";
import { formatSalaryToLPA } from "@/components/JobCard";
import { checkSavedJob, saveJob } from "@/services/saveJobService";
import {
  getCandidateId,
  getRole,
  getToken,
  isCandidate,
  isLoggedIn,
} from "@/utils/authUtils";
import { applyJob, checkJobAppliedOrNot } from "@/services/applyJob";

// Custom styled components with enhanced modern design
const JobHeaderSection = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(99, 102, 241, 0.1) 0%, 
      rgba(168, 85, 247, 0.05) 25%, 
      rgba(236, 72, 153, 0.05) 50%, 
      rgba(251, 146, 60, 0.1) 100%
    ),
    linear-gradient(45deg, #667eea 0%, #764ba2 100%)
  `,
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(6, 4),
  color: "white",
  borderRadius: theme.spacing(3),
  boxShadow:
    "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
  marginBottom: theme.spacing(4),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 88,
  height: 88,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  boxShadow:
    "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)",
  fontSize: "2rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  border: "3px solid rgba(255, 255, 255, 0.3)",
  [theme.breakpoints.down("sm")]: {
    width: 72,
    height: 72,
    fontSize: "1.5rem",
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2.5),
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 0 0 1px rgba(0, 0, 0, 0.05)
  `,
  overflow: "visible",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.6) inset,
      0 0 0 1px rgba(0, 0, 0, 0.05)
    `,
  },
}));

const StickyCard = styled(SectionCard)(({ theme }) => ({
  background: `
    linear-gradient(145deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.9) 100%
    )
  `,
  border: "1px solid rgba(99, 102, 241, 0.1)",
  "&:hover": {
    transform: "none", // Remove hover transform for sticky cards
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%, 
    #f093fb 100%
  )`,
  color: "white",
  padding: "12px 32px",
  fontWeight: "700",
  fontSize: "1rem",
  borderRadius: theme.spacing(2),
  textTransform: "none",
  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: `linear-gradient(135deg, 
      #5a67d8 0%, 
      #6b46c1 50%, 
      #ec4899 100%
    )`,
    transform: "translateY(-2px)",
    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
    color: "rgba(255, 255, 255, 0.7)",
    boxShadow: "none",
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  color: "#667eea",
  border: "2px solid #667eea",
  padding: "10px 28px",
  fontWeight: "600",
  borderRadius: theme.spacing(2),
  textTransform: "none",
  backdropFilter: "blur(20px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "rgba(102, 126, 234, 0.1)",
    borderColor: "#5a67d8",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
  },
}));

const ModernChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.1) 100%
  )`,
  color: "#4c1d95",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  borderRadius: theme.spacing(1.5),
  fontWeight: "600",
  fontSize: "0.85rem",
  backdropFilter: "blur(10px)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: `linear-gradient(135deg, 
      rgba(99, 102, 241, 0.15) 0%, 
      rgba(168, 85, 247, 0.15) 100%
    )`,
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
  },
}));

const InfoBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(3),
  border: "1px solid rgba(255, 255, 255, 0.3)",
  fontSize: "0.875rem",
  fontWeight: "500",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: "800",
  fontSize: "1.5rem",
  marginBottom: theme.spacing(3),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "60px",
    height: "3px",
    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    borderRadius: "2px",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(99, 102, 241, 0.05)",
    transform: "translateX(4px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1.5),
  background: `linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.1) 100%
  )`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(2),
  border: "1px solid rgba(99, 102, 241, 0.2)",
}));

const JobDetailsPage = () => {
  const [savedJobStatus, setSavedJobStatus] = useState<number>(0);
  const [checkAppliedOrNot, setCheckAppliedOrNot] = useState<number>(0);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // For Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const { id: jobId } = useParams();
  const router = useRouter();
  const candidateId = getCandidateId(); // Get candidateId from the utility function
  const role = getRole(); // Get role from the utility function
  const token = getToken();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/jobs/get/${jobId}`);
        setJobData(response.data.job);
      } catch (err) {
        console.error("❌ Error fetching job:", err.message);
        setError(err.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleSaveJob = async () => {
    if (!isCandidate()) {
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`); // Redirect to login if not logged in or not a candidate
      return;
    }
    // If the job is already saved, no need to make an API call again
    if (savedJobStatus === 1) {
      setSnackbarMessage("You have already saved this job!"); // Warning message
      setSnackbarOpen(true); // Show the Snackbar
      return;
    }

    try {
      if (candidateId && jobId) {
        const result = await saveJob(candidateId, jobId); // Save the job
        setSnackbarMessage("Job saved successfully!"); // Success message
        setSnackbarOpen(true); // Show the Snackbar
      }
    } catch (err) {
      setSnackbarMessage("Error saving the job"); // Error message
      setSnackbarOpen(true); // Show the Snackbar
    }
  };

  const handleApplyJob = async () => {
    if (!isCandidate()) {
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    // If the job is already saved, no need to make an API call again
    if (checkAppliedOrNot === 1) {
      setSnackbarMessage("You have already apply this job!"); // Warning message
      setSnackbarOpen(true); // Show the Snackbar
      return;
    }

    try {
      if (candidateId && jobId) {
        const result = await applyJob(candidateId, jobId); // Save the job
        setSnackbarMessage("Job Applied successfully!"); // Success message
        setSnackbarOpen(true); // Show the Snackbar
      }
    } catch (err) {
      setSnackbarMessage("Error applied the job"); // Error message
      setSnackbarOpen(true); // Show the Snackbar
    }
  };

  useEffect(() => {
    const checkIfJobIsSaved = async () => {
      if (candidateId && jobId) {
        try {
          const savedJobStatus = await checkSavedJob(candidateId, jobId);
          setSavedJobStatus(savedJobStatus); // If job is saved, set to 1
        } catch (error) {
          console.error("Error checking saved job status", error);
        }
      }
    };

    if (candidateId && jobId) {
      checkIfJobIsSaved();
    }
  }, [candidateId, jobId]);

  useEffect(() => {
    const jobAppliedOrNot = async () => {
      if (candidateId && jobId) {
        try {
          const jobAppliedOrNot = await checkJobAppliedOrNot(
            candidateId,
            jobId
          );
          setCheckAppliedOrNot(jobAppliedOrNot); // If job is saved, set to 1
        } catch (error) {
          console.error("Error checking job applied or not", error);
        }
      }
    };

    if (candidateId && jobId) {
      jobAppliedOrNot();
    }
  }, [candidateId, jobId]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Skeleton
            variant="rectangular"
            height={80}
            sx={{ mb: 3, borderRadius: 2 }}
          />
          <Skeleton variant="text" height={50} width="60%" sx={{ mb: 2 }} />
          <Skeleton variant="text" height={40} width="80%" sx={{ mb: 2 }} />
          <Skeleton variant="text" height={40} width="70%" sx={{ mb: 3 }} />
          <Skeleton
            variant="rounded"
            height={250}
            sx={{ mt: 3, borderRadius: 2 }}
          />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            color="error.main"
            fontWeight="bold"
            gutterBottom
          >
            Oops! Something went wrong
          </Typography>
          <Typography variant="h6" color="error.dark">
            {error}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: `
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.02) 0%, 
            rgba(168, 85, 247, 0.02) 25%, 
            rgba(236, 72, 153, 0.02) 50%, 
            rgba(251, 146, 60, 0.02) 100%
          ),
          radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
        `,
        }}
      >
        <Container style={{ paddingTop: "6rem" }} maxWidth="lg" sx={{ py: 4 }}>
          {/* Job Header Section */}
          <JobHeaderSection>
            <Grid container spacing={3} alignItems="center">
              {/* Company Logo and Job Info Combined */}
              <Grid item xs={12} sm>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: { xs: 2, sm: 3 },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  {/* Company Logo */}
                  <Box sx={{
                    flexShrink: 0,
                    alignSelf: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <CompanyLogo
                      src={jobData.companyLogo}
                      alt={jobData.companyName}
                    >
                      {jobData.companyName.charAt(0)}
                    </CompanyLogo>
                  </Box>

                  {/* Job Details */}
                  <Box sx={{
                    flex: 1,
                    minWidth: 0, // Prevent flex item from overflowing
                  }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        gap: 2,
                        mb: 2,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography
                        variant="h3"
                        fontWeight="800"
                        gutterBottom
                        sx={{
                          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                          lineHeight: 1.2,
                          margin: 0
                        }}
                      >
                        {jobData.title}
                      </Typography>
                      <Verified
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: { xs: "1.5rem", sm: "2rem" }
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        opacity: 0.9,
                        mb: 3,
                        fontWeight: "500",
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                      }}
                    >
                      {jobData.companyName}
                    </Typography>


                    <Box sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 1, sm: 2 },
                      justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}>
                      <InfoBadge>
                        <LocationOn fontSize="small" />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          {jobData.location}
                        </Typography>
                      </InfoBadge>
                      <InfoBadge>
                        <BusinessCenter fontSize="small" />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          {jobData.jobType}
                        </Typography>
                      </InfoBadge>
                      <InfoBadge>
                        <Work fontSize="small" />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          {jobData.minExp}-{jobData.maxExp} years
                        </Typography>
                      </InfoBadge>
                      <InfoBadge>
                        <PeopleAltIcon fontSize="small" />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          {jobData.openings || 1}{" "}
                          {jobData.openings === 1 ? "opening" : "openings"}
                        </Typography>
                      </InfoBadge>
                      <InfoBadge>
                        <AccessTime fontSize="small" />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          Posted 3 days ago
                        </Typography>
                      </InfoBadge>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} lg="auto" sx={{ display: "flex", justifyContent: "center" , marginX:"auto" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, sm: 2 },
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  {/* First Row - Apply Now and Save Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 1.5, sm: 2 },
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    {/* Apply Now Button with Tooltip */}
                    <Tooltip
                      title={
                        role && role !== "candidate"
                          ? "Only candidates can apply for this job"
                          : ""
                      }
                      arrow
                    >
                      <span>
                        <ApplyButton
                          variant="contained"
                          startIcon={<SendOutlined />}
                          onClick={handleApplyJob}
                          disabled={
                            checkAppliedOrNot === 1 ||
                            (role && role !== "candidate")
                          }
                          sx={{
                            width: { xs: "9rem", sm: "11rem" },
                            minWidth: { xs: "9rem", sm: "11rem" },
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            py: { xs: 1.2, sm: 1.5 },
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {checkAppliedOrNot === 1 ? "Applied" : "Apply Now"}
                        </ApplyButton>
                      </span>
                    </Tooltip>

                    {/* Save Button with Tooltip */}
                    <Tooltip
                      title={
                        role && role !== "candidate"
                          ? "Only candidates can save this job"
                          : ""
                      }
                      arrow
                    >
                      <span>
                        <SaveButton
                          variant="outlined"
                          startIcon={<Bookmark />}
                          onClick={handleSaveJob}
                          sx={{
                            width: { xs: "8rem", sm: "10rem" },
                            minWidth: { xs: "8rem", sm: "10rem" },
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            py: { xs: 1, sm: 1.3 },
                            whiteSpace: 'nowrap',
                            ...(savedJobStatus === 1 && {
                              background: "rgba(34, 197, 94, 0.1)",
                              color: "#059669",
                              borderColor: "#059669",
                            }),
                          }}
                          disabled={
                            savedJobStatus === 1 || (role && role !== "candidate")
                          }
                        >
                          {savedJobStatus === 1 ? "Saved" : "Save"}
                        </SaveButton>
                      </span>
                    </Tooltip>

                    {/* Browse Jobs Button - Show inline on larger screens */}
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <Button
                        variant="outlined"
                        startIcon={<TrendingUp />}
                        sx={{
                          width: { sm: "11rem" },
                          minWidth: { sm: "11rem" },
                          fontSize: { sm: "1rem" },
                          py: { sm: 1.3 },
                          color: "white",
                          borderColor: "rgba(255, 255, 255, 0.5)",
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          textTransform: "none",
                          fontWeight: "600",
                          whiteSpace: 'nowrap',
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                            borderColor: "rgba(255, 255, 255, 0.8)",
                            transform: "translateY(-2px)",
                          },
                        }}
                        href="/all-jobs"
                      >
                        Browse Jobs
                      </Button>
                    </Box>
                  </Box>

                  {/* Second Row - Browse Jobs Button (mobile only, centered) */}
                  <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      sx={{
                        width: "10rem",
                        minWidth: "10rem",
                        fontSize: "0.8rem",
                        py: 1,
                        color: "white",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        textTransform: "none",
                        fontWeight: "600",
                        whiteSpace: 'nowrap',
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.2)",
                          borderColor: "rgba(255, 255, 255, 0.8)",
                          transform: "translateY(-2px)",
                        },
                      }}
                      href="/all-jobs"
                    >
                      Browse Jobs
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </JobHeaderSection>


          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {/* Left Side - Job Details */}
            <Box sx={{ flex: "1 1 auto", width: { xs: "100%", md: "66.67%" } }}>
              {/* Job Description */}
              <SectionCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle variant="h6">Job Description</SectionTitle>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "text.secondary",
                      mb: 4,
                    }}
                  >
                    {jobData.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{
                      mt: 4,
                      mb: 3,
                      color: "#374151",
                      fontSize: "1.3rem",
                    }}
                  >
                    🎯 Key Responsibilities
                  </Typography>
                  <List dense sx={{ mb: 4 }}>
                    {jobData.responsibilities.map((item, index) => (
                      <StyledListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                          <IconWrapper>
                            <CheckCircle
                              sx={{ color: "#10b981", fontSize: "1.2rem" }}
                            />
                          </IconWrapper>
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>

                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{
                      mt: 4,
                      mb: 3,
                      color: "#374151",
                      fontSize: "1.3rem",
                    }}
                  >
                    🎓 Requirements & Qualifications
                  </Typography>
                  <List dense>
                    {jobData.qualifications.map((item, index) => (
                      <StyledListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                          <IconWrapper>
                            <School
                              sx={{ color: "#667eea", fontSize: "1.2rem" }}
                            />
                          </IconWrapper>
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </CardContent>
              </SectionCard>

              {/* Key Skills */}
              <SectionCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle variant="h6">💼 Key Skills</SectionTitle>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
                  >
                    {jobData.keySkills.map((skill, index) => (
                      <ModernChip
                        key={index}
                        label={skill}
                        icon={<LocalOffer sx={{ fontSize: "1rem" }} />}
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          px: 2,
                          py: 1,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </SectionCard>

              {/* Company Information */}
              <SectionCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle variant="h6">
                    🏢 About {jobData.companyName}
                  </SectionTitle>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {jobData.companyDescription}
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
                      border: "1px solid rgba(99, 102, 241, 0.1)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", color: "#6366f1" }}
                    >
                      💡 "Join a team that's shaping the future of technology"
                    </Typography>
                  </Box>
                </CardContent>
              </SectionCard>
            </Box>

            {/* Right Side - Job Summary */}
            <Box
              sx={{
                width: { xs: "100%", md: "33.33%" },
                position: { xs: "static", md: "sticky" },
                alignSelf: "flex-start",
                top: 24,
              }}
            >
              {/* Job Highlights */}
              <StickyCard>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <SectionTitle
                      variant="h6"
                      sx={{ mb: 0, "&::after": { display: "none" } }}
                    >
                      📊 Job Summary
                    </SectionTitle>
                    <Star sx={{ color: "#fbbf24" }} />
                  </Box>
                  <List disablePadding>
                    <ListItem divider sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <BusinessCenter
                            sx={{ color: "#667eea", fontSize: "1.1rem" }}
                          />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Company"
                        secondary={jobData.companyName}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#1f2937",
                        }}
                      />
                    </ListItem>

                    <ListItem divider sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <LocationOn
                            sx={{ color: "#ef4444", fontSize: "1.1rem" }}
                          />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={jobData.location}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#1f2937",
                        }}
                      />
                    </ListItem>

                    <ListItem divider sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <Work sx={{ color: "#8b5cf6", fontSize: "1.1rem" }} />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience"
                        secondary={`${jobData.minExp}-${jobData.maxExp} years`}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#1f2937",
                        }}
                      />
                    </ListItem>

                    <ListItem divider sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <Payments
                            sx={{ color: "#10b981", fontSize: "1.1rem" }}
                          />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Salary"
                        secondary={formatSalaryToLPA(jobData.salaryRange)}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#10b981",
                        }}
                      />
                    </ListItem>

                    <ListItem divider sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <CalendarMonth
                            sx={{ color: "#f59e0b", fontSize: "1.1rem" }}
                          />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Posted Date"
                        secondary={new Date(jobData.applyBy).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#1f2937",
                        }}
                      />
                    </ListItem>

                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <IconWrapper>
                          <PeopleAltIcon
                            sx={{ color: "#6366f1", fontSize: "1.1rem" }}
                          />
                        </IconWrapper>
                      </ListItemIcon>
                      <ListItemText
                        primary="Openings"
                        secondary={jobData.openings}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontWeight: "600",
                        }}
                        secondaryTypographyProps={{
                          variant: "body1",
                          fontWeight: "700",
                          color: "#1f2937",
                        }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </StickyCard>

              {/* Benefits Section */}
              <StickyCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle
                    variant="h6"
                    sx={{ "&::after": { display: "none" } }}
                  >
                    🎁 Company Benefits
                  </SectionTitle>
                  <List dense>
                    {jobData.benefits.map((benefit, index) => (
                      <StyledListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <IconWrapper sx={{ width: 32, height: 32 }}>
                            <CheckCircle
                              sx={{ color: "#10b981", fontSize: "1rem" }}
                            />
                          </IconWrapper>
                        </ListItemIcon>
                        <ListItemText
                          primary={benefit}
                          primaryTypographyProps={{
                            fontSize: "0.95rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </CardContent>
              </StickyCard>

              {/* Action Buttons */}
              <StickyCard>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    gutterBottom
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    🚀 Ready to Apply?
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    {/* Apply Button with Tooltip */}
                    <Tooltip
                      title={
                        role && role !== "candidate"
                          ? "Only candidates can apply for this job"
                          : ""
                      }
                      arrow
                    >
                      <span style={{ width: "100%" }}>
                        <ApplyButton
                          variant="contained"
                          startIcon={<SendOutlined />}
                          onClick={handleApplyJob}
                          disabled={
                            checkAppliedOrNot === 1 ||
                            (role && role !== "candidate")
                          }
                          sx={{ width: "100%", py: 2 }}
                        >
                          {checkAppliedOrNot === 1 ? "✅ Applied" : "Apply Now"}
                        </ApplyButton>
                      </span>
                    </Tooltip>

                    <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                      {/* Save Button with Tooltip */}
                      <Tooltip
                        title={
                          role && role !== "candidate"
                            ? "Only candidates can save this job"
                            : ""
                        }
                        arrow
                      >
                        <span style={{ flex: 1 }}>
                          <SaveButton
                            variant="outlined"
                            startIcon={<Bookmark />}
                            onClick={handleSaveJob}
                            sx={{
                              width: "100%",
                              py: 1.5,
                              ...(savedJobStatus === 1 && {
                                background: "rgba(34, 197, 94, 0.1)",
                                color: "#059669",
                                borderColor: "#059669",
                              }),
                            }}
                            disabled={
                              savedJobStatus === 1 ||
                              (role && role !== "candidate")
                            }
                          >
                            {savedJobStatus === 1 ? "💾 Saved" : "Save"}
                          </SaveButton>
                        </span>
                      </Tooltip>
                      <IconButton
                        sx={{
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #f59e0b 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #db2777 50%, #d97706 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                          },
                        }}
                        size="large"
                        onClick={async () => {
                          const jobUrl = `https://instantjob-frontend-nuiz.vercel.app/jobs-desc/${jobId}`;
                          const shareData = {
                            title: `${jobData.title} at ${jobData.companyName} - InstantJob`,
                            text: `Hey! Your friend shared this awesome job opportunity from InstantJob: <b><span style="color:#0000FF">${jobData.title}</span></b> at <b><span style="color:#0000FF">${jobData.companyName}</span></b>. Check out the job description and apply here to join the InstantJob community: ${jobUrl}`,
                            url: jobUrl,
                          };

                          try {
                            if (navigator.share) {
                              await navigator.share(shareData);
                            } else {
                              await navigator.clipboard.writeText(
                                shareData.text
                              );
                            }
                          } catch (err) {
                            console.error("Error sharing job:", err);
                          }
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </StickyCard>
            </Box>
          </Box>

          {/* Enhanced Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              position: "fixed",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={
                snackbarMessage.includes("already")
                  ? "warning"
                  : snackbarMessage.includes("Error")
                    ? "error"
                    : "success"
              }
              sx={{
                width: "100%",
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                background: snackbarMessage.includes("already")
                  ? "rgba(251, 146, 60, 0.95)"
                  : snackbarMessage.includes("Error")
                    ? "rgba(239, 68, 68, 0.95)"
                    : "rgba(34, 197, 94, 0.95)",
                color: "white",
                fontWeight: "600",
                "& .MuiAlert-icon": {
                  color: "white",
                },
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

export default JobDetailsPage;
