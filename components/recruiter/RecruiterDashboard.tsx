'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Button, Snackbar, Alert, Paper, Typography, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchRecruiterCandidates } from '@/services/recruiter';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import CandidateList from './CandidateList';
import CandidateForm from './CandidateForm';
import { Candidate, SnackbarState } from '@/types/candidate';

const RecruiterDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadCandidates = async () => {
    try {
      const data = await fetchRecruiterCandidates(token!);
      setCandidates(data);
    } catch (err: any) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load candidates', severity: 'error' });
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <DashboardHeader />
      <StatsCards candidates={candidates} />
      
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="medium">
            Candidate Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCandidate(null);
              setOpenModal(true);
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3,
              boxShadow: 2,
            }}
          >
            Add New Candidate
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <CandidateList candidates={candidates} onEdit={handleEdit} />
      </Paper>

      <CandidateForm
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCandidate(null);
        }}
        editingCandidate={editingCandidate}
        token={token}
        onSuccess={loadCandidates}
        setSnackbar={setSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecruiterDashboard;