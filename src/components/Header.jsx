import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  // Lấy state user và hàm logout từ Context
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
            <img src="/assets/images/anh_logo.jpg" />
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition">
            Trang chủ
          </Link>
          <Link to="/courses" className="hover:text-blue-600 transition">
            Khóa học
          </Link>
          <Link to="/leaderboard" className="hover:text-blue-600 transition">
            Xếp hạng
          </Link>
        </nav>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-4">
          {user ? (
            // TRẠNG THÁI ĐÃ ĐĂNG NHẬP
            <div className="flex items-center gap-4">
              <div
                className="hidden md:block text-right cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <p className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
                  {user.username}
                </p>
                <p className="text-xs text-slate-500">
                  {user.role === "admin" ? "Quản trị viên" : "Học viên"}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(user.role === "admin" ? "/admin" : "/dashboard")
                }
                className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold hover:bg-blue-200 transition"
                title="Vào trang quản lý"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {/* Nút Đăng xuất */}
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-500 transition ml-2 p-2 rounded-full hover:bg-red-50"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            // TRẠNG THÁI CHƯA ĐĂNG NHẬP
            <>
              <Link
                to="/login"
                className="hidden md:block text-slate-600 font-semibold hover:text-blue-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-md hover:shadow-blue-500/30"
              >
                Đăng ký miễn phí
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
