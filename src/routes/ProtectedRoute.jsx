import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Chưa đăng nhập -> Đẩy về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng không đúng Role (VD: Học sinh cố tình vào trang Admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu là admin thì cho về dashboard admin, user thì về trang học tập
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  // Hợp lệ thì cho phép render các component con
  return <Outlet />;
};

export default ProtectedRoute;
