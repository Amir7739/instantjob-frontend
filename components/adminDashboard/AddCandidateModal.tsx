import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Input,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  Business,
  Schedule,
  LinkedIn,
  AttachFile,
  CurrencyRupee,
} from "@mui/icons-material";
import { addSingleCandidate } from "@/services/candidates";

interface AddCandidateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    currentLocation: "",
    prefferedLocation: "",
    currentpackage: "",
    expectedpackage: "",
    linkedinProfile: "",
    jobRole: "",
    totalExperience: "",
    relevantExperience: "",
    currentOrganization: "",
    noticePeriod: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a valid PDF file");
      setResumeFile(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      await addSingleCandidate(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 600,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}>
        <Person sx={{ fontSize: '1.8rem' }} />
        Add New Candidate
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: '#fafafa',
                  border: '1px solid #e3f2fd',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: 2.5, 
                  color: '#333', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Person color="primary" />
                  Personal Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                      error={!!error && !formData.full_name}
                      helperText={
                        !!error && !formData.full_name ? "Full Name is required" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                      error={!!error && !formData.email}
                      helperText={!!error && !formData.email ? "Email is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                      error={!!error && !formData.phone}
                      helperText={!!error && !formData.phone ? "Phone is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Gender</InputLabel>
                      <Select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                        label="Gender"
                        sx={{
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                          },
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: '#f8f9ff',
                  border: '1px solid #e8eaf6',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #42a5f5 0%, #478ed1 100%)',
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: 2.5, 
                  color: '#333', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocationOn color="primary" />
                  Location Details
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Location"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Preferred Location"
                      name="prefferedLocation"
                      value={formData.prefferedLocation}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: '#fff8f0',
                  border: '1px solid #fff3e0',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: 2.5, 
                  color: '#333', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Work color="primary" />
                  Professional Details
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Job Role"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                      error={!!error && !formData.jobRole}
                      helperText={!!error && !formData.jobRole ? "Job Role is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Organization"
                      name="currentOrganization"
                      value={formData.currentOrganization}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Total Experience (Years)"
                      name="totalExperience"
                      type="number"
                      value={formData.totalExperience}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Relevant Experience (Years)"
                      name="relevantExperience"
                      type="number"
                      value={formData.relevantExperience}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Notice Period (Days)"
                      name="noticePeriod"
                      type="number"
                      value={formData.noticePeriod}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Compensation Information */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: '#f0fff4',
                  border: '1px solid #e8f5e8',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: 2.5, 
                  color: '#333', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CurrencyRupee color="primary" />
                  Compensation Details
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Package"
                      name="currentpackage"
                      type="number"
                      value={formData.currentpackage}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupee color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expected Package"
                      name="expectedpackage"
                      type="number"
                      value={formData.expectedpackage} // FIXED: was using currentpackage
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupee color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: '#fff5f5',
                  border: '1px solid #ffebee',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                  }
                }}
              >
                <Typography variant="h6" sx={{ 
                  mb: 2.5, 
                  color: '#333', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LinkedIn color="primary" />
                  Additional Information
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="LinkedIn Profile"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkedIn color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: 2, 
                      p: 2, 
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: '#f8f9ff'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 1 }}>
                        <AttachFile color="action" />
                        <Typography variant="body2" color="textSecondary">
                          Upload Resume (PDF only)
                        </Typography>
                      </Box>
                      <Input
                        type="file"
                        inputProps={{ accept: ".pdf" }}
                        onChange={handleFileChange}
                        fullWidth
                        sx={{ 
                          '&:before': { display: 'none' },
                          '&:after': { display: 'none' }
                        }}
                      />
                      {resumeFile && (
                        <Chip 
                          label={`✓ ${resumeFile.name}`}
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {error && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: 2,
              color: '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="body2">⚠️ {error}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        bgcolor: '#fafafa',
        borderTop: '1px solid #e0e0e0',
        gap: 1.5
      }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
          variant="outlined"
          sx={{ 
            minWidth: 100,
            fontWeight: 600,
            borderRadius: 2,
            borderColor: '#ccc',
            color: '#666',
            '&:hover': {
              borderColor: '#999',
              bgcolor: '#f5f5f5'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isSubmitting ||
            !formData.full_name ||
            !formData.email ||
            !formData.phone ||
            !formData.jobRole
          }
          sx={{ 
            minWidth: 150,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: '#ccc',
              boxShadow: 'none'
            }
          }}
        >
          {isSubmitting ? "Submitting..." : "Add Candidate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCandidateModal;