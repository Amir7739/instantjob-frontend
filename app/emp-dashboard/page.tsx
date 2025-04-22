// InstantJob Employee Dashboard
// File: Dashboard.tsx

'use client'

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  LinearProgress,
  useTheme,
  createTheme,
  ThemeProvider,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work,
  People,
  Notifications,
  Search,
  Person,
  ExitToApp,
  Star,
  Business,
  AccountCircle,
  AttachMoney,
  Schedule,
  Message,
  CalendarToday,
  MoreVert,
  Settings,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LocationOn
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Custom theme with InstantJob brand colors
const instantJobTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Primary brand color
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057', // Secondary accent color
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Interfaces for type safety
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected';
  logo: string;
  description: string;
  requirements: string[];
}

interface Notification {
  id: number;
  message: string;
  time: string;
  isRead: boolean;
}

interface Skill {
  name: string;
  level: number;
}

const Dashboard: React.FC = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const theme = useTheme();

  const router = useRouter(); 

  const handleLogOut = ()=> {
    localStorage.removeItem('token'),
      localStorage.removeItem('role');

      router.push('/')
    
  }
  
  const handleExpandJob = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };
  
  // Mock data loading
  useEffect(() => {
    // Simulating API fetch with mock data
    setJobs([
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechGlobal',
        location: 'Remote',
        salary: '$110,000 - $130,000',
        postedDate: '2 days ago',
        status: 'Interview',
        logo: 'https://via.placeholder.com/40',
        description: 'We are looking for a Senior Frontend Developer who is proficient with React.js and has a strong understanding of frontend architecture. The ideal candidate will have experience building scalable web applications and working with modern JavaScript frameworks.',
        requirements: [
          'Minimum 5 years of experience with frontend technologies',
          'Strong proficiency in JavaScript, HTML, CSS, and React.js',
          'Experience with state management libraries (Redux, MobX)',
          'Understanding of responsive design and cross-browser compatibility',
          'Experience with testing frameworks like Jest'
        ]
      },
      {
        id: 2,
        title: 'Full Stack Engineer',
        company: 'InstantSoft',
        location: 'New York, NY',
        salary: '$130,000 - $150,000',
        postedDate: '1 week ago',
        status: 'Shortlisted',
        logo: 'https://via.placeholder.com/40',
        description: 'InstantSoft is seeking a Full Stack Engineer to join our development team. You will be working on our core products, developing new features, and maintaining existing ones. The ideal candidate should be comfortable with both frontend and backend technologies.',
        requirements: [
          'Experience with JavaScript/TypeScript, React, and Node.js',
          'Familiarity with databases (SQL, NoSQL)',
          'Understanding of RESTful APIs and microservices',
          'Knowledge of cloud platforms (AWS, Azure)',
          'Experience with CI/CD pipelines'
        ]
      },
      {
        id: 3,
        title: 'Product Manager',
        company: 'ConnectTech',
        location: 'San Francisco, CA',
        salary: '$120,000 - $140,000',
        postedDate: '3 days ago',
        status: 'Applied',
        logo: 'https://via.placeholder.com/40',
        description: 'ConnectTech is looking for a Product Manager to lead our product development initiatives. The ideal candidate will work closely with engineering, design, and marketing teams to define product vision and roadmap.',
        requirements: [
          'Bachelor degree in Business, Computer Science, or related field',
          '3+ years of product management experience',
          'Experience with agile methodologies',
          'Strong analytical and problem-solving skills',
          'Excellent communication and stakeholder management abilities'
        ]
      },
      {
        id: 4,
        title: 'UX Designer',
        company: 'Design Masters',
        location: 'Seattle, WA',
        salary: '$100,000 - $120,000',
        postedDate: '5 days ago',
        status: 'Offered',
        logo: 'https://via.placeholder.com/40',
        description: 'Design Masters is seeking a UX Designer to create intuitive and engaging user experiences. You will be responsible for understanding user needs, designing wireframes, prototypes, and working closely with developers.',
        requirements: [
          'Portfolio showcasing UX design projects',
          'Proficiency in design tools (Figma, Sketch, Adobe XD)',
          'Experience conducting user research and usability testing',
          'Understanding of information architecture and design systems',
          'Strong problem-solving and communication skills'
        ]
      },
      {
        id: 5,
        title: 'UX Designer',
        company: 'Design Masters',
        location: 'Seattle, WA',
        salary: '$100,000 - $120,000',
        postedDate: '5 days ago',
        status: 'Offered',
        logo: 'https://via.placeholder.com/40',
        description: 'Design Masters is seeking a UX Designer to create intuitive and engaging user experiences. You will be responsible for understanding user needs, designing wireframes, prototypes, and working closely with developers.',
        requirements: [
          'Portfolio showcasing UX design projects',
          'Proficiency in design tools (Figma, Sketch, Adobe XD)',
          'Experience conducting user research and usability testing',
          'Understanding of information architecture and design systems',
          'Strong problem-solving and communication skills'
        ]
      },
      {
        id: 6,
        title: 'UX Designer',
        company: 'Design Masters',
        location: 'Seattle, WA',
        salary: '$100,000 - $120,000',
        postedDate: '5 days ago',
        status: 'Offered',
        logo: 'https://via.placeholder.com/40',
        description: 'Design Masters is seeking a UX Designer to create intuitive and engaging user experiences. You will be responsible for understanding user needs, designing wireframes, prototypes, and working closely with developers.',
        requirements: [
          'Portfolio showcasing UX design projects',
          'Proficiency in design tools (Figma, Sketch, Adobe XD)',
          'Experience conducting user research and usability testing',
          'Understanding of information architecture and design systems',
          'Strong problem-solving and communication skills'
        ]
      }
    ]);

    setNotifications([
      {
        id: 1,
        message: 'Your application for Full Stack Engineer at InstantSoft has been shortlisted',
        time: '2 hours ago',
        isRead: false
      },
      {
        id: 2,
        message: 'Interview scheduled for Senior Frontend Developer at TechGlobal on Friday at 2 PM',
        time: '1 day ago',
        isRead: false
      },
      {
        id: 3,
        message: 'Design Masters has viewed your profile',
        time: '3 days ago',
        isRead: true
      }
    ]);
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return theme.palette.info.main;
      case 'Shortlisted':
        return theme.palette.warning.main;
      case 'Interview':
        return theme.palette.secondary.main;
      case 'Offered':
        return theme.palette.success.main;
      case 'Rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const skills: Skill[] = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'MongoDB', level: 70 },
  ];

  // Profile component that stays consistent on the left side
  const ProfileSection = () => (
    <Paper sx={{ p: 3, height: '100%' }}>
      {/* Profile Content */}
      <Box sx={{ textAlign: 'center' }}>
        <Avatar
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: theme.palette.primary.main }}
        >
          <Person sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          John Smith
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Senior Frontend Developer
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip 
            icon={<Business />} 
            label="5 years experience" 
            size="small" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            icon={<Star />} 
            label="Top Rated" 
            size="small" 
            color="primary" 
          />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Skills
        </Typography>
        {skills.map((skill) => (
          <Box key={skill.name} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{skill.name}</Typography>
              <Typography variant="body2">{skill.level}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={skill.level} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        ))}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Contact Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">New York, NY (Remote)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Message fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">john.smith@example.com</Typography>
        </Box>
      </Box>
      
      <Button 
        variant="outlined" 
        startIcon={<Settings />}
        fullWidth
        sx={{ mt: 2 }}
      >
        Edit Profile
      </Button>
    </Paper>
  );

  // Dashboard Tab Content
  const DashboardContent = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" align="center">10</Typography>
            <Typography variant="body2" align="center" color="text.secondary">Applied Jobs</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(245, 0, 87, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" align="center">4</Typography>
            <Typography variant="body2" align="center" color="text.secondary">Interviews</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" align="center">2</Typography>
            <Typography variant="body2" align="center" color="text.secondary">Offers</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" align="center">25</Typography>
            <Typography variant="body2" align="center" color="text.secondary">Profile Views</Typography>
          </Paper>
        </Grid>
  
        
        
        {/* All Jobs - modified to show 2 cards per row */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              All Jobs
            </Typography>
            <Button size="small" color="primary">View More</Button>
          </Box>
          
          <Grid container spacing={2}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} key={job.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={job.logo} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1">{job.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Chip 
                        label={job.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getStatusColor(job.status) + '20',
                          color: getStatusColor(job.status),
                          fontWeight: 500
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{job.salary}</Typography>
                    </Box>
                    
                    <Typography variant="caption" display="block">
                      Posted {job.postedDate}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleExpandJob(job.id)}
                        endIcon={expandedJobId === job.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      >
                        {expandedJobId === job.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </Box>
                    
                    <Collapse in={expandedJobId === job.id}>
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Job Description
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {job.description}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Requirements
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {job.requirements.map((req, index) => (
                            <Typography component="li" variant="body2" key={index}>
                              {req}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">Apply Now</Button>
                    <Button size="small">Save Job</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
  // Applications Tab Content
  const ApplicationsContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Job Applications
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={0}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All (10)" />
          <Tab label="Applied (3)" />
          <Tab label="Shortlisted (2)" />
          <Tab label="Interviews (4)" />
          <Tab label="Offers (2)" />
          <Tab label="Rejected (1)" />
        </Tabs>
      </Box>
      
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={job.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={job.logo} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1">{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Chip 
                    label={job.status} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getStatusColor(job.status) + '20',
                      color: getStatusColor(job.status),
                      fontWeight: 500
                    }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{job.salary}</Typography>
                </Box>
                
                <Typography variant="caption" display="block">
                  Applied {job.postedDate}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => handleExpandJob(job.id)}
                    endIcon={expandedJobId === job.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  >
                    {expandedJobId === job.id ? 'Hide Details' : 'View Details'}
                  </Button>
                </Box>
                
                <Collapse in={expandedJobId === job.id}>
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Job Description
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {job.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Requirements
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {job.requirements.map((req, index) => (
                        <Typography component="li" variant="body2" key={index}>
                          {req}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">View Application</Button>
                <Button size="small">Withdraw</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Messages Tab Content
  const MessagesContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Messages
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        You have no unread messages at this time.
      </Typography>
    </Box>
  );

  // Network Tab Content
  const NetworkContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Professional Network
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: theme.palette.primary.main }}>
                <Person />
              </Avatar>
              <Typography variant="h6">Sarah Johnson</Typography>
              <Typography variant="body2" color="text.secondary">
                Senior Recruiter at TechGlobal
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ mt: 2 }}
              >
                Message
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: theme.palette.secondary.main }}>
                <Person />
              </Avatar>
              <Typography variant="h6">Michael Wong</Typography>
              <Typography variant="body2" color="text.secondary">
                Tech Lead at InstantSoft
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ mt: 2 }}
              >
                Message
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: theme.palette.warning.main }}>
                <Person />
              </Avatar>
              <Typography variant="h6">Lisa Chen</Typography>
              <Typography variant="body2" color="text.secondary">
                UX Director at Design Masters
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ mt: 2 }}
              >
                Message
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Main Tab Content based on selected tab
  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <DashboardContent />;
      case 1:
        return <ApplicationsContent />;
      case 2:
        return <MessagesContent />;
      case 3:
        return <NetworkContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <ThemeProvider theme={instantJobTheme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              InstantJob
            </Typography>
            <IconButton color="inherit">
              <Search />
            </IconButton>
            <IconButton 
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Profile dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
          <MenuItem onClick={handleLogOut}>Logout</MenuItem>
        </Menu>

        {/* Notifications dropdown */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleMenuClose} sx={{ 
              backgroundColor: notification.isRead ? 'inherit' : 'rgba(63, 81, 181, 0.08)',
              py: 1.5
            }}>
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">View All Notifications</Typography>
          </MenuItem>
        </Menu>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab icon={<DashboardIcon />} label="Dashboard" />
              <Tab icon={<Work />} label="Applications" />
              <Tab icon={<Message />} label="Messages" />
              <Tab icon={<People />} label="Network" />
            </Tabs>
          </Paper>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Left sidebar with profile - fixed for all tabs */}
            <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%' }, mb: { xs: 3, sm: 0 }, mr: { sm: 3 } }}>
              <ProfileSection />
            </Box>

            {/* Right content area - changes based on tab */}
            <Box sx={{ width: { xs: '100%', sm: '70%', md: '75%' }, flexGrow: 1 }}>
              <Paper>
                {renderTabContent()}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;