  import axios from "axios";
  import {store} from "../store/store";
import { resetUser } from "@/store/slice/userSlice";


  // Get the API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('this is th urell',API_URL); 

if (!API_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined");
}

  // Ensure the base URL is properly formatted
  const normalizeBaseURL = (url: string) => {
    if (!url) {
      throw new Error("API_URL is not defined in environment variables");
    }

    const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    try {
      new URL(cleanUrl);
    } catch (error) {
        console.error(error)
      throw new Error(
        `Invalid API_URL: ${url}. URL must include protocol (e.g., http:// or https://)`
      );
    }

    return cleanUrl;
  };

  // Create axios instance with normalized base URL
  export const userAxiosInstance = axios.create({
    baseURL: normalizeBaseURL(API_URL),
    withCredentials: true,
  });

  // Request interceptor
  userAxiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  userAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await getNewAccessToken();
          
          if (!newAccessToken) {
            // Force logout if no new token
            store.dispatch(resetUser());
            return Promise.reject(error);
          }

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return userAxiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token Refresh Failed:', refreshError);
          store.dispatch(resetUser());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  async function getNewAccessToken() {
      try {
        
          if (!API_URL) {
            throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined");
            }
      const response = await axios.post(
        `${normalizeBaseURL(API_URL)}/api/auth/refresh-token`,
        { withCredentials: true }
      );

      console.log('Refresh Token Response:', response.data); // Add detailed logging
      
      if (!response.data?.data?.accessToken) {
        throw new Error("No access token received from refresh token endpoint");
      }

      return response.data.data.accessToken;
    } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Detailed Refresh Token Error:", error.response?.data || error.message);
    } else {
        console.error("Unknown error:", error);
    }
    }
  }
