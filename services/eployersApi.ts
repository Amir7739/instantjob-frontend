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
