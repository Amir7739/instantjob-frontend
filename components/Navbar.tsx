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
    textTransform: "none",
    borderRadius: "12px",
    px: 3,
    py: 1,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(50, 82, 168, 0.2)",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "left 0.5s",
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
      ...navButtonStyle["&:hover"],
      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: scrolled 
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(50, 82, 168, 0.1)" : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        height: 80,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: "100%" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.8rem",
              letterSpacing: "-0.5px",
              mr: 4,
            }}
          >
            InstantJob
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                  <Button sx={{ ...navButtonStyle, color: "#4a5568" }}>
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              {isLoading ? (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  <Skeleton variant="rounded" width={80} height={40} sx={{ borderRadius: "12px" }} />
                  <Skeleton variant="rounded" width={80} height={40} sx={{ borderRadius: "12px" }} />
                  {token && <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: "12px" }} />}
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  {!isLoggedIn && (
                    <Link href="/login" style={{ textDecoration: "none" }}>
                      <Button sx={{ ...navButtonStyle, color: "#4a5568" }}>Login</Button>
                    </Link>
                  )}
                  
                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <Button sx={{ ...navButtonStyle, color: "#4a5568" }}>Signup</Button>
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

          {isMobile && (
            <IconButton
              size="large"
              onClick={toggleDrawer(true)}
              sx={{
                color: "#4a5568",
                "&:hover": {
                  backgroundColor: "rgba(50, 82, 168, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          },
        }}
      >
        <Box sx={{ width: 280, pt: 3 }}>
          <Typography variant="h6" sx={{ px: 3, pb: 2, fontWeight: 700, opacity: 0.9 }}>
            Menu
          </Typography>
          <List>
            {navItems.map((item) => (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItem
                  button
                  sx={{
                    mx: 2,
                    mb: 1,
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateX(8px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ListItemText primary={item.name} sx={{ "& .MuiTypography-root": { fontWeight: 500 } }} />
                </ListItem>
              </Link>
            ))}
            
            {isLoading ? (
              <Box sx={{ px: 3, py: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="text" height={40} sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
                ))}
              </Box>
            ) : (
              <>
                {!isLoggedIn && (
                  <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItem
                      button
                      sx={{
                        mx: 2,
                        mb: 1,
                        borderRadius: "12px",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", transform: "translateX(8px)" },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ListItemText primary="Login" sx={{ "& .MuiTypography-root": { fontWeight: 500 } }} />
                    </ListItem>
                  </Link>
                )}
                
                <Link href="/register" style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItem
                    button
                    sx={{
                      mx: 2,
                      mb: 1,
                      borderRadius: "12px",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", transform: "translateX(8px)" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemText primary="Signup" sx={{ "& .MuiTypography-root": { fontWeight: 500 } }} />
                  </ListItem>
                </Link>
                
                {isLoggedIn && (
                  <Link href={dashboardPath} style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItem
                      button
                      sx={{
                        mx: 2,
                        mb: 1,
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)", transform: "translateX(8px)" },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ListItemText primary="My Dashboard" sx={{ "& .MuiTypography-root": { fontWeight: 600 } }} />
                    </ListItem>
                  </Link>
                )}
                
                <Link href="/employer-dash/login" style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItem
                    button
                    sx={{
                      mx: 2,
                      mb: 1,
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)", transform: "translateX(8px)" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemText primary="For Employers" sx={{ "& .MuiTypography-root": { fontWeight: 600 } }} />
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