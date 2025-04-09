import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const featuredJobs = [
    { title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Bangalore', salary: '₹20-30 LPA', type: 'Full-time', postedDate: '2 days ago' },
    { title: 'Product Manager', company: 'InnovateTech', location: 'Mumbai', salary: '₹18-25 LPA', type: 'Full-time', postedDate: '1 day ago' },
    { title: 'UX Designer', company: 'DesignWave', location: 'Delhi', salary: '₹15-22 LPA', type: 'Remote', postedDate: '3 days ago' },
    { title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Bangalore', salary: '₹20-30 LPA', type: 'Full-time', postedDate: '2 days ago' },
    { title: 'Product Manager', company: 'InnovateTech', location: 'Mumbai', salary: '₹18-25 LPA', type: 'Full-time', postedDate: '1 day ago' },
    { title: 'UX Designer', company: 'DesignWave', location: 'Delhi', salary: '₹15-22 LPA', type: 'Remote', postedDate: '3 days ago' },
  ];

  const topCategories = [
    { name: 'Information Technology', count: 2845, icon: <WorkIcon /> },
    { name: 'Marketing & Sales', count: 1432, icon: <TrendingUpIcon /> },
    { name: 'Finance & Banking', count: 976, icon: <BusinessCenterIcon /> },
    { name: 'Human Resources', count: 658, icon: <PeopleIcon /> },
  ];

  return (
    <>
    <Navbar/>
      <Box 
        sx={{ 
          background: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
          pt: { xs: 6, md: 12 }, 
          pb: { xs: 6, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
          }}
        >
          <Image 
            src="/images/1.png" 
            alt="Background pattern" 
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid 
  container 
  spacing={4}
  sx={{ 
    minHeight: '60vh', // Full viewport height
    alignItems: 'center', // Vertically center
    justifyContent: 'center', // Horizontally center
    textAlign: 'center', 
    px: 2, // Optional horizontal padding
  }}
>
  <Grid item xs={12} md={7}>
    <Typography 
      variant="h2" 
      component="h1" 
      sx={{ 
        fontWeight: 'bold', 
        mb: 2, 
        color: 'white',
        fontSize: { xs: '2rem', md: '3.5rem' },
      }}
    >
      Find Your Dream Job Instantly
    </Typography>
    <Typography variant="h5" sx={{ mb: 4, color: 'white', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
      Connect with top employers and get hired faster
    </Typography>
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 1, md: 2 }, 
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Job title, keywords, or company"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Location"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ height: { xs: 'auto', md: '100%' }, py: { xs: 1, md: 1.5 } }}
          >
            Search Jobs
          </Button>
        </Grid>
      </Grid>
    </Paper>

    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
      <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
        Popular searches:
      </Typography>
      {['Remote', 'Full-time', 'Part-time', 'Internship', 'IT Jobs'].map((term) => (
        <Chip 
          key={term} 
          label={term} 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)', 
            color: 'white',
            '&:hover': { 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            } 
          }} 
        />
      ))}
    </Box>
  </Grid>

  {/* Right Side Image */}
  <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
    <Box sx={{ position: 'relative', height: 400 }}>
      <Image 
        src="/api/placeholder/600/400" 
        alt="People finding jobs" 
        fill
        style={{ objectFit: 'contain' }}
      />
    </Box>
  </Grid>
</Grid>

        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Browse Jobs by Category
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore opportunities in top industries across India
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {topCategories.map((category) => (
            <Grid xs={12} sm={6} md={3} key={category.name}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'all 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  } 
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: 'primary.main', fontSize: 40 }}>
                    {category.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h3">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count.toLocaleString()} jobs available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Featured Job Openings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Handpicked opportunities from top companies
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {featuredJobs.map((job, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {job.company}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        backgroundColor: 'grey.200', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="subtitle2">{job.company.charAt(0)}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BusinessCenterIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.salary} • {job.type}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip size="small" label={job.postedDate} />
                      <Button variant="outlined" size="small">Apply Now</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="large">
              View All Jobs
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box sx={{ position: 'relative', height: { xs: 300, md: 400 } }}>
              <Image 
                src="/api/placeholder/600/400" 
                alt="For employers" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Grid>
          <Grid xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Are You an Employer?
            </Typography>
            <Typography variant="body1" paragraph>
              Post jobs, screen applicants, and find the perfect match for your company. 
              Access India's largest talent pool and hire faster with InstantJob.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary" size="large">
                Post a Job
              </Button>
              <Button variant="outlined" color="primary" size="large">
                Learn More
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Get Instant Job Alerts
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Be the first to know about new opportunities matching your skills and preferences.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <TextField
                  placeholder="Enter your email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ 
                    bgcolor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  size="medium"
                  sx={{ 
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                    whiteSpace: 'nowrap',
                    mt: { xs: 1, sm: 0 }
                  }}
                >
                  Subscribe Now
                </Button>
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>
    </>
  );
}