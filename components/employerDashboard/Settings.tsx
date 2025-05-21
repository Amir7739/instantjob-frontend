import { Box, Typography } from "@mui/material";

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 1, color: "#1F2937" }}
      >
        Account Settings
      </Typography>
      <Typography sx={{ color: "#6B7280" }}>
        Manage your company profile and preferences.
      </Typography>
    </Box>
  );
};

export default Settings;