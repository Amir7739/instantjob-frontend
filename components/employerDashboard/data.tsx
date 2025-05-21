import { Stat, JobListing, Applicant } from "./types";
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Message as MessageIcon,
} from "@mui/icons-material";

export const stats: Stat[] = [
  {
    title: "Active Jobs",
    value: 12,
    icon: <WorkIcon sx={{ width: 28, height: 28 }} />,
    color: "#4F46E5",
    trend: "↑ 8% from last month",
    trendColor: "#10B981",
  },
  {
    title: "Total Applications",
    value: 142,
    icon: <PeopleIcon sx={{ width: 28, height: 28 }} />,
    color: "#3B82F6",
    trend: "↑ 12% from last month",
    trendColor: "#10B981",
  },
  {
    title: "Today Applications",
    value: 10,
    icon: <MessageIcon sx={{ width: 28, height: 28 }} />,
    color: "#10B982",
    trend: "↑ 4% from last month",
    trendColor: "#10B981",
  },
  {
    title: "Shortlisted",
    value: 36,
    icon: <DescriptionIcon sx={{ width: 28, height: 28 }} />,
    color: "#F59E0B",
    trend: "← Same as last month",
    trendColor: "#F59E0B",
  },
  {
    title: "Interviews",
    value: 18,
    icon: <MessageIcon sx={{ width: 28, height: 28 }} />,
    color: "#10B981",
    trend: "↑ 4% from last month",
    trendColor: "#10B981",
  },
  
];

export const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior React Developer",
    location: "Remote",
    type: "Full-time",
    applications: 48,
    status: "Active",
    date: "2025-05-02",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    location: "New York",
    type: "Full-time",
    applications: 32,
    status: "Active",
    date: "2025-05-07",
  },
  {
    id: 3,
    title: "Product Manager",
    location: "San Francisco",
    type: "Contract",
    applications: 15,
    status: "Paused",
    date: "2025-04-28",
  },
  {
    id: 4,
    title: "Backend Developer",
    location: "Remote",
    type: "Part-time",
    applications: 27,
    status: "Active",
    date: "2025-05-10",
  },
  {
    id: 5,
    title: "Data Scientist",
    location: "Boston",
    type: "Full-time",
    applications: 19,
    status: "Closed",
    date: "2025-04-15",
  },
];

export const recentApplicants: Applicant[] = [
  {
    id: 1,
    name: "John Smith",
    position: "Senior React Developer",
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js"],
    applied: "Today",
    status: "New",
  },
  {
    id: 2,
    name: "Emily Chen",
    position: "UI/UX Designer",
    experience: "3 years",
    skills: ["Figma", "Adobe XD", "Sketch"],
    applied: "Yesterday",
    status: "Shortlisted",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Product Manager",
    experience: "7 years",
    skills: ["Product Strategy", "Agile", "User Research"],
    applied: "2 days ago",
    status: "Interview",
  },
  {
    id: 4,
    name: "Michael Brown",
    position: "Product Manager",
    experience: "7 years",
    skills: ["Product Strategy", "Agile", "User Research"],
    applied: "2 days ago",
    status: "Interview",
  },
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];