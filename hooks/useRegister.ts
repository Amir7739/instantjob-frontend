import useSWRMutation from "swr/mutation";
import { RegisterPayload, AuthResponse } from "@/types/auth";
import axiosInstance from "../utils/axios";

const registerFetcher = async (
  url: string,
  { arg }: { arg: RegisterPayload }
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(url, arg);
  return response.data;
};

export const useRegister = () =>
    useSWRMutation<AuthResponse, Error, string, RegisterPayload>(
      "/auth/register",
      registerFetcher
    );
