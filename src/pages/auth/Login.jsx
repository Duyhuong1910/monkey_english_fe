import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API thông qua axiosClient đã cấu hình
      const res = await axiosClient.post("/auth/login", { email, password });
      console.log(res);
      // res ở đây chính là response.data nhờ interceptor của axios
      if (res.success && res.data.token) {
        // Lưu thông tin vào Context
        login(res.data.user, res.data.token);

        toast.success(
          `Chào mừng ${res.data.user.role === "admin" ? "Quản trị viên" : "Học viên"} ${res.data.user.username} quay trở lại!`,
        );

        // Điều hướng theo Role
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      // axios bắt lỗi từ backend (ví dụ: 400 Sai mật khẩu)
      const errorMessage =
        err.response?.data?.message || "Lỗi kết nối đến máy chủ!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="p-10 pb-6 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">
              M
            </div>
          </div>
          <p className="text-slate-400 font-medium mt-2">
            Đăng nhập để tiếp tục hành trình cùng Monkey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Địa chỉ Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Mật khẩu
              </label>
              <a
                href="#"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Đăng nhập ngay
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
          <p className="text-slate-500 font-medium text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-black hover:text-blue-700 transition-colors ml-1"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
