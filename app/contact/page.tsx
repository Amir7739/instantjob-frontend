"use client";

import Navbar from "@/components/Navbar";
import { Box, Typography, TextField, MenuItem, Button, Modal, Container, Grid, Card, CardContent } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axios";
import { Phone, Mail, LocationOn, BusinessCenter, Support, QuestionAnswer, TrendingUp } from "@mui/icons-material";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    queryType: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/contact", formData);

      // Open Thank You modal
      setOpenModal(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobileNo: "",
        queryType: "",
        description: "",
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit the form");
      console.error(err);
    }
  };

  // Auto-close modal after 5 seconds
  useEffect(() => {
    if (openModal) {
      const timer = setTimeout(() => {
        setOpenModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openModal]);

  const queryTypeOptions = [
    { value: "general", label: "General Inquiry", icon: <QuestionAnswer /> },
    { value: "job", label: "Job Related", icon: <BusinessCenter /> },
    { value: "support", label: "Technical Support", icon: <Support /> },
    { value: "other", label: "Others", icon: <TrendingUp /> },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          mt: 8,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>') repeat",
            opacity: 0.1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Get In Touch
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                opacity: 0.9,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Connect with India's leading recruitment platform. We're here to help you find your next opportunity.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "33.33%" },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "column" }, gap: 3, height: "100%", }}>
              {/* Office Address Card */}
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e0e7ff",
                  borderRadius: 3,
                  background: "linear-gradient(145deg, #f8faff 0%, #ffffff 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(30, 60, 114, 0.15)",
                    borderColor: "#1e3c72",
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                      color: "white",
                      mr: 2,
                    }}
                  >
                    <LocationOn />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3c72" }}>
                    Corporate Office
                  </Typography>
                </Box>
                <Typography sx={{ color: "#64748b", lineHeight: 1.6 }}>
                  911, 9th Floor, Tower-B, Advant IT Park, Sector-142, Noida, Uttar Pradesh, 201305, India
                </Typography>
              </Card>

              {/* Phone Card */}
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e0e7ff",
                  borderRadius: 3,
                  background: "linear-gradient(145deg, #f8faff 0%, #ffffff 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(30, 60, 114, 0.15)",
                    borderColor: "#1e3c72",
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "white",
                      mr: 2,
                    }}
                  >
                    <Phone />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3c72" }}>
                    Call Us
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#1e3c72",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                  }}
                >
                  0120-4461787
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 1 }}>
                  Mon - Fri, 9:00 AM - 6:00 PM
                </Typography>
              </Card>

              {/* Email Card */}
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e0e7ff",
                  borderRadius: 3,
                  background: "linear-gradient(145deg, #f8faff 0%, #ffffff 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(30, 60, 114, 0.15)",
                    borderColor: "#1e3c72",
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      color: "white",
                      mr: 2,
                    }}
                  >
                    <Mail />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3c72" }}>
                    Email Us
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#1e3c72",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  support@instantjob.in
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mt: 1 }}>
                  We'll respond within 24 hours
                </Typography>
              </Card>
            </Box>
          </Box>

          {/* Contact Form */}
          <Box
            sx={{
              width: { xs: "100%", md: "66.66%" },
              display: "flex",
              flexDirection: "column",
              mt: { xs: 4, md: 0 },
            }}
          >
            <Card
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 3, md: 4 },
                border: "1px solid #e0e7ff",
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                  borderRadius: "0 0 0 100px",
                  opacity: 0.1,
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  mb: 1,
                  color: "#1e3c72",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Send Us a Message
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  mb: 4,
                  fontSize: "1.1rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Have questions about jobs, hiring, or our platform? We'd love to hear from you.
              </Typography>

              {error && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#ffffff",
                        "&:hover fieldset": {
                          borderColor: "#1e3c72",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1e3c72",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1e3c72",
                      },
                    }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#1e3c72",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3c72",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#1e3c72",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="mobileNo"
                      label="Mobile Number"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: "#ffffff",
                          "&:hover fieldset": {
                            borderColor: "#1e3c72",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e3c72",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#1e3c72",
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    select
                    label="Query Type"
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#ffffff",
                        "&:hover fieldset": {
                          borderColor: "#1e3c72",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1e3c72",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1e3c72",
                      },
                    }}
                  >
                    {queryTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {option.icon}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Tell us more about your inquiry..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#ffffff",
                        "&:hover fieldset": {
                          borderColor: "#1e3c72",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1e3c72",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#1e3c72",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                      textTransform: "none",
                      boxShadow: "0 4px 14px rgba(30, 60, 114, 0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1a365d 0%, #2563eb 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(30, 60, 114, 0.6)",
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </form>
            </Card>
          </Box>

        </Box>
      </Container>

      {/* Thank You Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="thank-you-modal"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            maxWidth: "500px",
            width: "90%",
            textAlign: "center",
            background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
            border: "1px solid #e0e7ff",
            boxShadow: "0 25px 50px rgba(30, 60, 114, 0.3)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              color: "white",
              fontSize: "2rem",
            }}
          >
            ✓
          </Box>
          <Typography
            variant="h4"
            id="thank-you-modal"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
              mb: 2,
              color: "#1e3c72",
            }}
          >
            Thank You!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Your message has been successfully sent. Our team will get back to you within 24 hours.
          </Typography>
        </Card>
      </Modal>

      {/* Map and Company Description */}
      <Box sx={{ mt: 8 }}>
        {/* Google Map */}
        <Box
          sx={{
            height: { xs: "300px", md: "400px" },
            width: "100%",
            borderRadius: { xs: 0, md: 3 },
            overflow: "hidden",
            boxShadow: { xs: "none", md: "0 8px 32px rgba(30, 60, 114, 0.15)" },
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1751.8659635143448!2d77.4077335113832!3d28.500660396765205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9a87871c4c3%3A0x4ecc763a8e9e10be!2sNumber11!5e0!3m2!1sen!2sin!4v1718524469739!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        {/* Company Description */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "white",
            textAlign: "center",
            py: { xs: 4, md: 6 },
            px: { xs: 3, md: 8 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"dots\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23dots)\"/></svg>') repeat",
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: 3,
              }}
            >
              About Instant Job
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              Instant Job is India's premier recruitment platform, connecting top talent with leading companies across all industries. We leverage cutting-edge technology and deep market insights to make hiring faster, smarter, and more effective for businesses of all sizes.
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default ContactUs;