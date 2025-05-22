'use client'

import { useEffect, useState } from "react";
import { Card, Box, Typography, Avatar } from "@mui/material";
import { Work as WorkIcon } from "@mui/icons-material";
import { fetchEmployerById } from "@/services/eployersApi";

const WelcomeCard: React.FC = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const [employerName, setEmployerName] = useState<string>("");
  const [employerLoading, setEmployerLoading] = useState<boolean>(true);
  const [employerError, setEmployerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const employerId = localStorage.getItem("id");
        if (!employerId) {
          throw new Error("Employer ID not found in localStorage");
        }

        const employerData = await fetchEmployerById(employerId);
        setEmployerName(employerData.name);
        setEmployerLoading(false);
      } catch (err: any) {
        setEmployerError(err.message || "Failed to fetch employer data");
        setEmployerLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Card
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box>
          {employerLoading ? (
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Loading...
            </Typography>
          ) : employerError ? (
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1, color: "#EF4444" }}
            >
              Error loading name
            </Typography>
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {getGreeting()}, {employerName || "Employer"}! 👋
            </Typography>
          )}
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Welcome back to your employer dashboard
          </Typography>
        </Box>
        <Box
          sx={{ textAlign: "center", display: { xs: "none", md: "block" } }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255,255,255,0.2)",
              mb: 1,
            }}
          >
            <WorkIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Box>
      </Box>
    </Card>
  );
};

export default WelcomeCard;