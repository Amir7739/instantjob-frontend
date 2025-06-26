import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Typography,
} from '@mui/material';
import { Visibility as VisibilityIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { formatSalaryToLPA } from '../JobCard';
import { fetchInitialJobApplications, fetchMoreJobApplications } from '@/services/fetchJobApplications';
import DeleteConfirmationSnackbar from '../DeleteConfirmationSnackbar';
import CandidateListSkeleton from '../CandidateListSkeleton';

// Basic skeleton loader component (replace with actual implementation if available)
const JobApplicationSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Typography>Loading job applications...</Typography>
    <CandidateListSkeleton/>
  </Box>
);

const JobApplication = ({ getStatusColor = (status) => (status === 'Active' ? 'success' : 'error') }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [windowWidth, setWindowWidth] = useState(0);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
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

  // Fetch initial job applications on mount
  useEffect(() => {
    const loadInitialJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchInitialJobApplications();
        
        setJobApplications(response.data);
        setTotalJobs(response.totalJobApplications);
      } catch (error: any) {
        setError(error.message || 'Error fetching initial job applications');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialJobs();

    // Reset scroll position to top
    const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, []);

  // Debounced fetch more jobs handler
  const fetchMoreJobsHandler = useCallback(
    debounce(async () => {
      if (isLoading || jobApplications.length >= totalJobs) return;
      try {
        setIsLoading(true);
        const page = Math.floor(jobApplications.length / 10) + 1;
        
        const response = await fetchMoreJobApplications(page);
        
        if (response.data.length > 0) {
          setJobApplications((prev) => {
            const newApplications = response.data.filter(
              (newApp) => !prev.some((existingApp) => existingApp.applicationId === newApp.applicationId)
            );
            return [...prev, ...newApplications];
          });
        } else {
          
          if (jobApplications.length < totalJobs) {
            console.warn(`Expected more applications but received none. Current: ${jobApplications.length}, Total: ${totalJobs}`);
          }
        }
      } catch (error: any) {
        setError(error.message || 'Error fetching more job applications');
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [jobApplications.length, isLoading, totalJobs]
  );

  // Scroll handler for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current || isLoading) return;
      const gridElement = gridRef.current.querySelector('.MuiDataGrid-virtualScroller');
      if (!gridElement) {
        console.error('Virtual scroller not found during scroll');
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = gridElement;
      if (scrollTop + clientHeight >= scrollHeight - 50 && jobApplications.length < totalJobs) {
        fetchMoreJobsHandler();
      }
    };

    const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
    } else {
      console.error('Virtual scroller not found');
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchMoreJobsHandler, isLoading, jobApplications.length, totalJobs]);

  // Responsive column config
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: 'fullName',
        headerName: 'Candidate Name',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'resumeUrl',
        headerName: 'Resume',
        flex: 0.15,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          params.value ? (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center', height: '100%', mt: 1 }}>
              <Tooltip title="View Resume" arrow>
                <IconButton
                  size="small"
                  color="info"
                  component="a"
                  href={params.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ padding: isMobile ? '1px' : '2px' }}
                >
                  <VisibilityIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Resume" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  component="a"
                  href={params.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ padding: isMobile ? '1px' : '2px' }}
                >
                  <DownloadIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span>No Resume</span>
            </Box>
          )
        ),
      },
      {
        field: 'totalExperience',
        headerName: 'Experience',
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: 'city',
        headerName: 'City',
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: 'companyName',
        headerName: 'Company',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'jobTitle',
        headerName: 'Job Title',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'location',
        headerName: 'Job Location',
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: 'salaryRange',
        headerName: 'Salary',
        flex: 0.15,
        minWidth: 100,
        renderCell: (params) => formatSalaryToLPA(params.value),
      },
      {
        field: 'jobType',
        headerName: 'Job Type',
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: 'minExperience',
        headerName: 'Min Exp',
        flex: 0.1,
        minWidth: 80,
      },
      {
        field: 'maxExperience',
        headerName: 'Max Exp',
        flex: 0.1,
        minWidth: 80,
      },
      {
        field: 'keySkills',
        headerName: 'Key Skills',
        flex: 0.2,
        minWidth: 150,
        renderCell: (params) => (Array.isArray(params.value) ? params.value.join(', ') : 'N/A'),
      },
      {
        field: 'industryType',
        headerName: 'Industry',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: 'openings',
        headerName: 'Openings',
        flex: 0.1,
        minWidth: 80,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value || 'Active'}
            size="small"
            color={getStatusColor(params.value || 'Active')}
            sx={{ maxWidth: '100%' }}
          />
        ),
      },
      {
        field: 'postedAt',
        headerName: 'Posted',
        flex: 0.15,
        minWidth: 100,
      },
      {
        field: 'appliedAt',
        headerName: 'Applied',
        flex: 0.15,
        minWidth: 100,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 0.15,
        minWidth: 100,
      },
    ];

    return baseColumns;
  };

  const columns = getColumns();
  const rows: GridRowsProp = jobApplications.map((app) => ({
    id: app.applicationId,
    applicationId: app.applicationId,
    fullName: app.candidate.fullName,
    phone: app.candidate.phone,
    email: app.candidate.email,
    resumeUrl: app.candidate.resumeUrl,
    totalExperience: app.candidate.totalExperience,
    city: app.candidate.city,
    jobId: app.job.jobId,
    companyName: app.job.companyName,
    jobTitle: app.job.title,
    location: app.job.location,
    salaryRange: app.job.salaryRange,
    jobType: app.job.jobType,
    minExperience: app.job.minExperience,
    maxExperience: app.job.maxExperience,
    keySkills: app.job.keySkills,
    industryType: app.job.industryType,
    category: app.job.category,
    openings: app.job.openings,
    status: app.job.status,
    postedAt: app.job.postedAt,
    appliedAt: app.appliedAt,
    updatedAt: app.updatedAt,
  }));

  return (
    <div style={{ height: 750, width: '100%', overflow: 'auto' }} ref={gridRef}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h6">
          Total Job Applications: {totalJobs}
        </Typography>
      </Box>
      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '8px' }}>
          {error}
        </div>
      )}
      {isLoading ? (
        <JobApplicationSkeleton />
      ) : (
        <>
          <DataGrid
            showToolbar
            key={jobApplications.length}
            rows={rows}
            columns={columns}
            rowHeight={isMobile ? 50 : 60}
            autoHeight={false}
            disableSelectionOnClick
            loading={false} // Controlled by skeleton
            rowCount={totalJobs}
            paginationMode="server"
            sx={{
              '& .MuiDataGrid-cell': {
                fontSize: isMobile ? '14px' : '16px',
                padding: isMobile ? '4px' : '8px',
              },
              '& .MuiDataGrid-columnHeader': {
                fontSize: isMobile ? '14px' : '16px',
                padding: isMobile ? '8px 4px' : '12px 16px',
                backgroundColor: '#5e35b1',
                color: 'white',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto',
              },
            }}
          />
          {isLoading && (
            <Box sx={{ mt: 1 }}>
              <JobApplicationSkeleton />
            </Box>
          )}
        </>
      )}
      <DeleteConfirmationSnackbar
        open={deleteConfirmOpen}
        itemName="job application"
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

export default JobApplication;