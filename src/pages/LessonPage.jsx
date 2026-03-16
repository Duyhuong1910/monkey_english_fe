import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  Trophy,
  Loader2,
  Languages,
} from "lucide-react";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/lessons/detail/${id}?userId=${userId}`,
        );
        setData(res.data);
        if (res.data.savedAnswers) {
          setAnswers(res.data.savedAnswers);
          setIsSubmitted(true);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      }
    };
    fetchLesson();
    window.scrollTo(0, 0);
  }, [id, userId]);

  const handleSelect = (quizId, option) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [quizId]: option });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    data.quizzes.forEach((q) => {
      if (answers[q.quiz_id] === q.correct_option) correctCount++;
    });

    setScore(correctCount);
    setIsSubmitted(true);

    try {
      await axios.post("http://localhost:5000/api/lessons/save-progress", {
        userId,
        lessonId: id,
        courseId: data.course_id,
        answers: JSON.stringify(answers),
        isCompleted: true,
      });
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (err) {
      console.error("Lưu tiến độ thất bại", err);
    }
  };

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold tracking-wide">
          Đang chuẩn bị bài học...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* 1. NỘI DUNG HỌC (BÊN TRÁI) */}
      <section className="lg:w-1/2 p-8 lg:p-12 lg:sticky lg:top-0 lg:h-screen overflow-y-auto border-r border-slate-100 bg-slate-50/30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors mb-8 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Quay lại lộ trình
        </button>

        <div className="flex items-center gap-3 mb-2 text-blue-600">
          <BookOpen size={20} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Học liệu chi tiết
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
          {data.title}
        </h1>

        <div className="grid gap-6">
          {data.vocabularies?.map((v) => (
            <div
              key={v.vocab_id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-blue-600">
                    {v.english_word}
                  </span>
                  <span className="text-slate-400 font-medium italic">
                    /{v.pronunciation}/
                  </span>
                </div>
                <button className="p-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-slate-700 font-bold text-lg mb-2">
                {v.vietnamese_meaning}
              </p>
              <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border-l-4 border-blue-200">
                <span className="font-black text-blue-400 mr-2 italic underline">
                  Ex:
                </span>
                {v.example_sentence}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PHẦN KIỂM TRA (BÊN PHẢI) */}
      <section className="lg:w-1/2 p-8 lg:p-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
                <ArrowRight size={20} />
              </span>
              Bài tập thực hành
            </h2>
            {isSubmitted && (
              <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-black text-sm shadow-lg shadow-blue-200">
                {score}/{data.quizzes.length} Correct
              </div>
            )}
          </div>

          <div className="space-y-12">
            {data.quizzes?.map((q, idx) => {
              const userAns = answers[q.quiz_id];
              const isCorrect = userAns === q.correct_option;

              return (
                <div key={q.quiz_id} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-black text-slate-300 border-2 border-slate-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 ml-12">
                    {["A", "B", "C", "D"].map((opt) => {
                      const key = `option_${opt?.toLowerCase()}`;
                      const text = q[key];
                      if (!text) return null;

                      const isSelected = userAns === opt;
                      const showResult = isSubmitted;
                      const isOptionCorrect = opt === q.correct_option;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(q.quiz_id, opt)}
                          disabled={isSubmitted}
                          className={`
                            group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left font-bold
                            ${isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-50 bg-slate-50/50 text-slate-500 hover:border-slate-200"}
                            ${showResult && isOptionCorrect ? "!border-emerald-500 !bg-emerald-50 !text-emerald-700" : ""}
                            ${showResult && isSelected && !isOptionCorrect ? "!border-red-500 !bg-red-50 !text-red-700" : ""}
                          `}
                        >
                          <span
                            className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                            ${isSelected ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-400 group-hover:border-blue-400"}
                            ${showResult && isOptionCorrect ? "!bg-emerald-500 !text-white" : ""}
                            ${showResult && isSelected && !isOptionCorrect ? "!bg-red-500 !text-white" : ""}
                          `}
                          >
                            {opt}
                          </span>
                          <span className="flex-1">{text}</span>
                          {showResult && isOptionCorrect && (
                            <CheckCircle2
                              size={20}
                              className="text-emerald-500"
                            />
                          )}
                          {showResult && isSelected && !isOptionCorrect && (
                            <XCircle size={20} className="text-red-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* HIỆN DỊCH VÀ ĐÁP ÁN */}
                  {isSubmitted && (
                    <div className="ml-12 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div
                        className={`p-4 rounded-2xl border flex items-start gap-3 ${isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}
                      >
                        <Languages
                          size={18}
                          className={
                            isCorrect ? "text-emerald-600" : "text-red-600"
                          }
                        />
                        <div className="text-sm">
                          <p
                            className={`font-black mb-1 ${isCorrect ? "text-emerald-700" : "text-red-700"}`}
                          >
                            {isCorrect
                              ? "Giải thích:"
                              : `Đáp án đúng là ${q.correct_option}:`}
                          </p>
                          <p className="text-slate-600 leading-relaxed italic">
                            "
                            {q.question_translation ||
                              "Chủ đề này đang được cập nhật bản dịch chi tiết."}
                            "
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* FOOTER ACTION */}
          <div className="mt-20 pt-10 border-t border-slate-100 text-center">
            {!isSubmitted ? (
              <button
                className="px-16 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                onClick={handleSubmit}
              >
                Hoàn thành & Nộp bài
              </button>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Bạn đạt được {score}/{data.quizzes.length} điểm!
                  </h3>
                </div>
                <button
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                  onClick={() => navigate(-1)}
                >
                  Tiếp tục lộ trình học tập
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LessonPage;
