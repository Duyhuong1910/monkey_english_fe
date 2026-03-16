import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. AN TOÀN KHI ĐỌC DỮ LIỆU TỪ LOCALSTORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Kiểm tra có dữ liệu và không phải là chuỗi "undefined" hoặc "null"
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Bắt lỗi nếu chuỗi JSON bị hỏng
        console.error(
          "Dữ liệu user trong localStorage bị lỗi định dạng:",
          error,
        );
        localStorage.removeItem("user"); // Dọn dẹp rác
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // 2. AN TOÀN KHI GHI DỮ LIỆU LÚC ĐĂNG NHẬP
  const login = (userData, token) => {
    // Chặn ngay lập tức nếu dữ liệu truyền vào bị thiếu
    if (!userData || !token) {
      console.error("Không thể đăng nhập: Thiếu userData hoặc token");
      return;
    }

    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin đăng nhập:", error);
    }
  };

  // 3. AN TOÀN KHI ĐĂNG XUẤT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Khuyến nghị: Dùng thư viện điều hướng thay vì window.location để tránh reload lại toàn trang nếu không cần thiết
    // Tuy nhiên nếu hệ thống cần clear state triệt để thì window.location.href vẫn ổn định.
    window.location.href = "/login";
  };

  // Màn hình chờ khi đang check token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  const updateUserLocal = (newStats) => {
    if (!newStats || !user) return;

    const updatedUser = {
      ...user,
      total_points: newStats.total_points,
      current_level: newStats.current_level,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
};
