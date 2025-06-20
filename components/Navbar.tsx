"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    { name: "Home", path: "/" },
    // { name: "Services", path: "/jobs" },
  ];

  useEffect(() => {
    setIsLoading(true);
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setIsLoading(false);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const dashboardPath = role === "candidate" ? "/cand-dash" : role === "admin" ? "/admin-dashboard" : "/";
  const isLoggedIn = role === "admin" || role === "candidate";

  const navButtonStyle = {
    fontSize: "0.95rem",
    fontWeight: 600,
    borderRadius: "12px",
    px: 3,
    py: 1,
    position: "relative",
    overflow: "hidden",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    },
    "&:hover:before": {
      left: "100%",
    },
  };

  const primaryButtonStyle = {
    ...navButtonStyle,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontWeight: 700,
    "&:hover": {
      transform: "translateY(-2px)",
      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: scrolled 
          ? "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)"
          : "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        height: isMobile ? 70 : 85,
      }}
    >
      <Box sx={{ width: "100%", px: "2px" }}>
        <Toolbar 
          disableGutters 
          sx={{ 
            height: "100%", 
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            px: 0,
          }}
        >
          {/* Logo Section - Far Left */}
          <Box sx={{ flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="InstantJob Logo"
                  width={isMobile ? 120 : 180}
                  height={isMobile ? 50 : 95}
                  priority
                  style={{
                    objectFit: "contain",
                    height: "auto",
                    width: "auto",
                    maxWidth: isMobile ? "120px" : "180px",
                    maxHeight: isMobile ? "50px" : "95px",
                  }}
                />
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation - Far Right */}
          {!isMobile && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              flexShrink: 0
            }}>
              {navItems.map((item) => (
                <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                  <Button sx={navButtonStyle}>
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              {isLoading ? (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  <Skeleton 
                    variant="rounded" 
                    width={80} 
                    height={42} 
                    sx={{ 
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 255, 255, 0.1)"
                    }} 
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={80} 
                    height={42} 
                    sx={{ 
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 255, 255, 0.1)"
                    }} 
                  />
                  {token && (
                    <Skeleton 
                      variant="rounded" 
                      width={120} 
                      height={42} 
                      sx={{ 
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 255, 255, 0.1)"
                      }} 
                    />
                  )}
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  {!isLoggedIn && (
                    <Link href="/login" style={{ textDecoration: "none" }}>
                      <Button sx={navButtonStyle}>Login</Button>
                    </Link>
                  )}
                  
                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <Button sx={navButtonStyle}>Signup</Button>
                  </Link>
                  
                  {isLoggedIn && (
                    <Link href={dashboardPath} style={{ textDecoration: "none" }}>
                      <Button sx={primaryButtonStyle}>My Dashboard</Button>
                    </Link>
                  )}
                  
                  <Link href="/employer-dash/login" style={{ textDecoration: "none" }}>
                    <Button sx={primaryButtonStyle}>For Employers</Button>
                  </Link>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile Menu Button - Far Right */}
          {isMobile && (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                size="large"
                onClick={toggleDrawer(true)}
                sx={{
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                  borderRadius: "12px",
                  p: 1.5,
                }}
              >
                <MenuIcon sx={{ fontSize: "1.8rem" }} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
            color: "white",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <Box sx={{ width: 300, pt: 3 }}>
          {/* Logo in drawer */}
          <Box sx={{ px: 3, pb: 3, display: "flex", justifyContent: "center" }}>
            <Image
              src="/images/logo.png"
              alt="InstantJob Logo"
              width={150}
              height={60}
              style={{
                objectFit: "contain",
                filter: "brightness(1.2)",
              }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ px: 3, pb: 2, fontWeight: 700, opacity: 0.9 }}>
            Navigation
          </Typography>
          
          <List>
            {navItems.map((item) => (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItem
                  button
                  onClick={toggleDrawer(false)}
                  sx={{
                    mx: 2,
                    mb: 1,
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      transform: "translateX(8px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ListItemText 
                    primary={item.name} 
                    sx={{ "& .MuiTypography-root": { fontWeight: 500, fontSize: "1.1rem" } }} 
                  />
                </ListItem>
              </Link>
            ))}
            
            {isLoading ? (
              <Box sx={{ px: 3, py: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    variant="text" 
                    height={45} 
                    sx={{ 
                      mb: 1, 
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: "8px"
                    }} 
                  />
                ))}
              </Box>
            ) : (
              <>
                {!isLoggedIn && (
                  <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItem
                      button
                      onClick={toggleDrawer(false)}
                      sx={{
                        mx: 2,
                        mb: 1,
                        borderRadius: "12px",
                        "&:hover": { 
                          backgroundColor: "rgba(255, 255, 255, 0.15)", 
                          transform: "translateX(8px)" 
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ListItemText 
                        primary="Login" 
                        sx={{ "& .MuiTypography-root": { fontWeight: 500, fontSize: "1.1rem" } }} 
                      />
                    </ListItem>
                  </Link>
                )}
                
                <Link href="/register" style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItem
                    button
                    onClick={toggleDrawer(false)}
                    sx={{
                      mx: 2,
                      mb: 1,
                      borderRadius: "12px",
                      "&:hover": { 
                        backgroundColor: "rgba(255, 255, 255, 0.15)", 
                        transform: "translateX(8px)" 
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemText 
                      primary="Signup" 
                      sx={{ "& .MuiTypography-root": { fontWeight: 500, fontSize: "1.1rem" } }} 
                    />
                  </ListItem>
                </Link>
                
                {isLoggedIn && (
                  <Link href={dashboardPath} style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItem
                      button
                      onClick={toggleDrawer(false)}
                      sx={{
                        mx: 2,
                        mb: 1,
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { 
                          backgroundColor: "rgba(255, 255, 255, 0.3)", 
                          transform: "translateX(8px)" 
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ListItemText 
                        primary="My Dashboard" 
                        sx={{ "& .MuiTypography-root": { fontWeight: 600, fontSize: "1.1rem" } }} 
                      />
                    </ListItem>
                  </Link>
                )}
                
                <Link href="/employer-dash/login" style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItem
                    button
                    onClick={toggleDrawer(false)}
                    sx={{
                      mx: 2,
                      mb: 1,
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      "&:hover": { 
                        backgroundColor: "rgba(255, 255, 255, 0.3)", 
                        transform: "translateX(8px)" 
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemText 
                      primary="For Employers" 
                      sx={{ "& .MuiTypography-root": { fontWeight: 600, fontSize: "1.1rem" } }} 
                    />
                  </ListItem>
                </Link>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;