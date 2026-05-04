import React, { useState, useEffect } from "react";
import '../../css/Profile.css';
import {
  Zap,
  Trophy,
  BookOpen,
  Activity,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  MonitorPlay,
  ChevronRight,
  Award,
  Flame,
  Target,
  BarChart2,
  Loader2,
} from "lucide-react";
import { api } from "../../services/Api.js";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getUserProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="profile-loading" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="spin" size={32} color="#2563eb" />
      </div>
    );
  }

  if (!profile) return null;

  // Giả lập hoặc tính toán các thông số chưa có trực tiếp từ profile API nếu cần
  const recentActivities = profile.activities || [];
  const badges = profile.badges || [];
  const courseProgress = profile.progress || [];

  return (
    <div className="app">
      <div className="container">
        {/* Header Card */}
        <div className="header-card">
          <div className="bg-circle blue"></div>
          <div className="bg-circle purple"></div>

          <div className="header-content">
            <div className="user-info">
              <div className="avatar">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" />
                ) : (
                  profile.fullName?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div>
                <h1>
                  Xin chào, {profile.fullName} <span>👋</span>
                </h1>
                <p className="subtitle">Học viên CCNA • Level {profile.level || 1}</p>
                <div className="streak">
                  <Flame size={16} />
                  {profile.streak || 0} ngày streak
                </div>
              </div>
            </div>

            <div className="progress-box">
              <div className="progress-top">
                <div>
                  <p>Tiến độ tổng thể</p>
                  <div className="percent">{profile.totalProgress || 0}%</div>
                </div>
                <button className="primary-btn">
                  Tiếp tục học <ChevronRight size={18} />
                </button>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${profile.totalProgress || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="left-column">
            {/* Progress by Course */}
            <div className="card">
              <div className="card-header">
                <BookOpen size={22} />
                <h2>Tiến độ theo khóa học</h2>
              </div>

              {courseProgress.length > 0 ? courseProgress.map((cp, idx) => (
                <div className="course" key={idx}>
                  <div className="course-row">
                    <span>{cp.courseName || cp.courseId}</span>
                    <span className="blue">{cp.progressPercent}%</span>
                  </div>
                  <div className="bar">
                    <div className="fill blue-bg" style={{ width: `${cp.progressPercent}%` }}></div>
                  </div>
                </div>
              )) : (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Chưa có tiến độ khóa học nào.</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <Activity size={22} />
                <h2>Hoạt động gần đây</h2>
              </div>

              {recentActivities.length > 0 ? recentActivities.map((act) => (
                <div className="activity" key={act.id}>
                  {act.type === 'Lesson' ? <MonitorPlay size={24} /> : <FileText size={24} />}
                  <div>
                    <h3>{act.title}</h3>
                    <p>{new Date(act.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button>Xem lại</button>
                </div>
              )) : (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Chưa có hoạt động gần đây.</p>
              )}
            </div>
          </div>

          <div className="right-column">
            {/* Achievements */}
            <div className="card">
              <div className="card-header">
                <Trophy size={22} />
                <h2>Thành tích</h2>
              </div>

              <div className="achievement-grid">
                {badges.length > 0 ? badges.map((badge, idx) => (
                  <div className="achievement" key={idx}>
                    <Zap size={20} />
                    <span>{badge.badgeName}</span>
                  </div>
                )) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', gridColumn: 'span 3' }}>Chưa có thành tích.</p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <div className="card-header">
                <BarChart2 size={22} />
                <h2>Thống kê chi tiết</h2>
              </div>

              <div className="stat">
                <Clock size={20} />
                <span>Thời gian học</span>
                <strong>{Math.floor((profile.totalStudyTime || 0) / 60)}h {(profile.totalStudyTime || 0) % 60}m</strong>
              </div>

              <div className="stat">
                <CheckCircle2 size={20} />
                <span>Lab hoàn thành</span>
                <strong>{profile.completedLabs || 0}/{profile.totalLabs || 50}</strong>
              </div>

              <div className="stat">
                <Star size={20} />
                <span>Điểm trung bình</span>
                <strong className="blue">{profile.averageScore || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}