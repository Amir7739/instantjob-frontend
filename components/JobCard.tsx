"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Job } from "@/redux/features/jobsSlice";
import Link from "next/link";
import Navbar from "./Navbar";
import { capitalizeTitle } from "@/utils/wordFormat";

type JobCardProps = {
  job: Job;
};

// Helper function to convert salary to LPA and format it
export const formatSalaryToLPA = (salaryRange: string) => {
  const [minSalary, maxSalary] = salaryRange.split("-");

  // Convert min and max salary to LPA (Lakhs Per Annum)
  const minSalaryLPA = (parseInt(minSalary) / 100000).toFixed(2);
  const maxSalaryLPA = (parseInt(maxSalary) / 100000).toFixed(2);

  // Format salary in LPA (Lakhs Per Annum)
  return `₹${minSalaryLPA} LPA - ₹${maxSalaryLPA} LPA`;
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleShowMoreSkills = () => {
    setShowAllSkills(true);
  };
  

  const skillsToDisplay = showAllSkills
    ? job.keySkills
    : job.keySkills.slice(0, 8);
  return (
    <>
      <Navbar />
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          height: {
            xs: "auto",
            sm: "380px",
            md: "380px",
            lg: "390px",
            xl: "370px",
          },
          width: {
            xs: "100%",
            sm: "310px",
            md: "380px",
            lg: "355px",
            xl: "450px",
          },
          overflow: "hidden",
          margin: "0 auto",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
            "& .company-avatar": {
              transform: "scale(1.1)",
            },
            "& .apply-button": {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            zIndex: 1,
          },
        }}
      >
        <CardContent 
          sx={{ 
            flex: 1, 
            position: "relative", 
            paddingTop: 3,
            paddingX: 3,
            paddingBottom: 2.5,
          }}
        >
          {/* Company Logo with enhanced styling */}
          <Box sx={{ position: "absolute", top: 20, left: 20 }}>
            <Avatar
              src={job.companyLogo || "/company-placeholder.png"}
              alt={job.companyName}
              className="company-avatar"
              sx={{ 
                width: 48, 
                height: 48,
                border: "3px solid #ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>

          {/* Job Title with gradient text */}
          <Typography
            variant="h6"
            fontWeight="700"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              mt: 1,
              mb: 2,
              ml: 6,
              background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: {
                xs: "1.1rem",
                sm: "1.2rem",
                md: "1.25rem",
              },
            }}
          >
            {capitalizeTitle(job.title)}
          </Typography>

          {/* Company and Job Type with enhanced badges */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={2}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                border: "1px solid #f59e0b",
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{
                  color: "#92400e",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {capitalizeTitle(job.companyName)}
              </Typography>
            </Box>
            <Box
              sx={{
                background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                border: "1px solid #ec4899",
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{
                  color: "#be185d",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {capitalizeTitle(job.jobType)}
              </Typography>
            </Box>
          </Stack>

          {/* Job Details with enhanced icons */}
          <Stack
            direction="column"
            spacing={1.5}
            mt={2}
            mb={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocationOnIcon 
                  fontSize="small" 
                  sx={{ color: "#1d4ed8", fontSize: 16 }} 
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  overflow: "hidden", 
                  textOverflow: "ellipsis",
                  color: "#475569",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {capitalizeTitle(job.location)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BusinessCenterIcon 
                  fontSize="small" 
                  sx={{ color: "#15803d", fontSize: 16 }} 
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  overflow: "hidden", 
                  textOverflow: "ellipsis",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {formatSalaryToLPA(job.salaryRange)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccessTimeIcon 
                  fontSize="small" 
                  sx={{ color: "#d97706", fontSize: 16 }} 
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  overflow: "hidden", 
                  textOverflow: "ellipsis",
                  color: "#475569",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {job.minExp}-{job.maxExp} years
              </Typography>
            </Stack>
          </Stack>

          {/* Skills with enhanced chip design */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            mt={2}
            mb={2}
            sx={{ gap: 1 }}
          >
            {job.keySkills.slice(0, 4).map((skill, index) => (
              <Chip 
                key={index} 
                label={skill.toUpperCase()} 
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                  color: "#3730a3",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  border: "1px solid #a5b4fc",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)",
                    transform: "translateY(-1px)",
                  },
                }}
              />
            ))}
            {job.keySkills.length > 4 && !showAllSkills && (
              <Chip 
                label={`+${job.keySkills.length - 4} more`} 
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  border: "1px solid #d1d5db",
                }}
              />
            )}
          </Stack>

          {/* Footer with enhanced buttons */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              mt: { xs: 2, sm: 3 },
              marginTop: "auto",
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#6b7280",
                fontWeight: 500,
                fontSize: "0.75rem",
                marginBottom: { xs: 0, sm: 0 },
                marginTop: { xs: 0, sm: 1 },
              }}
            >
              Posted {job.postedAt}
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Link href={`/jobs-desc/${job._id}`} passHref>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "auto",
                    paddingX: 2,
                    paddingY: 0.75,
                    borderRadius: 2,
                    border: "2px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: "2px solid #667eea",
                      color: "#667eea",
                      background: "rgba(102, 126, 234, 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Details
                </Button>
              </Link>

              <Link href={`/jobs-desc/${job._id}`} passHref>
                <Button
                  variant="contained"
                  size="small"
                  className="apply-button"
                  sx={{
                    minWidth: "auto",
                    paddingX: 2,
                    paddingY: 0.75,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(79, 70, 229, 0.6)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Apply Now
                </Button>
              </Link>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default JobCard;