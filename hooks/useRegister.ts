import useSWRMutation from "swr/mutation";
import axios from "../utils/axios";
import { RegisterPayload, AuthResponse } from "@/types/auth";

const registerFetcher = async (
  url: string,
  { arg }: { arg: RegisterPayload }
): Promise<AuthResponse> => {
  const response = await axios.post(url, arg);
  return response.data;
};

export const useRegister = () =>
    useSWRMutation<AuthResponse, Error, string, RegisterPayload>(
      "/auth/register",
      registerFetcher
    );
