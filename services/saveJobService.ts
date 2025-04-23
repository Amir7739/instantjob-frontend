
import axiosInstance from "@/utils/axios";

// Define types for request and response
interface SaveJobResponse {
  message: string;
  savedJob: {
    candidateId: string;
    jobId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Function to save a job by candidateId and jobId
export const saveJob = async (candidateId: string, jobId: string): Promise<SaveJobResponse> => {
  try {
    const response = await axiosInstance.post('/save-jobs/create', { candidateId, jobId });
    return response.data;
  } catch (error) {
    console.error("Error saving job:", error.message);
    throw error;
  }
};

// Function to fetch saved job details by candidateId and jobId
export const getSavedJobDetails = async (candidateId: string, jobId: string) => {
  try {
    const response = await axiosInstance.get(`/save-jobs/get/${candidateId}/${jobId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved job:", error.message);
    throw error;
  }
};


export const checkSavedJob = async (candidateId: string, jobId: string): Promise<number> => {
    try {
      const response = await axiosInstance.get(`/save-jobs/saved-status/${candidateId}/${jobId}`);
      return response.data.saved;  // If saved, returns 1; if not, returns 0
    } catch (error) {
      console.error("Error checking saved job status:", error.message);
      throw error;
    }
}
