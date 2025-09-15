import { useEffect } from "react";
import { userStore } from "../state/global";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "../lib/api";
import api from "../lib/axios/axios";

async function getMe() {
  const res = await api.get(API_ROUTES.AUTH.ME);
  return res.data;
}

interface AxiosErr extends Error {
  status?: number;
}

export default function useCheckLogin() {
  const navigate = useNavigate();
  const token = userStore(state => state.token);

  const mequery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    const error = mequery.error as AxiosErr | null;
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate("/login", { replace: true });
    } else if (error?.status === 403) {
      console.log("Error fetching user data:", error);
      navigate("/login", { replace: true });
    }
  }, [token, mequery.error, navigate]);

}