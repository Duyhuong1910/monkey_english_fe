import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Search,
  BookOpen,
  ChevronRight,
  Loader2,
  Star,
  Plus,
  Tag as TagIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

const CoursePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({}); // { courseId: progress_percentage }
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // State phục vụ Tìm kiếm & Lọc
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Tất cả");

  const popularTags = [
    "Tất cả",
    "Giao tiếp",
    "TOEIC",
    "IELTS",
    "Ngữ pháp",
    "Cho người đi làm",
  ];

  // 1. Xử lý Debounce cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. Gọi API khi các điều kiện lọc thay đổi
  useEffect(() => {
    fetchCoursesData();
  }, [debouncedSearch, activeTag, user]);

  const fetchCoursesData = async () => {
    setLoading(true);
    try {
      // Chuẩn bị tham số Query
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeTag && activeTag !== "Tất cả") {
        params.tag = activeTag.toLowerCase(); // Chuẩn hóa lowercase gửi lên BE
      }

      // Lấy danh sách khóa học theo bộ lọc
      const coursesRes = await axiosClient.get("/courses", { params });

      if (coursesRes.success) {
        setCourses(coursesRes.data);
      }

      // Nếu đã đăng nhập, lấy thêm dữ liệu tiến độ thực tế
      if (user) {
        const progressRes = await axiosClient.get("/progress/courses");
        if (progressRes.success) {
          const map = {};
          progressRes.data.forEach((c) => {
            // Backend trả về c.id là ID khóa học và progress_percentage là số đã tính
            map[c.id] = parseFloat(c.progress_percentage) || 0;
          });
          setEnrolledMap(map);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để đăng ký khóa học!");
      return navigate("/login");
    }

    setActionLoading(courseId);
    try {
      const res = await axiosClient.post(
        `/progress/courses/${courseId}/enroll`,
      );
      if (res.success) {
        toast.success("Đăng ký thành công! Chúc bạn học tốt.");
        // Cập nhật local để chuyển nút thành "Tiếp tục học" ngay lập tức
        setEnrolledMap((prev) => ({ ...prev, [courseId]: 0 }));
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng ký thất bại!";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans bg-slate-50 min-h-screen">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Thư Viện <span className="text-blue-600">Khóa Học</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Lựa chọn lộ trình phù hợp để đạt mục tiêu của bạn nhanh nhất!
          </p>
        </div>

        <div className="relative group shadow-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm theo tên khóa học..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full md:w-80 transition-all font-medium text-slate-700"
          />
        </div>
      </header>

      {/* FILTER TAGS */}
      <div className="flex flex-wrap gap-3 mb-10">
        {popularTags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTag(tag)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTag === tag
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            {tag !== "Tất cả" && <TagIcon size={16} />}
            {tag}
          </button>
        ))}
      </div>

      {/* MAIN ROADMAP LIST */}
      <div className="space-y-12 relative">
        <section className="relative">
          {/* DECORATIVE LINE */}
          <div className="flex items-center gap-4 mb-10">
            <span className="px-6 py-2 bg-slate-900 text-white text-sm font-black rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">
              {activeTag === "Tất cả"
                ? "Toàn bộ lộ trình"
                : `Chủ đề: ${activeTag}`}
            </span>
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/4 animate-pulse"></div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
              <p className="font-bold">Đang lọc danh sách...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">
                Không tìm thấy khóa học nào
              </h3>
              <p className="text-slate-500 mt-1">
                Hãy thử đổi từ khóa hoặc bộ lọc thẻ khác.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course) => {
                const isEnrolled = enrolledMap.hasOwnProperty(course.id);
                const percent = isEnrolled ? enrolledMap[course.id] : 0;
                const isProcessing = actionLoading === course.id;

                return (
                  <div
                    key={course.id}
                    className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Progress Circle */}
                    <div className="w-24 h-24 shrink-0 transition-transform duration-500 group-hover:scale-110">
                      <CircularProgressbar
                        value={percent}
                        text={`${percent}%`}
                        styles={buildStyles({
                          pathColor:
                            percent === 100
                              ? "#10b981"
                              : isEnrolled
                                ? "#3b82f6"
                                : "#cbd5e1",
                          textColor: "#1e293b",
                          trailColor: "#f1f5f9",
                          strokeLinecap: "round",
                          textSize: "22px",
                        })}
                      />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 space-y-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            isEnrolled
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isEnrolled ? "Đã tham gia" : "Khóa học mới"}
                        </span>
                        {percent === 100 && (
                          <Star
                            size={14}
                            className="text-amber-500 fill-amber-500"
                          />
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Hiển thị Tags của từng khóa học */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {course.tags &&
                          course.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>

                      {/* Action Button */}
                      {isEnrolled ? (
                        <button
                          onClick={() =>
                            navigate(`/courses/${course.id}/learn`)
                          }
                          className={`mt-4 w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                            percent === 100
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                          }`}
                        >
                          {percent === 100 ? "Xem lại bài học" : "Tiếp tục học"}
                          <ChevronRight
                            size={16}
                            className={percent < 100 ? "animate-bounce-x" : ""}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={isProcessing}
                          className="mt-4 w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-70 disabled:hover:bg-slate-900 shadow-lg shadow-slate-200"
                        >
                          {isProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              Đăng ký học ngay
                              <Plus size={16} />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Decorative Pattern */}
                    <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:text-blue-100 transition-colors">
                      <BookOpen size={100} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CoursePage;
