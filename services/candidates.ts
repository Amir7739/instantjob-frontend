import axiosInstance from "@/utils/axios";
import { AxiosError, AxiosResponse } from "axios";

// Define interfaces based on the API response
export interface Education {
  degree: string;
  stream: string;
  institute: string;
  passingYear: number;
  score: string;
  _id: string;
}

export interface Experience {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  location?: string;
  currentlyWorking: boolean;
  description: string;
  _id: string;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl?: string;
  city?: string;
  dob?: string;
  education: Education[];
  expectedSalary?: string;
  experience: Experience[];
  gender?: string;
  noticePeriod?: string;
  pincode?: string;
  preferredJobType?: string;
  preferredLocation?: string;
  skills: string[];
  state?: string;
  totalExperience?: string;
  profileImage?: string;
}

interface CandidatesResponse {
  message: string;
  candidates: Candidate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCandidates: number;
    candidatesPerPage: number;
  };
}

interface AddCandidateResponse {
  message: string;
  candidate: Candidate;
}

interface ErrorResponse {
  message: string;
}

// Fetch initial candidates (first 10)
export const fetchInitialCandidates = async (): Promise<CandidatesResponse> => {
  try {
    const response: AxiosResponse<CandidatesResponse> = await axiosInstance.get(
      "/candidates/all-candidate",
      {
        params: { page: 1 },
      }
    );

    return {
      ...response.data,
      candidates: response.data.candidates.map((candidate) => ({
        ...candidate,
        id: candidate._id || candidate.id,
        full_name: candidate.full_name || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        role: candidate.role || "candidate",
        resumeUrl: candidate.resumeUrl || null,
        city: candidate.city || "",
        dob: candidate.dob
          ? new Date(candidate.dob).toISOString().split("T")[0]
          : "",
        education: Array.isArray(candidate.education)
          ? candidate.education
          : [],
        expectedSalary: candidate.expectedSalary || "",
        experience: Array.isArray(candidate.experience)
          ? candidate.experience
          : [],
        gender: candidate.gender || "",
        noticePeriod: candidate.noticePeriod || "",
        pincode: candidate.pincode || "",
        preferredJobType: candidate.preferredJobType || "",
        preferredLocation: candidate.preferredLocation || "",
        skills: Array.isArray(candidate.skills) ? candidate.skills : [],
        state: candidate.state || "",
        totalExperience: candidate.totalExperience || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchInitialCandidates:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching initial candidates"
    );
  }
};

// Fetch more candidates (next 10)
export const fetchMoreCandidates = async (
  page: number
): Promise<CandidatesResponse> => {
  try {
    const response: AxiosResponse<CandidatesResponse> = await axiosInstance.get(
      "/candidates/all-candidate",
      {
        params: { page },
      }
    );
    return {
      ...response.data,
      candidates: response.data.candidates.map((candidate) => ({
        ...candidate,
        id: candidate._id || candidate.id,
        full_name: candidate.full_name || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        role: candidate.role || "candidate",
        resumeUrl: candidate.resumeUrl || null,
        city: candidate.city || "",
        dob: candidate.dob
          ? new Date(candidate.dob).toISOString().split("T")[0]
          : "",
        education: Array.isArray(candidate.education)
          ? candidate.education
          : [],
        expectedSalary: candidate.expectedSalary || "",
        experience: Array.isArray(candidate.experience)
          ? candidate.experience
          : [],
        gender: candidate.gender || "",
        noticePeriod: candidate.noticePeriod || "",
        pincode: candidate.pincode || "",
        preferredJobType: candidate.preferredJobType || "",
        preferredLocation: candidate.preferredLocation || "",
        skills: Array.isArray(candidate.skills) ? candidate.skills : [],
        state: candidate.state || "",
        totalExperience: candidate.totalExperience || "",
      })),
    };
  } catch (error: any) {
    console.error("Error in fetchMoreCandidates:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching more candidates"
    );
  }
};


export const fetchInitialInActiveCandidates = async (): Promise<CandidatesResponse> => {
    try {
      const response: AxiosResponse<CandidatesResponse> = await axiosInstance.get(
        "/candidates/in-active/all-candidate",
        {
          params: { page: 1 },
        }
      );
  
      return {
        ...response.data,
        candidates: response.data.candidates.map((candidate) => ({
          ...candidate,
          id: candidate._id || candidate.id,
          full_name: candidate.full_name || "",
          email: candidate.email || "",
          phone: candidate.phone || "",
          role: candidate.role || "candidate",
          resumeUrl: candidate.resumeUrl || null,
          city: candidate.city || "",
          dob: candidate.dob
            ? new Date(candidate.dob).toISOString().split("T")[0]
            : "",
          education: Array.isArray(candidate.education)
            ? candidate.education
            : [],
          expectedSalary: candidate.expectedSalary || "",
          experience: Array.isArray(candidate.experience)
            ? candidate.experience
            : [],
          gender: candidate.gender || "",
          noticePeriod: candidate.noticePeriod || "",
          pincode: candidate.pincode || "",
          preferredJobType: candidate.preferredJobType || "",
          preferredLocation: candidate.preferredLocation || "",
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          state: candidate.state || "",
          totalExperience: candidate.totalExperience || "",
        })),
      };
    } catch (error: any) {
      console.error("Error in fetchInitialCandidates:", error);
      throw new Error(
        error.response?.data?.message || "Error fetching initial candidates"
      );
    }
  };


  export const fetchMoreInActiveCandidates = async (
    page: number
  ): Promise<CandidatesResponse> => {
    try {
      const response: AxiosResponse<CandidatesResponse> = await axiosInstance.get(
        "/candidates/in-active/all-candidate",
        {
          params: { page },
        }
      );
      return {
        ...response.data,
        candidates: response.data.candidates.map((candidate) => ({
          ...candidate,
          id: candidate._id || candidate.id,
          full_name: candidate.full_name || "",
          email: candidate.email || "",
          phone: candidate.phone || "",
          role: candidate.role || "candidate",
          resumeUrl: candidate.resumeUrl || null,
          city: candidate.city || "",
          dob: candidate.dob
            ? new Date(candidate.dob).toISOString().split("T")[0]
            : "",
          education: Array.isArray(candidate.education)
            ? candidate.education
            : [],
          expectedSalary: candidate.expectedSalary || "",
          experience: Array.isArray(candidate.experience)
            ? candidate.experience
            : [],
          gender: candidate.gender || "",
          noticePeriod: candidate.noticePeriod || "",
          pincode: candidate.pincode || "",
          preferredJobType: candidate.preferredJobType || "",
          preferredLocation: candidate.preferredLocation || "",
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          state: candidate.state || "",
          totalExperience: candidate.totalExperience || "",
        })),
      };
    } catch (error: any) {
      console.error("Error in fetchMoreCandidates:", error);
      throw new Error(
        error.response?.data?.message || "Error fetching more candidates"
      );
    }
  };


export const fetchCandidateById = async (candidateId: string): Promise<Candidate> => {
    try {
      const response: AxiosResponse<Candidate> = await axiosInstance.get(`/candidates/get/${candidateId}`);
  
      const candidate = response.data;
  
      return {
        ...candidate,
        id: candidate._id || candidate.id,
        full_name: candidate.full_name || "",
        profileImage: candidate.profileImage || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        role: candidate.role || "candidate",
        resumeUrl: candidate.resumeUrl || null,
        city: candidate.city || "",
        dob: candidate.dob ? new Date(candidate.dob).toISOString().split("T")[0] : "",
        education: Array.isArray(candidate.education) ? candidate.education : [],
        expectedSalary: candidate.expectedSalary || "",
        experience: Array.isArray(candidate.experience) ? candidate.experience : [],
        gender: candidate.gender || "",
        noticePeriod: candidate.noticePeriod || "",
        pincode: candidate.pincode || "",
        preferredJobType: candidate.preferredJobType || "",
        preferredLocation: candidate.preferredLocation || "",
        skills: Array.isArray(candidate.skills) ? candidate.skills : [],
        state: candidate.state || "",
        totalExperience: candidate.totalExperience || "",
      };
    } catch (error: any) {
      console.error("Error in fetchCandidateById:", error);
      throw new Error(
        error.response?.data?.message || "Error fetching candidate details"
      );
    }
}

// Replace deactivateCandidate and activateCandidate with a single function
export const updateCandidateStatus = async (candidateId: string, status: 'Active' | 'In-Active'): Promise<void> => {
    try {
      await axiosInstance.patch(`/candidates/update/status/${candidateId}`, { status });
    } catch (error: any) {
      console.error(`Error updating candidate status to ${status}:`, error);
      throw new Error(
        error.response?.data?.message || `Error updating candidate status to ${status}`
      );
    }
  };


  export const addSingleCandidate = async (
  formData: FormData
): Promise<AddCandidateResponse> => {
  try {
    const response = await axiosInstance.post<AddCandidateResponse>(
      "/upload-single-candidate",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to add candidate"
    );
  }
};