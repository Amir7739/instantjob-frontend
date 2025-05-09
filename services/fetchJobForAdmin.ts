import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";

// Define the Job interface based on your API response
interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange?: string;
  jobType: string;
  minExp: number;
  maxExp: number;
  companyLogo?: string | null;
  keySkills: string[];
  industryType: string;
  category: string;
  applyBy: string;
  openings: number;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  companyDescription: string;
}

interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  totalJobs: number;
  offset: number;
  limit: number;
}

// Fetch initial jobs (first 10)
export const fetchInitialJobs = async (): Promise<JobsResponse> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      "/jobs/admin-pannel",
      {
        params: { offset: 0, limit: 10 },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch initial jobs");
    }
    return {
      ...response.data,
      data: response.data.data.map((job) => ({
        ...job,
        id: job._id || job.id, // Ensure id is set
        category: job.category || "", // Default to empty string
        companyLogo: job.companyLogo || null, // Set to null if missing
        applyBy: job.applyBy
          ? new Date(job.applyBy).toISOString().split("T")[0]
          : "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchInitialJobs:", error);
    throw new Error(error.message || "Error fetching initial jobs");
  }
};

// Fetch more jobs (next 10)
export const fetchMoreJobs = async (
  offset: number,
  title: string = ""
): Promise<JobsResponse> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      "/jobs/admin-pannel",
      {
        params: { offset, limit: 10, title },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch more jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchMoreJobs:", error);
    throw new Error(error.message || "Error fetching more jobs");
  }
};


export const fetchInitiaInActivelJobs = async (): Promise<JobsResponse> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      "/jobs/in-active",
      {
        params: { offset: 0, limit: 10 },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch initial jobs");
    }
    return {
      ...response.data,
      data: response.data.data.map((job) => ({
        ...job,
        id: job._id || job.id, // Ensure id is set
        category: job.category || "", // Default to empty string
        companyLogo: job.companyLogo || null, // Set to null if missing
        applyBy: job.applyBy
          ? new Date(job.applyBy).toISOString().split("T")[0]
          : "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchInitialJobs:", error);
    throw new Error(error.message || "Error fetching initial jobs");
  }
};


export const fetchMoreInActiveJobs = async (
  offset: number,
  title: string = ""
): Promise<JobsResponse> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      "/jobs/in-active",
      {
        params: { offset, limit: 10, title },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch more jobs");
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchMoreJobs:", error);
    throw new Error(error.message || "Error fetching more jobs");
  }
};

export const fetchJobById = async (id: string): Promise<Job> => {
  try {
    const response: AxiosResponse<JobsResponse> = await axiosInstance.get(
      `/jobs/get/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch job");
    }
    const job = response.data.job;
    const formattedJob = {
      id: job._id || job.id || id, // Use _id, fallback to id or input id
      title: job.title || "",
      companyName: job.companyName || "",
      location: job.location || "",
      salaryRange: job.salaryRange || "",
      jobType: job.jobType || "Full-time",
      minExp: job.minExp !== undefined ? job.minExp : 0,
      maxExp: job.maxExp !== undefined ? job.maxExp : 0,
      companyLogo: job.companyLogo || null, // Explicitly set to null if missing
      keySkills: Array.isArray(job.keySkills) ? job.keySkills : [],
      industryType: job.industryType || "",
      category: job.category || "", // Default to empty string if missing
      applyBy: job.applyBy
        ? new Date(job.applyBy).toISOString().split("T")[0]
        : "",
      openings: job.openings !== undefined ? job.openings : 1,
      description: job.description || "",
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities
        : [],
      qualifications: Array.isArray(job.qualifications)
        ? job.qualifications
        : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      companyDescription: job.companyDescription || "",
    };
    return formattedJob;
  } catch (error: any) {
    console.error("Error in fetchJobById:", error);
    throw new Error(error.message || "Error fetching job");
  }
};

export const deleteJob = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response: AxiosResponse<{ success: boolean; message: string }> =
      await axiosInstance.put(`/jobs/delete/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete job");
    }
    return response.data;
  } catch (error: any) {
    console.error("Error in deleteJob:", error);
    throw new Error(error.message || "Error deleting job");
  }
};


export const updateJobStatus = async (jobId: string, status: 'Active' | 'In-Active'): Promise<void> => {
  try {
    await axiosInstance.patch(`/jobs/update-status/${jobId}`, { status });
  } catch (error: any) {
    console.error(`Error updating job status to ${status}:`, error);
    throw new Error(
      error.response?.data?.message || `Error updating job status to ${status}`
    );
  }
};

