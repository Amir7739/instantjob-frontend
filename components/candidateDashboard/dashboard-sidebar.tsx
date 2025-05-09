'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/cand-dash',
    icon: HomeIcon,
  },
  {
    title: 'Profile',
    href: '/cand-dash/profile',
    icon: PersonIcon,
  },
  {
    title: 'Jobs',
    icon: WorkIcon,
    children: [
      {
        title: 'Recommended',
        href: '/cand-dash/jobs/recommended',
      },
      {
        title: 'Applied',
        href: '/cand-dash/jobs/applied',
      },
      {
        title: 'Saved',
        href: '/cand-dash/jobs/saved-job',
      },
    ],
  },
  {
    title: 'Resume',
    href: '/cand-dash/resume',
    icon: DescriptionIcon,
  },
  {
    title: 'Interviews',
    href: '/cand-dash/interviews',
    icon: CalendarMonthIcon,
  },
  {
    title: 'Settings',
    href: '/cand-dash/settings',
    icon: SettingsIcon,
  },
];

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  handleDrawerToggle?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, handleDrawerToggle = () => {} }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Jobs');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setIsLoading(false), 500); // Artificial delay for visibility
    };

    router.events?.on('routeChangeStart', handleRouteChangeStart);
    router.events?.on('routeChangeComplete', handleRouteChangeComplete);
    router.events?.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChangeStart);
      router.events?.off('routeChangeComplete', handleRouteChangeComplete);
      router.events?.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  const handleSubmenuClick = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <>
      <Divider />
      <List>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const isSubmenuOpen = openSubmenu === link.title;

          if (link.children) {
            return (
              <Box key={link.title}>
                <ListItem disablePadding>
                  {isLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={48} />
                  ) : (
                    <ListItemButton onClick={() => handleSubmenuClick(link.title)}>
                      <ListItemIcon>
                        {(() => {
                          const IconComponent = link.icon;
                          return <IconComponent color={isSubmenuOpen ? 'primary' : 'inherit'} />;
                        })()}
                      </ListItemIcon>
                      <ListItemText
                        primary={link.title}
                        primaryTypographyProps={{
                          color: isSubmenuOpen ? 'primary.main' : 'inherit',
                          fontWeight: isSubmenuOpen ? 'medium' : 'normal',
                        }}
                      />
                      {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  )}
                </ListItem>
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {link.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <ListItemButton
                          key={child.title}
                          component={Link}
                          href={child.href}
                          selected={isChildActive}
                          sx={{ pl: 4 }}
                          onClick={handleLinkClick}
                        >
                          {isLoading ? (
                            <Skeleton variant="text" width="80%" />
                          ) : (
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{
                                color: isChildActive ? 'primary.main' : 'inherit',
                                fontWeight: isChildActive ? 'medium' : 'normal',
                              }}
                            />
                          )}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItem key={link.title} disablePadding>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={48} />
              ) : (
                <ListItemButton
                  component={Link}
                  href={link.href || '#'}
                  selected={isActive}
                  onClick={handleLinkClick}
                >
                  <ListItemIcon>
                    {(() => {
                      const IconComponent = link.icon;
                      return <IconComponent color={isActive ? 'primary' : 'inherit'} />;
                    })()}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.title}
                    primaryTypographyProps={{
                      color: isActive ? 'primary.main' : 'inherit',
                      fontWeight: isActive ? 'medium' : 'normal',
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          );
        })}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px建 solid',
            borderColor: 'divider',
            height: 'calc(100vh - 64px - 64px)', // Subtract header and footer
            top: '64px', // Below header
            zIndex: 1000, // Below header (1100), below footer (1300)
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {drawer}
        </Box>
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100vh - 64px - 64px)', // Subtract header and footer
        position: 'fixed',
        top: '64px', // Below header
        zIndex: 1000, // Below header (1100), below footer (1300)
        overflowY: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {drawer}
      </Box>
    </Box>
  );
}