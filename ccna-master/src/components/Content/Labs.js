import React, { useState, useEffect } from "react";
import { Download, Clock, Terminal, Search, Loader2 } from "lucide-react";
import { api } from "../../services/Api.js";

export const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const data = await api.getLabs();
        setLabs(data);
      } catch (err) {
        console.error("Failed to load labs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const getDifficultyClass = (diff) => {
    switch (diff) {
      case "Easy":
        return "badge-green";
      case "Medium":
        return "badge-yellow";
      case "Hard":
        return "badge-red";
      default:
        return "badge-gray";
    }
  };

  const categories = [
    "All",
    "Switching",
    "Routing",
    "Security",
    "Services",
    "Automation",
  ];

  const filteredLabs = labs.filter((lab) => {
    const matchesCategory = filter === "All" || lab.category === filter;
    const matchesSearch = lab.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      style={{ background: "#f8fafc", minHeight: "100vh", padding: "3rem 0" }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "0 0 0.5rem 0",
              }}
            >
              Phòng Lab Thực Hành
            </h1>
            <p style={{ color: "#475569" }}>
              Truy cập kho bài Lab chuẩn Cisco với dữ liệu cập nhật liên tục.
            </p>
          </div>
          <div style={{ position: "relative", width: "300px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "10px",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài Lab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <Loader2 className="animate-spin" />
          </div>
        ) : filteredLabs.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}
          >
            Không tìm thấy bài Lab nào.
          </div>
        ) : (
          <div className="lab-grid">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="card"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", height: "180px" }}>
                  <img
                    src={lab.imageUrl}
                    alt={lab.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{ position: "absolute", top: "1rem", right: "1rem" }}
                  >
                    <span
                      className={`badge ${getDifficultyClass(lab.difficulty)}`}
                    >
                      {lab.difficulty}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "1.5rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      color: "#2563eb",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {lab.category}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    {lab.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.875rem",
                      color: "#64748b",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Clock size={16} style={{ marginRight: "4px" }} />{" "}
                      {lab.duration}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Terminal size={16} style={{ marginRight: "4px" }} />{" "}
                      {lab.tools.join(", ")}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      style={{
                        background: "white",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      <Download size={16} style={{ marginRight: "8px" }} /> Tải
                      File
                    </button>
                    <button className="btn btn-primary">Hướng Dẫn</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Labs;
