import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  ListOrdered,
  FileText,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminLessonForm = () => {
  // Nếu là tạo mới: có courseId trên URL. Nếu là edit: có lessonId trên URL.
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(lessonId);

  const [formData, setFormData] = useState({
    title: "",
    points_reward: 10,
    course_id: courseId || "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchLessonDetails();
    }
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    try {
      const res = await axiosClient.get(`/lessons/${lessonId}`);
      if (res.success) {
        setFormData({
          title: res.data.title,
          order_index: res.data.order_index,
          points_reward: res.data.points_reward,
          course_id: res.data.course_id,
        });
      } else {
        toast.error("Không tìm thấy bài học");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "title" ? value : parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.warning("Vui lòng nhập tên bài học!");
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        const res = await axiosClient.put(`/lessons/${lessonId}`, formData);
        if (res.success) {
          toast.success("Cập nhật bài học thành công!");
          navigate(`/admin/courses/${formData.course_id}/lessons`);
        }
      } else {
        const res = await axiosClient.post("/lessons", formData);
        if (res.success) {
          toast.success("Tạo bài học mới thành công!");
          navigate(`/admin/courses/${courseId}/lessons`);
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
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditMode ? "Chỉnh sửa Bài học" : "Tạo Bài học mới"}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Thiết lập thứ tự và điểm thưởng cho bài học
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
            Tên bài học <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <FileText
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="Ví dụ: Unit 1 - Hello and Goodbye"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
              Điểm thưởng (Points)
            </label>
            <div className="relative group">
              <Award
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                size={20}
              />
              <input
                name="points_reward"
                value={formData.points_reward}
                onChange={handleChange}
                type="number"
                min="0"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-800"
              />
            </div>
            <p className="text-xs text-slate-400 ml-1 font-medium">
              Điểm học viên nhận được khi hoàn thành (vd: 10).
            </p>
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
            {isEditMode ? "Lưu thay đổi" : "Tạo bài học"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLessonForm;
