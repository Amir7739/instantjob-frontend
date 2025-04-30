'use client'

import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, AppBar, Toolbar, Button } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// Styled components for custom styling
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#c48484',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0),
  },
}));

const TeamCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginTop: theme.spacing(4),
}));

// Team data (replace with your actual team data)
const teamMembers = [
  {
    name: 'Aaditya',
    role: 'Founder & CEO',
    image: 'https://via.placeholder.com/150',
  },

  {
    name: 'Kiran',
    role: 'Founder & CEO',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Pramod',
    role: 'Co-Founder',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Pratibha',
    role: 'Head of Operations',
    image: 'https://via.placeholder.com/150',
  },

  {
    name: 'Jyoti',
    role: 'Hr Manager',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Amir',
    role: 'Full Stack Developer',
    image: 'https://via.placeholder.com/150',
  },


];

const AboutPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <Navbar/>

      {/* Hero Section */}
      <HeroSection style={{marginTop: 60}}>
        <Container>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            About Us
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, margin: 'auto' }}>
            We are dedicated to connecting job seekers with their dream jobs and helping employers find the perfect talent instantly.
          </Typography>
        </Container>
      </HeroSection>

      {/* Mission Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" align="center" sx={{ maxWidth: 800, margin: 'auto', mb: 4 }}>
          At Instant Job Portal, our mission is to simplify the job search process by providing a seamless platform that bridges the gap between talent and opportunity. We strive to empower individuals and organizations with the tools they need to succeed in today’s dynamic job market.
        </Typography>
      </Container>

      {/* Team Section */}
      <Container sx={{ py: 8, bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Meet Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TeamCard>
                <CardMedia
                  component="img"
                  height="150"
                  image={member.image}
                  alt={member.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {member.role}
                  </Typography>
                </CardContent>
              </TeamCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default AboutPage;