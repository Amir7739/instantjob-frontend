// hooks/useLogin.ts
import useSWRMutation from "swr/mutation";
import axios from "../utils/axios";
import { AuthResponse, LoginPayload } from "@/types/auth";

const loginFetcher = async (
  url: string,
  { arg }: { arg: LoginPayload }
): Promise<AuthResponse> => {
  const response = await axios.post(url, arg);
  return response.data;
};

export const useLogin = () => {
  return useSWRMutation<AuthResponse, Error, string, LoginPayload>("/auth/login", loginFetcher);
};
