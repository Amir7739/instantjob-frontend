import { Box, Typography } from "@mui/material";

const Applicants: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 1, color: "#1F2937" }}
      >
        Applicants Management
      </Typography>
      <Typography sx={{ color: "#6B7280" }}>
        View and manage all your job applicants here.
      </Typography>
    </Box>
  );
};

export default Applicants;