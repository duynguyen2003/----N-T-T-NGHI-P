import React from "react";
import { FileText, Download, HardDrive } from "lucide-react";
const resources = [
  {
    id: "1",
    title: "Giáo trình CCNA 200-301 Full Tiếng Việt",
    type: "PDF",
    size: "25 MB",
  },
  {
    id: "2",
    title: "Tổng hợp lệnh CLI Cisco Router/Switch",
    type: "PDF",
    size: "2 MB",
  },
  {
    id: "3",
    title: "Cisco Packet Tracer 8.2 (Windows)",
    type: "PKT",
    size: "240 MB",
  },
];

export const Resources = () => {
  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h1 style={{ marginBottom: "2rem" }}>Kho Tài Liệu CCNA</h1>
      <div className="card table-container">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Tên tài liệu</th>
              <th>Loại file</th>
              <th>Kích thước</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => (
              <tr key={res.id}>
                <td style={{ display: "flex", alignItems: "center" }}>
                  {res.type === "PDF" ? (
                    <FileText color="#dc2626" style={{ marginRight: "1rem" }} />
                  ) : (
                    <HardDrive
                      color="#16a34a"
                      style={{ marginRight: "1rem" }}
                    />
                  )}
                  <span style={{ fontWeight: "bold" }}>{res.title}</span>
                </td>
                <td>
                  <span
                    className={`badge ${res.type === "PDF" ? "badge-red" : "badge-green"
                      }`}
                  >
                    {res.type}
                  </span>
                </td>
                <td style={{ color: "#64748b" }}>{res.size}</td>
                <td>
                  <button
                    style={{
                      color: "#2563eb",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Download size={16} style={{ marginRight: "4px" }} /> Tải về
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Resources;
