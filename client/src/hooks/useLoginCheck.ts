import { useEffect } from "react";
import { userStore, type Role } from "../state/global";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "../lib/api";
import api from "../lib/axios/axios";
import type { Response } from "../types";

interface UserResponse extends Response {
  data: {
    email: string;
  password: string;
  id: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  }
}

async function getMe() {
  const res = await api.get<UserResponse>(API_ROUTES.AUTH.ME);
  return res.data;
}

interface AxiosErr extends Error {
  status?: number;
}

export default function useCheckLogin() {
  const navigate = useNavigate();
  const token = userStore(state => state.token);
  const setRole = userStore(state => state.setRole);
  const setEmail = userStore(state => state.setEmail);

  const mequery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    const error = mequery.error as AxiosErr | null;
    const data = mequery.data?.data;
    if (data) {
      console.log("User data fetched:", data);
      setRole(data.role);
      setEmail(data.email);
    }
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login", { replace: true });
    } else if (error?.status === 403) {
      console.log("Error fetching user data:", error);
      navigate("/login", { replace: true });
    }
  }, [mequery.data, token, mequery.error, navigate]);

}