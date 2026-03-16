import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react"; // Sử dụng Lucide React cho icon đồng bộ
import useAuth from "../hooks/useAuth";

function Sidebar() {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation(); // Để active màu link đang chọn

  // Hàm kiểm tra link hiện tại để đổi màu icon/text
  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) => `
        flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
        ${
          isActive(path)
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
        }
    `;

  return (
    <aside className="w-72 h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
      {/* LOGO TRONG SIDEBAR */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
          M
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">
          Monkey Admin
        </span>
      </div>

      {/* NHÓM MENU CHÍNH */}
      <div className="flex-1 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          Menu chính
        </p>

        <Link to="/" className={navItemClass("/")}>
          <div className="flex items-center gap-3">
            <Home size={20} />
            <span className="font-bold">Trang chủ</span>
          </div>
          <ChevronRight
            size={14}
            className={
              isActive("/")
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
          />
        </Link>

        <Link to="/courses" className={navItemClass("/courses")}>
          <div className="flex items-center gap-3">
            <BookOpen size={20} />
            <span className="font-bold">Khóa học</span>
          </div>
          <ChevronRight
            size={14}
            className={
              isActive("/courses")
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
          />
        </Link>

        {/* PHẦN DÀNH CHO ADMIN */}
        {isAuthenticated() && isAdmin() && (
          <div className="pt-8 space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Quản trị hệ thống
            </p>

            <Link
              to="/admin/dashboard"
              className={navItemClass("/admin/dashboard")}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                <span className="font-bold">Bảng điều khiển</span>
              </div>
            </Link>

            <Link to="/admin/users" className={navItemClass("/admin/users")}>
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span className="font-bold">Quản lý người dùng</span>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className={navItemClass("/admin/settings")}
            >
              <div className="flex items-center gap-3">
                <Settings size={20} />
                <span className="font-bold">Cài đặt</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG XUẤT PHÍA DƯỚI */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
