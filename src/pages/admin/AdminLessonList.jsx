import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  ListOrdered,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminLessonList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      // ĐÃ SỬA: Dùng /courses/all để Admin có thể tìm thấy cả khóa học nháp
      const coursesRes = await axiosClient.get("/courses/all");
      if (coursesRes.success) {
        const currentCourse = coursesRes.data.find(
          (c) => c.id === parseInt(courseId),
        );
        if (!currentCourse) {
          toast.error("Không tìm thấy khóa học");
          navigate("/admin/courses");
          return;
        }
        setCourse(currentCourse);
      }

      // ... phần gọi API lessons giữ nguyên
      const lessonsRes = await axiosClient.get(`/lessons/course/${courseId}`);
      if (lessonsRes.success) {
        setLessons(lessonsRes.data);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa bài học "${title}"? Từ vựng, ngữ pháp và bài tập bên trong cũng sẽ bị xóa.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axiosClient.delete(`/lessons/${id}`);
      if (res.success) {
        toast.success("Đã xóa bài học thành công");
        setLessons(lessons.filter((l) => l.id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa bài học");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER TỔNG QUAN */}
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin/courses"
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition shadow-sm shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Khóa học: <span className="text-blue-600">{course?.title}</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Quản lý lộ trình các bài học bên trong khóa học này
            </p>
          </div>
          <Link
            to={`/admin/courses/${courseId}/lessons/create`}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200 shrink-0"
          >
            <Plus size={20} />
            Thêm bài học mới
          </Link>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bài học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-black">
                  <th className="p-5 w-24 text-center">Thứ tự</th>
                  <th className="p-5">Tên bài học</th>
                  <th className="p-5 text-center">Điểm thưởng</th>
                  <th className="p-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => (
                    <tr
                      key={lesson.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-5 text-center font-black text-slate-400">
                        #{lesson.order_index}
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800">
                          {lesson.title}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-1 font-black text-amber-600 bg-amber-50 py-1.5 px-3 rounded-lg w-max mx-auto border border-amber-100">
                          <Award size={16} />+{lesson.points_reward}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {/* Nút vào quản lý nội dung bên trong bài học (Từ vựng/Ngữ pháp/Quiz) */}
                          <Link
                            to={`/admin/lessons/${lesson.id}/content`}
                            className="px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 font-bold rounded-lg border border-blue-100 hover:border-blue-600 transition-colors text-xs"
                          >
                            Quản lý nội dung
                          </Link>
                          <Link
                            to={`/admin/lessons/${lesson.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                            title="Chỉnh sửa bài học"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(lesson.id, lesson.title)
                            }
                            disabled={deletingId === lesson.id}
                            className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
                            title="Xóa bài học"
                          >
                            {deletingId === lesson.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-500">
                      <ListOrdered
                        size={48}
                        className="mx-auto text-slate-300 mb-4"
                      />
                      <p className="font-bold">
                        Chưa có bài học nào trong khóa này
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLessonList;
