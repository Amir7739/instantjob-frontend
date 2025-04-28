// app/admin-dashboard/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  useMediaQuery,
  alpha,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Dashboard as DashboardIcon,
  WorkOutline as JobsIcon,
  People as CandidatesIcon,
  Business as EmployersIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CandidateList from "@/components/adminDashboard/CandidateList";
import JobTable from "@/components/adminDashboard/JobTable";
import Sidebar from "@/components/adminDashboard/Sidebar";
import StatsCard from "@/components/adminDashboard/StatsCard";

// Dummy data for jobs and candidates
const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Bangalore, India",
    type: "Full Time",
    salary: "$100-200$",
    applications: 24,
    status: "Active",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "InnovateX",
    location: "Remote",
    type: "Part Time",
    salary: "$100-200$",
    applications: 18,
    status: "Active",
    posted: "1 day ago",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Delhi, India",
    type: "Contract",
    salary: "$100-200$",
    applications: 12,
    status: "Active",
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudNative",
    location: "Mumbai, India",
    type: "Full Time",
    salary: "$100-200$",
    applications: 8,
    status: "Review",
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "GrowthLabs",
    location: "Hyderabad, India",
    type: "Full Time",
    salary: "$100-200$",
    applications: 15,
    status: "Active",
    posted: "4 days ago",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Pune, India",
    type: "Full Time",
    salary: "$150-250$",
    applications: 22,
    status: "Active",
    posted: "3 days ago",
  },
  {
    id: 7,
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Chennai, India",
    type: "Contract",
    salary: "$120-220$",
    applications: 17,
    status: "Review",
    posted: "6 days ago",
  },
];

const candidates = [
  {
    id: 1,
    name: "Raj Sharma",
    role: "Frontend Developer",
    status: "Shortlisted",
    applied: "2 days ago",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "UX Designer",
    status: "New",
    applied: "1 day ago",
  },
  {
    id: 3,
    name: "Arun Kumar",
    role: "Backend Developer",
    status: "Interviewed",
    applied: "5 days ago",
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Data Scientist",
    status: "New",
    applied: "3 days ago",
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    role: "DevOps Engineer",
    status: "Shortlisted",
    applied: "4 days ago",
  },
];

const employers = [
  {
    id: 1,
    name: "Tech Solutions",
    industry: "IT Services",
    activeJobs: 5,
    location: "Bangalore",
  },
  {
    id: 2,
    name: "InnovateX",
    industry: "Software Development",
    activeJobs: 3,
    location: "Remote",
  },
  {
    id: 3,
    name: "Designify",
    industry: "Design Agency",
    activeJobs: 2,
    location: "Delhi",
  },
  {
    id: 4,
    name: "CloudNative",
    industry: "Cloud Computing",
    activeJobs: 4,
    location: "Mumbai",
  },
];

// Create a customized theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#5E35B1", // Deep purple
      light: "#7E57C2",
      dark: "#4527A0",
    },
    secondary: {
      main: "#FF5722", // Deep orange
      light: "#FF7043",
      dark: "#E64A19",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FFA726",
    },
    info: {
      main: "#29B6F6",
    },
    success: {
      main: "#66BB6A",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("Admin");
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Function to update active tab when sidebar item is clicked
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Review":
        return "warning";
      case "Paused":
        return "error";
      case "Shortlisted":
        return "success";
      case "New":
        return "info";
      case "Interviewed":
        return "warning";
      default:
        return "default";
    }
  };

  // Enhanced statistics for dashboard
  const statsData = [
    {
      title: "Total Jobs",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: <ArrowUpwardIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: "Active Applications",
      value: "1,285",
      change: "+7.2%",
      changeType: "positive",
      icon: <ArrowUpwardIcon />,
      color: theme.palette.success.main,
    },
    {
      title: "Registered Employers",
      value: "47",
      change: "+5%",
      changeType: "positive",
      icon: <ArrowUpwardIcon />,
      color: theme.palette.info.main,
    },
    {
      title: "Hiring Rate",
      value: "68%",
      change: "-3%",
      changeType: "negative",
      icon: <ArrowDownwardIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: "Abc",
      value: "68%",
      change: "-3%",
      changeType: "negative",
      icon: <ArrowDownwardIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: "Hiring Rate",
      value: "68%",
      change: "-3%",
      changeType: "negative",
      icon: <ArrowDownwardIcon />,
      color: theme.palette.warning.main,
    },
  ];

  // Render content based on active tab
  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {statsData.map((stat, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: 1,
                        borderRadius: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Your Stats Card Content */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: stat.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            mb: 1,
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          {stat.title}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              stat.changeType === "positive"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {stat.change} from last month
                        </Typography>
                      </Box>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={4} sx={{ width: "100%", mx: 0 }}>
              <Grid sx={{ width: "100%" }} item xs={12} lg={8}>
                <Card sx={{ mb: 4, overflow: "hidden" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile, horizontally on larger screens
                        gap: 2, // Add some gap between the title and buttons
                        flexWrap: "nowrap", // Prevent wrapping of items
                      }}
                    >
                      {/* Left side: Recent Job Postings */}
                      <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                          mb: { xs: 2, sm: 0 }, // Add margin-bottom for mobile
                          fontWeight: "600", // Make the title bolder for emphasis
                          fontSize: { xs: "1.2rem", sm: "1.5rem" }, // Adjust font size for mobile
                          flex: 1, // Allow the title to take available space
                        }}
                      >
                        Recent Job Postings
                      </Typography>

                      {/* Right side: Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end", // Align buttons to the right
                          alignItems: "center",
                          gap: 2, // Space between the buttons
                          width: "auto", // Buttons take up only as much space as required
                        }}
                      >
                        {/* Add New Job Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => window.open("/jobs/create", "_blank")}
                          sx={{
                            width: { xs: "100%", sm: "auto" }, // Make button full-width on mobile
                            padding: "12px 16px", // Add padding for a more prominent button on mobile
                            fontSize: { xs: "1rem", sm: "1.1rem" }, // Adjust font size
                            borderRadius: "8px", // Rounded corners for the button
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                            "&:hover": {
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)", // Enhance shadow on hover
                            },
                          }}
                        >
                          + Post New Job
                        </Button>

                        {/* View All Button */}
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleTabChange("jobs")}
                          sx={{
                            width: { xs: "100%", sm: "auto" }, // Make button full-width on mobile
                            padding: "12px 16px", // Add padding for button
                            fontSize: { xs: "1rem", sm: "1.1rem" }, // Adjust font size
                            borderRadius: "8px", // Rounded corners for the button
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                            "&:hover": {
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)", // Enhance shadow on hover
                            },
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                    </Box>

                    <JobTable jobs={jobs} getStatusColor={getStatusColor} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid sx={{ width: "100%" }} item xs={12} lg={4}>
                <Card sx={{ mb: 4, height: "100%" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" color="text.primary">
                        Recent Candidates
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        View All
                      </Typography>
                    </Box>
                    <CandidateList
                      candidates={candidates}
                      getStatusColor={getStatusColor}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        );
      case "jobs":
        return (
          <Card sx={{ width: "100%", mb: 5, overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Job Management
              </Typography>
              <Typography variant="body2">
                Manage all job postings across your platform. Currently showing{" "}
                {jobs.length} active listings.
              </Typography>
            </Box>
            <Divider />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <JobTable jobs={jobs} getStatusColor={getStatusColor} />
            </CardContent>
          </Card>
        );
      case "candidates":
        return (
          <Card sx={{ width: "100%", mb: 5, overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Candidate Management
              </Typography>
              <Typography variant="body2">
                Review and manage candidate applications. {candidates.length}{" "}
                recent candidates displayed.
              </Typography>
            </Box>
            <Divider />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <CandidateList
                candidates={candidates}
                getStatusColor={getStatusColor}
              />
            </CardContent>
          </Card>
        );
      case "employers":
        return (
          <Card sx={{ width: "150%", mb: 5, overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(45deg, ${theme.palette.info.main} 30%, ${theme.palette.info.light} 90%)`,
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Employer Management
              </Typography>
              <Typography variant="body2">
                Monitor and manage registered employers. Currently showing{" "}
                {employers.length} companies.
              </Typography>
            </Box>
            <Divider />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Paper elevation={0} sx={{ overflow: "auto" }}>
                <Box sx={{ width: "100%", overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                        }}
                      >
                        <th
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Company Name
                        </th>
                        <th
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Industry
                        </th>
                        <th
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Active Jobs
                        </th>
                        <th
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employers.map((employer) => (
                        <tr
                          key={employer.id}
                          style={{
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.05
                              ),
                            },
                          }}
                        >
                          <td
                            style={{
                              padding: "16px",
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {employer.name}
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {employer.industry}
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {employer.activeJobs}
                          </td>
                          <td
                            style={{
                              padding: "16px",
                              borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {employer.location}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CssBaseline />
        <Sidebar
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          handleLogout={handleLogout}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh", // Important
            overflowY: "auto", // Only main area vertically scroll kare
            overflowX: "auto",
            width: "100%", // Horizontal scroll bhi allow karo
            backgroundColor: "background.default",
            p: { xs: 1, sm: 2, md: 3 },
            mt: { xs: 8, sm: 8, md: 0 }, // mobile ke liye
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box
            sx={{
              mb: 3,
              mt: { xs: 1, sm: 2 },
              p: { xs: 2, sm: 3 },
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {activeTab === "dashboard" && (
                <DashboardIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
              )}
              {activeTab === "jobs" && (
                <JobsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              )}
              {activeTab === "candidates" && (
                <CandidatesIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
              )}
              {activeTab === "employers" && (
                <EmployersIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
              )}
              <Typography variant="h5" color="text.primary">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {activeTab === "dashboard" &&
                "Overview of platform performance and recent activities"}
              {activeTab === "jobs" &&
                "View and manage all job postings across the platform"}
              {activeTab === "candidates" &&
                "Track and manage candidate applications"}
              {activeTab === "employers" &&
                "Manage registered companies and organizations"}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", px: { xs: 0, sm: 0 } }}>
            {renderDashboardContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
