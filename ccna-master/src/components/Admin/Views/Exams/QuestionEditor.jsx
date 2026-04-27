import React from 'react';
import {
  Zap,
  ListChecks,
  AlignLeft,
  Upload,
  CheckCircle2,
  Plus,
  PencilLine,
  Trash2,
  FileText
} from 'lucide-react';
import CustomSelect from '../../Components/CustomSelect';
import { OPTION_LABELS, correctAnswerOptions } from './constants';

const TYPE_CARDS = [
  {
    key: 'mc',
    iconCls: 'efb-type-icon-purple',
    Icon: ListChecks,
    label: 'Trắc nghiệm',
    desc: 'Nhiều lựa chọn, tự động chấm điểm',
    active: true,
  },
  {
    key: 'essay',
    iconCls: 'efb-type-icon-blue',
    Icon: AlignLeft,
    label: 'Tự luận',
    desc: 'Dạng văn bản, giáo viên chấm điểm',
  },
  {
    key: 'import',
    iconCls: 'efb-type-icon-cyan',
    Icon: Upload,
    label: 'Nhập từ File',
    desc: 'Nhập hàng loạt từ Excel / CSV',
    onClick: true, // handled by parent
  },
];

// ─── Single option row ────────────────────────────────────────────────────────

const OptionRow = ({ index, value, isCorrect, onChange, onSelect }) => (
  <div className={`efb-option-item ${isCorrect ? 'efb-option-correct' : ''}`}>
    <button type="button" className="efb-option-radio" onClick={() => onSelect(index)}>
      {isCorrect ? <CheckCircle2 size={16} /> : <span className="efb-radio-dot" />}
    </button>
    <input
      className="efb-option-input"
      placeholder={`Đáp án ${OPTION_LABELS[index]}`}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
    />
  </div>
);

// ─── QuestionEditor ───────────────────────────────────────────────────────────

/**
 * The full "add / edit question" panel inside the exam form modal.
 */
const QuestionEditor = ({
  isEditMode,
  importMessage,
  draft,
  onDraftChange,        // (field, value) => void
  onOptionChange,       // (index, value) => void
  onImageUpload,
  onRemoveImage,
  uploadingImage,
  onBulkImportClick,
  onDownloadTemplate,
  onSave,
  onCancel,             // only shown when editing a question
  onReset,
  editingIdx,
  error,
}) => (
  <section className="efb-card efb-card-blue">
    <div className="efb-card-header">
      <div className="efb-card-badge efb-bg-blue"><Zap size={15} /></div>
      <span>{isEditMode ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Nhanh'}</span>
      {!isEditMode && <span className="efb-header-right">TIẾN NHANH THÔNG MINH</span>}
    </div>

    {/* Type cards */}
    <div className="efb-type-grid">
      {TYPE_CARDS.map(({ key, iconCls, Icon, label, desc, active, onClick }) => (
        <button
          key={key}
          type="button"
          className={`efb-type-card ${active ? 'efb-type-active' : ''}`}
          onClick={onClick ? onBulkImportClick : undefined}
        >
          <div className={`efb-type-icon ${iconCls}`}><Icon size={20} /></div>
          <strong>{label}</strong>
          <span>{desc}</span>
        </button>
      ))}
    </div>

    {/* Import helper */}
    <div className="efb-import-helper">
      <span>Định dạng: `question,optionA,optionB,optionC,optionD,correctAnswer,explanation,imageUrl`.</span>
      <button type="button" className="efb-btn-ghost" onClick={onDownloadTemplate}>
        Tải mẫu CSV
      </button>
    </div>
    {importMessage && <p className="exam-builder-success">{importMessage}</p>}

    {/* Draft editor */}
    <div className="efb-draft">
      {/* Question text */}
      <label className="efb-field efb-field-full">
        <input
          className="efb-input efb-question-input"
          placeholder="Nhập nội dung câu hỏi..."
          value={draft.question}
          onChange={(e) => onDraftChange('question', e.target.value)}
        />
      </label>

      {/* Image upload */}
      <div className="efb-image-upload-wrap">
        <label className="efb-btn-secondary efb-image-upload-btn">
          <Upload size={14} />
          {uploadingImage ? 'Đang tải ảnh...' : 'Tải ảnh sơ đồ mạng'}
          <input type="file" accept="image/*" disabled={uploadingImage} onChange={onImageUpload} hidden />
        </label>

        {draft.imageUrl && (
          <div className="efb-image-preview">
            <img src={draft.imageUrl} alt="Sơ đồ mạng câu hỏi" />
            <button type="button" className="efb-btn-ghost" onClick={onRemoveImage}>Gỡ ảnh</button>
          </div>
        )}
      </div>

      {/* Options grid */}
      <div className="efb-options-grid">
        {draft.options.map((opt, i) => (
          <OptionRow
            key={i}
            index={i}
            value={opt}
            isCorrect={draft.correctAnswer === i}
            onChange={onOptionChange}
            onSelect={(idx) => onDraftChange('correctAnswer', idx)}
          />
        ))}
      </div>

      {/* Footer: correct answer select + explanation */}
      <div className="efb-draft-footer">
        <label className="efb-field efb-flex-1">
          <span>Đáp án Đúng</span>
          <CustomSelect
            value={draft.correctAnswer}
            onChange={(val) => onDraftChange('correctAnswer', val)}
            options={correctAnswerOptions}
          />
        </label>
        <label className="efb-field efb-flex-2">
          <span>Giải thích / Ghi chú điểm số</span>
          <input
            className="efb-input"
            placeholder="Nhập gợi ý hoặc giải thích đáp án..."
            value={draft.explanation}
            onChange={(e) => onDraftChange('explanation', e.target.value)}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="efb-draft-actions">
        <button type="button" className="efb-btn-ghost" onClick={onReset}>
          Thêm câu hỏi mới theo cách thủ công
        </button>
        <div className="efb-gap-8">
          {editingIdx !== null && (
            <button type="button" className="efb-btn-secondary" onClick={onCancel}>Hủy</button>
          )}
          <button type="button" className="efb-btn-primary" onClick={onSave}>
            <Plus size={15} />
            {editingIdx !== null ? 'Cập nhật' : 'Thêm câu hỏi'}
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ─── QuestionList ─────────────────────────────────────────────────────────────

export const QuestionList = ({ questions, onEdit, onDelete }) => {
  if (!questions.length) return null;

  return (
    <div className="efb-qlist">
      <div className="efb-qlist-header">
        <FileText size={15} />
        <span>Danh Sách Câu Hỏi ({questions.length})</span>
      </div>

      {questions.map((q, idx) => (
        <div key={idx} className="efb-qcard">
          <div className="efb-qcard-top">
            <span className="efb-qnum">{idx + 1}</span>
            <p className="efb-qtext">{q.question}</p>
            <div className="efb-qcard-actions">
              <button type="button" className="efb-icon-btn" onClick={() => onEdit(idx)}>
                <PencilLine size={14} />
              </button>
              <button type="button" className="efb-icon-btn efb-icon-danger" onClick={() => onDelete(idx)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="efb-qoptions">
            {q.options.map((opt, oi) => (
              <div key={oi} className={`efb-qoption ${q.correctAnswer === oi ? 'correct' : ''}`}>
                {q.correctAnswer === oi
                  ? <CheckCircle2 size={13} className="efb-qoption-correct-icon" />
                  : <span className="efb-qoption-dot" />}
                <span>{opt || `(Đáp án ${OPTION_LABELS[oi]} trống)`}</span>
              </div>
            ))}
          </div>

          {q.imageUrl && (
            <div className="efb-qimage">
              <img src={q.imageUrl} alt={`Sơ đồ mạng câu hỏi ${idx + 1}`} />
            </div>
          )}

          {q.explanation && (
            <div className="efb-qexplan">
              <span>Giải thích:</span> {q.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default QuestionEditor;
