import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_URL_API, // Đổi URL này theo Backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho Request: Tự động gắn Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor cho Response: Xử lý lỗi chung (VD: 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ lấy phần data từ response của axios
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Nếu lỗi 401 (chưa đăng nhập hoặc token hết hạn)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Bắt buộc đăng nhập lại
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
