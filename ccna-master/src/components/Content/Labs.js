import React, { useState, useEffect, useCallback } from "react";
import {
  Download, Clock, Terminal, Search, Loader2,
  X, ChevronLeft, ChevronRight, Copy, Check,
  BookOpen, Network, Zap, AlertCircle
} from "lucide-react";
import { api } from "../../services/Api.js";

/* ──────────────────────────────────────
   HELPER: Copy to clipboard + feedback
────────────────────────────────────── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className="lab-copy-btn" onClick={handleCopy} title="Copy">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
};

/* ──────────────────────────────────────
   TERMINAL GUIDE MODAL
────────────────────────────────────── */
const LabGuideModal = ({ lab, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const totalSteps = lab.steps?.length || 0;

  // Close on Escape
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const currentStep = lab.steps?.[step];

  return (
    <div className="lab-modal-overlay" onClick={onClose}>
      <div className="lab-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Top Bar ── */}
        <div className="lab-modal-topbar">
          <div className="lab-modal-dots">
            <span className="dot-red" onClick={onClose} title="Đóng" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>
          <span className="lab-modal-title-bar">
            <Terminal size={13} style={{ marginRight: 6 }} />
            cisco-lab — {lab.title}
          </span>
          <button className="lab-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* ── Content area ── */}
        <div className="lab-modal-body">

          {/* Left: Info sidebar */}
          <div className="lab-modal-sidebar">
            <div className="lab-sidebar-section">
              <div className="lab-sidebar-label">
                <Network size={13} /> Topology
              </div>
              <pre className="lab-topology-pre">{lab.topology}</pre>
            </div>

            <div className="lab-sidebar-section">
              <div className="lab-sidebar-label">
                <BookOpen size={13} /> Mục tiêu
              </div>
              <p className="lab-objective-text">{lab.objective}</p>
            </div>

            <div className="lab-sidebar-section">
              <div className="lab-sidebar-label">
                <Zap size={13} /> Công cụ
              </div>
              <div className="lab-tool-tags">
                {lab.tools?.map(t => (
                  <span key={t} className="lab-tool-tag">{t}</span>
                ))}
              </div>
            </div>

            {/* Step progress */}
            <div className="lab-step-dots">
              {lab.steps?.map((_, i) => (
                <button
                  key={i}
                  className={`lab-step-dot ${i === step ? "active" : i < step ? "done" : ""}`}
                  onClick={() => setStep(i)}
                  title={`Bước ${i + 1}`}
                />
              ))}
            </div>

            {/* Automatic grading instructions */}
            <div className="lab-sidebar-section" style={{ background: 'rgba(37,99,235,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)', marginTop: 'auto', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#58a6ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> CHẤM ĐIỂM TỰ ĐỘNG
              </div>
              <p style={{ fontSize: '0.7rem', color: '#8b949e', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                Tải file bài tập .pka bên dưới. Mở bằng phần mềm Packet Tracer để làm và xem phần trăm hoàn thành trực tiếp trên phần mềm.
              </p>
            </div>

            <a href={lab.fileUrl || "#"} className="lab-download-btn" download>
              <Download size={14} /> Tải file bài tập (.pka)
            </a>
          </div>

          {/* Right: Terminal steps */}
          <div className="lab-modal-terminal">
            {/* Step header */}
            <div className="lab-step-header">
              <span className="lab-step-badge">Bước {step + 1}/{totalSteps}</span>
              <h3 className="lab-step-title">{currentStep?.title}</h3>
            </div>

            {/* CLI block */}
            <div className="lab-cli-block">
              {currentStep?.commands?.map((cmd, i) => (
                <div key={i} className="lab-cli-line">
                  <span className="lab-cli-prompt">$</span>
                  <span className="lab-cli-cmd">{cmd}</span>
                  <CopyButton text={cmd} />
                </div>
              ))}
            </div>

            {/* Note */}
            {currentStep?.note && (
              <div className="lab-step-note">
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{currentStep.note}</span>
              </div>
            )}

            {/* Navigation */}
            <div className="lab-step-nav">
              <button
                className="lab-nav-btn"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ChevronLeft size={16} /> Bước trước
              </button>

              {step < totalSteps - 1 ? (
                <button
                  className="lab-nav-btn primary"
                  onClick={() => setStep(s => s + 1)}
                >
                  Bước tiếp theo <ChevronRight size={16} />
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: '#d29922', paddingBottom: '6px' }}>
                    * Đảm bảo bạn đã đạt 100% Completion trên phần mềm trước khi xác nhận.
                  </div>
                  <button className="lab-nav-btn success" onClick={() => onComplete(lab.id)}>
                    <Check size={16} /> Xác nhận Hoàn thành Lab!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   LAB CARD
────────────────────────────────────── */
const difficultyConfig = {
  Easy:   { label: "Dễ",    cls: "badge-easy" },
  Medium: { label: "Trung bình", cls: "badge-medium" },
  Hard:   { label: "Khó",   cls: "badge-hard" },
};

const LabCard = ({ lab, isCompleted, onSelect }) => {
  const diff = difficultyConfig[lab.difficulty] || { label: lab.difficulty, cls: "badge-gray" };
  return (
    <div className="lab-card">
      <div className="lab-card-img-wrap">
        <img src={lab.imageUrl} alt={lab.title} className="lab-card-img" />
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: '8px' }}>
          {isCompleted && (
            <span className="lab-badge badge-easy" style={{ position: 'relative', top: 0, right: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={10} /> ĐÃ XONG
            </span>
          )}
          <span className={`lab-badge ${diff.cls}`} style={{ position: 'relative', top: 0, right: 0 }}>
            {diff.label}
          </span>
        </div>
        <div className="lab-card-overlay" />
      </div>

      <div className="lab-card-body">
        <span className="lab-card-category">{lab.category}</span>
        <h3 className="lab-card-title">{lab.title}</h3>

        <div className="lab-card-meta">
          <span><Clock size={13} /> {lab.duration}</span>
          <span><Terminal size={13} /> {lab.tools?.join(", ")}</span>
        </div>

        <div className="lab-card-actions">
          <a href={lab.fileUrl || "#"} className="lab-btn-outline" download>
            <Download size={14} /> Tải file
          </a>
          <button className="lab-btn-primary" onClick={() => onSelect(lab)}>
            <BookOpen size={14} /> Xem hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   MAIN PAGE
────────────────────────────────────── */
const CATEGORIES = ["All", "Switching", "Routing", "Security", "Services", "Automation"];

export const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  
  // Lưu trữ danh sách lab đã hoàn thành bằng ID
  const [completedLabs, setCompletedLabs] = useState([]);

  useEffect(() => {
    api.getLabs()
      .then(data => setLabs(data))
      .catch(err => console.error("Failed to load labs", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLabs = labs.filter(lab => {
    const matchCat = filter === "All" || lab.category === filter;
    const matchSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="labs-page">
      {/* ── Header ── */}
      <div className="labs-header">
        <div className="labs-header-text">
          <h1 className="labs-main-title">Phòng Lab Thực Hành</h1>
          <p className="labs-main-desc">
            Kho bài Lab chuẩn Cisco — topology, CLI step-by-step, file Packet Tracer.
          </p>
        </div>

        <div className="labs-search-wrap">
          <Search size={16} className="labs-search-icon" />
          <input
            type="text"
            className="labs-search-input"
            placeholder="Tìm kiếm bài Lab..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="labs-loading">
          <Loader2 className="labs-spinner" size={32} />
          <p>Đang tải danh sách Lab...</p>
        </div>
      ) : filteredLabs.length === 0 ? (
        <div className="labs-empty">
          <Terminal size={40} />
          <p>Không tìm thấy bài Lab nào phù hợp.</p>
        </div>
      ) : (
        <div className="lab-grid">
          {filteredLabs.map(lab => (
            <LabCard 
              key={lab.id} 
              lab={lab} 
              isCompleted={completedLabs.includes(lab.id)}
              onSelect={setSelectedLab} 
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {selectedLab && (
        <LabGuideModal 
          lab={selectedLab} 
          onClose={() => setSelectedLab(null)} 
          onComplete={(id) => {
            if (!completedLabs.includes(id)) {
              setCompletedLabs(prev => [...prev, id]);
            }
            setSelectedLab(null); // Đóng modal sau khi hoàn thành
          }}
        />
      )}
    </div>
  );
};

export default Labs;
