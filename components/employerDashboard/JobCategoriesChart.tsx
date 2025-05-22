'use client'

import { Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const JobCategoriesChart: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Job Categories
      </Typography>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "series A" },
              { id: 1, value: 15, label: "series B" },
              { id: 2, value: 20, label: "series C" },
              { id: 3, value: 20, label: "series D" },
              { id: 4, value: 20, label: "series E" },
              { id: 5, value: 20, label: "series F" },
              { id: 6, value: 20, label: "series G" },
            ],
          },
        ]}
        width={500}
        height={300}
      />
    </Paper>
  );
};

export default JobCategoriesChart;