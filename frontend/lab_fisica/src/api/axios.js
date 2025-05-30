import axios from "axios";

/**
 * Instancia personalizada de Axios configurada para comunicarse con el backend.
 * - Base URL apuntando a la API en http://localhost:4000/api
 * - Incluye credenciales (cookies) en las solicitudes.
 */
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
});

/**
 * Interceptor que se ejecuta antes de cada solicitud.
 * - Obtiene el token almacenado en localStorage.
 * - Si existe token, lo añade en el header Authorization como 'Bearer <token>'.
 * 
 * @param {import("axios").AxiosRequestConfig} config - Configuración de la solicitud.
 * @returns {import("axios").AxiosRequestConfig} Configuración modificada con el token en headers.
 */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Obtener el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
