import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Message as MessageSquareIcon,
  Settings as SettingsIcon,
  Logout as LogOutIcon,
} from "@mui/icons-material";
import { handleLogout } from "@/utils/clearLocalStrogat";

interface SidebarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  sidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? sidebarOpen : true}
      onClose={isMobile ? toggleSidebar : undefined}
      sx={{
        width: sidebarOpen ? 240 : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? 240 : isMobile ? 240 : 80,
          bgcolor: "#4B5EAA",
          color: "#FFF",
          transition: "width 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          zIndex: isMobile ? 1300 : 1200,
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #6B7280",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {sidebarOpen ? "JobPortal Pro" : "JP"}
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ color: "#A5B4FC" }}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        <List>
          {[
            { tab: "dashboard", icon: <WorkIcon />, label: "Dashboard" },
            { tab: "jobs", icon: <DescriptionIcon />, label: "Job Listings" },
            {
              tab: "recent-applicants",
              icon: <PeopleIcon />,
              label: "Recent Applicants",
            },
            {
              tab: "candidate-search",
              icon: <SearchIcon />,
              label: "Candidate Search",
            },
            // {
            //   tab: "subscription-history",
            //   icon: <HistoryIcon />,
            //   label: "Subscription History",
            // },
            { tab: "settings", icon: <SettingsIcon />, label: "Settings" },
          ].map(({ tab, icon, label }) => (
            <ListItem key={tab} disablePadding>
              <ListItemButton
                selected={activeTab === tab}
                onClick={() => {
                  console.log(`Clicked tab: ${tab}`); // Debug log
                  setActiveTab(tab);
                  if (isMobile) toggleSidebar();
                }}
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: activeTab === tab ? "#3B4A8A" : "transparent",
                  color: activeTab === tab ? "#FFF" : "#D1D5DB",
                  "&:hover": { bgcolor: "#6B7280" },
                  "&.Mui-selected": { bgcolor: "#3B4A8A" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={label} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2, borderTop: "1px solid #6B7280" }}>
        <Button
          startIcon={<LogOutIcon />}
          onClick={() => {
            handleLogout();
            window.location.href = "/employer-dash/login";
          }}
          sx={{
            color: "#D1D5DB",
            "&:hover": { color: "#FFF" },
            width: "100%",
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}
        >
          {sidebarOpen && "Logout"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
