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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as BellIcon,
  Logout as LogOutIcon,
  Work as BriefcaseIcon,
  Description as FileTextIcon,
  People as UsersIcon,
  Message as MessageSquareIcon,
  Settings as SettingsIcon,
  Add as PlusIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as Trash2Icon,
  FilterList as FilterIcon,
  GetApp as DownloadIcon,

} from "@mui/icons-material";
import { jobListings } from "../../components/employerDashboard/data";

const JobListings: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1F2937" }}
        >
          Job Listings
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" } }}
        >
          Post New Job
        </Button>
      </Box>

      <Card sx={{ p: 2, boxShadow: 1 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select defaultValue="all">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Type</InputLabel>
            <Select defaultValue="all">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Location</InputLabel>
            <Select defaultValue="all">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
              <MenuItem value="onsite">Onsite</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              size="small"
            >
              More Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Export
            </Button>
          </Box>
        </Box>
      </Card>

      <Card sx={{ boxShadow: 1, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {[
                  "Job Title",
                  "Location",
                  "Type",
                  "Applications",
                  "Status",
                  "Date Posted",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      fontSize: window.innerWidth < 900 ? 10 : 12,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      display:
                        window.innerWidth < 900 &&
                        ["Location", "Type", "Date Posted"].includes(header)
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
              {jobListings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        fontWeight: "medium",
                        color: "#1F2937",
                      }}
                    >
                      {window.innerWidth < 900 ? job.title.split(" ")[0] : job.title}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#6B7280",
                      }}
                    >
                      {job.location}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#6B7280",
                      }}
                    >
                      {job.type}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#1F2937",
                      }}
                    >
                      {job.applications}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Chip
                      label={job.status}
                      sx={{
                        bgcolor:
                          job.status === "Active"
                            ? "#D1FAE5"
                            : job.status === "Paused"
                            ? "#FEF3C7"
                            : "#F3F4F6",
                        color:
                          job.status === "Active"
                            ? "#065F46"
                            : job.status === "Paused"
                            ? "#92400E"
                            : "#1F2937",
                        fontSize: window.innerWidth < 900 ? 10 : 12,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#6B7280",
                      }}
                    >
                      {job.date}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        sx={{ color: "#4F46E5", p: window.innerWidth < 900 ? 0.5 : 1 }}
                      >
                        <EyeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#3B82F6", p: window.innerWidth < 900 ? 0.5 : 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#EF4444", p: window.innerWidth < 900 ? 0.5 : 1 }}
                      >
                        <Trash2Icon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            sx={{ fontSize: window.innerWidth < 900 ? 12 : 14, color: "#6B7280" }}
          >
            Showing 1 to 5 of 12 entries
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" size="small" disabled>
              Previous
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#4F46E5",
                "&:hover": { bgcolor: "#4338CA" },
              }}
            >
              1
            </Button>
            <Button variant="outlined" size="small">
              2
            </Button>
            <Button variant="outlined" size="small">
              3
            </Button>
            <Button variant="outlined" size="small">
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default JobListings;