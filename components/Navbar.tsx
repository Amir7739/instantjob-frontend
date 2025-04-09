'use client';

import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/jobs' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: scrolled ? 'white' : 'white',
        transition: 'all 0.3s ease-in-out',
        height: scrolled ? 70 : 70,
        boxShadow: scrolled ? 'rgba(0, 0, 0, 0.1) 0px 4px 12px' : 'none',
        color: scrolled ? '#3252a8' : '#3252a8'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: '100%', justifyContent: 'space-between' }}>
          {/* Left: Logo + Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: scrolled ? '1.5rem' : '1.75rem',
                transition: 'all 0.3s ease-in-out',
                mr: 4
              }}
            >
              InstantJob
            </Typography>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        opacity: 0.85,
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </Box>
            )}
          </Box>

          {/* Right: Login, Signup, Post Job or Drawer */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Signup
                </Button>
              </Link>
              {/* <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Post a Job
              </Button> */}
            </Box>
          ) : (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navItems.map((item) => (
              <Link key={item.name} href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem button>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
            ))}
            <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemText primary="Login" />
              </ListItem>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem button>
                <ListItemText primary="Signup" />
              </ListItem>
            </Link>
            <ListItem>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  mt: 1
                }}
              >
                Post a Job
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
