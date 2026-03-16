import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, LayoutList, Tags } from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    tagsText: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // ĐÃ SỬA: Dùng /courses/all để Admin có thể lấy data của khóa học nháp để chỉnh sửa
      const res = await axiosClient.get("/courses/all");
      if (res.success) {
        const course = res.data.find((c) => c.id === parseInt(id));
        if (course) {
          setFormData({
            title: course.title,
            description: course.description || "",
            status: course.status || "draft",
            tagsText: course.tags ? course.tags.join(", ") : "",
          });
        } else {
          toast.error("Không tìm thấy khóa học");
          navigate("/admin/courses");
        }
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim())
      return toast.warning("Vui lòng nhập tên khóa học!");

    setSaving(true);
    try {
      // Chuyển đổi tagsText ("TOEIC, Giao Tiếp") thành mảng (["TOEIC", "Giao Tiếp"])
      const tagsArray = formData.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const payload = { ...formData, tags: tagsArray };

      if (isEditMode) {
        const res = await axiosClient.put(`/courses/${id}`, payload);
        if (res.success) toast.success("Cập nhật thành công!");
      } else {
        const res = await axiosClient.post("/courses", payload);
        if (res.success) {
          toast.success("Tạo mới thành công!");
          navigate("/admin/courses");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* NÚT QUAY LẠI */}
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin/courses"
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditMode ? "Chỉnh sửa Khóa học" : "Tạo Khóa học mới"}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Điền các thông tin cơ bản cho khóa học của bạn
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8"
      >
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <LayoutList
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="Ví dụ: Tiếng Anh giao tiếp cơ bản"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Viết mô tả ngắn gọn về những gì học viên sẽ đạt được..."
            rows="4"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 resize-none"
          ></textarea>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
            Gắn thẻ (Tags)
          </label>
          <div className="relative group">
            <Tags
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              name="tagsText"
              value={formData.tagsText}
              onChange={handleChange}
              type="text"
              placeholder="Ví dụ: Giao tiếp, TOEIC, Cho người đi làm (Ngăn cách bằng dấu phẩy)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-800"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
            Trạng thái hiển thị
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${
                formData.status === "published"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === "published"}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p
                  className={`font-black ${formData.status === "published" ? "text-emerald-700" : "text-slate-700"}`}
                >
                  Đã xuất bản
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Học viên có thể nhìn thấy và đăng ký
                </p>
              </div>
            </label>

            <label
              className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${
                formData.status === "draft"
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={handleChange}
                className="w-5 h-5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <p
                  className={`font-black ${formData.status === "draft" ? "text-amber-700" : "text-slate-700"}`}
                >
                  Bản nháp
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Ẩn khỏi danh sách của học viên
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* NÚT SUBMIT */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {isEditMode ? "Lưu thay đổi" : "Tạo khóa học"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseForm;
