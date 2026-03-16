import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Trophy,
  Star,
  PlayCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi song song 2 API để tối ưu tốc độ tải trang
        const [progressRes, leaderboardRes] = await Promise.all([
          axiosClient.get("/progress/courses"),
          axiosClient.get("/leaderboard?limit=1"), // Chỉ cần limit 1 vì ta chủ yếu lấy current_user_ranking
        ]);

        if (progressRes.success) {
          setEnrolledCourses(progressRes.data);
        }

        if (
          leaderboardRes.success &&
          leaderboardRes.data.current_user_ranking
        ) {
          setUserRank(leaderboardRes.data.current_user_ranking.rank);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">
          Đang tải dữ liệu học tập...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* HEADER SECTION - THÔNG TIN HỌC VIÊN */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl text-white flex items-center justify-center font-black text-4xl shadow-lg shadow-blue-500/30 shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                Xin chào, {user?.username}!
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                Cấp độ hiện tại:{" "}
                <span className="text-blue-600 font-bold">
                  Level {user?.current_level || 1}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 md:flex-none text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Tổng điểm
              </p>
              <p className="text-2xl font-black text-slate-800">
                {user?.total_points || 0}
              </p>
            </div>
            <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 flex-1 md:flex-none text-center">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                Thứ hạng
              </p>
              <p className="text-2xl font-black text-blue-700 flex items-center justify-center gap-1">
                <Trophy size={20} className="text-blue-600" />
                {userRank ? `#${userRank}` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH KHÓA HỌC ĐANG THAM GIA */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={24} className="text-blue-600" />
            Khóa học của bạn
          </h2>
          <Link
            to="/courses"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Khám phá thêm <ArrowRight size={16} />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          // TRẠNG THÁI TRỐNG (EMPTY STATE) KHI CHƯA ĐĂNG KÝ KHÓA NÀO
          <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Bạn chưa đăng ký khóa học nào
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Hãy khám phá thư viện khóa học của chúng tôi và bắt đầu hành trình
              chinh phục tiếng Anh ngay hôm nay.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Xem danh sách khóa học
            </button>
          </div>
        ) : (
          // LƯỚI KHÓA HỌC
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                    {course.description || "Chưa có mô tả cho khóa học này."}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Thanh Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">
                        Tiến độ
                      </span>
                      <span className="font-bold text-blue-600">
                        {course.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                    className="w-full py-3 bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition border border-slate-100"
                  >
                    <PlayCircle size={18} />
                    Tiếp tục học
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
