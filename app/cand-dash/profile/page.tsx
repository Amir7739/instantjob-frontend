"use client"

import type React from "react"

import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { ProfileBasicInfo } from "@/components/candidateDashboard/profile/profile-basic-info"
import { ProfileEducation } from "@/components/candidateDashboard/profile/profile-education"
import { ProfileSkills } from "@/components/candidateDashboard/profile/profile-skills"
import { ProfileWorkExperience } from "@/components/candidateDashboard/profile/profile-work-experience"


interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  }
}

export default function ProfilePage() {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile information to maximize your job opportunities.
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
            <Tab label="Basic Info" {...a11yProps(0)} />
            <Tab label="Experience" {...a11yProps(1)} />
            <Tab label="Education" {...a11yProps(2)} />
            <Tab label="Skills" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProfileBasicInfo />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProfileWorkExperience />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProfileEducation />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ProfileSkills />
        </TabPanel>
      </Box>
    </Box>
  )
}
