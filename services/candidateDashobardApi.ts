import axiosInstance from "@/utils/axios"

export interface CandidateJob {
    id: number
    title: string
    company: string
    location: string
    salary: string
    posted: string
    tags: string[]
    matchScore?: number
    savedAt?: string
  }

  interface SavedJobResponse {
    jobs: CandidateJob[];
    totalJobs: number;
    currentPage: number;
    totalPages: number;
  }

  interface CandidateStats {
    jobsApplied: number;
    savedJobs: number;
    profileStrength: number;
    jobsAppliedPercentageChange: string;
    savedJobsPercentageChange: string;
  }

  export const getSavedJobsByCandidateId = async (candidateId: string, page: number = 1, limit: number = 9): Promise<SavedJobResponse> =>{
    try {

    const response = await axiosInstance.get(`/candidate-dashboard/saved-job/${candidateId}?page=${page}?limit=${limit}`);
    return response.data
        
    } catch (error) {
        console.error("Error fetching saved jobs:", error.message);
        throw error;
    }
  }


  export const getAppliedJobsByCandidateId = async (candidateId: string, page: number = 1, limit: number = 9): Promise<SavedJobResponse> =>{
    try {

    const response = await axiosInstance.get(`/candidate-dashboard/applied-job/${candidateId}?page=${page}?limit=${limit}`);
    return response.data
        
    } catch (error) {
        console.error("Error fetching applied jobs:", error.message);
        throw error;
    }
  }


  export const getCandidateStats = async (candidateId: string): Promise<CandidateStats> => {
    try {
      const response = await axiosInstance.get(`/candidate-dashboard/candidate-stats/${candidateId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching candidate stats:", error.message);
      throw error;
    }
  };


  