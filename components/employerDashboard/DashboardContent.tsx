import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Paper,
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
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
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
import { stats, recentApplicants } from "../../components/employerDashboard/data";

const DashboardContent: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => window.open("/jobs/create", "_blank")}
          sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" } }}
        >
          Post New Job
        </Button>
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item key={index}>
            <Card
              sx={{ p: 2, borderRadius: 2, boxShadow: 3, width: 220 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: `${stat.color}1A`,
                    borderRadius: "50%",
                    p: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: stat.trendColor, mt: 1 }}
              >
                {stat.trend}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Application Trends
        </Typography>
        <BarChart
          series={[
            {
              data: [35, 51, 15, 60, 35, 51, 12, 60, 60, 45, 30, 20],
              label: "Applications",
              color: "#4F46E5",
            },
          ]}
          height={290}
          xAxis={[
            {
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              scaleType: "band",
            },
          ]}
        />
      </Paper>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Job Categories
        </Typography>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "series A" },
                { id: 1, value: 15, label: "series B" },
                { id: 2, value: 20, label: "series C" },
                { id: 3, value: 20, label: "series D" },
                { id: 4, value: 20, label: "series E" },
                { id: 5, value: 20, label: "series F" },
                { id: 6, value: 20, label: "series G" },
              ],
            },
          ]}
          width={500}
          height={300}
        />
      </Paper>

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
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: "medium",
              color: "#1F2937",
            }}
          >
            Recent Applicants
          </Typography>
          <Button
            sx={{ color: "#4F46E5", "&:hover": { color: "#4338CA" } }}
          >
            View All
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                {[
                  "Applicant",
                  "Position",
                  "Skills",
                  "Applied",
                  "Status",
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
                        ["Skills", "Applied"].includes(header)
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
                        sx={{
                          mr: window.innerWidth < 900 ? 1 : 2,
                          width: 24,
                          height: 24,
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: window.innerWidth < 900 ? 12 : 14,
                            fontWeight: "medium",
                            color: "#1F2937",
                          }}
                        >
                          {window.innerWidth < 900
                            ? applicant.name.split(" ")[0]
                            : applicant.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: window.innerWidth < 900 ? 10 : 12,
                            color: "#6B7280",
                          }}
                        >
                          {applicant.experience} exp
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ px: window.innerWidth < 900 ? 1 : 3, py: 1 }}>
                    <Typography
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#1F2937",
                      }}
                    >
                      {window.innerWidth < 900
                        ? applicant.position.split(" ")[0]
                        : applicant.position}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      px: window.innerWidth < 900 ? 1 : 3,
                      py: 1,
                      display: window.innerWidth < 900 ? "none" : "table-cell",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
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
                      sx={{
                        fontSize: window.innerWidth < 900 ? 12 : 14,
                        color: "#6B7280",
                      }}
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
                      <IconButton
                        sx={{ color: "#4F46E5", p: window.innerWidth < 900 ? 0.5 : 1 }}
                      >
                        <EyeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#10B981", p: window.innerWidth < 900 ? 0.5 : 1 }}
                      >
                        <MessageSquareIcon fontSize="small" />
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
      </Card>
    </Box>
  );
};

export default DashboardContent;