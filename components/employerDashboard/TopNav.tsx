import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Badge,
  Fade,
  Skeleton,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { Employer, fetchEmployerById } from '@/services/eployersApi';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ isMobile, toggleSidebar }) => {
  const [employerData, setEmployerData] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const navigate = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employerId = localStorage.getItem('id');
        if (employerId) {
          const employer = await fetchEmployerById(employerId);
          setEmployerData(employer);
        }
      } catch (err) {
        console.error('Error fetching employer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    navigate.push('/employer-dash/login'); // Adjust path as needed
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate.push('/settings'); // Adjust path as needed
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate.push('/profile'); // Adjust path as needed
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '72px !important',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleSidebar}
              sx={{
                color: 'white',
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BusinessIcon 
                sx={{ 
                  color: 'white', 
                  fontSize: 28,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }} 
              />
              <Box>
                {loading ? (
                  <>
                    <Skeleton 
                      variant="text" 
                      width={180} 
                      height={28} 
                      sx={{ bgcolor: alpha(theme.palette.common.white, 0.2) }}
                    />
                    <Skeleton 
                      variant="text" 
                      width={120} 
                      height={16} 
                      sx={{ bgcolor: alpha(theme.palette.common.white, 0.1) }}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        lineHeight: 1.2,
                      }}
                    >
                      {employerData?.companyName || 'Company Dashboard'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(theme.palette.common.white, 0.8),
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        display: 'block',
                      }}
                    >
                      Employer Dashboard
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>


         
          {/* User Avatar */}
          <Box
            sx={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
            onClick={handleAvatarClick}
          >
            {loading ? (
              <Skeleton
                variant="circular"
                width={44}
                height={44}
                sx={{ bgcolor: alpha(theme.palette.common.white, 0.2) }}
              />
            ) : (
              <>
                <Avatar
                  src={employerData?.companyLogo || '/api/placeholder/44/44'}
                  sx={{
                    width: 44,
                    height: 44,
                    border: `3px solid ${alpha(theme.palette.common.white, 0.3)}`,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: `0 12px 35px ${alpha(theme.palette.common.black, 0.2)}`,
                      borderColor: alpha(theme.palette.common.white, 0.5),
                    },
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 30 }} />
                </Avatar>
                {/* Online Status Indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    backgroundColor: theme.palette.success.main,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                />
              </>
            )}
          </Box>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 3,
              minWidth: 220,
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
              overflow: 'hidden',
            },
          }}
        >
          {/* User Info Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {loading ? 'Loading...' : (employerData?.companyName || 'User')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {loading ? '...' : (employerData?.email || 'admin@company.com')}
            </Typography>
          </Box>

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 3,
              color: theme.palette.error.main,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 20, color: theme.palette.error.main }} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 500 }}>Logout</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default TopNav;