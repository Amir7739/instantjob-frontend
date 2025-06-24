import { Box, Typography, Paper, TextField, Button, Avatar } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";

// Mock data (replace with API data)
const mockEmployerData = {
  name: "TechCorp Inc.",
  logo: "/api/placeholder/100/100",
};

const Settings: React.FC = () => {
  return (
    <Box sx={{
      display: "flex", flexDirection: "column", gap: 3,
      m: { xs: 2, md: 3 },
    }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1F2937", mb: 2 }}>
          Company Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={mockEmployerData.logo} sx={{ width: 60, height: 60 }} />
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              sx={{ color: "#4F46E5", borderColor: "#4F46E5", "&:hover": { borderColor: "#4338CA", color: "#4338CA" } }}
            >
              Update Logo
            </Button>
          </Box>
          <TextField label="Company Name" defaultValue={mockEmployerData.name} fullWidth />
          <TextField label="Company Description" multiline rows={4} defaultValue="Enter your company description" fullWidth />
          <Button
            variant="outlined"
            sx={{ color: "#4F46E5", borderColor: "#4F46E5", "&:hover": { borderColor: "#4338CA", color: "#4338CA" } }}
          >
            Change Password
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" } }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
