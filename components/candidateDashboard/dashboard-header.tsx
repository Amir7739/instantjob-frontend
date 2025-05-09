"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

interface DashboardHeaderProps {
  handleDrawerToggle: () => void;
}

export function DashboardHeader({ handleDrawerToggle }: DashboardHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Debounce the search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle search navigation
  const handleSearch = useCallback(() => {
    if (debouncedSearchQuery.trim()) {
      router.push(`/cand-dash/search?search=${encodeURIComponent(debouncedSearchQuery)}&type=recommended`);
    } else {
      // If search query is empty, navigate to default recommended jobs
      router.push(`/cand-dash/search?search=&type=recommended`);
    }
  }, [debouncedSearchQuery, router]);

  // Trigger search when debounced value changes
  useEffect(() => {
    handleSearch();
  }, [debouncedSearchQuery, handleSearch]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: 1100, // Above sidebar (1000), below footer (1300)
        height: "64px", // Fixed height
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          href="/cand-dash"
          sx={{
            display: "flex",
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          IntantJob
        </Typography>

        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={5} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
          <Avatar
            alt="User"
            src="/placeholder-user.jpg"
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              router.push("/cand-dash/profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              router.push("/cand-dash/settings");
            }}
          >
            Settings
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              localStorage.removeItem("id");
              localStorage.removeItem("role");
              localStorage.removeItem("token");
              handleMenuClose();
              router.push("/");
            }}
          >
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}