import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Code2, Router, Shield, TerminalSquare } from 'lucide-react';
import { A1, A2 } from '../../image';
import { useAuth } from '../../context/AuthContext';

/* ===============================
   STATIC DATA
================================= */

const bannerImages = [A1, A2];

const courses = [
  {
    id: 1,
    icon: Code2,
    title: "Network Fundamentals",
    desc: "Mô hình OSI, TCP/IP, IP Addressing, Cabling & Hardware.",
    progress: 100,
    statusText: "HOÀN THÀNH 100%",
  },
  {
    id: 2,
    icon: Router,
    title: "Routing & Switching",
    desc: "VLAN, Trunking, STP, Static Routing, OSPF, EtherChannel.",
    progress: 45,
    statusText: "ĐANG HỌC 45%",
  },
  {
    id: 3,
    icon: Shield,
    title: "IP Services & Security",
    desc: "ACLs, NAT, DHCP, SNMP, Security Fundamentals.",
    progress: 0,
    statusText: "CHƯA BẮT ĐẦU",
  },
  {
    id: 4,
    icon: TerminalSquare,
    title: "Automation & Cloud",
    desc: "Python basics, API, JSON, SDN Architecture, Cloud models.",
    progress: 0,
    statusText: "CHƯA BẮT ĐẦU",
  },
];

const features = [
  {
    materialIcon: "calculate",
    title: "Trình tính toán Subnet",
    desc: "Phân chia dải mạng, tính toán host và broadcast nhanh chóng.",
    to: "/tools/subnet",
  },
  {
    materialIcon: "account_tree",
    title: "VLSM Calculator",
    desc: "Phân bổ mạng con theo VLSM, tối ưu không gian địa chỉ IP.",
    to: "/tools/vlsm",
  },
  {
    materialIcon: "terminal",
    title: "Tra cứu Cisco CLI",
    desc: "Từ điển lệnh IOS đầy đủ cho Router và Switch.",
    to: "/tools/cli",
  },
  {
    materialIcon: "format_list_bulleted",
    title: "Tra cứu Port & Giao thức",
    desc: "Danh sách các cổng dịch vụ phổ biến (HTTP, SSH, Telnet...).",
    to: "/tools/ports",
  },
];

/* ===============================
   HOOKS
 ================================= */

/**
 * Counts from 0 → target over `duration` ms, then resets and repeats every `interval` ms.
 */
const useCountUp = (target, duration = 1500, interval = 3000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    // reset & repeat every `interval` ms
    const repeater = setInterval(() => {
      startTime = null;
      cancelAnimationFrame(frameId);
      setCount(0);
      frameId = requestAnimationFrame(animate);
    }, interval);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(repeater);
    };
  }, [target, duration, interval]);

  return count;
};

/* ===============================
   REUSABLE COMPONENTS
 ================================= */

const FeatureCard = ({ materialIcon, title, desc, to }) => (
  <Link to={to} className="feat-card">
    <div className="feat-icon-box">
      <span className="material-icons-round feat-icon">{materialIcon}</span>
    </div>
    <h3 className="feat-title">{title}</h3>
    <p className="feat-desc">{desc}</p>
    <span className="feat-explore-btn">
      Khám phá
      <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
    </span>
  </Link>
);

const StatsSection = () => {
  const count120 = useCountUp(120);
  const count50 = useCountUp(50);
  const count1000 = useCountUp(1000);

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <span className="material-icons-round">play_circle</span>
        </div>
        <div className="stat-info">
          <h3>{count120}+</h3>
          <p>Giờ học video</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-indigo">
          <span className="material-icons-round">terminal</span>
        </div>
        <div className="stat-info">
          <h3>{count50}+</h3>
          <p>Bài lab thực hành</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-purple">
          <span className="material-icons-round">fact_check</span>
        </div>
        <div className="stat-info">
          <h3>{count1000}+</h3>
          <p>Câu hỏi ôn thi</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon icon-emerald">
          <span className="material-icons-round">support_agent</span>
        </div>
        <div className="stat-info">
          <div className="stat-value-row">
            <h3>24/7</h3>
            <span className="online-dot" title="Đang online"></span>
          </div>
          <p>Hỗ trợ cộng đồng</p>
        </div>
      </div>
    </section>
  );
};

/* ===============================
   MAIN COMPONENT
 ================================= */

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % bannerImages.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setCurrent((prev) => (prev + 1) % bannerImages.length);

  const prev = () =>
    setCurrent((prev) =>
      (prev - 1 + bannerImages.length) % bannerImages.length
    );

  return (
    <div className="home-wrapper">
      {/* ================= Banner ================= */}
      <section className="banner-section">
        <div className="banner-container">
          <button className="nav-btn prev" onClick={prev}>
            <ChevronLeft size={24} />
          </button>

          <button className="nav-btn next" onClick={next}>
            <ChevronRight size={24} />
          </button>

          {bannerImages.map((img, i) => (
            <div
              key={i}
              className={`banner-slide ${i === current ? "active" : ""}`}
            >
              <div className="banner-text-content">
                <h1 className="banner-title">
                  Chinh phục <span className="text-highlight">CCNA 200-301</span>
                </h1>
                <p className="banner-subtitle">Bắt đầu hành trình trở thành Network Engineer.</p>
                <Link to="/roadmap" className="btn-primary-compact">
                  Bắt đầu ngay <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Link>
              </div>
              <div
                className="banner-image-content"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            </div>
          ))}

          <div className="banner-indicators">
            {bannerImages.map((_, i) => (
              <button
                key={i}
                className={`indicator-dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= Stats ================= */}
      <StatsSection />

      {/* ================= Curriculum ================= */}
      <section className="curriculum">
        <div className="section-header">
          <h2 className="section-title">Lộ trình học CCNA chuẩn Cisco</h2>
          <p className="section-desc">Đi từ nền tảng đến sẵn sàng thi CCNA 200-301.</p>
        </div>

        <div className="course-grid-container">
          <div className="course-grid-line"></div>
          <div className="course-grid">
            {courses.map((course) => {
              const Icon = course.icon;
              const isStarted = course.progress > 0 || course.statusText === "HOÀN THÀNH 100%";
              const showAsActive = !isAuthenticated || isStarted;
              const numberClass = showAsActive ? "active" : "inactive";
              const cardClass = showAsActive ? "course-card active" : "course-card inactive";

              return (
                <Link to="/roadmap" key={course.id} className={cardClass} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={`course-number ${numberClass}`}>{course.id}</div>
                  <div className="icon-box">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.desc}</p>

                  {isAuthenticated && (
                    <div className="course-progress-section">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${course.progress}%`, backgroundColor: course.progress > 0 ? '#2563eb' : 'transparent' }}
                        ></div>
                      </div>
                      <p className={`progress-text ${course.progress === 0 ? 'inactive' : ''}`}>
                        {course.statusText}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Công cụ hỗ trợ học tập</h2>
          <p>Các tiện ích giúp bạn tối ưu hóa quá trình học tập và thực hành mạng.</p>
        </div>

        <div className="features-grid">
          {features.map((item, i) => (
            <FeatureCard key={i} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;