import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Mail,
  Phone,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import Navbar from './Navbar';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 20, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Database size={20} />,
      content: [
        "Personal information you provide during account registration (name, email, phone number)",
        "Professional information including resumes, job applications, and work history",
        "Usage data and analytics to improve our platform performance",
        "Device information and IP addresses for security purposes",
        "Communication records between users and employers on our platform"
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <Eye size={20} />,
      content: [
        "To provide and maintain our job matching services",
        "To facilitate communication between job seekers and employers",
        "To send important notifications about your account and job opportunities",
        "To improve our platform features and user experience",
        "To ensure platform security and prevent fraudulent activities"
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <Users size={20} />,
      content: [
        "With employers when you apply for positions or express interest",
        "With service providers who assist in platform operations",
        "When required by law or to protect our legal rights",
        "In connection with business transfers or acquisitions",
        "With your explicit consent for specific purposes"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock size={20} />,
      content: [
        "Industry-standard encryption for data transmission and storage",
        "Regular security audits and vulnerability assessments",
        "Secure authentication and account protection measures",
        "Limited access to personal data on a need-to-know basis",
        "Incident response procedures for potential data breaches"
      ]
    }
  ];

  return (
    <>
    <Navbar/>
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa',mt: 10 }}>
      {/* Header */}
      <Box sx={{ 
        background: '#a87b7e',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Shield size={32} style={{ marginRight: 16 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Privacy Policy
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px' }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information on instantjob.in.
          </Typography>
          <Chip 
            label={`Last Updated: ${lastUpdated}`}
            sx={{ 
              mt: 2, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Welcome to instantjob.in
          </Typography>
          <Typography variant="body1" paragraph>
            This Privacy Policy describes how Number11 ("we," "our," or "us") collects, uses, and protects your personal information when you use our website and services. By accessing or using instantjob.in, you agree to the practices described in this Privacy Policy.
          </Typography>
          <Typography variant="body1">
            We are committed to protecting your privacy and ensuring transparency in how we handle your personal data. If you have any questions about this policy, please contact us using the information provided at the end of this document.
          </Typography>
        </Paper>

        {/* Privacy Sections */}
        {sections.map((section, index) => (
          <Paper key={section.id} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 3, 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#667eea',
                color: 'white',
                mr: 2
              }}>
                {section.icon}
              </Box>
              <Typography variant="h6" fontWeight="600">
                {section.title}
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <List sx={{ p: 0 }}>
                {section.content.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ px: 0, py: 1 }}>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: { lineHeight: 1.6 }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        ))}

        {/* User Rights */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to access, update, or delete your personal information at any time through your account settings. You may also:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Request a copy of all personal data we have about you" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ask us to correct or update inaccurate information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Request deletion of your account and associated data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Opt out of non-essential communications" />
            </ListItem>
          </List>
        </Paper>

        {/* Data Retention */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Account information is typically retained for the duration of your account plus a reasonable period thereafter for legal and business purposes.
          </Typography>
          <Typography variant="body1">
            If you delete your account, we will remove your personal information within 30 days, except where we are required to retain certain information for legal compliance.
          </Typography>
        </Paper>

        {/* Updates to Policy */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date.
          </Typography>
          <Typography variant="body1">
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
          </Typography>
        </Paper>

        {/* Contact Information */}
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Mail size={20} style={{ marginRight: 12, color: '#667eea' }} />
              <Typography variant="body1">support@instantjob.in</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone size={20} style={{ marginRight: 12, color: '#667eea' }} />
              <Typography variant="body1">0120-4461787</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MapPin size={20} style={{ marginRight: 12, color: '#667eea' }} />
              <Typography variant="body1">911, 9th Floor, Tower-B, Advant IT Park, Sector-142, Noida, U.P.-201305</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Link href='/contact'>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#667eea',
                '&:hover': { backgroundColor: '#5a67d8' },
                borderRadius: 2,
                px: 3
              }}
            >
              Contact Support
            </Button>
            </Link>
          </Box>
        </Paper>

        
      </Container>
    </Box>
    </>
  );
};

export default PrivacyPolicyPage;