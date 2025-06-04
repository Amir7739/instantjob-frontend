"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Candidate } from "@/types/candidate";

interface CandidateListProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onEdit,
}) => {
  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "Candidate",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
            {params.value.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.8,
      minWidth: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "jobRole",
      headerName: "Job Role",
      flex: 0.8,
      minWidth: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "exp",
      headerName: "Exp",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "resumeUrl",
      headerName: "Resume",
      flex: 0.7,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label="View Resume"
          component="a"
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          clickable
          size="small"
          variant="outlined"
          color="primary"
          sx={{
            textDecoration: "none",
            "&:hover": { backgroundColor: "primary.50" },
          }}
        />
      ),
    },

    {
      field: "createdAt",
      headerName: "Added On",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const date = new Date(params.value).toLocaleString(); // Adjust format as needed
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Edit Candidate">
          <IconButton
            color="primary"
            onClick={() => params.row && onEdit(params.row)} // onEdit is now in scope
            size="small"
            sx={{
              "&:hover": {
                backgroundColor: "primary.50",
                transform: "scale(1.05)",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
        "& .MuiDataGrid-root": {
          border: "none",
          borderRadius: 2,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "grey.50",
          borderRadius: "8px 8px 0 0",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #f0f0f0",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "grey.50",
        },
      }}
    >
      <DataGrid
      showToolbar
        rows={candidates}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
      />
    </Box>
  );
};

export default CandidateList;
