"use client";

import React from "react";
import { Box, Container, Typography, Grid, Divider, useMediaQuery } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const socials = [
    {
      name: "linkedin",
      icon: <LinkedInIcon />,
      color: "#0e76a8",
      url: "https://www.linkedin.com"
    },
    {
      name: "facebook",
      icon: <FacebookIcon />,
      color: "#3b5998",
      url: "https://www.facebook.com"
    },
    {
      name: "instagram",
      icon: <InstagramIcon />,
      color: "#E1306C",
      url: "https://www.instagram.com"
    },
    {
      name: "twitter",
      icon: <TwitterIcon />,
      color: "#1DA1F2",
      url: "https://www.twitter.com"
    },
  ];

  const iconBoxStyle = {
    bgcolor: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
    flexShrink: 0,
  };

  const contactTextStyle = {
    color: "#e4e8ed",
    fontWeight: 500,
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#A87B7E",
        color: "grey.400",
        mt: "68px",
        zIndex: -110,
        py: { xs: 3, md: 5 },
        animation: "fadeIn 0.8s ease-in-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Container maxWidth="lg">

        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            textAlign: { xs: "left", sm: "left" },
          }}
        >
          {/* For Job Seekers */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              For Job Seekers
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {["Browse Jobs", "Company Reviews", "Career Advice", "Salary Calculator"].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link href={item === "Browse Jobs" ? "/all-jobs" : "#"} style={{ textDecoration: "none" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#e4e8ed",
                        transition: "all 0.2s ease",
                        fontWeight: 500,
                        "&:hover": {
                          color: "white",
                          textDecoration: "underline",
                          fontWeight: 600,
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* For Employers */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              For Employers
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {["Post Jobs", "Search Resumes", "Pricing", "Recruitment Solutions"].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href={
                      item === "Post Jobs"
                        ? "/jobs/create"
                        : item === "Search Resumes"
                          ? "/employer-dash"
                          : "#"
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#e4e8ed",
                        transition: "all 0.2s ease",
                        fontWeight: 500,
                        "&:hover": {
                          color: "white",
                          textDecoration: "underline",
                          fontWeight: 600,
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {["About Us", "Contact", "Privacy Policy", "Careers", "Blog"].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href={
                      item === "About Us"
                        ? "/about"
                        : item === "Contact"
                          ? "/contact"
                          : item === "Careers"
                            ? "/careers"
                            : "#"
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#e4e8ed",
                        transition: "all 0.2s ease",
                        fontWeight: 500,
                        "&:hover": {
                          color: "white",
                          textDecoration: "underline",
                          fontWeight: 600,
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent:"flex-start", mb: 2 }}>
              <Box sx={iconBoxStyle}>✉️</Box>
              <Typography sx={contactTextStyle}>support@instantjob.in</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: { xs: "flex-start", sm: "flex-start" }, mb: 2 }}>
              <Box sx={iconBoxStyle}>📞</Box>
              <Typography sx={contactTextStyle}>0120-4461787</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: { xs: "flex-start", sm: "flex-start" } }}>
              <Box sx={iconBoxStyle}>🏢</Box>
              <Typography sx={{ ...contactTextStyle, lineHeight: 1.6 }}>
                911, 9th Floor, Tower-B,<br />
                Advant IT Park, Sector-142,<br />
                Noida, U.P.-201305
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#e4e8ed",
            maxWidth: "800px",
            mx: "auto",
            mt: 3,
            lineHeight: 1.6
          }}
        >
          Find your dream job instantly with India's fastest growing job portal.
          Join over 1 million professionals who found their perfect career match with us.
        </Typography>


        <Divider
          sx={{
            my: 2,
            borderColor: "rgba(255,255,255,0.3)",
            borderWidth: 1
          }}
        />

        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2
        }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              letterSpacing: 0.5,
              fontWeight: 500
            }}
            variant="body2"
          >
            © {new Date().getFullYear()} InstantJob. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, }}>
            {socials.map((social) => (
              <Box
                key={social.name}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "white",
                    transform: "scale(1.1)",
                    "& svg": {
                      color: social.color,
                    },
                  },
                }}
              >
                <Link
                  href={social.url}
                  target="_blank"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      color: "white",
                      transition: "color 0.3s ease",
                      display: "flex",
                      fontSize: "1.4rem",
                      "&:hover": {
                        color: social.color,
                      },
                    }}
                  >
                    {social.icon}
                  </Box>
                </Link>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link href="#" key={item} style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "white",
                      textDecoration: "underline"
                    }
                  }}
                  variant="body2"
                >
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;