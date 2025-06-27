// Define interfaces based on the API response
export interface Employer {
  id: string;
  name: string;
  email: string;
  companyName: string;
  companyLogo?: string;
  website?: string;
  industry?: string;
  location?: string;
  contactNumber?: string;
  companySize?: string;
  bio?: string;
  verified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface EmployersResponse {
  message: string;
  employers: Employer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEmployers: number;
    employersPerPage: number;
  };
}

interface EmployerResponse {
  message: string;
  employer: Employer;
}

interface UpdateEmployerResponse {
  status: string;
  message: string;
  employer: Employer;
}

interface UpdatePasswordResponse {
  status: string;
  message: string;
}


export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobType: string;
  minExp: number;
  maxExp: number;
  keySkills: string[];
  industryType: string;
  category: string;
  applyBy: string;
  openings: number;
  status: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  status: string;
  message: string;
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    jobsPerPage: number;
  };
}

interface StatIcon {
  name: string;
  color: string;
  size: number;
}

 export interface Stat {
  title: string;
  value: number;
  icon: StatIcon;
  color: string;
  trend: string;
  trendColor: string;
}

interface StatsResponse {
  status: string;
  stats: Stat[];
}

interface ApplicationTrendsResponse {
  status: string;
  message: string;
  data: number[];
}

interface Applicant {
  id: string;
  applicantId: string;
  name: string;
  resumeUrl? : string,
  email: string,
  position: string;
  experience: string;
  skills: string[];
  applied: string;
  status: string;
}

interface RecentApplicantsResponse {
  status: string;
  message: string;
  applicants: Applicant[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApplicants: number;
    applicantsPerPage: number;
  };
}

export interface JobFilters {
  locations: string[];
  statuses: string[];
  jobTypes: string[];
}

interface JobFiltersResponse {
  status: string;
  message: string;
  data: JobFilters;
}


import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";

// Fetch initial employers (first 10)
export const fetchInitialEmployers = async (): Promise<EmployersResponse> => {
  try {
    const response: AxiosResponse<EmployersResponse> = await axiosInstance.get(
      "/employers/get-all",
      {
        params: { page: 1 },
      }
    );

    return {
      ...response.data,
      employers: response.data.employers.map((employer) => ({
        ...employer,
        id: employer._id || employer.id,
        name: employer.name || "",
        email: employer.email || "",
        companyName: employer.companyName || "",
        companyLogo: employer.companyLogo || "",
        website: employer.website || "",
        industry: employer.industry || "",
        location: employer.location || "",
        contactNumber: employer.contactNumber || "",
        companySize: employer.companySize || "",
        bio: employer.bio || "",
        verified: employer.verified ?? false,
        createdAt: employer.createdAt || "",
        updatedAt: employer.updatedAt || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchInitialEmployers:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching initial employers"
    );
  }
};

// Fetch more employers (next 10)
export const fetchMoreEmployers = async (
  page: number
): Promise<EmployersResponse> => {
  try {
    const response: AxiosResponse<EmployersResponse> = await axiosInstance.get(
      "/employers/get-all",
      {
        params: { page },
      }
    );

    return {
      ...response.data,
      employers: response.data.employers.map((employer) => ({
        ...employer,
        id: employer._id || employer.id,
        name: employer.name || "",
        email: employer.email || "",
        companyName: employer.companyName || "",
        companyLogo: employer.companyLogo || "",
        website: employer.website || "",
        industry: employer.industry || "",
        location: employer.location || "",
        contactNumber: employer.contactNumber || "",
        companySize: employer.companySize || "",
        bio: employer.bio || "",
        verified: employer.verified ?? false,
        createdAt: employer.createdAt || "",
        updatedAt: employer.updatedAt || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchMoreEmployers:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching more employers"
    );
  }
};

export const updateEmployerStatus = async (
  employerId: string,
  verified: boolean
): Promise<void> => {
  try {
    await axiosInstance.patch(`/employers/verify/${employerId}`, {
      verified,
    });
  } catch (error: any) {
    console.error(`Error updating employer status to ${verified}:`, error);
    throw new Error(
      error.response?.data?.message || `Error updating employer status`
    );
  }
};

export const fetchEmployerById = async (id: string): Promise<Employer> => {
  try {
    const response: AxiosResponse<EmployerResponse> = await axiosInstance.get(
      `/employers/get/${id}`
    );
    const { employer } = response.data;

    return {
      ...employer,
      id: employer._id || employer.id || id,
      name: employer.name ?? "",
      email: employer.email ?? "",
      companyName: employer.companyName ?? "",
      companyLogo: employer.companyLogo ?? "",
      website: employer.website ?? "",
      industry: employer.industry ?? "",
      location: employer.location ?? "",
      contactNumber: employer.contactNumber ?? "",
      companySize: employer.companySize ?? "",
      bio: employer.bio ?? "",
      verified: employer.verified ?? false,
      createdAt: employer.createdAt ?? "",
      updatedAt: employer.updatedAt ?? "",
    };
  } catch (error: any) {
    console.error("Error in fetchEmployerById:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching employer details"
    );
  }
};

export const fetchEmployerStats = async (id: string): Promise<Stat[]> => {
  try {
    const response: AxiosResponse<StatsResponse> = await axiosInstance.get(
      `/employers/dashboard-stats/${id}`
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to fetch stats");
    }

    return response.data.stats.map((stat) => ({
      title: stat.title || "",
      value: stat.value || 0,
      icon: {
        name: stat.icon?.name || "",
        color: stat.icon?.color || "#000000",
        size: stat.icon?.size || 24,
      },
      color: stat.color || "#000000",
      trend: stat.trend || "",
      trendColor: stat.trendColor || "#000000",
    }));
  } catch (error: any) {
    console.error("Error in fetchEmployerStats:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching employer stats"
    );
  }
};

export const fetchApplicationTrends = async (id: string): Promise<number[]> => {
  try {
    const response: AxiosResponse<ApplicationTrendsResponse> = await axiosInstance.get(
      `/employers/dashboard-applications-trends/${id}`
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to fetch application trends");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Error in fetchApplicationTrends:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching application trends"
    );
  }
};

export const fetchRecentApplicants = async (id: string, page: number): Promise<RecentApplicantsResponse> => {
  try {
    const response: AxiosResponse<RecentApplicantsResponse> = await axiosInstance.get(
      `/employers/dashboard/applicants/${id}`,
      { params: { page } }
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to fetch recent applicants");
    }

    return {
      ...response.data,
      applicants: response.data.applicants.map((applicant) => ({
        id: applicant.id || "",
        applicantId: applicant.applicantId || "",
        name: applicant.name || "",
        email: applicant.email || "",
        resumeUrl: applicant.resumeUrl || "",
        position: applicant.position || "",
        experience: applicant.experience || "",
        skills: applicant.skills || [],
        applied: applicant.applied || "",
        status: applicant.status || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchRecentApplicants:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching recent applicants"
    );
  }
};



export const updateApplicantStatus = async (id: string, status: string): Promise<{ status: string; message: string }> => {
  try {
    const response: AxiosResponse = await axiosInstance.patch(`/employers/update/job-app/status/${id}`, { status });
    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to update applicant status");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error in updateApplicantStatus:", error);
    throw new Error(error.response?.data?.message || "Error updating applicant status");
  }
};

export const fetchJobsByEmployer = async (
  employerId: string,
  page: number,
  status: string | null,
  jobType: string | null,
  location: string | null
): Promise<JobsResponse> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      `/employers/get-jobs-by-employer/${employerId}`,
      {
        params: {
          page,
          status: status !== "all" ? status : undefined,
          jobType: jobType !== "all" ? jobType : undefined,
          location: location !== "all" ? location : undefined,
        },
      }
    );

    return {
      ...response.data,
      jobs: response.data.jobs.map((job) => ({
        id: job.id || "",
        title: job.title || "",
        companyName: job.companyName || "",
        location: job.location || "",
        salaryRange: job.salaryRange || "",
        jobType: job.jobType || "",
        minExp: job.minExp || 0,
        maxExp: job.maxExp || 0,
        keySkills: job.keySkills || [],
        industryType: job.industryType || "",
        category: job.category || "",
        applyBy: job.applyBy || "",
        openings: job.openings || 0,
        status: job.status || "",
        postedAt: job.postedAt || "",
        createdAt: job.createdAt || "",
        updatedAt: job.updatedAt || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchJobsByEmployer:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching jobs"
    );
  }
};


export const fetchJobFiltersForEmployer = async (employerId: string): Promise<JobFilters> => {
  try {
    const response: AxiosResponse<JobFiltersResponse> = await axiosInstance.get(
      `/employers/get-job-filters-for-employer/${employerId}`
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to fetch job filters");
    }

    return {
      locations: response.data.data.locations || [],
      statuses: response.data.data.statuses || [],
      jobTypes: response.data.data.jobTypes || [],
    };
  } catch (error: any) {
    console.error("Error in fetchJobFiltersForEmployer:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching job filters"
    );
  }
};

export const updateJobStatus = async (
  jobId: string,
  status: string
): Promise<{ status: string; message: string; job: { id: string; title: string; status: string } }> => {
  try {
    const token = localStorage.getItem("token");
    const response: AxiosResponse = await axiosInstance.put(
      `/employers/update-job-status/${jobId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to update job status");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error in updateJobStatus:", error);
    throw new Error(error.response?.data?.message || "Error updating job status");
  }
};

export const updateEmployer = async (
  id: string,
  data: Partial<Employer>
): Promise<Employer> => {
  try {
    const response: AxiosResponse<UpdateEmployerResponse> = await axiosInstance.put(
      `/employers/update-employer-profile/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to update employer");
    }

    const { employer } = response.data;
    return {
      ...employer,
      id: employer._id || employer.id || id,
      name: employer.name ?? "",
      email: employer.email ?? "",
      companyName: employer.companyName ?? "",
      companyLogo: employer.companyLogo ?? "",
      website: employer.website ?? "",
      industry: employer.industry ?? "",
      location: employer.location ?? "",
      contactNumber: employer.contactNumber ?? "",
      companySize: employer.companySize ?? "",
      bio: employer.bio ?? "",
      verified: employer.verified ?? false,
      createdAt: employer.createdAt ?? "",
      updatedAt: employer.updatedAt ?? "",
    };
  } catch (error: any) {
    console.error("Error in updateEmployer:", error);
    throw new Error(
      error.response?.data?.message || "Error updating employer details"
    );
  }
};

export const updateEmployerPassword = async (
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const response: AxiosResponse<UpdatePasswordResponse> = await axiosInstance.put(
      `/employers/update-password/${id}`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to update password");
    }
  } catch (error: any) {
    console.error("Error in updateEmployerPassword:", error);
    throw new Error(
      error.response?.data?.message || "Error updating employer password"
    );
  }
};
