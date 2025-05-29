import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o desde context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
