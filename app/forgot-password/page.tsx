"use client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Fade,
  Slide,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axios";
import Navbar from "@/components/Navbar";
import { Email, Lock, ArrowBack } from "@mui/icons-material";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await axiosInstance.post(`/auth/forgot-password`, {
        email,
      });
      setStatus("success");
      setMessage(res.data.message);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      
      <Box
        sx={{
          minHeight: "100vh",
          mt: '3rem',
        //   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><defs><radialGradient id=\"a\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0%\" stop-color=\"%23ffffff\" stop-opacity=\".1\"/><stop offset=\"100%\" stop-color=\"%23ffffff\" stop-opacity=\"0\"/></radialGradient></defs><circle cx=\"20%\" cy=\"20%\" r=\"10%\" fill=\"url(%23a)\"/><circle cx=\"80%\" cy=\"30%\" r=\"15%\" fill=\"url(%23a)\"/><circle cx=\"40%\" cy=\"70%\" r=\"8%\" fill=\"url(%23a)\"/><circle cx=\"90%\" cy=\"80%\" r=\"12%\" fill=\"url(%23a)\"/></svg>') center/cover",
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="sm">
          <Slide direction="up" in={true} timeout={600}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 25px 45px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
                },
              }}
            >
              {/* Header Section */}
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Lock sx={{ fontSize: 40, color: "white" }} />
                </Box>
                
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    mb: 1,
                  }}
                >
                  Forgot Password
                </Typography>
                
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 400, mx: "auto", lineHeight: 1.6 }}
                >
                  Enter your email address and we'll send you a link to reset your password
                </Typography>
              </Box>

              {/* Alert Messages */}
              <Fade in={status === "success"} timeout={300}>
                <Box mb={status === "success" ? 3 : 0}>
                  {status === "success" && (
                    <Alert
                      severity="success"
                      sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      {message}
                    </Alert>
                  )}
                </Box>
              </Fade>

              <Fade in={status === "error"} timeout={300}>
                <Box mb={status === "error" ? 3 : 0}>
                  {status === "error" && (
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      {message}
                    </Alert>
                  )}
                </Box>
              </Fade>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "action.active" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                        },
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                          borderWidth: "2px",
                        },
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={status === "loading"}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
                    },
                    "&.Mui-disabled": {
                      background: "linear-gradient(135deg, #c1c9f0 0%, #d4c7e8 100%)",
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                >
                  {status === "loading" ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <CircularProgress size={24} sx={{ color: "white" }} />
                      <span>Sending...</span>
                    </Box>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </Box>

              {/* Decorative Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                  zIndex: -1,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(118, 75, 162, 0.1), rgba(240, 147, 251, 0.1))",
                  zIndex: -1,
                }}
              />
            </Paper>
          </Slide>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;