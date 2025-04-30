// components/JobTable.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon,Visibility as VisibilityIcon } from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import { deleteJob, fetchInitialJobs, fetchMoreJobs } from '@/services/fetchJobForAdmin';
import DeleteConfirmationSnackbar from '../DeleteConfirmationSnackbar';
import { formatSalaryToLPA } from '../JobCard';

const JobTable = ({ getStatusColor = (status) => (status === 'Active' ? 'success' : 'error') }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [windowWidth, setWindowWidth] = useState(0);
  const [visibleJobs, setVisibleJobs] = useState<any[]>([]); 
  const [totalJobs, setTotalJobs] = useState(0); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); 
  const [jobToDelete, setJobToDelete] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Fetch initial jobs on mount
  useEffect(() => {
    const loadInitialJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchInitialJobs(); // Fetch first 10 jobs
        setVisibleJobs(response.data);
        setTotalJobs(response.totalJobs);
        console.log(`Initial jobs loaded: ${response.data.length}, total: ${response.totalJobs}`);
      } catch (error) {
        setError(error.message || 'Error fetching initial jobs');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialJobs();

    // Reset scroll position to top
    const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
    if (gridElement) {
      gridElement.scrollTop = 0;
      console.log('Scroll position reset to top');
    }
  }, []); // Run only on mount

  // Scroll handler for infinite scrolling with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    const retryInterval = 200; // Retry every 200ms

    const attachScrollListener = () => {
      const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
      if (gridElement) {
        gridElement.addEventListener('scroll', handleScroll);
        console.log('Scroll listener attached');
        return true;
      }
      return false;
    };

    const tryAttachListener = () => {
      if (retryCount < maxRetries) {
        if (!attachScrollListener()) {
          retryCount++;
          console.log(`Retry ${retryCount}/${maxRetries} to attach scroll listener`);
          setTimeout(tryAttachListener, retryInterval);
        }
      } else {
        console.error('Failed to attach scroll listener after max retries');
      }
    };

    const handleScroll = () => {
      if (!gridRef.current || isLoading) {
        console.log('Scroll skipped: No gridRef or loading in progress');
        return;
      }
      const gridElement = gridRef.current.querySelector('.MuiDataGrid-virtualScroller');
      if (!gridElement) {
        console.error('Virtual scroller not found during scroll');
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = gridElement;
      console.log(`Scroll: scrollTop=${scrollTop}, clientHeight=${clientHeight}, scrollHeight=${scrollHeight}`);
      console.log(`Scroll condition: ${scrollTop + clientHeight} >= ${scrollHeight - 200}`);
      if (scrollTop + clientHeight >= scrollHeight - 200 && visibleJobs.length < totalJobs) {
        console.log(`Triggering load: visibleJobs=${visibleJobs.length}, totalJobs=${totalJobs}`);
        setIsLoading(true);
        fetchMoreJobsHandler();
      }
    };

    const fetchMoreJobsHandler = async () => {
      try {
        const response = await fetchMoreJobs(visibleJobs.length); // Fetch next 10 jobs
        if (response.data.length > 0) {
          console.log(`Loading ${response.data.length} new jobs`);
          setVisibleJobs((prev) => {
            const newJobs = [...prev, ...response.data];
            console.log(`New visibleJobs length: ${newJobs.length}`);
            return newJobs;
          });
        } else {
          console.log('No more jobs to load');
        }
      } catch (error) {
        setError(error.message || 'Error fetching more jobs');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial attempt to attach listener
    tryAttachListener();

    // Cleanup
    return () => {
      const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
        console.log('Scroll listener removed');
      }
    };
  }, [visibleJobs.length, isLoading, totalJobs]);

  // Handle edit button click
  const handleEdit = (jobId: string) => {
    window.open(`/edit-job/${jobId}`, '_blank');
  };


  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteConfirmOpen(true);
  };

  // Handle confirmed deletion
  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      const response = await deleteJob(jobToDelete); // Call the new deleteJob API
      console.log('Delete response:', response);
      if (response.success) {
        // Remove the deleted job from the visibleJobs state
        setVisibleJobs((prev) => {
          const updatedJobs = prev.filter((job) => job.id !== jobToDelete);
          console.log(`Job ${jobToDelete} deleted, new visibleJobs length: ${updatedJobs.length}`);
          return updatedJobs;
        });
        setTotalJobs((prev) => prev - 1); // Update total job count
        setSuccessMessage('Job deleted successfully!');
      } else {
        throw new Error(response.message || 'Failed to delete job');
      }
    } catch (error: any) {
      setError(error.message || 'Error deleting job');
    } finally {
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    }
  };

  // Close delete confirmation Snackbar
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setJobToDelete(null);
  };

  const handleViewDetails = (jobId: string) => {
    window.open(`/jobs-desc/${jobId}`, '_blank');
  };


  // Responsive column config
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: 'title',
        headerName: 'Job Title',
        flex: isMobile ? 0.4 : windowWidth < 1024 ? 0.25 : 0.15,
        minWidth: isMobile ? 100 : 120,
      },
      {
        field: 'companyName',
        headerName: 'Company',
        flex: isMobile ? 0.3 : windowWidth < 1024 ? 0.2 : 0.15,
        minWidth: isMobile ? 80 : 100,
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: windowWidth < 1024 ? 0.2 : 0.15,
        minWidth: 100,
        hideable: isMobile,
      },
      {
        field: 'jobType',
        headerName: 'Job Type',
        flex: 0.1,
        minWidth: 80,
        hideable: isMobile || windowWidth < 1024,
      },
      {
        field: 'salaryRange',
        headerName: 'Salary',
        flex: 0.2,
        minWidth: 80,
        hideable: isMobile || windowWidth < 1024,
        renderCell: (params) => formatSalaryToLPA(params.value),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: isMobile ? 0.15 : 0.1,
        minWidth: isMobile ? 60 : 80,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value || 'Active'} // Fallback if status is missing
            size="small"
            color={getStatusColor(params.value || 'Active')}
            sx={{ maxWidth: '100%' }}
          />
        ),
      },
      {
        field: 'posted',
        headerName: 'Posted',
        flex: isMobile ? 0 : windowWidth < 1024 ? 0.1 : 0.15,
        minWidth: 80,
        hideable: isMobile,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: isMobile ? 0.3 : 0.1,
        minWidth: isMobile ? 100 : 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, alignItems: 'center',mt: 1 }}>
            <IconButton
              size="small"
              color="primary"
              sx={{ padding: isMobile ? '1px' : '2px' }}
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
            <Tooltip title='View full job description' arrow>
            <IconButton
              size="small"
              color="info"
              sx={{ padding: isMobile ? '1px' : '2px' }}
              onClick={() => handleViewDetails(params.row.id)}
            >
              <VisibilityIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              color="error"
              sx={{ padding: isMobile ? '1px' : '2px' }}
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        ),
      }
    ];

    return baseColumns;
  };

  const columns = getColumns();
  const rows: GridRowsProp = visibleJobs;

  return (
    <div style={{ height: 700, width: '100%' }} ref={gridRef}>
      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '8px' }}>
          {error}
        </div>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={isMobile ? 50 : 60}
        autoHeight={false}
        disableSelectionOnClick
        loading={isLoading}
        rowCount={totalJobs} // Total jobs from API
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '4px' : '8px',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '8px 4px' : '12px 16px',
            backgroundColor: '#5e35b1',
            color: 'white'
          },
        }}
      />
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '8px' }}>
          Loading more jobs...
        </div>
      )}
      <DeleteConfirmationSnackbar
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="job"
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default JobTable;
