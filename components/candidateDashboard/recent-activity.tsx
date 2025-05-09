import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import VisibilityIcon from "@mui/icons-material/Visibility"
import WorkIcon from "@mui/icons-material/Work"
import EmailIcon from "@mui/icons-material/Email"

const activities = [
  {
    id: 1,
    type: "view",
    message: "Your profile was viewed by Google",
    time: "2 hours ago",
    icon: VisibilityIcon,
  },
  {
    id: 2,
    type: "application",
    message: "Applied for Senior Frontend Developer at TechCorp Inc.",
    time: "1 day ago",
    icon: WorkIcon,
  },
  {
    id: 3,
    type: "message",
    message: "You received a message from Amazon recruiter",
    time: "2 days ago",
    icon: EmailIcon,
  },
  {
    id: 4,
    type: "application",
    message: "Applied for Full Stack Engineer at InnovateSoft",
    time: "3 days ago",
    icon: WorkIcon,
  },
]

export function RecentActivity() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Recent Activity"
        subheader="Your recent job search activities"
        action={
          <IconButton aria-label="view all">
            <ArrowForwardIcon />
          </IconButton>
        }
      />
      <CardContent>
        <List sx={{ px: 0 }}>
          {activities.map((activity) => (
            <ListItem key={activity.id} alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "background.default" }}>
                  <activity.icon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={activity.message}
                secondary={activity.time}
                primaryTypographyProps={{ variant: "body2" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
