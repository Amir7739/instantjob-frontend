import axiosInstance from "@/utils/axios";


export const loginRecruiter = async (formData: FormData) => {
  // Convert FormData to JSON object
  const data = Object.fromEntries(formData.entries());

  const response = await axiosInstance.post(`/recruiter/login`, data);
  return response.data; // { token: string }
};


export const fetchRecruiterCandidates = async (token: string) => {
  const res = await axiosInstance.get(`/recruiter/candidates/get-by-recruiterId`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.candidates;
};

// Add a new candidate
export const addRecruiterCandidate = async (formData: FormData, token: string) => {
  const res = await axiosInstance.post(`/recruiter/candidates/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateRecruiterCandidate = async (id: string, formData: FormData, token: string) => {
  try {
    const response = await axiosInstance.put(`/recruiter/candidates/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update candidate');
  }
};
