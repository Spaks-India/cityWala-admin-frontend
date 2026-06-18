// import axios from 'axios'

// const getStorage = () => {
//   if (typeof window === 'undefined') return null
//   return window.localStorage || null
// }

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   // baseURL: import.meta.env.VITE_API_URL || 'https://citywala-backend.onrender.com/api',
// })

// // Auto attach token from localStorage
// API.interceptors.request.use((config) => {
//   const storage = getStorage()
//   const token =
//     storage?.getItem('adminToken') ||
//     storage?.getItem('partnerToken') ||
//     storage?.getItem('token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // Auto logout on 401
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       const storage = getStorage()
//       storage?.removeItem('token')
//       storage?.removeItem('partnerToken')
//       storage?.removeItem('adminToken')
//     }
//     return Promise.reject(err)
//   }
// )

// export default API
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://citywala-backend-production.up.railway.app/api",
  withCredentials: true, // cookies enabled
});

// request interceptor (NO TOKEN NEEDED)
API.interceptors.request.use((config) => {
  return config;
});

// auto logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;