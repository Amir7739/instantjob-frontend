import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";

// Define interfaces based on the backend API response
interface Candidate {
  fullName: string;
  email: string;
  resumeUrl: string | null;
  phone: string;
  totalExperience: number;
  city: string;
}

interface Job {
  jobId: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobType: string;
  minExperience: number;
  maxExperience: number;
  keySkills: string[];
  industryType: string;
  category: string;
  openings: number;
  status: string;
  postedAt: string;
}

interface JobApplication {
  applicationId: string;
  appliedAt: string;
  updatedAt: string;
  candidate: Candidate;
  job: Job;
}

interface JobApplicationsResponse {
  success: boolean;
  totalJobApplications: number;
  totalPages: number;
  currentPage: number;
  count: number;
  data: JobApplication[];
}

// Fetch initial job applications (first 10, page 1)
export const fetchInitialJobApplications =
  async (): Promise<JobApplicationsResponse> => {
    try {
      const response: AxiosResponse<JobApplicationsResponse> =
        await axiosInstance.get(
          "/job-applications/get-job-candidates-details",
          {
            params: { page: 1 },
          }
        );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch initial job applications"
        );
      }
      return {
        ...response.data,
        data: response.data.data.map((app) => ({
          applicationId: app.applicationId,
          appliedAt: app.appliedAt,
          updatedAt: app.updatedAt,
          candidate: {
            fullName: app.candidate.fullName || "N/A",
            email: app.candidate.email || "N/A",
            resumeUrl: app.candidate.resumeUrl || null,
            phone: app.candidate.phone || "N/A",
            totalExperience: app.candidate.totalExperience ?? 0,
            city: app.candidate.city || "N/A",
          },
          job: {
            jobId: app.job.jobId || "",
            title: app.job.title || "N/A",
            companyName: app.job.companyName || "N/A",
            location: app.job.location || "N/A",
            salaryRange: app.job.salaryRange || "N/A",
            jobType: app.job.jobType || "N/A",
            minExperience: app.job.minExperience ?? 0,
            maxExperience: app.job.maxExperience ?? 0,
            keySkills: Array.isArray(app.job.keySkills)
              ? app.job.keySkills
              : [],
            industryType: app.job.industryType || "N/A",
            category: app.job.category || "N/A",
            openings: app.job.openings ?? 0,
            status: app.job.status || "N/A",
            postedAt: app.job.postedAt,
          },
        })),
      };
    } catch (error: any) {
      console.error("Error in fetchInitialJobApplications:", error);
      throw new Error(
        error.message || "Error fetching initial job applications"
      );
    }
  };

// Fetch more job applications (next 10)
export const fetchMoreJobApplications = async (
  page: number
): Promise<JobApplicationsResponse> => {
  try {
    const response: AxiosResponse<JobApplicationsResponse> =
      await axiosInstance.get("/job-applications/get-job-candidates-details", {
        params: { page },
      });
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch more job applications"
      );
    }
    return {
      ...response.data,
      data: response.data.data.map((app) => ({
        applicationId: app.applicationId,
        appliedAt: app.appliedAt,
        updatedAt: app.updatedAt,
        candidate: {
          fullName: app.candidate.fullName || "N/A",
          email: app.candidate.email || "N/A",
          resumeUrl: app.candidate.resumeUrl || null,
          phone: app.candidate.phone || "N/A",
          totalExperience: app.candidate.totalExperience ?? 0,
          city: app.candidate.city || "N/A",
        },
        job: {
          jobId: app.job.jobId || "",
          title: app.job.title || "N/A",
          companyName: app.job.companyName || "N/A",
          location: app.job.location || "N/A",
          salaryRange: app.job.salaryRange || "N/A",
          jobType: app.job.jobType || "N/A",
          minExperience: app.job.minExperience ?? 0,
          maxExperience: app.job.maxExperience ?? 0,
          keySkills: Array.isArray(app.job.keySkills) ? app.job.keySkills : [],
          industryType: app.job.industryType || "N/A",
          category: app.job.category || "N/A",
          openings: app.job.openings ?? 0,
          status: app.job.status || "N/A",
          postedAt: app.job.postedAt,
        },
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchMoreJobApplications:", error);
    throw new Error(error.message || "Error fetching more job applications");
  }
};
