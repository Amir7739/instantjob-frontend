import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  useTheme,
  alpha,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  LinkedIn,
  LocationOn,
  Work,
  Schedule,
  Email,
  Phone,
  Business,
  MonetizationOn,
  CalendarToday,
  Add,
  Close,
  Edit,
  Delete,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axiosInstance from '@/utils/axios';
import BulkUpload from '@/components/BulkUpload';
import DeleteConfirmationSnackbar from '@/components/DeleteConfirmationSnackbar'; // Import DeleteConfirmationSnackbar
import CustomSnackbar from '@/components/CustomSnackbar'; // Import CustomSnackbar

interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  currentLocation: string;
  prefferedLocation: string;
  currentpackage: string;
  expectedpackage: string;
  linkedinProfile: string;
  jobRole: string;
  totalExperience: string;
  relevantExperience: string;
  currentOrganization: string;
  noticePeriod: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  message: string;
  total: number;
  page: number;
  totalPages: number;
  candidates: Candidate[];
}

const CandidateDataGrid: React.FC = () => {
  const theme = useTheme();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<Partial<Candidate>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit button click
  const handleEditClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      full_name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      gender: candidate.gender,
      currentLocation: candidate.currentLocation,
      prefferedLocation: candidate.prefferedLocation,
      currentpackage: candidate.currentpackage,
      expectedpackage: candidate.expectedpackage,
      linkedinProfile: candidate.linkedinProfile,
      jobRole: candidate.jobRole,
      totalExperience: candidate.totalExperience,
      relevantExperience: candidate.relevantExperience,
      currentOrganization: candidate.currentOrganization,
      noticePeriod: candidate.noticePeriod,
      resumeUrl: candidate.resumeUrl,
    });
    setOpenEdit(true);
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!selectedCandidate) return;
    try {
      const response = await axiosInstance.put(`/bulk-cand-update/${selectedCandidate._id}`, formData);
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === selectedCandidate._id ? { ...candidate, ...formData } : candidate
        )
      );
      setOpenEdit(false);
      setSelectedCandidate(null);
      setFormData({});
      setSnackbarMessage('Candidate updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Error updating candidate');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error updating candidate:', error);
    }
  };

  // Handle delete initiation
  const handleDeleteClick = (id: string) => {
    setCandidateToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirmed delete
  const handleDelete = async () => {
    if (!candidateToDelete) return;
    try {
      await axiosInstance.delete(`/bulk-cand-delete/${candidateToDelete}`);
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== candidateToDelete));
      setTotalCount((prev) => prev - 1);
      setSnackbarMessage('Candidate deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Error deleting candidate');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error deleting candidate:', error);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Enhanced columns with action column
  const columns: GridColDef[] = [
    { 
      field: 'full_name', 
      headerName: 'Full Name', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '0.875rem' }}>
            {params.value?.charAt(0)?.toUpperCase() || 'N'}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'resumeUrl', 
      headerName: 'Resume', 
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <Tooltip title="View Resume">
            <IconButton 
              href={params.value} 
              target="_blank" 
              rel="noopener noreferrer"
              size="small"
              sx={{ 
                color: 'success.main',
                mt: -5,
                '&:hover': { 
                  bgcolor: alpha(theme.palette.success.main, 0.1) 
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
            N/A
          </Typography>
        )
      ),
    },
    { 
      field: 'email', 
      headerName: 'Contact', 
      width: 220,
      renderCell: (params) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {params.value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {params.row.phone}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'gender', 
      headerName: 'Gender', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          sx={{mt: -3}}
          color={params.value === 'Male' ? 'primary' : params.value === 'Female' ? 'secondary' : 'default'}
        />
      ),
    },
    { 
      field: 'currentLocation', 
      headerName: 'Location', 
      width: 200,
      renderCell: (params) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <LocationOn sx={{ fontSize: 14, color: 'success.main' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              Current: {params.value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 14, color: 'warning.main' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Preferred: {params.row.prefferedLocation}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'currentpackage', 
      headerName: 'Package', 
      width: 180,
      renderCell: (params) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <CurrencyRupeeIcon sx={{ fontSize: 14, color: 'success.main' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              Current: {params.value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CurrencyRupeeIcon sx={{ fontSize: 14, color: 'info.main' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Expected: {params.row.expectedpackage}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'linkedinProfile', 
      headerName: 'LinkedIn', 
      width: 100,
      renderCell: (params) => (
        <Tooltip title="View LinkedIn Profile">
          <IconButton 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer"
            size="small"
            sx={{ 
              color: '#0077b5',
              mt: -4,
              '&:hover': { 
                bgcolor: alpha('#0077b5', 0.1) 
              }
            }}
          >
            <LinkedIn />
          </IconButton>
        </Tooltip>
      ),
    },
    { 
      field: 'jobRole', 
      headerName: 'Role & Experience', 
      width: 220,
      renderCell: (params) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Work sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              {params.value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`Total: ${params.row.totalExperience}`} 
              size="small" 
              variant="outlined"
              color="primary"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />
            <Chip 
              label={`Relevant: ${params.row.relevantExperience}`} 
              size="small" 
              variant="outlined"
              color="secondary"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />
          </Box>
        </Box>
      ),
    },
    { 
      field: 'currentOrganization', 
      headerName: 'Organization', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 3 }}>
          <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'noticePeriod', 
      headerName: 'Notice Period', 
      width: 140,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          icon={<Schedule sx={{ fontSize: 14 }} />}
          sx={{mt: -3}}
          color={
            params.value?.toLowerCase().includes('immediate') ? 'success' :
            params.value?.toLowerCase().includes('30') ? 'warning' : 'default'
          }
          variant="outlined"
        />
      ),
    },
    { 
      field: 'createdAt', 
      headerName: 'Added On', 
      width: 140, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2.5 }}>
          <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Tooltip title="Edit Candidate">
            <IconButton
              size="small"
              onClick={() => handleEditClick(params.row)}
              sx={{ color: 'primary.main' }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Candidate">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row._id)}
              sx={{ color: 'error.main' }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchCandidates = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse>(`/get-all-bulk-candidate?page=${pageNum}`);
      const { candidates: newCandidates, total, page: currentPage, totalPages: totalPg } = response.data;
      
      
      
      setCandidates((prev) => {
        const existingIds = new Set(prev.map(c => c._id));
        const uniqueNewCandidates = newCandidates.filter(c => !existingIds.has(c._id));
        const updatedList = [...prev, ...uniqueNewCandidates];
        
        return updatedList;
      });
      
      setTotalPages(totalPg);
      setTotalCount(total);
      setHasMore(pageNum < totalPg && candidates.length + newCandidates.length < total);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const loadMore = () => {
    if (loading || page >= totalPages || candidates.length >= totalCount) {
      setHasMore(false);
      return;
    }
    setPage((prev) => prev + 1);
  };

  const handleUploadSuccess = () => {
    setCandidates([]);
    setPage(1);
    setHasMore(true);
    setOpenUpload(false);
    setTimeout(() => {
      fetchCandidates(1);
    }, 1000);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%', 
      p: 3,
      bgcolor: 'grey.50'
    }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 2
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Candidate Database
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage and explore your talent pool
            </Typography>
          </Box>
          <Card sx={{ minWidth: 200, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Typography variant="h3" fontWeight={700}>
                {totalCount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Candidates
              </Typography>
              {loading && (
                <LinearProgress 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white'
                    }
                  }} 
                />
              )}
            </CardContent>
          </Card>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenUpload(true)}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Add Candidates
          </Button>
        </Stack>
      </Paper>
      
      {/* Data Grid Section */}
      <Paper 
        elevation={1} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          id="grid-container"
          ref={gridContainerRef}
          style={{ height: 700, width: '100%', position: 'relative', overflow: 'auto' }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                zIndex: 10,
              }}
            >
              <CircularProgress 
                size={60} 
                thickness={4} 
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 2
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                {candidates.length === 0 ? 'Loading Candidates...' : 'Fetching More Candidates...'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                {candidates.length > 0 && `Loaded ${candidates.length} of ${totalCount} candidates`}
              </Typography>
            </Box>
          )}
          
          <InfiniteScroll
            dataLength={candidates.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="grid-container"
            loader={<div />}
          >
            <div style={{ minHeight: 700, width: '100%' }}>
              <DataGrid
                rows={candidates}
                columns={columns}
                getRowId={(row) => row._id}
                disableSelectionOnClick
                rowHeight={80}
                sx={{ 
                  border: 0,
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderColor: 'grey.200',
                    py: 1,
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'grey.100',
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '&:nth-of-type(even)': {
                      bgcolor: 'grey.25',
                    }
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: 600,
                  }
                }}
                autoHeight={false}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                hideFooter
              />
            </div>
          </InfiniteScroll>
        </div>
      </Paper>

      {/* Footer Info */}
      {!hasMore && candidates.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            All {totalCount} candidates loaded successfully
          </Typography>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => setOpenUpload(true)}
      >
        <Add />
      </Fab>

      {/* Upload Dialog */}
      <Dialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Upload New Candidates
          </Typography>
          <IconButton onClick={() => setOpenUpload(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BulkUpload onUploadSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedCandidate(null);
          setFormData({});
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Candidate
          </Typography>
          <IconButton
            onClick={() => {
              setOpenEdit(false);
              setSelectedCandidate(null);
              setFormData({});
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Current Location"
              name="currentLocation"
              value={formData.currentLocation || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Preferred Location"
              name="prefferedLocation"
              value={formData.prefferedLocation || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Current Package"
              name="currentpackage"
              value={formData.currentpackage || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Expected Package"
              name="expectedpackage"
              value={formData.expectedpackage || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="LinkedIn Profile"
              name="linkedinProfile"
              value={formData.linkedinProfile || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Job Role"
              name="jobRole"
              value={formData.jobRole || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Total Experience"
              name="totalExperience"
              value={formData.totalExperience || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Relevant Experience"
              name="relevantExperience"
              value={formData.relevantExperience || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Current Organization"
              name="currentOrganization"
              value={formData.currentOrganization || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Notice Period"
              name="noticePeriod"
              value={formData.noticePeriod || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Resume URL"
              name="resumeUrl"
              value={formData.resumeUrl || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEdit(false);
              setSelectedCandidate(null);
              setFormData({});
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Snackbar */}
      <DeleteConfirmationSnackbar
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setCandidateToDelete(null);
        }}
        onConfirm={handleDelete}
        itemName="candidate"
      />

      {/* Custom Snackbar for Success/Error Messages */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default CandidateDataGrid;