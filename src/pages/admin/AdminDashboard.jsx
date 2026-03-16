import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Target,
  Activity,
  Plus,
  MoreVertical,
  TrendingUp,
  Award,
  Loader2,
  Zap,
} from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // State lưu trữ số liệu thật
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalCompletedLessons: 0,
    totalSystemPoints: 0,
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi 3 API cùng lúc để tối ưu thời gian tải trang
        const [statsRes, coursesRes, leaderboardRes] = await Promise.all([
          axiosClient.get("/admin/stats"),
          axiosClient.get("/courses/all"),
          axiosClient.get("/leaderboard?limit=5"),
        ]);

        // 1. Cập nhật Thống kê tổng quan
        if (statsRes.success) {
          const data = statsRes.data;
          setStats({
            totalCourses: parseInt(data.total_courses),
            totalStudents: parseInt(data.total_students),
            totalCompletedLessons: parseInt(data.total_completed_lessons),
            totalSystemPoints: parseInt(data.total_system_points),
          });
        }

        // 2. Cập nhật 5 khóa học mới nhất
        if (coursesRes.success) {
          setRecentCourses(coursesRes.data.slice(0, 5));
        }

        // 3. Cập nhật Bảng xếp hạng 5 học viên
        if (leaderboardRes.success) {
          setTopStudents(leaderboardRes.data.top_users || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Admin Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
        <p className="font-bold text-slate-500">
          Đang đồng bộ dữ liệu hệ thống...
        </p>
      </div>
    );
  }

  // Dữ liệu cho các thẻ thống kê được truyền từ state thực tế
  const statCards = [
    {
      title: "Tổng số khóa học",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Học viên hệ thống",
      value: stats.totalStudents,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Bài học đã hoàn thành",
      value: stats.totalCompletedLessons,
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Tổng điểm đã phát",
      value: stats.totalSystemPoints,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Chào mừng trở lại, {user?.username || "Admin"}!
          </h1>
          <p className="text-slate-500 font-medium">
            Dưới đây là dữ liệu tổng quan theo thời gian thực của toàn bộ hệ
            thống.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses/create"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Tạo khóa học mới
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}
              >
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  {/* Hiển thị dấu phẩy phân cách hàng nghìn cho số lớn */}
                  {stat.value.toLocaleString("vi-VN")}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT COURSES TABLE (Left 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800">
                Khóa học mới nhất
              </h2>
            </div>
            <Link
              to="/admin/courses"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-black">
                  <th className="p-4 pl-8">Tên khóa học</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4 text-right pr-8">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    <td className="p-4 pl-8 font-bold text-slate-800">
                      {course.title}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          course.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {course.status === "published"
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {new Date(course.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-right pr-8">
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="text-slate-400 hover:text-blue-600 transition p-2 opacity-0 group-hover:opacity-100"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentCourses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">
                      Chưa có khóa học nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP STUDENTS (Right 1/3) */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Award size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800">
                Top 5 Học viên
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                      : index === 1
                        ? "bg-slate-100 text-slate-600 border-2 border-slate-200"
                        : index === 2
                          ? "bg-orange-100 text-orange-700 border-2 border-orange-200"
                          : "bg-blue-50 text-blue-600"
                  }`}
                >
                  #{index + 1}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-slate-800 truncate">
                    {student.username}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    Cấp độ {student.current_level}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-blue-600">
                    {student.total_points}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Điểm
                  </p>
                </div>
              </div>
            ))}

            {topStudents.length === 0 && (
              <p className="text-center text-slate-500">
                Chưa có dữ liệu xếp hạng.
              </p>
            )}

            <Link
              to="/admin/users"
              className="mt-auto pt-4 w-full py-3 bg-slate-50 text-slate-700 font-bold text-center rounded-xl hover:bg-slate-100 transition border border-slate-200 block"
            >
              Quản lý tất cả học viên
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
