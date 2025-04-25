import React from 'react';
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
  useMediaQuery
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

const StyledSidebar = styled(Box)(({ theme, open }) => ({
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
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    position: 'fixed',
    zIndex: 1200,
    width: open ? 240 : 0,
    boxShadow: open ? theme.shadows[8] : 'none',
  }
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
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

const Sidebar = ({ activeTab, handleTabChange, handleLogout, userName = "Admin User", userAvatar = null }) => {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'jobs', text: 'Jobs', icon: <WorkIcon /> },
    { id: 'candidates', text: 'Candidates', icon: <PeopleIcon /> },
    { id: 'employers', text: 'Employers', icon: <BusinessIcon /> },
  ];

  return (
    <StyledSidebar open={open}>
      <HeaderBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {open ? (
          <>
            <Typography variant="h6" fontWeight="bold" noWrap>
              Admin Portal
            </Typography>
            <IconButton 
              onClick={toggleDrawer} 
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
      
      {open && (
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
        <List>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Tooltip 
                title={!open ? item.text : ""} 
                placement="right" 
                key={item.id}
                arrow
              >
                <StyledListItem 
                  button 
                  active={isActive ? 1 : 0}
                  onClick={() => handleTabChange(item.id)}
                  sx={{ py: 1 }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.main' : 'text.secondary',
                      minWidth: open ? 40 : 36,
                      ml: open ? 0 : '2px'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
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
          <Tooltip title={!open ? "Logout" : ""} placement="right" arrow>
            <StyledListItem button onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'error.main', minWidth: open ? 40 : 36, ml: open ? 0 : '2px' }}>
                <LogoutIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        </List>
      </Box>
    </StyledSidebar>
  );
};

export default Sidebar;