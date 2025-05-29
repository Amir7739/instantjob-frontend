"use client";

import React from "react";
import { Box, Container, Typography, Grid, Divider } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import Link from "next/link";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        
        bgcolor: "#A87B7E",
        color: "grey.400",
        mt: "0.5rem",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom>
              InstantJob
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#e4e8ed" }}>
              Find your dream job instantly with India's fastest growing job
              portal.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Social icons would go here */}
              {["linkedin", "facebook", "instagram", "twitter"].map(
                (social) => (
                  <Box
                    key={social}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Link
                      href={`https://www.${social}.com`}
                      target="_blank"
                      style={{ color: "white", marginTop: "0.3rem" }}
                    >
                      {social === "linkedin" && <LinkedInIcon />}
                      {social === "facebook" && <FacebookIcon />}
                      {social === "instagram" && <InstagramIcon />}
                      {social === "twitter" && <TwitterIcon />}
                    </Link>
                  </Box>
                )
              )}
            </Box>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              For Job Seekers
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {[
                "Browse Jobs",
                "Company Reviews",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link
                    href="#"
                    style={{
                      textDecoration: "none",
                      color: "#e4e8ed",
                      "&:hover": { color: "primary.main" },
                      display: "block",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="body2">{item}</Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              For Employers
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {[
                "Post Jobs",
                "Search Resumes",
                "Pricing",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link
                    href="#"
                    style={{
                      textDecoration: "none",
                      color: "#e4e8ed",
                      "&:hover": { color: "primary.main" },
                      display: "block",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="body2">{item}</Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              InstantJob
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {["About Us", "Contact", "Policy"].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link
                   href={item === "About Us" ? "/about" : item === "Contact" ? "/contact" : "#"}
                    style={{
                      textDecoration: "none",
                      color: "#e4e8ed",
                      "&:hover": { color: "primary.main" },
                      display: "block",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="body2">{item}</Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Contact Us
            </Typography>
            <Typography sx={{ color: "#e4e8ed" }} variant="body2" paragraph>
              Email: support@instantjob.com
            </Typography>
            <Typography sx={{ color: "#e4e8ed" }} variant="body2" paragraph>
              Phone:  0120-4461787
            </Typography>
            <Typography sx={{ color: "#e4e8ed" }} variant="body2">
            911,9th Floor, Tower-B, Advant IT Park
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: "grey.800" }} />
        <Typography style={{color: 'white'}} variant="body2" align="center">
          © {new Date().getFullYear()} InstantJob. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
