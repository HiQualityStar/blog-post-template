"use client";

import {} from "@/types/authApiType";
import { CHECKUSERNAME, SETUSERNAME } from "@/utils/constant";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  CheckUsernameErrorRes,
  CheckUsernameSuccessRes,
  SetUsernameErrorRes,
  SetUsernameSuccessRes,
} from "@/types/userApiType";

const useUserSetting = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const token = Cookies.get("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // check username
  const checkUsername = async (): Promise<
    CheckUsernameSuccessRes | CheckUsernameErrorRes
  > => {
    setLoading(true);
    try {
      const res: AxiosResponse<
        CheckUsernameSuccessRes | CheckUsernameErrorRes
      > = await axios.get(CHECKUSERNAME, config);
      return { ...res.data, status: res.status }; // Return the response data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          message: error.response?.data?.message && "Something went wrong.",
          status: error.response?.status || 500, // Add default/fallback status
        };
      }
      return {
        message: "An unknown error occurred",
        status: 500,
      };
    } finally {
      setLoading(false);
    }
  };
  // set username
  const setUsername = async (
    userName: string
  ): Promise<SetUsernameSuccessRes | SetUsernameErrorRes> => {
    setLoading(true);
    try {
      const res: AxiosResponse<SetUsernameSuccessRes | SetUsernameErrorRes> =
        await axios.put(SETUSERNAME, { userName }, config);
      return { ...res.data, status: res.status }; // Return the response data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          message: error.response?.data?.message && "Something went wrong.",
          status: error.response?.status || 500, // Add default/fallback status
        };
      }
      return {
        message: "An unknown error occurred",
        status: 500,
      };
    } finally {
      setLoading(false);
    }
  };

  return { checkUsername, setUsername, loading };
};

export default useUserSetting;
