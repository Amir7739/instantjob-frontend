"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Box,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Stat, fetchEmployerStats } from "@/services/eployersApi";
import {
  Work as WorkIcon,
  People as UsersIcon,
  Message as MessageSquareIcon,
  CheckCircle as CheckCircleIcon,
  PostAdd as PostAddIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const iconMap: {
  [key: string]: React.ComponentType<{
    sx: { color: string; fontSize: number };
  }>;
} = {
  WorkIcon,
  UsersIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  PostAddIcon,
  CalendarIcon,
};

const StatsGrid: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerId = localStorage.getItem("id");
        if (!employerId) {
          throw new Error("Employer ID not found in localStorage");
        }

        const statsData = await fetchEmployerStats(employerId);
        setStats(statsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const WorkIconComponent = iconMap["WorkIcon"];

  return (
    <>
      {loading ? (
        <LinearProgress sx={{ borderRadius: 4 }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon.name] || WorkIconComponent;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    width: {
                      xs: "22rem", // extra-small: phones
                      sm: "14.6rem", // small: tablets
                      md: "22rem", // medium: small laptops
                      lg: "18rem", // large: desktops
                      xl: "24rem", // extra-large: large screens
                    },

                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        noWrap
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}1A`,
                        borderRadius: "50%",
                        p: 1.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComponent
                        sx={{
                          color: stat.icon.color,
                          fontSize: stat.icon.size,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: stat.trendColor, mt: 1 }}
                    noWrap
                  >
                    {stat.trend}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default StatsGrid;
