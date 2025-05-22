'use client'

import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  PostAdd as PostAddIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Define the type for planData prop
interface PlanData {
  usedJobPosts: number;
  usedResumeViews: number;
}

interface FreePlanCardProps {
  planData: PlanData;
}


{/* Current Plan Info */}
      {/* <Card sx={{ p: 3, boxShadow: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1F2937", display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon sx={{ color: "#F59E0B" }} />
            Current Plan Information
          </Typography>
          {planData.planStatus === "Expired" && (
            <Button
              variant="contained"
              color="error"
              startIcon={<RefreshIcon />}
              sx={{ ml: 2 }}
            >
              Renew Plan
            </Button>
          )}
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip 
                  label={planData.planName}
                  sx={{ 
                    bgcolor: "#4F46E5", 
                    color: "white", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    px: 2
                  }}
                />
                <Chip
                  icon={getPlanStatusIcon()}
                  label={planData.planStatus}
                  sx={{
                    bgcolor: `${getPlanStatusColor()}20`,
                    color: getPlanStatusColor(),
                    fontWeight: "medium"
                  }}
                />
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon sx={{ color: "#6B7280", fontSize: 20 }} />
                <Typography variant="body1" color="text.secondary">
                  {planData.planStatus === "Active" 
                    ? `${planData.validityLeft} days remaining`
                    : `Expired on ${planData.renewalDate}`
                  }
                </Typography>
              </Box>

              {planData.validityLeft <= 7 && planData.planStatus === "Active" && (
                <Alert 
                  severity="warning" 
                  sx={{ mt: 1 }}
                  action={
                    <Button color="inherit" size="small" variant="outlined">
                      Renew Now
                    </Button>
                  }
                >
                  Your plan expires in {planData.validityLeft} days
                </Alert>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium", display: "flex", alignItems: "center", gap: 1 }}>
                    <PostAddIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                    Job Posts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {planData.usedJobPosts} / {planData.totalJobPosts}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(planData.usedJobPosts / planData.totalJobPosts) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#F3F4F6",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: getProgressColor(planData.usedJobPosts, planData.totalJobPosts),
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium", display: "flex", alignItems: "center", gap: 1 }}>
                    <RemoveRedEyeIcon sx={{ fontSize: 18, color: "#10B981" }} />
                    Resume Views
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {planData.usedResumeViews} / {planData.totalResumeViews}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(planData.usedResumeViews / planData.totalResumeViews) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#F3F4F6",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: getProgressColor(planData.usedResumeViews, planData.totalResumeViews),
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1, color: "#1F2937" }}>
            Plan Features:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {planData.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                sx={{ bgcolor: "#F0F9FF", color: "#0369A1" }}
              />
            ))}
          </Box>
        </Box>
      </Card> */}

const PlanCardDetails: React.FC<FreePlanCardProps> = ({ planData }) => {
  return (
    <Card sx={{ p: 3, boxShadow: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1F2937", display: "flex", alignItems: "center", gap: 1 }}>
          <StarIcon sx={{ color: "#F59E0B" }} />
          Free Plan for Everyone
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip 
                label="Free"
                sx={{ 
                  bgcolor: "#4F46E5", 
                  color: "white", 
                  fontWeight: "bold",
                  fontSize: "1rem",
                  px: 2
                }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Active"
                sx={{
                  bgcolor: "#10B98120",
                  color: "#10B981",
                  fontWeight: "medium"
                }}
              />
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: "#6B7280", fontSize: 20 }} />
              <Typography variant="body1" color="text.secondary">
                Unlimited access for all users
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "medium", display: "flex", alignItems: "center", gap: 1 }}>
                  <PostAddIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                  Job Posts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {planData.usedJobPosts} / Unlimited
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#F3F4F6",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#10B981",
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "medium", display: "flex", alignItems: "center", gap: 1 }}>
                  <RemoveRedEyeIcon sx={{ fontSize: 18, color: "#10B981" }} />
                  Resume Views 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {planData.usedResumeViews} / Unlimited
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#F3F4F6",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#10B981",
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1, color: "#1F2937" }}>
          Plan Features:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {["Job Postings", "Applicant Tracking", "Dashboard Insights"].map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              size="small"
              sx={{ bgcolor: "#F0F9FF", color: "#0369A1" }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default PlanCardDetails;