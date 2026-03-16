import React, { useState, useEffect, useContext } from "react";
import { Award, Trophy, Loader2 } from "lucide-react";
import axiosClient from "../../services/axiosClient";
import { AuthContext } from "../../contexts/AuthContext";

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [topUsers, setTopUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, rankRes] = await Promise.all([
          axiosClient.get("/leaderboard?limit=20"),
          user
            ? axiosClient.get("/leaderboard/my-rank")
            : Promise.resolve(null),
        ]);
        setTopUsers(topRes.data.top_users);
        if (rankRes) setMyRank(rankRes.data.rank);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <Trophy className="text-yellow-500" /> Bảng xếp hạng
      </h1>

      {/* Card Hạng của tôi */}
      {myRank && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white mb-8 shadow-xl flex items-center justify-between">
          <div>
            <p className="font-bold opacity-80">Hạng của bạn</p>
            <h2 className="text-4xl font-black">#{myRank}</h2>
          </div>
          <div className="text-right">
            <p className="font-bold">{user.total_points} điểm</p>
          </div>
        </div>
      )}

      {/* Danh sách Top 20 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-center">Hạng</th>
                <th className="p-4 text-left">Học viên</th>
                <th className="p-4 text-center">Cấp độ</th>
                <th className="p-4 text-right">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="p-4 text-center font-black text-slate-400">
                    {i < 3 ? (
                      <Trophy
                        className={`mx-auto ${i === 0 ? "text-yellow-500" : i === 1 ? "text-slate-400" : "text-orange-700"}`}
                      />
                    ) : (
                      `#${i + 1}`
                    )}
                  </td>
                  <td className="p-4 font-bold">{u.username}</td>
                  <td className="p-4 text-center">Lv.{u.current_level}</td>
                  <td className="p-4 text-right font-black text-blue-600">
                    {u.total_points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
