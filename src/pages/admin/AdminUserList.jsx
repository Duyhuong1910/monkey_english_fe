import React, { useState, useEffect } from "react";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  Loader2,
  User as UserIcon,
  Award,
  X,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // State cho Modal Chỉnh sửa
  // const [showModal, setShowModal] = useState(false);
  // const [editingUser, setEditingUser] = useState(null);
  // const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Gọi API lấy toàn bộ user (yêu cầu Backend phải có route GET /users dành cho Admin)
      const res = await axiosClient.get("/users");
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa tài khoản "${username}"? Dữ liệu học tập của họ sẽ bị mất vĩnh viễn.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axiosClient.delete(`/users/${id}`);
      if (res.success) {
        toast.success("Đã xóa tài khoản thành công");
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa tài khoản");
    } finally {
      setDeletingId(null);
    }
  };

  // const openEditModal = (user) => {
  //   setEditingUser({ ...user });
  //   setShowModal(true);
  // };

  // const handleModalSubmit = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   try {
  //     // Gọi API cập nhật thông tin user
  //     const res = await axiosClient.put(`/users/${editingUser.id}`, {
  //       role: editingUser.role,
  //       current_level: parseInt(editingUser.current_level),
  //       total_points: parseInt(editingUser.total_points),
  //     });

  //     if (res.success) {
  //       toast.success("Cập nhật thông tin thành công!");
  //       setShowModal(false);
  //       // Cập nhật lại UI không cần gọi lại API
  //       setUsers(
  //         users.map((u) =>
  //           u.id === editingUser.id ? { ...u, ...editingUser } : u,
  //         ),
  //       );
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Lỗi khi cập nhật");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER TỔNG QUAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Quản lý Tài khoản
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Theo dõi, phân quyền và quản lý thông tin học viên
          </p>
        </div>
        <div className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100 flex items-center gap-2">
          <UserIcon size={18} />
          Tổng cộng: {users.length} user
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên đăng nhập hoặc Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            <p className="text-slate-500 font-medium">
              Đang tải dữ liệu tài khoản...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-black">
                  <th className="p-5 pl-8">Thông tin người dùng</th>
                  <th className="p-5">Vai trò</th>
                  <th className="p-5 text-center">Cấp độ</th>
                  <th className="p-5 text-center">Tổng điểm</th>
                  <th className="p-5 text-right pr-8">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                              user.role === "admin"
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-base">
                              {user.username}
                            </div>
                            <div className="text-slate-500 font-medium">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-max ${
                            user.role === "admin"
                              ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                              : "bg-slate-100 border border-slate-200 text-slate-600"
                          }`}
                        >
                          {user.role === "admin" && <Shield size={14} />}
                          {user.role === "admin" ? "Quản trị viên" : "Học viên"}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                          Lv. {user.current_level}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-1 font-black text-amber-600">
                          <Award size={16} />
                          {user.total_points}
                        </div>
                      </td>
                      <td className="p-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {/* <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                            title="Chỉnh sửa tài khoản"
                          >
                            <Edit size={18} />
                          </button> */}
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            disabled={
                              deletingId === user.id || user.role === "admin"
                            } // Không cho phép admin tự xóa admin khác ở giao diện này
                            className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400"
                            title={
                              user.role === "admin"
                                ? "Không thể xóa Admin"
                                : "Xóa tài khoản"
                            }
                          >
                            {deletingId === user.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">
                      <UserIcon
                        size={48}
                        className="mx-auto text-slate-300 mb-4"
                      />
                      <p className="font-bold">Không tìm thấy tài khoản nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CHỈNH SỬA TÀI KHOẢN */}
      {/* {showModal && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">
                Chỉnh sửa Tài khoản
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-8 space-y-5">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-1">
                  Tài khoản
                </p>
                <p className="text-lg font-black text-slate-900">
                  {editingUser.username}
                </p>
                <p className="text-sm text-slate-500">{editingUser.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Vai trò hệ thống
                </label>
                <select
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-700"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">Học viên (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AdminUserList;
