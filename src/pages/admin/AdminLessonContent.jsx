import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminLessonContent = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("vocab");
  const [loading, setLoading] = useState(true);

  const [vocabs, setVocabs] = useState([]);
  const [grammars, setGrammars] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // States cho Modal Thêm/Sửa
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // STATE MỚI: Dùng để phân biệt Thêm mới (null) hay Chỉnh sửa (có ID)
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLessonAndContent();
  }, [lessonId]);

  const fetchLessonAndContent = async () => {
    setLoading(true);
    try {
      const [lessonRes, vocabRes, grammarRes, quizRes] = await Promise.all([
        axiosClient.get(`/lessons/${lessonId}`),
        axiosClient.get(`/vocabularies/lesson/${lessonId}`),
        axiosClient.get(`/grammars/lesson/${lessonId}`),
        axiosClient.get(`/quizzes/lesson/${lessonId}`),
      ]);

      setLesson(lessonRes.data);
      setVocabs(vocabRes.data);
      setGrammars(grammarRes.data);
      setQuizzes(quizRes.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu nội dung bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
    try {
      let endpoint = "";
      if (type === "vocab") endpoint = `/vocabularies/${id}`;
      else if (type === "grammar") endpoint = `/grammars/${id}`;
      else if (type === "quiz") endpoint = `/quizzes/${id}`;

      const res = await axiosClient.delete(endpoint);
      if (res.success) {
        toast.success("Xóa thành công");
        if (type === "vocab") setVocabs(vocabs.filter((v) => v.id !== id));
        else if (type === "grammar")
          setGrammars(grammars.filter((g) => g.id !== id));
        else if (type === "quiz")
          setQuizzes(quizzes.filter((q) => q.id !== id));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa dữ liệu");
    }
  };

  // HÀM MỞ MODAL THÊM MỚI
  const openAddModal = (type) => {
    setModalType(type);
    setEditingId(null); // Reset ID về null để hiểu là thêm mới
    if (type === "vocab") {
      setFormData({
        lesson_id: lessonId,
        word: "",
        meaning: "",
        word_type: "noun",
        pronunciation: "",
        example_en: "",
        example_vi: "",
      });
    } else if (type === "grammar") {
      setFormData({
        lesson_id: lessonId,
        title: "",
        structure: "",
        explanation: "",
        example_en: "",
        example_vi: "",
      });
    } else if (type === "quiz") {
      setFormData({
        lesson_id: lessonId,
        title: "",
        passing_score: 1,
        points_reward: 50,
      });
    }
    setShowModal(true);
  };

  // HÀM MỚI: MỞ MODAL ĐỂ CHỈNH SỬA
  const openEditModal = (type, itemData) => {
    setModalType(type);
    setEditingId(itemData.id); // Gắn ID để hiểu là đang sửa

    // Copy toàn bộ dữ liệu của item vào form
    setFormData({ ...itemData });
    setShowModal(true);
  };

  // HÀM SUBMIT XỬ LÝ CẢ THÊM MỚI LẪN CẬP NHẬT
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let endpoint = "";
      if (modalType === "vocab") endpoint = "/vocabularies";
      else if (modalType === "grammar") endpoint = "/grammars";
      else if (modalType === "quiz") endpoint = "/quizzes";

      let res;
      if (editingId) {
        // GỌI API CẬP NHẬT (PUT)
        res = await axiosClient.put(`${endpoint}/${editingId}`, formData);
      } else {
        // GỌI API THÊM MỚI (POST)
        res = await axiosClient.post(endpoint, formData);
      }

      if (res.success) {
        toast.success(
          editingId ? "Cập nhật thành công!" : "Thêm mới thành công!",
        );
        setShowModal(false);
        fetchLessonAndContent(); // Tải lại dữ liệu mới nhất
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER & BREADCRUMB */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {lesson?.title}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Quản lý chi tiết nội dung kiến thức và bài tập
          </p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex flex-wrap bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-max">
        {[
          { id: "vocab", label: "Từ vựng", icon: BookOpen },
          { id: "grammar", label: "Ngữ pháp", icon: FileText },
          { id: "quiz", label: "Bài tập Quiz", icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm min-h-[400px]">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Danh sách{" "}
            {activeTab === "vocab"
              ? "Từ vựng"
              : activeTab === "grammar"
                ? "Ngữ pháp"
                : "Bài tập Quiz"}
          </h2>
          <button
            onClick={() => openAddModal(activeTab)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>

        {/* RENDER DỮ LIỆU THEO TAB */}
        <div className="grid gap-4">
          {/* TAB TỪ VỰNG */}
          {activeTab === "vocab" &&
            vocabs.map((v) => (
              <div
                key={v.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-4"
              >
                <div>
                  <p className="text-lg font-black text-blue-600">
                    {v.word}{" "}
                    <span className="text-xs font-medium text-slate-400">
                      ({v.word_type})
                    </span>
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {v.meaning}
                  </p>
                </div>
                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end">
                  {/* Nút sửa */}
                  <button
                    onClick={() => openEditModal("vocab", v)}
                    className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete("vocab", v.id)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

          {/* TAB NGỮ PHÁP */}
          {activeTab === "grammar" &&
            grammars.map((g) => (
              <div
                key={g.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-4"
              >
                <div className="flex-1">
                  <p className="text-lg font-black text-blue-600">{g.title}</p>
                  <p className="text-sm font-mono font-bold text-slate-600 bg-white w-max px-2 py-1 rounded mt-1 border border-slate-200">
                    {g.structure}
                  </p>
                </div>
                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto justify-end">
                  {/* Nút sửa */}
                  <button
                    onClick={() => openEditModal("grammar", g)}
                    className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete("grammar", g.id)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

          {/* TAB BÀI TẬP */}
          {activeTab === "quiz" &&
            quizzes.map((q) => (
              <div
                key={q.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center group gap-4"
              >
                <div>
                  <p className="text-lg font-black text-slate-800">{q.title}</p>
                  <p className="text-xs font-bold text-slate-400">
                    Yêu cầu: {q.passing_score} câu đúng - Thưởng:{" "}
                    {q.points_reward}đ
                  </p>
                </div>
                <div className="flex gap-2 items-center w-full sm:w-auto justify-end flex-wrap">
                  <Link
                    to={`/admin/quizzes/${q.id}/questions`}
                    className="px-4 py-2 bg-white text-blue-600 font-bold text-xs rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition"
                  >
                    Quản lý Câu hỏi
                  </Link>
                  {/* Nút sửa */}
                  <button
                    onClick={() => openEditModal("quiz", q)}
                    className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete("quiz", q.id)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

          {((activeTab === "vocab" && vocabs.length === 0) ||
            (activeTab === "grammar" && grammars.length === 0) ||
            (activeTab === "quiz" && quizzes.length === 0)) && (
            <div className="text-center py-10 text-slate-400 font-medium italic">
              Chưa có dữ liệu cho mục này.
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM / SỬA (Dùng chung) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">
                {editingId ? "Chỉnh sửa" : "Thêm mới"}{" "}
                {modalType === "vocab"
                  ? "Từ vựng"
                  : modalType === "grammar"
                    ? "Ngữ pháp"
                    : "Bài tập Quiz"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleModalSubmit}
              className="p-8 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              {/* FORM TỪ VỰNG */}
              {modalType === "vocab" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Từ vựng (Word)
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                      value={formData.word || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, word: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Phát âm
                      </label>
                      <input
                        type="text"
                        placeholder="/heˈləʊ/"
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                        value={formData.pronunciation || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pronunciation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Từ loại
                      </label>
                      <select
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                        value={formData.word_type || "noun"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            word_type: e.target.value,
                          })
                        }
                      >
                        <option value="noun">Danh từ (Noun)</option>
                        <option value="verb">Động từ (Verb)</option>
                        <option value="adj">Tính từ (Adj)</option>
                        <option value="adv">Trạng từ (Adv)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Nghĩa tiếng Việt
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                      value={formData.meaning || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, meaning: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Ví dụ Tiếng Anh
                    </label>
                    <textarea
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      rows="2"
                      value={formData.example_en || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, example_en: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Ví dụ Tiếng Việt
                    </label>
                    <textarea
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      rows="2"
                      value={formData.example_vi || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, example_vi: e.target.value })
                      }
                    ></textarea>
                  </div>
                </>
              )}

              {/* FORM NGỮ PHÁP */}
              {modalType === "grammar" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Tên chủ điểm
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Cấu trúc (Structure)
                    </label>
                    <input
                      type="text"
                      placeholder="S + V + O"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-mono font-bold"
                      value={formData.structure || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, structure: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Giải thích cách dùng
                    </label>
                    <textarea
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      rows="3"
                      value={formData.explanation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          explanation: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Ví dụ Tiếng Anh
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      value={formData.example_en || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, example_en: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Nghĩa Tiếng Việt
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      value={formData.example_vi || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, example_vi: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* FORM QUIZ */}
              {modalType === "quiz" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Tên bài tập
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                        Số câu đúng tối thiểu
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold"
                        value={formData.passing_score || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            passing_score: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                        Điểm thưởng
                      </label>
                      <input
                        type="number"
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-bold text-amber-600"
                        value={formData.points_reward || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            points_reward: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {editingId ? "Lưu cập nhật" : "Tạo dữ liệu"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessonContent;
