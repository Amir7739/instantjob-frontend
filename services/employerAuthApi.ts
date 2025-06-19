import axiosInstance from "@/utils/axios";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  email: string;
  companyName?: string;
  contactNumber: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface BulkUploadResponse {
  status: string;
  message: string;
  results: Array<{ row: number; email: string; status: string; message: string }>;
  errors: Array<{ row: number; message: string }>;
  totalProcessed: number;
  totalSuccess: number;
  totalErrors: number;
}

interface ErrorResponse {
  message: string;
}

export const signupEmployer = async (
  data: { companyName: string; email: string; password: string; contactNumber: string },
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/employers/signup", data, {
      headers: { "Content-Type": "application/json" },
    });
    // localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Signup failed",
    );
  }
};

export const loginEmployer = async (
  data: { email: string; password: string },
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/employers/login", data, {
      headers: { "Content-Type": "application/json" },
    });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Login failed",
    );
  }
};

export const bulkSignupEmployers = async (
  formData: FormData
): Promise<BulkUploadResponse> => {
  try {
    const response = await axiosInstance.post<BulkUploadResponse>(
      "/employers/bulk-signup",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Bulk signup failed"
    );
  }
};