import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Phone as PhoneIcon, Logout as LogoutIcon } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

const EmployerNavBar: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElOfferings, setAnchorElOfferings] = useState<null | HTMLElement>(null);
  const [anchorElMobile, setAnchorElMobile] = useState<null | HTMLElement>(null);
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [userInitial, setUserInitial] = useState("?");
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserInitial(localStorage.getItem("token") ? "E" : "?");
      setIsEmployer(localStorage.getItem("role") === "employer");
    }
  }, []);

  const handleOfferingsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOfferings(event.currentTarget);
  };

  const handleOfferingsClose = () => {
    setAnchorElOfferings(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMobile(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorElMobile(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/employer-dash/login");
    handleProfileMenuClose();
  };

  const offerings = [
    { label: "Job Posting", path: "/employer/jobs/post" },
    { label: "Resume Database", path: "/employer/resumes" },
    { label: "Candidate Matching", path: "/employer/matching" },
    { label: "Analytics", path: "/employer/analytics" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        // bgcolor: "white",
        backgroundColor:"#2d3748",
        color: "#1F2937",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ width: "100%", px: "2px" }}>
        <Toolbar 
          disableGutters
          sx={{ 
            justifyContent: "space-between",
            px: 0
          }}
        >
          {/* Logo Section - Far Left */}
          <Box sx={{ flexShrink: 0 }}>
            <Link href="/" passHref style={{ textDecoration: "none" }}>
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
                  width={isMobile ? 120 : 160}
                  height={isMobile ? 50 : 90}
                  priority
                  style={{
                    objectFit: "contain",
                    height: "auto",
                    width: "auto",
                    maxWidth: isMobile ? "120px" : "160px",
                    maxHeight: isMobile ? "50px" : "90px",
                  }}
                />
              </Box>
            </Link>
          </Box>

          {/* Center Navigation - Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color="inherit"
                onMouseEnter={handleOfferingsOpen}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: 18,
                  "&:hover": { color: "#4B5EAA",cursor: 'pointer'},
                  color: 'white'
                }}
              >
                Our Offerings
              </Button>
              {isEmployer && (
                <Button
                  color="inherit"
                  onClick={() => router.push("/employer-dash")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { color: "white" },
                  }}
                >
                  My Dashboard
                </Button>
              )}
              <Menu
                anchorEl={anchorElOfferings}
                open={Boolean(anchorElOfferings)}
                onClose={handleOfferingsClose}
                MenuListProps={{
                  onMouseLeave: handleOfferingsClose,
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {offerings.map((offering) => (
                  <MenuItem
                    key={offering.label}
                    onClick={() => {
                      router.push(offering.path);
                      handleOfferingsClose();
                    }}
                    sx={{
                      color: "#1F2937",
                      "&:hover": { bgcolor: "#F3F4F6", color: "#4B5EAA" },
                    }}
                  >
                    {offering.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Right Section - Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 , }}>
                <PhoneIcon sx={{ color: "white" }} />
                <Typography variant="body2" sx={{ color: "white" , 
                  fontSize: 17}}>
                  0120-4461787
                </Typography>
              </Box>
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar sx={{ bgcolor: "#4B5EAA" }}>{userInitial}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={handleProfileMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {isEmployer && (
                  <MenuItem
                  sx={{color:'white'}}
                    onClick={() => {
                      router.push("/employer-dash");
                      handleProfileMenuClose();
                    }}
                  >
                    My Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, color: "#1F2937" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Mobile Menu Button - Far Right */}
          {isMobile && (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton onClick={handleMobileMenuOpen}>
                <MenuIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
          )}
          
          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorElMobile}
            open={Boolean(anchorElMobile)}
            onClose={handleMobileMenuClose}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 1,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <MenuItem onMouseEnter={handleOfferingsOpen} onClick={handleOfferingsOpen}>
              Our Offerings
            </MenuItem>
            {Boolean(anchorElOfferings) ? (
              offerings.map((offering) => (
                <MenuItem
                  key={offering.label}
                  onClick={() => {
                    router.push(offering.path);
                    handleMobileMenuClose();
                  }}
                  sx={{ pl: 4, color: "#1F2937", "&:hover": { bgcolor: "#F3F4F6", color: "#4B5EAA" } }}
                >
                  {offering.label}
                </MenuItem>
              ))
            ) : (
              <>
                {isEmployer && (
                  <MenuItem
                    onClick={() => {
                      router.push("/employer-dash");
                      handleMobileMenuClose();
                    }}
                    sx={{ color: "#1F2937", "&:hover": { bgcolor: "white", color: "#4B5EAA" } }}
                  >
                    My Dashboard
                  </MenuItem>
                )}
                <MenuItem sx={{ color: "#1F2937" }}>
                  <PhoneIcon sx={{ mr: 1, color: "#4B5EAA" }} />
                  0120-4461787
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, color: "#1F2937" }} />
                  Logout
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default EmployerNavBar;