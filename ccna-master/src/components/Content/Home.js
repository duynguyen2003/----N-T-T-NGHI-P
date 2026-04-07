import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Layers, Cpu } from 'lucide-react';
import { A1, A2 } from '../../image';


/* ===============================
   STATIC DATA
================================= */

const bannerImages = [A1, A2];

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