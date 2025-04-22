// File: app/admin-dashboard/page.tsx (for Next.js App Router)
// or: pages/admin-dashboard.tsx (for Next.js Pages Router)

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline,
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  Container, 
  Grid, 
  Paper, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Card, 
  CardContent, 
  Badge, 
  Avatar, 
  Button,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ThemeProvider,
  createTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5E35B1', // Deep purple
    },
    secondary: {
      main: '#FF5722', // Deep orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});

// Mock data
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Delhi, India',
    type: 'Contract',
    salary: '$100-200$',
    applications: 12,
    status: 'Active',
    posted: '3 days ago'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudNative',
    location: 'Mumbai, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 8,
    status: 'Review',
    posted: '5 days ago'
  },
  {
    id: 5,
    title: 'Product Manager',
    company: 'GrowthLabs',
    location: 'Hyderabad, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 15,
    status: 'Active',
    posted: '4 days ago'
  }
];

const candidates = [
  { id: 1, name: 'Raj Sharma', role: 'Frontend Developer', status: 'Shortlisted', applied: '2 days ago' },
  { id: 2, name: 'Priya Singh', role: 'UX Designer', status: 'New', applied: '1 day ago' },
  { id: 3, name: 'Arun Kumar', role: 'Backend Developer', status: 'Interviewed', applied: '5 days ago' }
];

const drawerWidth = 240;

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    // Check authentication when component mounts
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    
    if (role !== 'admin') {
      // Redirect to appropriate dashboard based on role
      if (role === 'employer') {
        router.push('/employer-dashboard');
      } else if (role === 'jobseeker') {
        router.push('/jobseeker-dashboard');
      }
      return;
    }
    
    // Set user role from localStorage
    setUserRole(role || '');
    
    // Simulate fetching user data
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [router]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Redirect to login page
    router.push('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'primary.dark',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          InstantJob Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {[
          { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'jobs', text: 'Jobs', icon: <WorkIcon /> },
          { id: 'candidates', text: 'Candidates', icon: <PeopleIcon /> },
          { id: 'employers', text: 'Employers', icon: <BusinessIcon /> },
        
          
        ].map((item) => (
          <ListItem 
            button 
            key={item.id} 
            selected={activeTab === item.id}
            onClick={() => handleTabChange(item.id)}
          >
            <ListItemIcon sx={{ color: activeTab === item.id ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                color: activeTab === item.id ? 'primary.main' : 'inherit'
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Review': return 'warning';
      case 'Paused': return 'error';
      case 'Shortlisted': return 'success';
      case 'New': return 'info';
      case 'Interviewed': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  const renderDashboardContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Stats cards */}
            <Grid  container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total Jobs', value: '156', change: '+12%', changeType: 'positive', icon: <WorkIcon fontSize="large" />, color: '#5E35B1' },
                { title: 'Active Candidates', value: '1,284', change: '+18%', changeType: 'positive', icon: <PeopleIcon fontSize="large" />, color: '#4CAF50' },
                { title: 'Employers', value: '86', change: '+5%', changeType: 'positive', icon: <BusinessIcon fontSize="large" />, color: '#9C27B0' },
                { title: 'New Applications', value: '38', change: '-4%', changeType: 'negative', icon: <AssessmentIcon fontSize="large" />, color: '#FF9800' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                          {stat.icon}
                        </Avatar>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: stat.changeType === 'positive' ? 'success.main' : 'error.main'
                        }}
                      >
                        {stat.changeType === 'positive' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                        {stat.change} from last month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Recent Job Listings */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Card sx={{width:"1000px"}}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="div">
                        Recent Job Listings
                      </Typography>
                      <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                        Add New Job
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Applications</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Posted</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {jobs.map((job) => (
                            <TableRow key={job.id}>
                              <TableCell>
                                <Typography variant="subtitle2">{job.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{job.type}</Typography>
                              </TableCell>
                              <TableCell>{job.company}</TableCell>
                              <TableCell>{job.location}</TableCell>
                              <TableCell>{job.applications}</TableCell>
                              <TableCell>{job.salary}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={job.status} 
                                  size="small" 
                                  color={getStatusColor(job.status)}
                                />
                              </TableCell>
                              <TableCell>{job.posted}</TableCell>
                              <TableCell>
                                <IconButton size="small" color="primary">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Recent Candidates and Activity */}
            <Grid container spacing={3} sx={{mb:5}}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="div">
                        Recent Candidates
                      </Typography>
                      <Button color="primary">View All</Button>
                    </Box>
                    <List sx={{ p: 0 }}>
                      {candidates.map((candidate) => (
                        <ListItem key={candidate.id} sx={{ px: 0, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>{candidate.name.charAt(0)}</Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2">{candidate.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{candidate.role}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <Chip 
                                label={candidate.status} 
                                size="small" 
                                color={getStatusColor(candidate.status)}
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">{candidate.applied}</Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
             
            </Grid>
          </>
        );
        
      case 'jobs':
        return (
          <Card sx={{width: '150%',mb: 5}}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Job Management</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                  Add New Job
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage all job listings across the platform. You can add, edit, or remove job postings.
              </Typography>
              {/* Job management content would go here */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job ID</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Posted Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Applications</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>#{job.id}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.posted}</TableCell>
                        <TableCell>
                          <Chip 
                            label={job.status} 
                            size="small" 
                            color={getStatusColor(job.status)}
                          />
                        </TableCell>
                        <TableCell>{job.applications}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );
        
      case 'candidates':
        return (
          <Card sx={{width: '180%'}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Candidate Management</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage all registered candidates, their applications, and profiles.
              </Typography>
              {/* Candidate management content would go here */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Applied</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>#{candidate.id}</TableCell>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell>{candidate.role}</TableCell>
                        <TableCell>
                          <Chip 
                            label={candidate.status} 
                            size="small" 
                            color={getStatusColor(candidate.status)}
                          />
                        </TableCell>
                        <TableCell>{candidate.applied}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );
        
      case 'employers':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Employer Management</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage company accounts, verify employers, and review company information.
              </Typography>
              {/* Employer management content would go here */}
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                Employer management content will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        );
        
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Platform Settings</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure platform settings, user permissions, and notification preferences.
              </Typography>
              {/* Settings content would go here */}
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                Settings options will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            // ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
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
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: 'grey.100',
                borderRadius: 2,
                p: '4px 8px',
                width: 300,
                mr: 'auto',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Title,Company,Location"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }}
            >
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Typography>
           
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {userName.charAt(0)}
              </Avatar>
              <Typography variant="subtitle2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                {userName}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
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
            mr: 100,
            width: 1000,
            backgroundColor: 'background.default',
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="text.primary" gutterBottom>
                {activeTab === 'dashboard' ? 'Welcome back, Admin!' : (
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                )}
              </Typography>
              {activeTab === 'dashboard' && (
                <Typography variant="body1" color="text.secondary">
                  Here's what's happening with your job portal today.
                </Typography>
              )}
            </Box>
            
            {renderDashboardContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}