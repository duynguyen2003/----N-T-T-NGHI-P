import React, { useState, useEffect, useContext } from 'react';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import StatsCard from '../Components/StatsCard';
import '../../../css/Admin/AdminViews.css';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalExams: 0,
    recentUsers: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, logsData] = await Promise.all([
          adminApi.getStats(token),
          adminApi.getLogs(token, 1, 5) // Get latest 5 logs
        ]);
        setStats(statsData);
        setLogs(logsData.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return <div style={{ color: '#fff' }}>Đang tải thống kê...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="admin-stats-grid">
        <StatsCard title="Tổng Học Viên" value={stats.totalUsers} icon={Users} />
        <StatsCard title="Tổng Khóa Học" value={stats.totalCourses} icon={BookOpen} />
        <StatsCard title="Bài Thi Đã Tạo" value={stats.totalExams} icon={FileText} />
        <StatsCard title="Học Viên Mới (7 ngày)" value={stats.recentUsers} icon={Activity} />
      </div>

      <div className="admin-datatable-container">
        <div className="admin-table-header">
          <h3>Nhật ký hoạt động bảo mật (Gần đây)</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Quản trị viên</th>
              <th>Hành động</th>
              <th>Bảng</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                <td>{log.admin?.fullName || 'Không xác định'}</td>
                <td><span className="admin-badge active">{log.action}</span></td>
                <td>{log.targetTable}</td>
                <td>{log.description}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Chưa có hoạt động nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
