'use client'

import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const ApplicationTrendsChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Application Trends
      </Typography>
      <BarChart
        series={[
          {
            data: [35, 51, 15, 60, 35, 51, 12, 60, 60, 45, 30, 20],
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