import axiosInstance from "@/utils/axios";


interface applyJobResponse {
    message: string;

    applyJob: {
        candidateId: string;
        jobId: string;
        createdAt: string;
        updatedAt: string;
    }
}


export const applyJob = async(candidateId: string, jobId: string): Promise<applyJobResponse> => {
    try {
        const response = await axiosInstance.post('/apply-job/create', {candidateId, jobId})
        return response.data;
    } catch (error) {
        console.error("Error saving job:", error.message);
    throw error;
    }
}

export const checkJobAppliedOrNot = async (candidateId: string, jobId: string): Promise<number> => {
    try {
      const response = await axiosInstance.get(`/apply-job/applied-or-not/${candidateId}/${jobId}`);
      return response.data.applied;  // If saved, returns 1; if not, returns 0
    } catch (error) {
      console.error("Error checking to job applied or not:", error.message);
      throw error;
    }
}
