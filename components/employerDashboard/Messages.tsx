import { Box, Typography } from "@mui/material";

const Messages: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 1, color: "#1F2937" }}
      >
        Messages
      </Typography>
      <Typography sx={{ color: "#6B7280" }}>
        Communicate with applicants and team members.
      </Typography>
    </Box>
  );
};

export default Messages;