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
} from "lucide-react";
import api from "../../services/Api.js";

export default function Profile() {
  return (
    <div className="app">
      <div className="container">
        {/* Header Card */}
        <div className="header-card">
          <div className="bg-circle blue"></div>
          <div className="bg-circle purple"></div>

          <div className="header-content">
            <div className="user-info">
              <div className="avatar">NM</div>
              <div>
                <h1>
                  Xin chào, Nguyễn Văn Mạng <span>👋</span>
                </h1>
                <p className="subtitle">Học viên CCNA • Level 5</p>
                <div className="streak">
                  <Flame size={16} />
                  12 ngày streak
                </div>
              </div>
            </div>

            <div className="progress-box">
              <div className="progress-top">
                <div>
                  <p>Tiến độ tổng thể</p>
                  <div className="percent">45%</div>
                </div>
                <button className="primary-btn">
                  Tiếp tục học <ChevronRight size={18} />
                </button>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "45%" }}></div>
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

              <div className="course">
                <div className="course-row">
                  <span>Introduction to Networks (ITN)</span>
                  <span className="green">100%</span>
                </div>
                <div className="bar">
                  <div className="fill green-bg" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="course">
                <div className="course-row">
                  <span>Switching, Routing, Wireless (SRWE)</span>
                  <span className="blue">35%</span>
                </div>
                <div className="bar">
                  <div className="fill blue-bg" style={{ width: "35%" }}></div>
                </div>
              </div>

              <div className="course">
                <div className="course-row">
                  <span>Enterprise, Security, Automation (ENSA)</span>
                  <span className="gray">0%</span>
                </div>
                <div className="bar">
                  <div className="fill gray-bg" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <Activity size={22} />
                <h2>Hoạt động gần đây</h2>
              </div>

              <div className="activity">
                <FileText size={24} />
                <div>
                  <h3>Lab: OSPF Configuration</h3>
                  <p>2 hours ago</p>
                </div>
                <button>Xem lại</button>
              </div>

              <div className="activity">
                <MonitorPlay size={24} />
                <div>
                  <h3>Lesson: VLAN Concepts</h3>
                  <p>1 day ago</p>
                </div>
                <button>Xem lại</button>
              </div>
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
                <div className="achievement">
                  <Zap size={20} />
                  <span>Early Bird</span>
                </div>
                <div className="achievement">
                  <Award size={20} />
                  <span>Lab Master</span>
                </div>
                <div className="achievement">
                  <Target size={20} />
                  <span>Subnetting Hero</span>
                </div>
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
                <strong>45h 20m</strong>
              </div>

              <div className="stat">
                <CheckCircle2 size={20} />
                <span>Lab hoàn thành</span>
                <strong>18/50</strong>
              </div>

              <div className="stat">
                <Star size={20} />
                <span>Điểm trung bình</span>
                <strong className="blue">8.5</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}