// hooks/useLogin.ts
import useSWRMutation from "swr/mutation";

import { AuthResponse, LoginPayload } from "@/types/auth";
import axiosInstance from "../utils/axios";

const loginFetcher = async (
  url: string,
  { arg }: { arg: LoginPayload }
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(url, arg);
  return response.data;
};

export const useLogin = () => {
  return useSWRMutation<AuthResponse, Error, string, LoginPayload>("/auth/login", loginFetcher);
};
