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

// Custom styled components
const JobHeaderSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)",
  padding: theme.spacing(4),
  color: "white",
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(3),
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: "white",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  overflow: "visible",
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #ff5722 30%, #ff9800 90%)",
  color: "white",
  padding: "10px 30px",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #f44336 30%, #ff5722 90%)",
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: "#ffffff",
  color: "#2557a7",
  border: "1px solid #2557a7",
  padding: "10px 20px",
  "&:hover": {
    background: "#f0f7ff",
  },
}));

// Mock data - would be replaced by actual API data
const dummyJobData = {
  id: "job123",
  title: "Senior Frontend Developer",
  companyName: "TechSolutions Inc.",
  companyLogo: "/company-logo.png", // This would be a placeholder
  location: "Bangalore, Karnataka",
  employmentType: "Full-time",
  experience: "4-6 years",
  salaryRange: "₹18,00,000 - ₹25,00,000 PA",
  postedDate: "3 days ago",
  applyBy: "30 April 2025",
  openings: 2,
  description:
    "We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern frontend frameworks. The ideal candidate will be responsible for developing and maintaining responsive web applications with clean and efficient code.",
  keySkills: [
    "React.js",
    "TypeScript",
    "Next.js",
    "Material UI",
    "Redux",
    "RESTful APIs",
    "Responsive Design",
  ],
  responsibilities: [
    "Develop new user-facing features using React.js",
    "Build reusable components and front-end libraries for future use",
    "Translate designs and wireframes into high-quality code",
    "Optimize components for maximum performance across devices and browsers",
    "Participate in code reviews and collaborate with other team members",
  ],
  qualifications: [
    "4+ years experience with front-end development",
    "Strong proficiency with JavaScript, TypeScript and React.js",
    "Experience with responsive design and CSS frameworks",
    "Familiarity with RESTful APIs and modern frontend build pipelines",
    "Knowledge of modern authorization mechanisms such as JWT",
  ],
  benefits: [
    "Flexible working hours",
    "Health insurance",
    "Annual bonus",
    "Professional development allowance",
    "Regular team outings",
  ],
  companyDescription:
    "TechSolutions Inc. is a leading technology company specializing in building innovative software solutions for enterprise clients. With offices across India, we've been recognized as one of the top workplaces in the IT sector for three consecutive years.",
};

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
  console.log("jobid", jobId);
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/jobs/get/${jobId}`);
        console.log("✅ Fetched Job:", response.data.job);
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
        console.log(result);
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
        console.log(result);
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={40} width="50%" />
        <Skeleton variant="text" height={30} width="80%" />
        <Skeleton variant="text" height={30} width="60%" />
        <Skeleton variant="rounded" height={200} sx={{ mt: 3 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center", color: "error.main" }}>
          <Typography variant="h5">Error loading job details</Typography>
          <Typography>{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "4rem" }} maxWidth="lg" sx={{ py: 4 }}>
        {/* Job Header Section */}
        <JobHeaderSection>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <CompanyLogo src={jobData.companyLogo} alt={jobData.companyName}>
                {jobData.companyName.charAt(0)}
              </CompanyLogo>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {jobData.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {jobData.companyName}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">{jobData.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BusinessCenter fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">{jobData.jobType}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Work fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">
                    {jobData.minExp}-{jobData.maxExp}years
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PeopleAltIcon fontSize="small" />
                  <Typography
                    variant="body2"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {jobData.openings || 1}{" "}
                    {jobData.openings === 1 ? "opening" : "openings"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md="auto"
              sx={{ mt: { xs: 2, md: 0 }, ml: { xs: 2, sm: 3, md: 24 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  mt: { xs: 2, md: 0 },
                  ml: { xs: 2, sm: 3, md: 54 },
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
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
                    {" "}
                    {/* Wrapping with span to enable tooltip on disabled button */}
                    <ApplyButton
                      variant="contained"
                      startIcon={<SendOutlined />}
                      onClick={handleApplyJob}
                      disabled={
                        checkAppliedOrNot === 1 || (role && role !== "candidate")
                      }
                      
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
                    {" "}
                    {/* Wrapping with span to enable tooltip on disabled button */}
                    <SaveButton
                      variant="outlined"
                      startIcon={<Bookmark />}
                      onClick={handleSaveJob}
                      sx={{
                        color: "#2557a7",
                        borderColor: "#2557a7",
                        ...(savedJobStatus === 1 && {
                          backgroundColor: "#e0f7fa",
                          color: "#00796b",
                        }),
                      }}
                      disabled={savedJobStatus === 1 || (role && role !== "candidate")} // Disable if already saved or not candidate
                    >
                      {savedJobStatus === 1 ? "Saved" : "Save"}
                    </SaveButton>
                  </span>
                </Tooltip>

                {/* Browse Jobs Button */}
                <Button
                  variant="contained"
                  startIcon={<BusinessCenter />}
                  sx={{
                    color: "#4285f4",
                    borderColor: "#4285f4",
                    "&:hover": {
                      backgroundColor: "rgba(66, 133, 244, 0.04)",
                      borderColor: "#2557a7",
                    },
                  }}
                  href="/all-jobs"
                >
                  Browse Jobs
                </Button>
              </Box>
            </Grid>
          </Grid>
        </JobHeaderSection>

        {/* Use Box instead of Grid for better layout control */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Left Side - Job Details */}
          <Box sx={{ flex: "1 1 auto", width: { xs: "100%", md: "66.67%" } }}>
            {/* Job Description */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  Job Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  {jobData.description}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mt: 3, color: "#333" }}
                >
                  Key Responsibilities
                </Typography>
                <List dense>
                  {jobData.responsibilities.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item.toUpperCase()} />
                    </ListItem>
                  ))}
                </List>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mt: 3, color: "#333" }}
                >
                  Requirements & Qualifications
                </Typography>
                <List dense>
                  {jobData.qualifications.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <School color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item.toUpperCase()} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </SectionCard>

            {/* Key Skills */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  Key Skills
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {jobData.keySkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.toUpperCase()}
                      icon={<LocalOffer />}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: "4px",
                        fontWeight: 500,
                        px: 1,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </SectionCard>

            {/* Company Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  About {jobData.companyName}
                </Typography>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  {jobData.companyDescription}
                </Typography>
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
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  Job Summary
                </Typography>
                <List disablePadding>
                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <BusinessCenter color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Company"
                      secondary={jobData.companyName}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>

                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={jobData.location}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>

                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Work color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Experience"
                      secondary={`${jobData.minExp}-${jobData.maxExp} years`}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>

                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Payments color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Salary"
                      secondary={formatSalaryToLPA(jobData.salaryRange)}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>

                  <ListItem divider sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CalendarMonth color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Apply By"
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
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <BusinessCenter color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Openings"
                      secondary={jobData.openings}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body1",
                        fontWeight: "medium",
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </SectionCard>

            {/* Benefits Section */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary"
                >
                  Company Benefits
                </Typography>
                <List dense>
                  {jobData.benefits.map((benefit, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit.toUpperCase()} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </SectionCard>

            {/* Action Buttons */}
           
            <SectionCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    gap: 3, // Adds space between the buttons
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
                    <span>
                      <ApplyButton
                        variant="contained"
                        startIcon={<SendOutlined />}
                        onClick={handleApplyJob}
                        disabled={
                          checkAppliedOrNot === 1 || (role && role !== "candidate")
                        }
                        
                      >
                        {checkAppliedOrNot === 1 ? "Applied" : "Apply Now"}
                      </ApplyButton>
                    </span>
                  </Tooltip>

                  {/* Save Button with Tooltip */}
                  <Tooltip
                    title={
                    role&&role !== "candidate"
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
                          color: "#2557a7",
                          borderColor: "#2557a7",
                          ...(savedJobStatus === 1 && {
                            backgroundColor: "#e0f7fa",
                            color: "#00796b",
                          }),
                        }}
                        disabled={savedJobStatus === 1 || (role && role !== "candidate")} // Disable if already saved or not candidate
                      >
                        {savedJobStatus === 1 ? "Saved" : "Save"}
                      </SaveButton>
                    </span>
                  </Tooltip>

                  {/* Share Button */}
                  <Button startIcon={<Share />} size="small" color="primary">
                    Share
                  </Button>
                </Box>
              </CardContent>
            </SectionCard>
          </Box>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "top", // position from the top of the screen
            horizontal: "center", // position from the center horizontally
          }}
          sx={{
            position: "fixed", // Keeps it fixed in the viewport
            top: "100%", // Centers it vertically
            left: "50%", // Centers it horizontally
            transform: "translate(-50%, -50%)", // Offset to ensure it's in the exact middle
            zIndex: 9999, // Ensure it's on top of other content
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={savedJobStatus === 1 ? "error" : "success"} // Set the severity
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default JobDetailsPage;
