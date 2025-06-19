"use client";

import Navbar from "@/components/Navbar";
import { Box, Typography, TextField, MenuItem, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/utils/axios";

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

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "stretch",
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 3, md: 6 },
          mt: 10,
          gap: { xs: 3, md: 6 },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "40vh",
        }}
      >
        {/* LEFT SECTION */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.3rem", sm: "1.6rem", md: "1.8rem" },
              mb: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Corporate Office :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "#34495e",
              mb: 3,
              lineHeight: 1.7,
            }}
          >
            911, 9th Floor, Tower-B, Advant IT Park, Sector-142, Noida, Uttar
            Pradesh, 201305, India
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              mt: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Call Us At :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem" },
              fontWeight: 600,
              color: "#34495e",
              mb: 2,
            }}
          >
            0120-4461787
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              mt: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mail Us At :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              color: "#34495e",
              fontWeight: 500,
            }}
          >
            support@instantjob.in
          </Typography>
        </Box>

        {/* RIGHT FORM SECTION */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
              mb: 3,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CONTACT US
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                name="email"
                label="Email ID"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="mobileNo"
                label="Mobile No"
                value={formData.mobileNo}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Box>

            <TextField
              fullWidth
              select
              label="Query Type"
              name="queryType"
              value={formData.queryType}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="job">Job</MenuItem>
              <MenuItem value="support">Support</MenuItem>
              <MenuItem value="other">Others</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                  },
                }}
              >
                Submit Query
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      {/* Thank You Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="thank-you-modal"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            textAlign: "center",
            maxWidth: "600px",
            width: "90%",
          }}
        >
          <Typography
            variant="h3"
            id="thank-you-modal"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              mb: 2,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thank You!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem" },
              color: "#34495e",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Your query has been successfully submitted. Our team will get back to
            you soon.
          </Typography>
        </Box>
      </Modal>

      {/* Google Map + Footer Description */}
      <Box sx={{ mt: 5, px: { xs: 2, md: 6 } }}>
        {/* Google Map Embed */}
        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: "300px", md: "450px" },
            width: "100%",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
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
          ></iframe>
        </Box>

        {/* Description Text */}
        <Box
          sx={{
            backgroundColor: "#002d4c",
            color: "#fff",
            textAlign: "center",
            py: 3,
            mt: 0,
            fontSize: { xs: "0.9rem", md: "1rem" },
            px: { xs: 2, md: 10 },
          }}
        >
          Instant Job is a modern job platform built to simplify hiring and job
          searching for today’s fast-moving world. Designed for both
          professionals and companies, it offers a seamless way to discover
          talent, explore real opportunities, and grow careers across every
          sector.
        </Box>
      </Box>
    </>
  );
};

export default ContactUs;