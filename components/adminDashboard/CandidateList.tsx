// components/CandidateList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const candidates = [
  { id: 1, name: 'Raj Sharma', role: 'Frontend Developer', status: 'Shortlisted', applied: '2 days ago' },
  { id: 2, name: 'Priya Singh', role: 'UX Designer', status: 'New', applied: '1 day ago' },
  { id: 3, name: 'Arun Kumar', role: 'Backend Developer', status: 'Interviewed', applied: '5 days ago' },
  { id: 4, name: 'Sneha Patel', role: 'Data Scientist', status: 'New', applied: '3 days ago' },
  { id: 5, name: 'Vikram Malhotra', role: 'DevOps Engineer', status: 'Shortlisted', applied: '4 days ago' }
];

const CandidateList = ({ getStatusColor }) => {
  return (  
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Candidate Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.role}</TableCell>
              <TableCell>
                <Chip label={candidate.status} size="small" color={getStatusColor(candidate.status)} />
              </TableCell>
              <TableCell>{candidate.applied}</TableCell>
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

export default CandidateList;
