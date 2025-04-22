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
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Job } from "@/redux/features/jobsSlice";
import Link from "next/link";
import Navbar from "./Navbar";

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
          height: { xs: "auto", sm: "260px", md: "260px" }, // Height adjusts based on screen size
          width: { xs: "100%", sm: "500px", md: "440px" }, // Width adjusts based on screen size
          overflow: "hidden",
          margin: "0 auto", // Center the cards horizontally
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: 'center'
            }} // Truncate the title if it's too long
          >
            {job?.title}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="subtitle2" color="#FE9900" gutterBottom>
              {job.companyName}
            </Typography>
            <Typography variant="subtitle2" color="#E73CC2" gutterBottom>
              {job.jobType}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            mt={1}
            mb={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {job.location}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <BusinessCenterIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {formatSalaryToLPA(job.salaryRange)}{" "}
                {/* Format salary to LPA here */}
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
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            mt={4}
            mb={2}
            sx={{ marginBottom: "8px" }} // Added margin to space between lines
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
              flexDirection: { xs: "column", sm: "row" }, // Stack vertically on smaller screens, horizontally on larger ones
              mt: { xs: 2, sm: 4 }, // Adjust top margin for smaller screens
              marginTop: "auto", // Ensure that the bottom elements push to the bottom of the card
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                marginBottom: { xs: 2, sm: 0 },
                marginTop: { xs: 0, sm: 1 },
              }} // Adjust top margin for larger screens
            >
              Posted {job.postedAt}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Link to the job details page */}
              <Link href={`/jobs-desc/${job._id}`} passHref>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "auto", // Prevent stretching of the button
                    paddingX: 1, // Adjust padding for responsiveness
                  }}
                >
                  Details
                </Button>
              </Link>

              {/* Apply Now Button */}
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "auto", // Prevent stretching of the button
                  paddingX: 1, // Adjust padding for responsiveness
                }}
              >
                Apply Now
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default JobCard;
