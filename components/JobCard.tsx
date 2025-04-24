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
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          height: { xs: "auto", sm: "280px", md: "280px" }, // Increased height slightly to accommodate new content
          width: { xs: "100%", sm: "500px", md: "440px" }, // Width adjusts based on screen size
          overflow: "hidden",
          margin: "0 auto", // Center the cards horizontally
        }}
      >
        <CardContent sx={{ flex: 1, position: "relative", paddingTop: 2 }}>
          {/* Company Logo in left top corner */}
          <Box sx={{ position: "absolute", top: 16, left: 16 }}>
            <Avatar
              src={job.companyLogo || "/company-placeholder.png"}
              alt={job.companyName}
              sx={{ width: 40, height: 40 }}
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              mt: 1,
            }}
          >
            {capitalizeTitle(job.title)}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="subtitle2" color="#FE9900" gutterBottom>
              {capitalizeTitle(job.companyName)}
            </Typography>
            <Typography variant="subtitle2" color="#E73CC2" gutterBottom>
              {capitalizeTitle(job.jobType)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            mt={1}
            mb={1}
            flexWrap="wrap"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {capitalizeTitle(job.location)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <BusinessCenterIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {formatSalaryToLPA(job.salaryRange)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {job.minExp}-{job.maxExp} years
              </Typography>
            </Stack>
            {/* Added Number of Openings */}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            mt={3}
            mb={2}
            sx={{ marginBottom: "8px" }}
          >
            {job.keySkills.slice(0, 4).map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
            {job.keySkills.length > 5 && !showAllSkills && (
              <Chip label={`+${job.keySkills.length - 5} more`} size="small" />
            )}
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              mt: { xs: 2, sm: 3 },
              marginTop: "auto",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                marginBottom: { xs: 2, sm: 0 },
                marginTop: { xs: 0, sm: 1 },
              }}
            >
              Posted {job.postedAt}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Link href={`/jobs-desc/${job._id}`} passHref>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "auto",
                    paddingX: 1,
                  }}
                >
                  Details
                </Button>
              </Link>

              <Link href={`/jobs-desc/${job._id}`} passHref>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: "auto",
                    paddingX: 1,
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
