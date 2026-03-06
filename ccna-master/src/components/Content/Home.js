import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Server, Shield, Cpu, PlayCircle, ChevronLeft, ChevronRight, Globe, Layers } from 'lucide-react';
import { A1, A2 } from '../../image';


/* ===============================
   STATIC DATA
================================= */

const bannerImages = [A1, A2];

const statsData = [
  { number: "120+", label: "Giờ học Video" },
  { number: "50+", label: "Bài Lab Thực Hành" },
  { number: "1000+", label: "Câu hỏi ôn thi" },
  { number: "24/7", label: "Hỗ trợ cộng đồng" },
];

const courses = [
  {
    icon: Globe,
    className: "itn",
    title: "1. ITN - Introduction to Networks",
    desc: "Xây dựng nền tảng về IP, Ethernet và cấu hình thiết bị.",
    topics: ["IPv4 & IPv6", "Ethernet Switching", "Network Security Basics"],
  },
  {
    icon: Layers,
    className: "srwe",
    title: "2. SRWE - Switching, Routing, Wireless",
    desc: "Chuyên sâu chuyển mạch, định tuyến và WLAN.",
    topics: ["VLAN & Inter-VLAN", "STP & EtherChannel", "WLAN Config"],
  },
  {
    icon: Cpu,
    className: "ensa",
    title: "3. ENSA - Enterprise & Automation",
    desc: "Routing nâng cao, ACL, NAT và Automation.",
    topics: ["OSPFv2", "ACL & NAT", "SDN & Automation"],
  },
];

const features = [
  {
    icon: Server,
    title: "Phòng Lab Ảo",
    desc: "Thực hành Topology Packet Tracer từng bước.",
    to: "/labs",
  },
  {
    icon: Shield,
    title: "Thi Thử Real-time",
    desc: "Mô phỏng áp lực phòng thi thật.",
    to: "/exam",
  },
  {
    icon: PlayCircle,
    title: "Video Chất Lượng",
    desc: "Giải thích trực quan bằng sơ đồ mạng.",
    to: "/lesson",
  },
  {
    icon: Cpu,
    title: "Tài Nguyên Số",
    desc: "Ebook, Slide, Cheat Sheet miễn phí.",
    to: "/resources",
  },
];

/* ===============================
   REUSABLE COMPONENTS
 ================================= */

const FeatureCard = ({ icon: Icon, title, desc, to }) => (
  <Link to={to} className="feat-card">
    <div className="feat-icon-box">
      <Icon className="feat-icon" />
    </div>
    <h3 className="feat-title">{title}</h3>
    <p className="feat-desc">{desc}</p>
    <span className="feat-link">
      Khám phá <ArrowRight size={16} />
    </span>
  </Link>
);

const StatCard = ({ number, label }) => (
  <div className="stat-card">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
);

/* ===============================
   MAIN COMPONENT
 ================================= */

export const Home = () => {
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
      <section className="stats-banner">
        <div className="stats-grid">
          {statsData.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* ================= Curriculum ================= */}
      <section className="curriculum">
        <div className="section-header">
          <h2 className="section-title">Lộ trình học CCNA chuẩn Cisco</h2>
          <p className="section-desc">Đi từ nền tảng đến sẵn sàng thi CCNA 200-301.</p>
        </div>

        <div className="course-grid">
          {courses.map((course, i) => {
            const Icon = course.icon;
            return (
              <div key={i} className={`course-card ${course.className}`}>
                <div className="icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.desc}</p>
                <ul className="course-list">
                  {course.topics.map((topic, idx) => (
                    <li key={idx}>
                      <span className="dot"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Công cụ hỗ trợ học tập</h2>
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