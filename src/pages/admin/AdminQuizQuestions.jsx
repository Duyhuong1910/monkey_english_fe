import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminQuizQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    fetchQuizFullData();
  }, [quizId]);

  const fetchQuizFullData = async () => {
    setLoading(true);
    try {
      // API này trả về Quiz kèm Questions và Answers
      const res = await axiosClient.get(`/quizzes/${quizId}/full`);
      if (res.success) {
        setQuizData(res.data);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    const content = window.prompt("Nhập nội dung câu hỏi:");
    if (!content) return;
    try {
      const res = await axiosClient.post("/qa/questions", {
        quiz_id: quizId,
        content,
        question_type: "multiple_choice",
      });
      if (res.success) {
        toast.success("Đã thêm câu hỏi");
        fetchQuizFullData();
      }
    } catch (error) {
      toast.error("Lỗi khi thêm");
    }
  };

  const handleAddAnswer = async (questionId) => {
    const content = window.prompt("Nhập nội dung đáp án:");
    if (!content) return;
    const isCorrect = window.confirm("Đây có phải là đáp án ĐÚNG không?");
    try {
      const res = await axiosClient.post("/qa/answers", {
        question_id: questionId,
        content,
        is_correct: isCorrect,
      });
      if (res.success) {
        toast.success("Đã thêm đáp án");
        fetchQuizFullData();
      }
    } catch (error) {
      toast.error("Lỗi khi thêm");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-slate-900">
          {quizData?.title} - Danh sách câu hỏi
        </h1>
      </div>

      <button
        onClick={handleAddQuestion}
        className="w-full py-4 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Thêm câu hỏi mới vào quiz này
      </button>

      <div className="space-y-6">
        {quizData?.questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-black text-slate-800">
                Câu {idx + 1}: {q.content}
              </h3>
              <button className="text-slate-300 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid gap-3 mb-6">
              {q.answers.map((ans) => (
                <div
                  key={ans.id}
                  className={`p-4 rounded-2xl flex justify-between items-center border ${ans.is_correct ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-600"}`}
                >
                  <span className="font-bold">{ans.content}</span>
                  {ans.is_correct && <CheckCircle size={18} />}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddAnswer(q.id)}
              className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
            >
              + Thêm lựa chọn đáp án
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuizQuestions;
