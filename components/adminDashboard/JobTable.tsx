// components/JobTable.tsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Paper, useMediaQuery, useTheme } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FixedSizeList as List } from 'react-window';

// Dummy data
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 4,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 5,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 6,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 7,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 8,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 9,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 10,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 11,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 12,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  {
    id: 13,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Bangalore, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 24,
    status: 'Active',
    posted: '2 days ago',
  },
  {
    id: 14,
    title: 'Backend Developer',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Part Time',
    salary: '$100-200$',
    applications: 18,
    status: 'Active',
    posted: '1 day ago',
  },
  // Add more jobs here...
];

// Column widths for alignment

const JobTable = ({ getStatusColor = (status) => status === 'Active' ? 'success' : 'default' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [windowWidth, setWindowWidth] = useState(0);
  const [visibleJobs, setVisibleJobs] = useState(jobs.slice(0, 10)); // Initially show first 10 jobs
  
  // Update window width on mount and resize
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle virtualized rendering logic
  const loadMoreData = (startIndex: number, stopIndex: number) => {
    const nextJobs = jobs.slice(visibleJobs.length, visibleJobs.length + 10); // Load the next 10 jobs
    setVisibleJobs((prevJobs) => [...prevJobs, ...nextJobs]);
  };

  // Responsive column config
  const getColumnLayout = () => {
    if (isMobile) {
      return { title: '40%', company: '30%', status: '15%', actions: '15%' };
    }
    
    if (windowWidth < 1024) {
      return { title: '25%', company: '20%', location: '20%', status: '15%', posted: '10%', actions: '10%' };
    }
    
    return { title: '15%', company: '15%', location: '15%', applications: '10%', salary: '10%', status: '10%', posted: '15%', actions: '10%' };
  };

  const columnLayout = getColumnLayout();
  
  const getHeaders = () => {
    const headers = [];
    if ('title' in columnLayout) headers.push({ id: 'title', label: 'Job Title' });
    if ('company' in columnLayout) headers.push({ id: 'company', label: 'Company' });
    if ('location' in columnLayout) headers.push({ id: 'location', label: 'Location' });
    if ('applications' in columnLayout) headers.push({ id: 'applications', label: 'Applications' });
    if ('salary' in columnLayout) headers.push({ id: 'salary', label: 'Salary' });
    if ('status' in columnLayout) headers.push({ id: 'status', label: 'Status' });
    if ('posted' in columnLayout) headers.push({ id: 'posted', label: 'Posted' });
    if ('actions' in columnLayout) headers.push({ id: 'actions', label: 'Actions' });
    return headers;
  };

  const headers = getHeaders();

  const renderCellContent = (job, columnId) => {
    switch (columnId) {
      case 'title': return job.title;
      case 'company': return job.company;
      case 'location': return job.location;
      case 'applications': return job.applications;
      case 'salary': return job.salary;
      case 'status': return (
        <Chip 
          label={job.status} 
          size="small" 
          color={getStatusColor(job.status)}
          sx={{ maxWidth: '100%' }}
        />
      );
      case 'posted': return job.posted;
      case 'actions': return (
        <>
          <IconButton size="small" color="primary" sx={{ padding: isMobile ? '2px' : '4px' }}>
            <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
          <IconButton size="small" color="error" sx={{ padding: isMobile ? '2px' : '4px' }}>
            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </>
      );
      default: return null;
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Table Headers */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid rgba(224, 224, 224, 1)',
        backgroundColor: '#f5f5f5',
        padding: isMobile ? '8px 4px' : '12px 16px',
        fontWeight: 'bold',
        fontSize: isMobile ? '14px' : '16px',
      }}>
        {headers.map(header => (
          <div 
            key={header.id} 
            style={{ 
              width: columnLayout[header.id],
              padding: isMobile ? '2px' : '4px', 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {header.label}
          </div>
        ))}
      </div>
      
      {/* Virtualized Rows */}
      <div style={{ height: 400, width: '100%', overflow: 'auto' }}>
        <List
          height={400}
          itemCount={visibleJobs.length}
          itemSize={isMobile ? 50 : 60}
          width="100%"
          overscanCount={5}
          onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
            // When the user scrolls, load more data if necessary
            if (visibleStopIndex >= visibleJobs.length - 1) {
              console.log("Loading more data...");
              loadMoreData(visibleStopIndex + 1, visibleStopIndex + 10);
            }
          }}
        >
          {({ index, style }) => {
            const job = visibleJobs[index];
            return (
              <div style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                padding: isMobile ? '4px' : '8px 16px',
                fontSize: isMobile ? '14px' : '16px',
              }}>
                {headers.map(header => (
                  <div 
                    key={`${job.id}-${header.id}`} 
                    style={{ 
                      width: columnLayout[header.id],
                      padding: isMobile ? '2px' : '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {renderCellContent(job, header.id)}
                  </div>
                ))}
              </div>
            );
          }}
        </List>
      </div>
    </Paper>
  );
};

export default JobTable;