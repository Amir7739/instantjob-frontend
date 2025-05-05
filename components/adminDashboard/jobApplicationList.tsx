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
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DeleteConfirmationSnackbar from '../DeleteConfirmationSnackbar';
import { formatSalaryToLPA } from '../JobCard';
import { fetchInitialJobApplications, fetchMoreJobApplications } from '@/services/fetchJobApplications';

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
        const response = await fetchInitialJobApplications(); // Fetch first 10 job applications
        setJobApplications(response.data);
        setTotalJobs(response.totalJobApplications); // Use totalDocuments from response
       
      } catch (error) {
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

  // Scroll handler for infinite scrolling with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    const retryInterval = 200;

    const attachScrollListener = () => {
      const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
      if (gridElement) {
        gridElement.addEventListener('scroll', handleScroll);
        return true;
      }
      return false;
    };

    const tryAttachListener = () => {
      if (retryCount < maxRetries) {
        if (!attachScrollListener()) {
          retryCount++;
          setTimeout(tryAttachListener, retryInterval);
        }
      } else {
        console.error('Failed to attach scroll listener after max retries');
      }
    };

    const handleScroll = () => {
      if (!gridRef.current || isLoading) {
        return;
      }
      const gridElement = gridRef.current.querySelector('.MuiDataGrid-virtualScroller');
      if (!gridElement) {
        console.error('Virtual scroller not found during scroll');
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = gridElement;
     
      if (scrollTop + clientHeight >= scrollHeight - 200 && jobApplications.length < totalJobs) {
       
        setIsLoading(true);
        fetchMoreJobsHandler();
      }
    };

    const fetchMoreJobsHandler = async () => {
      try {
        const nextPage = Math.floor(jobApplications.length / 10) + 2; // Calculate next page
        const response = await fetchMoreJobApplications(nextPage); // Fetch next 10 job applications
        if (response.data.length > 0) {

          setJobApplications((prev) => {
            const newJobs = [...prev, ...response.data];
            
            return newJobs;
          });
        } else {
          console.log('No more job applications to load');
        }
      } catch (error) {
        setError(error.message || 'Error fetching more job applications');
      } finally {
        setIsLoading(false);
      }
    };

    tryAttachListener();

    return () => {
      const gridElement = gridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
       
      }
    };
  }, [jobApplications.length, isLoading, totalJobs]);

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
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center', height: '100%', mt: 1}}>
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
          //  renderCell: (params) => new Date(params.value).toLocaleDateString(),
          },
          {
            field: 'appliedAt',
            headerName: 'Applied',
            flex: 0.15,
            minWidth: 100,
           // renderCell: (params) => new Date(params.value).toLocaleDateString(),
          },
          {
            field: 'updatedAt',
            headerName: 'Updated',
            flex: 0.15,
            minWidth: 100,
           // renderCell: (params) => new Date(params.value).toLocaleDateString(),
          },
          // {
          //   field: 'actions',
          //   headerName: 'Actions',
          //   flex: 0.15,
          //   minWidth: 120,
          //   sortable: false,
          //   filterable: false,
          //   disableColumnMenu: true,
          //   renderCell: (params: GridRenderCellParams) => (
          //     <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, alignItems: 'center', mt: 1 }}>
          //       <IconButton
          //         size="small"
          //         color="primary"
          //         sx={{ padding: isMobile ? '1px' : '2px' }}
          //         onClick={() => handleEdit(params.row.id)}
          //       >
          //         <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
          //       </IconButton>
          //       <Tooltip title="View full job description" arrow>
          //         <IconButton
          //           size="small"
          //           color="info"
          //           sx={{ padding: isMobile ? '1px' : '2px' }}
          //           onClick={() => handleViewDetails(params.row.id)}
          //         >
          //           <VisibilityIcon fontSize={isMobile ? 'small' : 'medium'} />
          //         </IconButton>
          //       </Tooltip>
          //       <IconButton
          //         size="small"
          //         color="error"
          //         sx={{ padding: isMobile ? '1px' : '2px' }}
          //         onClick={() => handleDeleteClick(params.row.id)}
          //       >
          //         <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
          //       </IconButton>
          //     </Box>
          //   ),
          // },
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
    <div style={{ height: 700, width: '100%' }} ref={gridRef}>
      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '8px' }}>
          {error}
        </div>
      )}
      <DataGrid
      showToolbar
        rows={rows}
        columns={columns}
        rowHeight={isMobile ? 50 : 60}
        autoHeight={false}
        disableSelectionOnClick
        loading={isLoading}
        rowCount={totalJobs}
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
        //minWidth: '100%'
        }}
      />
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '8px' }}>
          Loading more job applications...
        </div>
      )}
      <DeleteConfirmationSnackbar
        open={deleteConfirmOpen}
        // onClose={handleDeleteCancel}
        // onConfirm={handleDeleteConfirm}
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