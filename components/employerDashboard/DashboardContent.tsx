"use client";

import {
  Box,
  Typography,
  Button
} from "@mui/material";
import {
  Add as PlusIcon
} from "@mui/icons-material";
import PlanCardDetails from "./PlanCardDetails";
import ApplicationTrendsChart from "./ApplicationTrendsChart";
import JobCategoriesChart from "./JobCategoriesChart";
import Applicants from "./Applicants";
import StatsGrid from "./StatsGrid";
import WelcomeCard from "./WelcomeCard";

// Mock plan data
const planData = {
  planName: "Premium",
  planStatus: "Active",
  validityLeft: 5,
  totalJobPosts: 50,
  usedJobPosts: 23,
  totalResumeViews: 500,
  usedResumeViews: 145,
  renewalDate: "2024-06-15",
  features: [
    "Priority Job Listings",
    "Advanced Analytics",
    "Bulk Resume Download",
    "Direct Messaging",
  ],
};

const DashboardContent: React.FC = () => {
  return (
    <Box sx={{
      display: "flex", flexDirection: "column", gap: 3,
      m: { xs: 2, md: 3 },
    }}>
      {/* Welcome Message */}
      <WelcomeCard />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1F2937" }}>
          Dashboard Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => window.open("/jobs/create", "_blank")}
          sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" } }}
          disabled={planData.usedJobPosts >= planData.totalJobPosts}
        >
          Post a FREE job
        </Button>
      </Box>

      <StatsGrid />
      <PlanCardDetails planData={planData} />
      <ApplicationTrendsChart />
      {/* <JobCategoriesChart /> */}
      <Applicants />
    </Box>
  );
};

export default DashboardContent;
