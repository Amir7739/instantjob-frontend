'use client'

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for enhanced visuals
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

// Types for interview data
interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Sample data
const initialInterviews: Interview[] = [
  {
    id: 1,
    candidateName: 'John Doe',
    position: 'Software Engineer',
    date: '2025-05-10',
    time: '10:00 AM',
    interviewer: 'Alice Smith',
    status: 'Scheduled',
  },
  {
    id: 2,
    candidateName: 'Jane Roe',
    position: 'Product Manager',
    date: '2025-05-11',
    time: '2:00 PM',
    interviewer: 'Bob Johnson',
    status: 'Completed',
  },
];

// Main component
const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    position: '',
    date: '',
    time: '',
    interviewer: '',
    status: 'Scheduled' as Interview['status'],
  });

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewInterview({
      candidateName: '',
      position: '',
      date: '',
      time: '',
      interviewer: '',
      status: 'Scheduled',
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInterview((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status select change
  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setNewInterview((prev) => ({ ...prev, status: e.target.value as Interview['status'] }));
  };

  // Handle filter change
  const handleFilterChange = (e: SelectChangeEvent<string>) => {
    setFilterStatus(e.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    setInterviews((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newInterview,
      },
    ]);
    handleClose();
  };

  // Handle delete interview
  const handleDelete = (id: number) => {
    setInterviews((prev) => prev.filter((interview) => interview.id !== id));
  };

  // Filter interviews based on status
  const filteredInterviews = filterStatus === 'All'
    ? interviews
    : interviews.filter((interview) => interview.status === filterStatus);

  return (
    <StyledContainer maxWidth="lg">
      <HeaderBox>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Candidate Interviews
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select value={filterStatus} onChange={handleFilterChange} label="Filter Status">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Schedule Interview
          </Button>
        </Box>
      </HeaderBox>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Candidate</strong></TableCell>
              <TableCell><strong>Position</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Interviewer</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell>{interview.candidateName}</TableCell>
                <TableCell>{interview.position}</TableCell>
                <TableCell>{interview.date}</TableCell>
                <TableCell>{interview.time}</TableCell>
                <TableCell>{interview.interviewer}</TableCell>
                <TableCell>{interview.status}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(interview.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Modal for scheduling new interview */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Interview</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Candidate Name"
              name="candidateName"
              value={newInterview.candidateName}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Position"
              name="position"
              value={newInterview.position}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newInterview.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={newInterview.time}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Interviewer"
              name="interviewer"
              value={newInterview.interviewer}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newInterview.status}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default InterviewsPage;