import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Toolbar, 
  Typography, 
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Work as WorkIcon, 
  People as PeopleIcon, 
  Business as BusinessIcon, 
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Fix for TypeScript props
interface StyledSidebarProps {
  open: boolean;
}

const StyledSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledSidebarProps>(({ theme, open }) => ({
  width: open ? 240 : 73,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100vh',
  display: 'flex',
  position: 'sticky',
  left: 0,
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    display: 'none', // Hide completely on mobile as we use Drawer instead
  }
}));

interface StyledListItemProps {
  active: number;
}

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledListItemProps>(({ theme, active }) => ({
  margin: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(active && {
    backgroundColor: theme.palette.primary.light + '33',
    '&:hover': {
      backgroundColor: theme.palette.primary.light + '4D',
    },
  }),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const Sidebar = ({ 
  activeTab, 
  handleTabChange, 
  handleLogout, 
  userName = "Admin User", 
  userAvatar = null 
}) => {
  // Separate mobile open state from regular sidebar state
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Initialize open state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setOpen(true);
    }
  }, [isMobile]);

  // Handle desktop sidebar toggle
  const toggleDrawer = () => {
    if (!isMobile) {
      setOpen(!open);
    }
  };

  // Handle mobile sidebar toggle - explicitly separated
  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'jobs', text: 'Jobs', icon: <WorkIcon /> },
    { id: 'candidates', text: 'Candidates', icon: <PeopleIcon /> },
    { id: 'employers', text: 'Employers', icon: <BusinessIcon /> },
  ];

  const sidebarContent = (
    <>
      <HeaderBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {(open || isMobile) ? (
          <>
            <Typography variant="h6" fontWeight="bold" noWrap>
              Admin Portal
            </Typography>
            <IconButton 
              onClick={isMobile ? handleMobileToggle : toggleDrawer} 
              sx={{ color: 'inherit' }}
              size="small"
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton 
            onClick={toggleDrawer} 
            sx={{ color: 'inherit', mx: 'auto' }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}
      </HeaderBox>
      
      {(open || isMobile) && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={userAvatar} 
            alt={userName}
            sx={{ 
              width: 40, 
              height: 40,
              backgroundColor: theme.palette.secondary.main
            }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">{userName}</Typography>
            <Typography variant="caption" color="text.secondary">Administrator</Typography>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 1 }}>
        <List style={{cursor: 'pointer'}}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Tooltip 
                title={!open && !isMobile ? item.text : ""} 
                placement="right" 
                key={item.id}
                arrow
              >
                <StyledListItem 
                  button 
                  active={isActive ? 1 : 0}
                  onClick={() => {
                    handleTabChange(item.id);
                    if (isMobile) {
                      setMobileOpen(false);
                    }
                  }}
                  sx={{ py: 1 }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.main' : 'text.secondary',
                      minWidth: (open || isMobile) ? 40 : 36,
                      ml: (open || isMobile) ? 0 : '2px'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(open || isMobile) && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 'bold' : 'medium',
                        color: isActive ? 'primary.main' : 'text.primary'
                      }}
                    />
                  )}
                </StyledListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>
      
      <Box>
        <Divider />
        <List>
          <Tooltip title={!open && !isMobile ? "Logout" : ""} placement="right" arrow>
            <StyledListItem 
              button 
              onClick={handleLogout} 
              sx={{ color: 'error.main', cursor: 'pointer' }} 
              active={0}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: (open || isMobile) ? 40 : 36, ml: (open || isMobile) ? 0 : '2px' }}>
                <LogoutIcon />
              </ListItemIcon>
              {(open || isMobile) && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        </List>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile app bar with menu button */}
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <IconButton
              onClick={handleMobileToggle}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Portal
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <StyledSidebar open={open}>
          {sidebarContent}
        </StyledSidebar>
      )}

      {/* Mobile drawer */}
      <Drawer
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;