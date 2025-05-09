import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import VideocamIcon from "@mui/icons-material/Videocam"

const interviews = [
  {
    id: 1,
    company: "TechCorp Inc.",
    position: "Senior Frontend Developer",
    date: "May 10, 2025",
    time: "10:00 AM",
    type: "Video Interview",
  },
  {
    id: 2,
    company: "InnovateSoft",
    position: "Full Stack Engineer",
    date: "May 12, 2025",
    time: "2:30 PM",
    type: "Technical Assessment",
  },
]

export function UpcomingInterviews() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Interviews
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your scheduled interviews and assessments
        </Typography>

        <Stack spacing={2} sx={{ mt: 3 }}>
          {interviews.map((interview) => (
            <Paper key={interview.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {interview.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {interview.position}
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2">{interview.date}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2">{interview.time}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                <VideocamIcon fontSize="small" color="action" />
                <Typography variant="body2">{interview.type}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button variant="outlined" size="small" fullWidth>
                  Reschedule
                </Button>
                <Button variant="contained" size="small" fullWidth>
                  Join
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>

        {interviews.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CalendarTodayIcon sx={{ fontSize: 40, color: "text.secondary" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No Interviews
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You don't have any upcoming interviews scheduled.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
