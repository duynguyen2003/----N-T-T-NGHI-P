import React from "react";
import {
  Router as RouterIcon,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#060D17",
        color: "#94a3b8",
        padding: "4rem 0 2rem",
        borderTop: "1px solid #1e293b",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Cột 1: Thông tin chung */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#2563eb",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                }}
              >
                <RouterIcon size={16} color="white" />
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "white",
                  marginLeft: "0.5rem",
                }}
              >
                NetMastery
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.6",
                color: "#64748b",
              }}
            >
              Nền tảng đào tạo mạng máy tính chuyên sâu, bám sát thực tế và
              chuẩn kỹ sư quốc tế Cisco CCNA.
            </p>
          </div>

          {/* Cột 2: Khóa học */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Khóa học
            </h3>
            <ul
              style={{
                fontSize: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  CCNA 200-301
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  Network Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  Automation (DevNet)
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Hỗ trợ
            </h3>
            <ul
              style={{
                fontSize: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  Cộng đồng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ transition: "0.2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#60a5fa")}
                  onMouseOut={(e) => (e.target.style.color = "inherit")}
                >
                  Liên hệ giảng viên
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Thông tin
            </h3>
            <div
              style={{
                fontSize: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p style={{ margin: 0 }}>Email: contact@netmastery.edu.vn</p>
              <p style={{ margin: 0 }}>Hotline: 1900 1234</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#1e293b",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Facebook size={16} />
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#1e293b",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Youtube size={16} />
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#1e293b",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Linkedin size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "2rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#475569",
          }}
        >
          &copy; 2025 NetMastery. Built for future network engineers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
