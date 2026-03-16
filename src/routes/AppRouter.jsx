import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// Các trang (Tạm thời import giả lập, bạn sẽ tạo sau)
import Home from "../pages/public/Home"; // File Home.jsx của bạn để vào đây
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Course from "../pages/public/CoursePage";
import LessonView from "../pages/user/LessonView";
import AdminCourseList from "../pages/admin/AdminCourseList";
import AdminCourseForm from "../pages/admin/AdminCourseForm";
import AdminLessonList from "../pages/admin/AdminLessonList";
import AdminLessonForm from "../pages/admin/AdminLessonForm";
import AdminLessonContent from "../pages/admin/AdminLessonContent";
import AdminQuizQuestions from "../pages/admin/AdminQuizQuestions";
import AdminUserList from "../pages/admin/AdminUserList";
import Leaderboard from "../pages/user/Leaderboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/courses/:courseId/learn" element={<LessonView />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourseList />} />
            <Route path="/admin/courses/create" element={<AdminCourseForm />} />
            <Route
              path="/admin/courses/:id/edit"
              element={<AdminCourseForm />}
            />
            <Route
              path="/admin/courses/:courseId/lessons"
              element={<AdminLessonList />}
            />
            <Route
              path="/admin/courses/:courseId/lessons/create"
              element={<AdminLessonForm />}
            />
            <Route
              path="/admin/lessons/:lessonId/edit"
              element={<AdminLessonForm />}
            />
            <Route
              path="/admin/lessons/:lessonId/content"
              element={<AdminLessonContent />}
            />
            <Route
              path="/admin/quizzes/:quizId/questions"
              element={<AdminQuizQuestions />}
            />
            <Route path="/admin/users" element={<AdminUserList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
