export interface Stat {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
  trend: string;
  trendColor: string;
}

export interface JobListing {
  id: number;
  title: string;
  location: string;
  type: string;
  applications: number;
  status: string;
  date: string;
}

export interface Applicant {
  id: number;
  name: string;
  position: string;
  experience: string;
  skills: string[];
  applied: string;
  status: string;
}