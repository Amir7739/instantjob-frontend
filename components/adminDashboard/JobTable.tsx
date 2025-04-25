// components/JobTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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
    posted: '2 days ago'
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
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'Delhi, India',
    type: 'Contract',
    salary: '$100-200$',
    applications: 12,
    status: 'Active',
    posted: '3 days ago'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudNative',
    location: 'Mumbai, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 8,
    status: 'Review',
    posted: '5 days ago'
  },
  {
    id: 5,
    title: 'Product Manager',
    company: 'GrowthLabs',
    location: 'Hyderabad, India',
    type: 'Full Time',
    salary: '$100-200$',
    applications: 15,
    status: 'Active',
    posted: '4 days ago'
  }
];

const JobTable = ({ getStatusColor }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Applications</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Posted</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.applications}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell>
                <Chip label={job.status} size="small" color={getStatusColor(job.status)} />
              </TableCell>
              <TableCell>{job.posted}</TableCell>
              <TableCell>
                <IconButton size="small" color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobTable;
