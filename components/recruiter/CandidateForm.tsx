'use client';

import React from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Avatar, Divider, InputAdornment, Typography,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Upload as UploadIcon, Work as WorkIcon, Timer as TimerIcon } from '@mui/icons-material';
import { addRecruiterCandidate, updateRecruiterCandidate } from '@/services/recruiter';
import { Candidate, FormValues } from '@/types/candidate';

interface CandidateFormProps {
  open: boolean;
  onClose: () => void;
  editingCandidate: Candidate | null;
  token: string | null;
  onSuccess: () => void;
  setSnackbar: (state: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
}

// Define validation schema
const getValidationSchema = (editingCandidate: Candidate | null) => {
  return Yup.object({
    full_name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    jobRole: Yup.string().required('Job role is required'), // Required field
    exp: Yup.string().required('Experience is required'), // Required field
    resume: editingCandidate
      ? Yup.mixed().nullable().optional() // Optional for update
      : Yup.mixed().required('Resume is required'), // Required for create
  });
};

const CandidateForm: React.FC<CandidateFormProps> = ({
  open,
  onClose,
  editingCandidate,
  token,
  onSuccess,
  setSnackbar,
}) => {
  const initialValues: FormValues = {
    full_name: editingCandidate?.full_name || '',
    email: editingCandidate?.email || '',
    phone: editingCandidate?.phone || '',
    jobRole: editingCandidate?.jobRole || '',
    exp: editingCandidate?.exp || '',
    resume: null,
  };

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    if (!token) {
      setSnackbar({ open: true, message: 'Authentication needed', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('full_name', values.full_name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('jobRole', values.jobRole); // Always include, as required
    formData.append('exp', values.exp); // Always include, as required
    if (values.resume) formData.append('resume', values.resume);

    try {
      if (editingCandidate) {
        await updateRecruiterCandidate(editingCandidate._id, formData, token);
        setSnackbar({
          open: true,
          message: 'Candidate updated successfully!',
          severity: 'success',
        });
      } else {
        await addRecruiterCandidate(formData, token);
        setSnackbar({
          open: true,
          message: 'Candidate added successfully!',
          severity: 'success',
        });
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: editingCandidate ? 'warning.main' : 'primary.main' }}>
            {editingCandidate ? <EditIcon /> : <AddIcon />}
          </Avatar>
          <Typography variant="h6" fontWeight="medium">
            {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(editingCandidate)}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, values }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    error={touched.full_name && !!errors.full_name}
                    helperText={touched.full_name && errors.full_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Job Role"
                    name="jobRole"
                    error={touched.jobRole && !!errors.jobRole}
                    helperText={touched.jobRole && errors.jobRole}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Experience"
                    name="exp"
                    error={touched.exp && !!errors.exp}
                    helperText={touched.exp && errors.exp}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<UploadIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderStyle: 'dashed',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      borderColor: touched.resume && errors.resume ? 'error.main' : 'grey.400',
                    }}
                  >
                    {values.resume
                      ? values.resume.name
                      : editingCandidate?.resumeUrl
                      ? 'Replace Resume'
                      : 'Upload Resume'}
                    <input
                      type="file"
                      hidden
                      name="resume"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files) {
                          setFieldValue('resume', event.target.files[0]);
                        }
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                  </Button>
                  {touched.resume && errors.resume && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.resume}
                    </Typography>
                  )}
                  {editingCandidate && editingCandidate.resumeUrl && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Current resume:{' '}
                      <a href={editingCandidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                  onClick={onClose}
                  sx={{ textTransform: 'none', fontWeight: 'medium' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'medium',
                    px: 3,
                    borderRadius: 2,
                  }}
                >
                  {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateForm;