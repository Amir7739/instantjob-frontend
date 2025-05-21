"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Paper,
  Button,
  Tab,
  Tabs,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  People as PeopleIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";

// Define employer data interface based on the DB schema
interface EmployerProfile {
  _id: { $oid: string };
  name: string;
  email: string;
  role: string;
  companyName: string;
  companyLogo: string;
  website: string;
  industry: string;
  location: string;
  contactNumber: string;
  companySize: string;
  bio: string;
  verified: boolean;
  createdAt: { $date: string };
}

// TabPanel component for tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployerProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sample employer data from the DB
  const employerData: EmployerProfile = {
    _id: { $oid: "68243b7d964d12d68800c2b9" },
    name: "Amir Alam",
    email: "mdamira949@gmail.com",
    role: "employer",
    companyName: "Innovate Solutions",
    companyLogo: "https://example.com/logo.png", // Will use a placeholder since this URL might not work
    website: "https://innovatesolutions.com",
    industry: "Software Development",
    location: "San Francisco, CA",
    contactNumber: "7739132686",
    companySize: "51-200",
    bio: "Innovate Solutions is a leading software development company specializing in AI and cloud solutions.",
    verified: false,
    createdAt: { $date: "2025-05-14T06:43:09.425Z" },
  };

  // Sample job listing data (for the Jobs tab)
  const activeJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "May 10, 2025",
      applicants: 24,
    },
    {
      id: 2,
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time",
      postedDate: "May 12, 2025",
      applicants: 18,
    },
    {
      id: 3,
      title: "UX/UI Designer",
      location: "San Francisco, CA",
      type: "Contract",
      postedDate: "May 14, 2025",
      applicants: 9,
    },
  ];

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return phoneNumber;
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "#f7f9fc",
        minHeight: "100vh",
        mt: 2,
        pt: 3,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Main Profile Content */}
          <Grid item xs={12} md={8}>
            <Box mb={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {employerData.companyName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {employerData.industry}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Mobile Edit Button */}
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  justifyContent: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Company Info Tags */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2 }}
                sx={{ mb: 2, flexWrap: "wrap" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2">
                    {employerData.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PeopleIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2">
                    {employerData.companySize} employees
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <WebsiteIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography
                    variant="body2"
                    component="a"
                    href={employerData.website}
                    target="_blank"
                    sx={{ color: "primary.main", textDecoration: "none" }}
                  >
                    {employerData.website.replace(/(^\w+:|^)\/\//, "")}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Tabs Navigation */}
            <Paper
              sx={{
                borderRadius: 2,
                mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="employer profile tabs"
                  textColor="primary"
                  indicatorColor="primary"
                  variant={isMobile ? "fullWidth" : "standard"}
                >
                  <Tab label="Jobs" icon={<WorkIcon />} iconPosition="start" />
                </Tabs>
              </Box>
              {/* Jobs Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight="medium">
                      Active Job Postings
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: 2,
                      }}
                    >
                      Post New Job
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {activeJobs.map((job) => (
                      <Paper
                        key={job.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            borderColor: "primary.light",
                            transform: "translateY(-2px)",
                            transition: "all 0.3s ease",
                          },
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography
                              variant="h6"
                              fontWeight="medium"
                              gutterBottom
                            >
                              {job.title}
                            </Typography>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={{ xs: 0.5, sm: 2 }}
                              sx={{ mb: 1 }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <LocationIcon
                                  fontSize="small"
                                  color="action"
                                  sx={{ mr: 0.5 }}
                                />
                                <Typography variant="body2">
                                  {job.location}
                                </Typography>
                              </Box>
                              <Chip
                                label={job.type}
                                size="small"
                                sx={{
                                  bgcolor:
                                    job.type === "Full-time"
                                      ? alpha(theme.palette.success.main, 0.1)
                                      : alpha(theme.palette.info.main, 0.1),
                                  color:
                                    job.type === "Full-time"
                                      ? "success.main"
                                      : "info.main",
                                  fontWeight: 500,
                                  borderRadius: 1,
                                  height: 24,
                                }}
                              />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              Posted on {job.postedDate} • {job.applicants}{" "}
                              applicants
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                              display: "flex",
                              justifyContent: {
                                xs: "flex-start",
                                sm: "flex-end",
                              },
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                mr: 1,
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                              }}
                            >
                              Edit
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>

                  {/* Show All Jobs Button */}
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ textTransform: "none" }}
                    >
                      View All Job Postings
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>

          {/* Sidebar - Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                borderRadius: 2,
                p: 3,
                mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Contact Person
                    </Typography>
                    <Typography variant="body1">{employerData.name}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <EmailIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography
                      variant="body1"
                      component="a"
                      href={`mailto:${employerData.email}`}
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {employerData.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <PhoneIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography
                      variant="body1"
                      component="a"
                      href={`tel:${employerData.contactNumber}`}
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {formatPhoneNumber(employerData.contactNumber)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <WebsiteIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Website
                    </Typography>
                    <Typography
                      variant="body1"
                      component="a"
                      href={employerData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {employerData.website.replace(/(^\w+:|^)\/\//, "")}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Industry
                    </Typography>
                    <Typography variant="body1">
                      {employerData.industry}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      mr: 2,
                    }}
                  >
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Company Size
                    </Typography>
                    <Typography variant="body1">
                      {employerData.companySize} employees
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Social Media
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "#0077b5",
                    bgcolor: alpha("#0077b5", 0.1),
                    "&:hover": { bgcolor: alpha("#0077b5", 0.2) },
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "#1DA1F2",
                    bgcolor: alpha("#1DA1F2", 0.1),
                    "&:hover": { bgcolor: alpha("#1DA1F2", 0.2) },
                  }}
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "#4267B2",
                    bgcolor: alpha("#4267B2", 0.1),
                    "&:hover": { bgcolor: alpha("#4267B2", 0.2) },
                  }}
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>

            {/* Company Stats Card */}
            <Paper
              sx={{
                borderRadius: 2,
                p: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Company Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Jobs
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: "1px solid",
                      borderColor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="bold"
                    >
                      51
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applicants
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: "1px solid",
                      borderColor: alpha(theme.palette.info.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="info.main"
                      fontWeight="bold"
                    >
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interviews
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: "1px solid",
                      borderColor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Reviews
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    py: 1,
                  }}
                >
                  View Dashboard
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Member since footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Member since{" "}
            {new Date(employerData.createdAt.$date).toLocaleDateString(
              "en-US",
              { month: "long", year: "numeric" }
            )}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Missing PersonIcon import
import { Person as PersonIcon } from "@mui/icons-material";

export default EmployerProfilePage;
