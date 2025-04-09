// InstantJob Employee Dashboard
// This file contains the main dashboard component for employees
// Built with TypeScript and Material UI

'use client'

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Avatar, 
  Box, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Badge, 
  IconButton,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';

// Import Material UI icons
import { 
  Dashboard as DashboardIcon, 
  Work as WorkIcon, 
  Notifications as NotificationsIcon, 
  Message as MessageIcon, 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Star as StarIcon, 
  Search as SearchIcon, 
  ExitToApp as LogoutIcon,
  BusinessCenter as BusinessCenterIcon,
  Timeline as TimelineIcon,
  Menu as MenuIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

// Define types for our data
interface Job {
  id: number;
  title: string;
  company: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
}

interface RecommendedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  matchPercentage: number;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface ProfileData {
  name: string;
  title: string;
  profileCompleteness: number;
  profileViews: number;
  connections: number;
}

// Sample data
const sampleJobs: Job[] = [
  { id: 1, title: 'Frontend Developer', company: 'Tech Solutions', status: 'Interview', date: '2025-03-28' },
  { id: 2, title: 'React Developer', company: 'Digital Innovations', status: 'Applied', date: '2025-04-02' },
  { id: 3, title: 'UI/UX Designer', company: 'Creative Design Co', status: 'Offer', date: '2025-03-20' },
  { id: 4, title: 'Full Stack Developer', company: 'WebTech Systems', status: 'Applied', date: '2025-04-05' },
];

const sampleRecommendedJobs: RecommendedJob[] = [
  { id: 1, title: 'Senior Frontend Developer', company: 'InnoTech', location: 'Remote', salary: '$90k-$120k', postedDate: '2025-04-05', matchPercentage: 92 },
  { id: 2, title: 'TypeScript Developer', company: 'SoftSys', location: 'New York', salary: '$95k-$115k', postedDate: '2025-04-06', matchPercentage: 87 },
  { id: 3, title: 'React Team Lead', company: 'WebFront', location: 'San Francisco', salary: '$120k-$150k', postedDate: '2025-04-07', matchPercentage: 81 },
  { id: 4, title: 'JavaScript Engineer', company: 'CodeCraft', location: 'Austin', salary: '$85k-$110k', postedDate: '2025-04-08', matchPercentage: 78 },
];

const sampleNotifications: Notification[] = [
  { id: 1, message: 'Your profile has been viewed by 5 recruiters this week', time: '2 hours ago', read: false },
  { id: 2, message: 'Interview scheduled with Tech Solutions', time: '1 day ago', read: true },
  { id: 3, message: 'Digital Innovations has responded to your application', time: '2 days ago', read: false },
];

const profileData: ProfileData = {
  name: 'Alex Johnson',
  title: 'Senior Frontend Developer',
  profileCompleteness: 85,
  profileViews: 47,
  connections: 325
};

// Main Dashboard Component
const EmployeeDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const drawer = (
    <div>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          InstantJob
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
          { text: 'My Applications', icon: <WorkIcon />, id: 'applications' },
          { text: 'Job Search', icon: <SearchIcon />, id: 'search' },
          { text: 'Messages', icon: <MessageIcon />, id: 'messages' },
          { text: 'My Profile', icon: <PersonIcon />, id: 'profile' },
        ].map((item) => (
          <ListItem 
            key={item.text} 
            selected={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            sx={{ 
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': { 
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 'bold',
                  color: 'primary.main',
                }
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        {[
          { text: 'Settings', icon: <SettingsIcon />, id: 'settings' },
          { text: 'Logout', icon: <LogoutIcon />, id: 'logout' },
        ].map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => setActiveTab(item.id)}
            sx={{ 
              borderRadius: 1,
              mx: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f7' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            InstantJob
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={sampleNotifications.filter(n => !n.read).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: theme.palette.secondary.main }}>AJ</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          mt: 8,
          overflowY: 'auto',
          height: `calc(100vh - 64px)`
        }}
      >
        {activeTab === 'dashboard' && (
          <DashboardContent 
            jobs={sampleJobs} 
            recommendedJobs={sampleRecommendedJobs} 
            notifications={sampleNotifications} 
            profileData={profileData} 
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
        {activeTab === 'applications' && <ApplicationsContent jobs={sampleJobs} />}
        {activeTab === 'search' && <SearchContent recommendedJobs={sampleRecommendedJobs} />}
        {activeTab === 'messages' && <MessagesContent />}
        {activeTab === 'profile' && <ProfileContent profileData={profileData} />}
        {activeTab === 'settings' && <SettingsContent />}
      </Box>
    </Box>
  );
};

// Dashboard Content Component
interface DashboardContentProps {
  jobs: Job[];
  recommendedJobs: RecommendedJob[];
  notifications: Notification[];
  profileData: ProfileData;
  isMobile: boolean;
  isTablet: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  jobs, 
  recommendedJobs, 
  notifications, 
  profileData,
  isMobile,
  isTablet
}) => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl" disableGutters sx={{ height: '100%' }}>
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {profileData.name}!
        </Typography>
        <Typography variant="body1">
          You have {jobs.filter(job => job.status === 'Interview').length} upcoming interviews and {notifications.filter(n => !n.read).length} unread notifications.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Profile Summary */}
        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 70, 
                  height: 70, 
                  mr: 2,
                  bgcolor: theme.palette.secondary.main,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                AJ
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.main">{profileData.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profileData.title}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>Profile completeness</Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', alignItems: 'center' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={profileData.profileCompleteness} 
                  size={70}
                  thickness={6}
                  sx={{ 
                    mr: 2,
                    color: theme.palette.success.main
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                  }}
                >
                  <Typography variant="body1" component="div" fontWeight="bold">
                    {`${profileData.profileCompleteness}%`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
                  <Typography variant="body2">
                    Complete your profile to attract more recruiters
                  </Typography>
                  <Button 
                    size="small" 
                    sx={{ 
                      alignSelf: 'flex-start', 
                      mt: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    Complete Now
                  </Button>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }}>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">{profileData.profileViews}</Typography>
                  <Typography variant="body2" color="text.secondary">Profile views</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1)
                }}>
                  <Typography variant="h5" fontWeight="bold" color="secondary.main">{profileData.connections}</Typography>
                  <Typography variant="body2" color="text.secondary">Connections</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 'auto', textAlign: 'center', pt: 3 }}>
              <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1
                }}
              >
                View Full Profile
              </Button>
            </Box>
          </Paper>
        </Grid> */}
        
        {/* Application Status */}
        
        
        {/* Job Recommendations */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" color="primary.main">
              Recommended Jobs For You
            </Typography>
            <Button 
              size="small" 
              endIcon={<SearchIcon />}
              sx={{ 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              View More
            </Button>
          </Box>
          <Grid container spacing={2}>
            {recommendedJobs.slice(0, isMobile ? 4 : isTablet ? 4 : 4).map((job) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                <Card sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Chip 
                        label={`${job.matchPercentage}% Match`} 
                        size="small" 
                        sx={{ fontWeight: '500' }}
                        color={
                          job.matchPercentage > 90 ? 'success' : 
                          job.matchPercentage > 80 ? 'primary' : 
                          'default'
                        }
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <BusinessCenterIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                      {job.company}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <FavoriteIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                        <strong>Location:</strong> {job.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Salary:</strong> {job.salary}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Posted:</strong> {job.postedDate}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.info.main, 0.2),
                        },
                        mr: 1
                      }}
                    >
                      View Job
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      sx={{ borderRadius: 2, flexGrow: 1 }}
                    >
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={8}>
          <Paper sx={{ 
            width: '100%',
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" color="primary.main">
                Your Application Status
              </Typography>
              <Button 
                size="small" 
                endIcon={<WorkIcon />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                      }
                    }}>
                      <TableCell sx={{ fontWeight: '500', color: theme.palette.primary.main }}>{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Chip 
                          label={job.status} 
                          size="small"
                          sx={{ fontWeight: '500' }}
                          color={
                            job.status === 'Offer' ? 'success' : 
                            job.status === 'Interview' ? 'primary' : 
                            job.status === 'Applied' ? 'info' : 
                            'warning'
                          }
                        />
                      </TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ borderRadius: 2 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid> */}
        
        {/* Recent Notifications */}
        {/* <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" color="primary.main">
                Recent Notifications
              </Typography>
              <Button 
                size="small" 
                endIcon={<NotificationsIcon />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                See All
              </Button>
            </Box>
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      px: 1, 
                      py: 1.5,
                      borderRadius: 1,
                      bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Badge color="error" variant="dot" invisible={notification.read}>
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: notification.read ? theme.palette.grey[200] : theme.palette.primary.light 
                          }}
                        >
                          <NotificationsIcon fontSize="small" />
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.time}
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        sx: { 
                          fontWeight: notification.read ? 'normal' : 'bold',
                          mb: 0.5
                        } 
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        sx: { color: theme.palette.text.secondary }
                      }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid> */}
        
        {/* Career Insights */}
        {/* <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <Typography variant="h6" component="h2" fontWeight="bold" color="primary.main" gutterBottom>
              Career Insights
            </Typography>
            <List>
              <ListItem sx={{ 
                px: 2, 
                py: 1.5,
                borderRadius: 2,
                mb: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <BusinessCenterIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Top skills in demand" 
                  secondary="TypeScript, React, Material UI are trending in your field" 
                  primaryTypographyProps={{ fontWeight: '500' }}
                />
              </ListItem>
              <ListItem sx={{ 
                px: 2, 
                py: 1.5,
                borderRadius: 2,
                mb: 1.5,
                bgcolor: alpha(theme.palette.secondary.main, 0.05)
              }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                    <TimelineIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Salary trends" 
                  secondary="Average salary for your role has increased by 5% in the last quarter" 
                  primaryTypographyProps={{ fontWeight: '500' }}
                />
              </ListItem>
              <ListItem sx={{ 
                px: 2, 
                py: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.05)
              }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                    <StarIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary="Career development" 
                  secondary="5 recommended courses to advance your career" 
                  primaryTypographyProps={{ fontWeight: '500' }}
                />
              </ListItem>
            </List>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                color="secondary"
                sx={{ borderRadius: 2, px: 3 }}
              >
                View Career Report
              </Button>
            </Box>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
};

// Applications Content Component
interface ApplicationsContentProps {
  jobs: Job[];
}

const ApplicationsContent: React.FC<ApplicationsContentProps> = ({ jobs }) => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Applications
        </Typography>
        <Typography variant="body1">
          Track and manage all your job applications in one place
        </Typography>
      </Box>
      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary.main">Application History</Typography>
          <Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<WorkIcon />}
              sx={{ borderRadius: 2 }}
            >
              New Application
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Applied</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                  }
                }}>
                  <TableCell sx={{ fontWeight: '500', color: theme.palette.primary.main }}>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      sx={{ fontWeight: '500' }}
                      color={
                        job.status === 'Offer' ? 'success' : 
                        job.status === 'Interview' ? 'primary' : 
                        job.status === 'Applied' ? 'info' : 
                        'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        mr: 1
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small" 
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.info.main, 0.2),
                        }
                      }}
                    >
                      Notes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

// Search Content Component
interface SearchContentProps {
  recommendedJobs: RecommendedJob[];
}

const SearchContent: React.FC<SearchContentProps> = ({ recommendedJobs }) => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Job Search
        </Typography>
        <Typography variant="body1">
          Find your next career opportunity
        </Typography>
      </Box>
      
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        {/* Enhanced search implementation */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold">Keywords</Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              p: 1
            }}>
              <SearchIcon sx={{ color: theme.palette.grey[600], mt: 1 }} />
              <Box sx={{ flexGrow: 1 }}>
                <input 
                  type="text" 
                  placeholder="Job title, skills, or company" 
                  style={{ 
                    width: '100%', 
                    padding: '10px',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '16px'
                  }} 
                />
              </Box>
              <Button 
                variant="contained" 
                sx={{ borderRadius: 2 }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" fontWeight="bold" color="primary.main">
          Recommended Jobs
        </Typography>
        <Button 
          size="small" 
          endIcon={<FavoriteIcon />}
          sx={{ 
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          Saved Jobs
        </Button>
      </Box>
      <Grid container spacing={2}>
        {recommendedJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                    {job.title}
                  </Typography>
                  <Chip 
                    label={`${job.matchPercentage}% Match`} 
                    size="small" 
                    sx={{ fontWeight: '500' }}
                    color={
                      job.matchPercentage > 90 ? 'success' : 
                      job.matchPercentage > 80 ? 'primary' : 
                      'default'
                    }
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <BusinessCenterIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                  {job.company}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.grey[600] }} />
                    <strong>Location:</strong> {job.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Salary:</strong> {job.salary}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Posted:</strong> {job.postedDate}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.info.main, 0.2),
                    },
                    mr: 1
                  }}
                >
                  View Job
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="primary"
                  sx={{ borderRadius: 2, flexGrow: 1 }}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Messages Content Component
const MessagesContent: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Messages
        </Typography>
        <Typography variant="body1">
          Connect with recruiters and companies
        </Typography>
      </Box>
      <Paper sx={{ 
        p: 3, 
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10
      }}>
        <MessageIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          No Messages Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          Start connecting with recruiters or companies to receive messages
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Explore Connections
        </Button>
      </Paper>
    </Container>
  );
};

// Profile Content Component
interface ProfileContentProps {
  profileData: ProfileData;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profileData }) => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Profile
        </Typography>
        <Typography variant="body1">
          Manage your professional identity
        </Typography>
      </Box>
      
      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              bgcolor: theme.palette.secondary.main,
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            AJ
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">{profileData.name}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{profileData.title}</Typography>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                borderRadius: 2,
                mr: 1
              }}
            >
              Edit Profile
            </Button>
            <Button 
              size="small" 
              sx={{ 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              View Public Profile
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          mb: 3
        }}>
          <CircularProgress 
            variant="determinate" 
            value={profileData.profileCompleteness} 
            size={60}
            thickness={5}
            sx={{ 
              mr: 2,
              color: theme.palette.success.main
            }}
          />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Your profile is {profileData.profileCompleteness}% complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete your profile to increase visibility to recruiters
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ 
              ml: 'auto',
              borderRadius: 2
            }}
          >
            Complete Now
          </Button>
        </Box>
        
        <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
          Additional profile sections will appear here
        </Typography>
      </Paper>
    </Container>
  );
};

// Settings Content Component
const SettingsContent: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Settings
        </Typography>
        <Typography variant="body1">
          Manage your account preferences
        </Typography>
      </Box>
      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          Account Settings
        </Typography>
        <List>
          <ListItem sx={{ 
            px: 2, 
            py: 1.5,
            borderRadius: 2,
            mb: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Profile Settings" 
              secondary="Update your personal information and visibility" 
              primaryTypographyProps={{ fontWeight: '500' }}
            />
            <Button 
              variant="outlined" 
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>
          </ListItem>
          <ListItem sx={{ 
            px: 2, 
            py: 1.5,
            borderRadius: 2,
            mb: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Notification Preferences" 
              secondary="Control what notifications you receive" 
              primaryTypographyProps={{ fontWeight: '500' }}
            />
            <Button 
              variant="outlined" 
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>
          </ListItem>
          <ListItem sx={{ 
            px: 2, 
            py: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Account Security" 
              secondary="Update password and security settings" 
              primaryTypographyProps={{ fontWeight: '500' }}
            />
            <Button 
              variant="outlined" 
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default EmployeeDashboard;