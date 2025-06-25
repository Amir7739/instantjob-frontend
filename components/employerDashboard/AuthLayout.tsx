import {
  Box,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline as CheckIcon } from "@mui/icons-material";
import Image from "next/image";
import EmployerNavBar from "./EmployerNavBar";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <>
      <EmployerNavBar />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 4, md: 8 }, bgcolor: "#F3F4F6" }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side: Promotional Content */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                mt: {
                  xs: "5rem", // for extra-small screens (mobile)
                  sm: "4rem", // small screens
                  md: "1rem", // medium screens and up (like desktop)
                },
                pr: { md: 4 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "#1F2937", fontWeight: 700 }}
              >
                Instant Job Portal
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "#6B7280" }}>
                Hire top talent in minutes with our cutting-edge platform,
                trusted by thousands of recruiters.
              </Typography>
              <List>
                {[
                  "Access 5k+ verified resumes instantly",
                  "Post jobs and get applications in hours",
                  "AI-powered candidate matching",
                  "Secure and easy-to-use dashboard",
                ].map((text) => (
                  <ListItem key={text} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ color: "#1F2937" }} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          {/* Right Side: Form */}
          <Grid item xs={12} md={6} sx={{
                width: {xs : "100%",md:"25rem"},}}>
            <Box
              sx={{
                p: { xs: 2, sm: 4 },
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: 10,
                mt: {
                  xs: "1rem", // for extra-small screens (mobile)
                  sm: "4rem", // small screens
                  md: "2rem", // medium screens and up (like desktop)
                },
                width: {xs : "100%",md:"25rem"},
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#1F2937",
                  fontWeight: 600,
                  textAlign: "center",
                  mb: 2.3,
                }}
              >
                {title}
              </Typography>
              {children}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AuthLayout;
