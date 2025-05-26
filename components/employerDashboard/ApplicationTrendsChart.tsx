'use client';

import { fetchApplicationTrends } from "@/services/eployersApi";
import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState, useEffect } from "react";

const ApplicationTrendsChart = () => {
  const [chartData, setChartData] = useState(Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerId = localStorage.getItem('id'); // Retrieve employerId from localStorage
        if (employerId) {
          const data = await fetchApplicationTrends(employerId);
          setChartData(data);
        } else {
          console.error("No employerId found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching application trends:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Application Trends
      </Typography>
      <BarChart
        series={[
          {
            data: chartData,
            label: "Applications",
            color: "#4F46E5",
          },
        ]}
        height={290}
        xAxis={[
          {
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            scaleType: "band",
          },
        ]}
      />
    </Paper>
  );
};

export default ApplicationTrendsChart;