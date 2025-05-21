'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Paper, Avatar, Grid, Chip, Button, CircularProgress } from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { fetchEmployerById } from "@/services/eployersApi";

const EmployerProfileForAdmin = () => {
  const { id } = useParams();
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployer = async () => {
      setLoading(true);
      try {
        const employerData = await fetchEmployerById(id as string);
        setEmployer(employerData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch employer details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadEmployer();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!employer) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>No employer found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Avatar
            src={employer.companyLogo || undefined}
            sx={{ width: 100, height: 100, mr: { md: 3 }, mb: { xs: 2, md: 0 } }}
          >
            <BusinessIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {employer.companyName}
            </Typography>
            <Chip
              label={employer.verified ? "Verified" : "Non-Verified"}
              color={employer.verified ? "success" : "error"}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        {/* Details Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Email:</strong> {employer.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Phone:</strong> {employer.contactNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Location:</strong> {employer.location}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Website:</strong>{" "}
                {employer.website ? (
                  <a href={employer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {employer.website}
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Industry:</strong> {employer.industry}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1, color: '#5e35b1' }} />
              <Typography variant="body1">
                <strong>Company Size:</strong> {employer.companySize}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {employer.bio || "No bio available"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Registered:</strong> {new Date(employer.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Last Updated:</strong> {new Date(employer.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#5e35b1', borderRadius: 2 }}
            onClick={() => window.history.back()}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployerProfileForAdmin;