import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/Api.js";
export const Roadmap = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
        const activeCourse =
          data.find((c) => c.progress > 0 && c.progress < 100) || data[0];
        if (activeCourse) setExpandedCourse(activeCourse.id);
      } catch (err) {
        setError("Không thể tải dữ liệu lộ trình.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleCourse = (id) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Đang tải...
      </div>
    );
  if (error) return <div className="container">{error}</div>;

  return (
    <div
      style={{ padding: "3rem 0", background: "#f8fafc", minHeight: "100vh" }}
    >
      <div className="container" style={{ maxWidth: "1024px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            Lộ trình CCNA 200-301
          </h1>
          <p style={{ color: "#475569" }}>
            Chinh phục chứng chỉ quốc tế với 3 khóa học chuyên sâu.
          </p>
        </div>

        <div>
          {courses.map((course) => (
            <div key={course.id} className="card roadmap-item">
              {/* Course Header */}
              <div
                className="roadmap-header"
                onClick={() => toggleCourse(course.id)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      color: "white",
                      fontWeight: "bold",
                      background:
                        course.code === "ITN"
                          ? "#3b82f6"
                          : course.code === "SRWE"
                            ? "#6366f1"
                            : "#a855f7",
                    }}
                  >
                    {course.code}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {course.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        margin: "4px 0 0",
                      }}
                    >
                      {course.description}
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "2rem" }}
                >
                  <div style={{ width: "120px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        marginBottom: "4px",
                        fontWeight: "600",
                        color: "#64748b",
                      }}
                    >
                      <span>Hoàn thành</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${course.progress}%`,
                          background:
                            course.progress === 100 ? "#22c55e" : "#2563eb",
                        }}
                      ></div>
                    </div>
                  </div>
                  {expandedCourse === course.id ? (
                    <ChevronUp size={20} color="#94a3b8" />
                  ) : (
                    <ChevronDown size={20} color="#94a3b8" />
                  )}
                </div>
              </div>

              {/* Modules List */}
              {expandedCourse === course.id && (
                <div className="roadmap-content">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {course.modules?.map((module, idx) => (
                      <div
                        key={module.id}
                        className="module-item"
                        style={{
                          opacity: module.status === "locked" ? 0.6 : 1,
                        }}
                      >
                        <div style={{ marginRight: "1rem" }}>
                          {module.status === "completed" ? (
                            <CheckCircle size={24} color="#16a34a" />
                          ) : module.status === "active" ? (
                            <Play size={24} color="#2563eb" fill="#2563eb" />
                          ) : (
                            <Lock size={24} color="#94a3b8" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              margin: 0,
                            }}
                          >
                            Module {idx + 1}: {module.title}
                          </h4>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#64748b",
                              margin: "4px 0 0",
                            }}
                          >
                            {module.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Roadmap;
