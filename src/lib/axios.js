import axios from "axios";

const customInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
customInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    config.headers.Authorization = token ? `Bearer ${token}` : "";
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  }
  return config;
});

export default customInstance;
