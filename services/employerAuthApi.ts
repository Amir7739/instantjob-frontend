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