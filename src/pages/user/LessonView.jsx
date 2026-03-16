import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  PlayCircle,
  HelpCircle,
  Star,
  Award,
  Loader2,
  Send,
  FileText,
  ClipboardList,
  Eye,
} from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const LessonView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserLocal } = useContext(AuthContext);

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [grammars, setGrammars] = useState([]);

  const [quizList, setQuizList] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

  // STATE MỚI: Quản lý chế độ xem lại đáp án chi tiết
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/lessons/course/${courseId}`);
      if (res.success && res.data.length > 0) {
        setLessons(res.data);
        loadLessonDetails(res.data[0].id);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const loadLessonDetails = async (lessonId) => {
    setLoading(true);
    setQuizResult(null);
    setUserAnswers({});
    setActiveQuiz(null);
    setShowReview(false); // Reset review mode
    setActiveTab("content");

    try {
      const [lessonRes, vocabRes, grammarRes, quizListRes] = await Promise.all([
        axiosClient.get(`/lessons/${lessonId}`),
        axiosClient.get(`/vocabularies/lesson/${lessonId}`),
        axiosClient.get(`/grammars/lesson/${lessonId}`),
        axiosClient.get(`/quizzes/lesson/${lessonId}`),
      ]);

      setCurrentLesson(lessonRes.data);
      setVocabularies(vocabRes.data);
      setGrammars(grammarRes.data);

      if (quizListRes.success) {
        setQuizList(quizListRes.data);
      }
    } catch (error) {
      toast.error("Không thể tải chi tiết bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId) => {
    setLoading(true);
    setQuizResult(null);
    setUserAnswers({});
    setShowReview(false);
    try {
      const fullQuizRes = await axiosClient.get(`/quizzes/${quizId}/full`);
      if (fullQuizRes.success) {
        setActiveQuiz(fullQuizRes.data);
      }
    } catch (error) {
      toast.error("Không thể tải chi tiết bài tập");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerId) => {
    if (showReview) return; // Không cho phép đổi đáp án nếu đang ở chế độ xem lại
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      const res = await axiosClient.post(
        `/progress/lessons/${lessonId}/complete`,
      );
      console.log(res);
      // Nếu có nhận được điểm và level mới, cập nhật ngay lên Header
      if (res.success && res.data.newStats) {
        updateUserLocal(res.data.newStats);
        if (res.data.pointsEarned > 0) {
          toast.success(
            `Bạn nhận được +${res.data.pointsEarned} điểm từ bài học!`,
          );
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ bài học:", error);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length < activeQuiz.questions.length) {
      toast.warning("Vui lòng hoàn thành tất cả câu hỏi!");
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = Object.entries(userAnswers).map(([qId, aId]) => ({
        question_id: parseInt(qId),
        answer_id: aId,
      }));

      const res = await axiosClient.post(`/quizzes/${activeQuiz.id}/submit`, {
        answers: answersArray,
      });

      if (res.success) {
        setQuizResult(res.data);
        if (res.data.is_passed) {
          if (res.data.new_user_stats) {
            updateUserLocal(res.data.new_user_stats);
          }
          await handleCompleteLesson(currentLesson.id);

          if (res.data.points_earned > 0) {
            toast.success(
              `Chúc mừng! Bạn nhận được ${res.data.points_earned} điểm.`,
            );
          }
        } else {
          toast.info("Bạn chưa đạt điểm yêu cầu. Hãy xem lại đáp án nhé!");
        }
      }
    } catch (error) {
      toast.error("Lỗi khi nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  // HÀM MỚI: Lấy CSS class cho đáp án khi ở chế độ xem lại (Review)
  const getReviewAnswerClass = (questionId, answerId) => {
    const isSelected = userAnswers[questionId] === answerId;

    // Kiểm tra xem đây có phải là đáp án đúng từ Backend trả về không
    const isCorrectAnswer = quizResult?.correct_answers?.some(
      (ca) => ca.question_id === questionId && ca.answer_id === answerId,
    );

    if (isCorrectAnswer) {
      return "bg-emerald-50 border-emerald-500 text-emerald-700 font-black shadow-sm"; // Đáp án đúng luôn hiện xanh
    }
    if (isSelected && !isCorrectAnswer) {
      return "bg-red-50 border-red-500 text-red-700 font-bold"; // Chỗ user chọn sai hiện đỏ
    }
    return "bg-slate-50 border-slate-200 text-slate-400 opacity-60"; // Các đáp án sai khác làm mờ đi
  };

  if (loading && lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition mb-4"
          >
            <ChevronLeft size={16} /> Quay lại Dashboard
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Nội dung khóa học
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => loadLessonDetails(lesson.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                currentLesson?.id === lesson.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border-slate-100 hover:border-blue-200 text-slate-700"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  currentLesson?.id === lesson.id
                    ? "bg-white/20"
                    : "bg-slate-100"
                }`}
              >
                {index + 1}
              </div>
              <span className="font-bold text-sm line-clamp-1">
                {lesson.title}
              </span>
              {currentLesson?.id === lesson.id && (
                <PlayCircle size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative">
        {loading ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto px-6 py-10 lg:px-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              {currentLesson?.title}
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition ${
                  activeTab === "content"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                Kiến thức chính
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition ${
                  activeTab === "quiz"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                Bài tập thực hành ({quizList.length})
              </button>
            </div>
          </div>

          {activeTab === "content" ? (
            /* TAB 1: TỪ VỰNG & NGỮ PHÁP */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              {vocabularies.length > 0 && (
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-600" /> Danh sách từ vựng
                  </h3>
                  <div className="grid gap-6">
                    {vocabularies.map((v) => (
                      <div
                        key={v.id}
                        className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/50 transition duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-2xl font-black text-blue-600">
                            {v.word}
                          </h4>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                            {v.word_type}
                          </span>
                        </div>
                        <p className="text-slate-500 font-bold mb-4">
                          Phát âm:{" "}
                          <span className="text-slate-800">
                            {v.pronunciation}
                          </span>
                        </p>
                        <div className="pl-4 border-l-4 border-blue-200 space-y-1">
                          <p className="font-bold text-slate-800 underline decoration-blue-200 decoration-4 underline-offset-4">
                            {v.meaning}
                          </p>
                          <p className="text-slate-600 italic">
                            "{v.example_en}"
                          </p>
                          <p className="text-slate-400 text-sm">
                            ({v.example_vi})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {grammars.length > 0 && (
                <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Cấu trúc ngữ pháp
                  </h3>
                  <div className="grid gap-6">
                    {grammars.map((g) => (
                      <div
                        key={g.id}
                        className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/50 transition duration-300"
                      >
                        <h4 className="text-xl font-black text-blue-600 mb-4">
                          {g.title}
                        </h4>
                        <div className="bg-slate-800 text-blue-300 p-4 rounded-xl font-mono font-bold text-lg mb-4 shadow-inner">
                          {g.structure}
                        </div>
                        <p className="text-slate-700 font-medium mb-6 leading-relaxed">
                          {g.explanation}
                        </p>
                        {(g.example_en || g.example_vi) && (
                          <div className="pl-4 border-l-4 border-amber-400 space-y-1">
                            <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">
                              Ví dụ minh họa
                            </p>
                            <p className="font-bold text-slate-800 text-lg">
                              {g.example_en}
                            </p>
                            <p className="text-slate-500">{g.example_vi}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={async () => {
                    await handleCompleteLesson(currentLesson.id);
                    toast.success("Đã ghi nhận tiến độ bài học!");
                    const nextIdx =
                      lessons.findIndex((l) => l.id === currentLesson.id) + 1;
                    if (nextIdx < lessons.length)
                      loadLessonDetails(lessons[nextIdx].id);
                    else navigate("/dashboard");
                  }}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 shadow-xl shadow-slate-200 transition flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Xác nhận Hoàn thành bài học
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: BÀI TẬP QUIZ */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              {quizList.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                  <HelpCircle
                    size={48}
                    className="mx-auto text-slate-200 mb-4"
                  />
                  <p className="text-slate-500 font-bold">
                    Bài học này chưa có bài tập quiz.
                  </p>
                </div>
              ) : !activeQuiz ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
                    <ClipboardList className="text-blue-600" /> Danh sách bài
                    tập
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizList.map((quiz, index) => (
                      <div
                        key={quiz.id}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                              Bài {index + 1}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                              <Award size={12} /> +{quiz.points_reward}đ
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-slate-800 mb-2">
                            {quiz.title}
                          </h4>
                          <p className="text-sm font-medium text-slate-500 mb-6">
                            Yêu cầu đạt: {quiz.passing_score} câu đúng
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartQuiz(quiz.id)}
                          className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Bắt đầu làm bài
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : quizResult && !showReview ? (
                // TRẠNG THÁI HIỂN THỊ KẾT QUẢ TỔNG QUAN
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl text-center">
                  <div
                    className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${
                      quizResult.is_passed
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {quizResult.is_passed ? (
                      <Award size={40} />
                    ) : (
                      <HelpCircle size={40} />
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    {quizResult.is_passed ? "Tuyệt vời!" : "Cố gắng lên!"}
                  </h2>
                  <p className="text-slate-500 font-medium mb-8">
                    Bạn trả lời đúng {quizResult.score}/
                    {quizResult.total_questions} câu hỏi.
                  </p>

                  {quizResult.is_passed && quizResult.is_first_time_pass && (
                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-6 py-3 rounded-2xl font-black mb-10 border border-yellow-100 animate-bounce">
                      <Star
                        size={20}
                        className="fill-yellow-500 text-yellow-500"
                      />
                      +{quizResult.points_earned} Điểm kinh nghiệm
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* BỔ SUNG NÚT XEM CHI TIẾT */}
                    <button
                      onClick={() => setShowReview(true)}
                      className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Eye size={20} /> Xem chi tiết đáp án
                    </button>
                    <button
                      onClick={() => {
                        setActiveQuiz(null);
                        setQuizResult(null);
                        setShowReview(false);
                      }}
                      className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                    >
                      Về danh sách bài tập
                    </button>
                  </div>
                </div>
              ) : (
                // TRẠNG THÁI LÀM BÀI HOẶC XEM LẠI CHI TIẾT
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => {
                        if (showReview) {
                          setShowReview(false); // Đang xem chi tiết thì quay về bảng điểm
                        } else {
                          setActiveQuiz(null); // Đang làm bài thì thoát ra ngoài
                        }
                      }}
                      className="text-slate-400 hover:text-blue-600 transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">
                        {activeQuiz.title}
                      </h2>
                      {showReview && (
                        <p className="text-sm font-bold text-blue-600">
                          Chế độ xem lại đáp án chi tiết
                        </p>
                      )}
                    </div>
                  </div>

                  {activeQuiz.questions.map((q, qIndex) => {
                    // Logic kiểm tra đúng sai để hiển thị icon tương ứng ở tiêu đề câu hỏi (nếu đang ở chế độ review)
                    let isQuestionCorrect = false;
                    if (showReview && quizResult?.correct_answers) {
                      isQuestionCorrect = quizResult.correct_answers.some(
                        (ca) =>
                          ca.question_id === q.id &&
                          ca.answer_id === userAnswers[q.id],
                      );
                    }

                    return (
                      <div
                        key={q.id}
                        className={`bg-white rounded-[2rem] p-8 border shadow-sm transition-colors ${
                          showReview
                            ? isQuestionCorrect
                              ? "border-emerald-200"
                              : "border-red-200"
                            : "border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <p className="text-xs font-black text-blue-500 uppercase tracking-widest">
                            Câu hỏi {qIndex + 1}
                          </p>
                          {showReview && (
                            <span
                              className={`text-xs font-black px-2 py-1 rounded-md ${isQuestionCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                            >
                              {isQuestionCorrect ? "Đúng" : "Sai"}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 mb-8">
                          {q.content}
                        </h4>

                        <div className="grid gap-3">
                          {q.answers.map((ans) => {
                            // Chọn CSS Class tùy thuộc vào trạng thái (đang làm bài hay đang review)
                            const buttonClass = showReview
                              ? getReviewAnswerClass(q.id, ans.id)
                              : userAnswers[q.id] === ans.id
                                ? "bg-blue-50 border-blue-600 text-blue-700"
                                : "bg-white border-slate-100 hover:border-blue-200 text-slate-600";

                            return (
                              <button
                                key={ans.id}
                                onClick={() => handleAnswerChange(q.id, ans.id)}
                                disabled={showReview} // Khóa không cho bấm khi xem lại
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-bold ${buttonClass} ${showReview ? "cursor-default" : ""}`}
                              >
                                {ans.content}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {!showReview && (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/60 disabled:opacity-70"
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Send size={20} /> Hoàn thành và Nộp bài
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonView;
