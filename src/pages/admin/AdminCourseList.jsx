import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosClient.get("/courses/all");
      if (res.success) {
        setCourses(res.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa khóa học "${title}"? Mọi bài học bên trong cũng sẽ bị xóa.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axiosClient.delete(`/courses/${id}`);
      if (res.success) {
        toast.success("Đã xóa khóa học thành công");
        setCourses(courses.filter((c) => c.id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa khóa học");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER TỔNG QUAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Quản lý Khóa học
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Hiển thị danh sách tất cả các khóa học trong hệ thống
          </p>
        </div>
        <Link
          to="/admin/courses/create"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200 shrink-0"
        >
          <Plus size={20} />
          Tạo khóa học mới
        </Link>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học..."
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
                  <th className="p-5">Khóa học</th>
                  <th className="p-5">Mô tả ngắn</th>
                  <th className="p-5 text-center">Trạng thái</th>
                  <th className="p-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen size={24} />
                          </div>
                          <div className="font-bold text-slate-800 line-clamp-2">
                            {course.title}
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">
                        <div className="line-clamp-2 max-w-xs">
                          {course.description || "Chưa có mô tả"}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
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
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/courses/${course.id}/lessons`}
                            className="px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 font-bold rounded-lg border border-blue-100 hover:border-blue-600 transition-colors text-xs"
                          >
                            Quản lý Bài học
                          </Link>
                          <Link
                            to={`/admin/courses/${course.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(course.id, course.title)
                            }
                            disabled={deletingId === course.id}
                            className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
                            title="Xóa khóa học"
                          >
                            {deletingId === course.id ? (
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
                      <BookOpen
                        size={48}
                        className="mx-auto text-slate-300 mb-4"
                      />
                      <p className="font-bold">Không tìm thấy khóa học nào</p>
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

export default AdminCourseList;
