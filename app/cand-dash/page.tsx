"use client";

import type React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import { ProfileCompletion } from "@/components/candidateDashboard/profile-completion";
import { RecommendedJobs } from "@/components/candidateDashboard/recommended-jobs";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { SavedJobs } from "@/components/candidateDashboard/savedJobCard";
import { AppliedJobs } from "@/components/candidateDashboard/appliedJobsCard";
import { getCandidateStats } from "@/services/candidateDashobardApi";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// New component to replace Upcoming Interviews
const CareerTips = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TipsAndUpdatesIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            Career Tips
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="Resume Optimization"
              secondary="Tailor your resume for ATS systems"
            />
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="Interview Preparation"
              secondary="Practice common questions in your field"
            />
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="Networking Strategies"
              secondary="Connect with professionals in your target companies"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

// New component to replace Recent Activity
const SkillDevelopment = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SchoolIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            Skill Development
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="In-Demand Skills"
              secondary="Top skills employers are looking for in your field"
            />
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="Learning Resources"
              secondary="Free and paid courses to boost your qualifications"
            />
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemText
              primary="Certification Guides"
              secondary="Industry certifications that can advance your career"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

// New component for the market insights

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);

  const [stats, setStats] = useState({
    jobsApplied: 0,
    savedJobs: 0,
    profileStrength: 0,
    jobsAppliedPercentageChange: "",
    savedJobsPercentageChange: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const candidateId = localStorage.getItem("id");
        if (!candidateId) {
          console.error("No candidate ID found in localStorage");
          return;
        }

        const response = await getCandidateStats(candidateId);
        setStats(response);
      } catch (error) {
        console.error("Error fetching candidate stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const parsePercentageChange = (change: string): number => {
    if (!change) return 0;
    const match = change.match(/^([+-]?\d*\.?\d+)% from last month$/);
    if (!match) return 0;
    const value = Math.abs(parseFloat(match[1]));
    return Math.min(value, 100); // Cap at 100
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your job search.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Jobs Applied
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {loading ? "..." : stats.jobsApplied}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loading ? "Loading..." : stats.jobsAppliedPercentageChange}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  loading
                    ? 0
                    : parsePercentageChange(stats.jobsAppliedPercentageChange)
                }
                sx={{ mt: 2, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Saved Jobs
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {loading ? "..." : stats.savedJobs}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loading ? "Loading..." : stats.savedJobsPercentageChange}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  loading
                    ? 0
                    : parsePercentageChange(stats.savedJobsPercentageChange)
                }
                sx={{ mt: 2, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Profile Strength
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {loading ? "..." : `${stats.profileStrength}%`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loading ? "Loading..." : "Complete your profile"}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={loading ? 0 : stats.profileStrength}
                sx={{ mt: 2, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="job tabs"
          >
            <Tab label="Recommended" {...a11yProps(0)} />
            <Tab label="Saved Jobs" {...a11yProps(1)} />
            <Tab label="Applied Jobs" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <RecommendedJobs limit={6} />
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              component={Link}
              href="/cand-dash/jobs/recommended"
            >
              View All Recommended Jobs
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <SavedJobs limit={6} />
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              component={Link}
              href="/cand-dash/jobs/saved-job"
            >
              View All Saved Jobs
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <AppliedJobs limit={6} />
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              component={Link}
              href="/cand-dash/jobs/applied"
            >
              View All Applied Jobs
            </Button>
          </Box>
        </TabPanel>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileCompletion />
        </Grid>
        <Grid item xs={12} md={4}>
          <CareerTips />
        </Grid>
        <Grid item xs={12} md={4}>
          <SkillDevelopment />
        </Grid>
      </Grid>
    </Box>
  );
}
