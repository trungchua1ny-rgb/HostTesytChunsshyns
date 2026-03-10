import axios from "axios";

const api = axios.create({
  // Sử dụng link Render của bạn làm mặc định
  baseURL: "https://hosttesytchunsshyns-1.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Tự động gắn JWT token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động redirect về login nếu token hết hạn (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa dữ liệu cũ để tránh xung đột
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Chuyển hướng người dùng về trang login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
