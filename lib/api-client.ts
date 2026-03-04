import axios from "axios";
// import { AuthService } from "@/services/auth.service";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de respuesta para manejar tokens expirados
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Si es un error 401 (token expirado) y no es una solicitud de refresh
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/token/refresh/")
//     ) {
//       originalRequest._retry = true;

//       if (!AuthService.getIsRefreshing()) {
//         AuthService.setIsRefreshing(true);

//         try {
//           // Intentar refrescar el token
//           await AuthService.refreshToken();
//           AuthService.setIsRefreshing(false);
//           AuthService.resetRefreshSubscribers();

//           // Reintentar la solicitud original
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           // Si el refresh falla, redirigir al login
//           AuthService.resetRefreshSubscribers();
//           if (typeof window !== "undefined") {
//             window.location.href = "/auth/login";
//           }
//           return Promise.reject(refreshError);
//         }
//       } else {
//         // Si ya se está refrescando, esperar y reintentar
//         return new Promise((resolve) => {
//           AuthService.getRefreshSubscribers().push(() => {
//             resolve(apiClient(originalRequest));
//           });
//         });
//       }
//     }

//     return Promise.reject(error);
//   }
// );