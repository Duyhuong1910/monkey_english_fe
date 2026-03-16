import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Volume2,
  HelpCircle,
  Trophy,
  Loader2,
  ArrowRight,
} from "lucide-react";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const api_url = import.meta.env.VITE_URL_API;
  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const res = await axios.get(
        `${api_url}/api/lessons/detail/${id}`,
      );
      setData(res.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết bài học:", err);
    }
  };

  const handleSelect = (quizId, option) => {
    if (isSubmitted) return; // Không cho sửa sau khi đã nộp bài
    setUserAnswers({ ...userAnswers, [quizId]: option });
  };

  const checkResults = () => {
    let correctCount = 0;
    data.quizzes.forEach((q) => {
      if (userAnswers[q.quiz_id] === q.correct_option) correctCount++;
    });
    setScore(correctCount);
    setIsSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 bg-slate-50">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
        <p className="font-bold">Đang tải nội dung bài học...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* HEADER NAV */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <ChevronLeft size={20} /> Quay lại
          </button>
          <h2 className="text-lg font-black text-slate-800 truncate px-4">
            {data.title}
          </h2>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-12">
        {/* PHẦN 1: TỪ VỰNG */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <BookOpen size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              1. Danh sách từ vựng
            </h3>
          </div>

          <div className="grid gap-4">
            {data.vocabularies.map((v) => (
              <div
                key={v.vocab_id}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-blue-600 tracking-tight">
                      {v.english_word}
                    </span>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 rounded-full transition-colors">
                      <Volume2 size={16} />
                    </button>
                    <span className="text-slate-400 font-medium italic">
                      /{v.pronunciation}/
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    <span className="text-blue-400 font-bold mr-2">Ex:</span>
                    {v.example_sentence}
                  </p>
                </div>
                <div className="px-6 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-100 text-center">
                  {v.vietnamese_meaning}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PHẦN 2: QUIZ */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              2. Bài kiểm tra bài học
            </h3>
          </div>

          <div className="space-y-8">
            {data.quizzes.map((q, idx) => (
              <div
                key={q.quiz_id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
              >
                <p className="text-lg font-bold text-slate-700 mb-6 flex items-start gap-3">
                  <span className="w-8 h-8 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-black text-slate-400">
                    {idx + 1}
                  </span>
                  {q.question}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["a", "b", "c", "d"].map((opt) => {
                    const optionVal = opt.toUpperCase();
                    const isSelected = userAnswers[q.quiz_id] === optionVal;
                    const isCorrect =
                      isSubmitted && optionVal === q.correct_option;
                    const isWrong =
                      isSubmitted &&
                      isSelected &&
                      optionVal !== q.correct_option;

                    return (
                      <button
                        key={opt}
                        disabled={isSubmitted}
                        onClick={() => handleSelect(q.quiz_id, optionVal)}
                        className={`
                          p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group
                          ${isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-white"}
                          ${isCorrect ? "!border-emerald-500 !bg-emerald-50 !text-emerald-700" : ""}
                          ${isWrong ? "!border-red-500 !bg-red-50 !text-red-700" : ""}
                        `}
                      >
                        <span>
                          {optionVal}. {q[`option_${opt}`]}
                        </span>
                        {isCorrect && (
                          <CheckCircle size={20} className="text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER ACTION */}
          <div className="pt-10 flex flex-col items-center gap-6">
            {!isSubmitted ? (
              <button
                className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                onClick={checkResults}
              >
                Nộp bài & Chấm điểm <ArrowRight size={20} />
              </button>
            ) : (
              <div className="w-full bg-slate-900 rounded-[3rem] p-10 text-center animate-in zoom-in duration-500 shadow-2xl">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/40">
                  <Trophy size={40} className="text-white" />
                </div>
                <h4 className="text-3xl font-black text-white mb-2">
                  Kết quả bài học
                </h4>
                <p className="text-slate-400 font-bold mb-8 text-lg">
                  Bạn đã trả lời đúng{" "}
                  <span className="text-blue-400 text-2xl mx-1">{score}</span> /{" "}
                  {data.quizzes.length} câu hỏi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                  >
                    Làm lại bài học
                  </button>
                  <button
                    onClick={() => navigate("/courses")}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Tiếp tục lộ trình
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LessonDetail;
