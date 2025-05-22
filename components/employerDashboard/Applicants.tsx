'use client'

import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Visibility as EyeIcon,
  Message as MessageSquareIcon,
  Delete as Trash2Icon,
} from "@mui/icons-material";
import { recentApplicants } from "../../components/employerDashboard/data";

const Applicants: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ boxShadow: 1, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: "medium", color: "#1F2937" }}>
            Recent Applicants
          </Typography>
          <Button sx={{ color: "#4F46E5", "&:hover": { color: "#4338CA" } }}>
            View All
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {["Applicant", "Position", "Skills", "Applied", "Status", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      fontSize: window.innerWidth < 900 ? 10 : 12,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      display:
                        window.innerWidth < 900 && ["Skills", "Applied"].includes(header)
                          ? "none"
                          : "table-cell",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={`/api/placeholder/${applicant.id * 10}/40`}
                        sx={{ mr: window.innerWidth < 900 ? 1 : 2, width: 24, height: 24 }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: window.innerWidth < 900 ? 12 : 14,
                            fontWeight: "medium",
                            color: "#1F2937",
                          }}
                        >
                          {window.innerWidth < 900 ? applicant.name.split(" ")[0] : applicant.name}
                        </Typography>
                        <Typography
                          sx={{ fontSize: window.innerWidth < 900 ? 10 : 12, color: "#6B7280" }}
                        >
                          {applicant.experience} exp
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Typography
                      sx={{ fontSize: window.innerWidth < 900 ? 12 : 14, color: "#1F2937" }}
                    >
                      {window.innerWidth < 900 ? applicant.position.split(" ")[0] : applicant.position}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {applicant.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ bgcolor: "#F3F4F6", color: "#1F2937" }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: window.innerWidth < 900 ? 12 : 14, color: "#6B7280" }}
                    >
                      {applicant.applied}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Chip
                      label={applicant.status}
                      sx={{
                        bgcolor:
                          applicant.status === "New"
                            ? "#DBEAFE"
                            : applicant.status === "Shortlisted"
                            ? "#D1FAE5"
                            : "#FEF3C7",
                        color:
                          applicant.status === "New"
                            ? "#1E40AF"
                            : applicant.status === "Shortlisted"
                            ? "#065F46"
                            : "#92400E",
                        fontSize: window.innerWidth < 900 ? 10 : 12,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton sx={{ color: "#4F46E5", p: window.innerWidth < 900 ? 0.5 : 1 }}>
                        <EyeIcon fontSize="small" />
                      </IconButton>
                      <IconButton sx={{ color: "#10B981", p: window.innerWidth < 900 ? 0.5 : 1 }}>
                        <MessageSquareIcon fontSize="small" />
                      </IconButton>
                      <IconButton sx={{ color: "#EF4444", p: window.innerWidth < 900 ? 0.5 : 1 }}>
                        <Trash2Icon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Applicants;
