import React, { useRef } from 'react';
import {
  ArrowLeft,
  Save,
  ListChecks,
  Clock3,
  Settings2,
  Shuffle,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import CustomSelect from '../../Components/CustomSelect';
import QuestionEditor, { QuestionList } from './QuestionEditor';
import { difficultyOptions } from './constants';

const ExamEditor = ({
  isEditMode,
  formData,
  setFormData,
  questions,
  questionDraft,
  setQuestionDraft,
  editingQuestionIndex,
  modules,
  error,
  importMessage,
  uploadingQuestionImage,
  shuffleQuestions,
  setShuffleQuestions,
  hideResult,
  setHideResult,
  courseOptions,
  handleCourseChange,
  handleQuestionOptionChange,
  handleQuestionImageUpload,
  handleBulkImportQuestions,
  handleSaveQuestion,
  handleEditQuestion,
  handleDeleteQuestion,
  handleSubmitExam,
  resetQuestionDraft,
  onClose
}) => {
  const bulkImportInputRef = useRef(null);

  const handleDownloadCsvTemplate = () => {
    const sampleCsv = [
      'question,optionA,optionB,optionC,optionD,correctAnswer,explanation,imageUrl',
      '"Router nào là default gateway?","R1","R2","SW1","PC1","A","Default gateway là router kết nối ra mạng ngoài.",""'
    ].join('\n');

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exam-questions-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const moduleOptions = [
    { value: '', label: 'Chọn chương (không bắt buộc)' },
    ...modules.map((m) => ({ value: m.id, label: m.title }))
  ];

  return (
    <div className="efb-page">
      <div className="efb-page-content">
        <div className="efb-shell">
          <header className="efb-editor-header">
            <div className="efb-header-main">
              <div className="efb-header-title-group">
                <button type="button" className="efb-back-btn" onClick={onClose} style={{ marginBottom: '8px' }}>
                  <ArrowLeft size={14} />
                  <span>TRỞ LẠI DANH SÁCH</span>
                </button>
                <h1 className="efb-page-title">{isEditMode ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}</h1>
              </div>

              <div className="efb-header-stepper">
                <div className="efb-stepper">
                  <div className="efb-step active">1</div>
                  <div className="efb-step-line" />
                  <div className="efb-step">2</div>
                </div>
              </div>
            </div>
          </header>

          {error && <p className="exam-builder-error" style={{ marginBottom: '20px' }}>{error}</p>}

          <section className="efb-card efb-card-purple">
            <div className="efb-card-header">
              <div className="efb-card-badge efb-bg-purple"><ListChecks size={15} /></div>
              <div>
                <strong>Thông Tin Cơ Bản</strong>
                <p style={{ paddingTop: '2px', margin: 0, fontSize: '12px', color: '#666' }}>Điền các thông tin chi tiết để thiết lập cấu hình bài thi</p>
              </div>
            </div>

            <div className="efb-draft" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
              <label className="efb-field efb-field-full">
                <span style={{ fontWeight: 600 }}>Tiêu đề bài thi *</span>
                <input
                  className="efb-input"
                  placeholder="Ví dụ: Kiểm tra cuối kỳ môn Toán Giải Tích 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>

              <div className="efb-row" style={{ marginTop: '16px' }}>
                <label className="efb-field efb-flex-1">
                  <span style={{ fontWeight: 600 }}>Mã đề thi</span>
                  <input
                    className="efb-input"
                    placeholder="MD-2023-01"
                    value={formData.examCode}
                    onChange={(e) => setFormData({ ...formData, examCode: e.target.value })}
                  />
                </label>

                <label className="efb-field efb-flex-1">
                  <span style={{ fontWeight: 600 }}>Thời gian làm bài (phút) *</span>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      className="efb-input"
                      placeholder="60"
                      style={{ paddingRight: '45px' }}
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#888' }}>Phút</span>
                  </div>
                </label>
              </div>

              <div className="efb-row" style={{ marginTop: '16px' }}>
                <label className="efb-field efb-flex-1">
                  <span style={{ fontWeight: 600 }}>Chuyên môn / Khóa học *</span>
                  <CustomSelect
                    value={formData.courseId}
                    onChange={(val) => handleCourseChange(val)}
                    options={courseOptions}
                  />
                </label>

                <label className="efb-field efb-flex-1">
                  <span style={{ fontWeight: 600 }}>Chương bài học</span>
                  <CustomSelect
                    value={formData.moduleId}
                    onChange={(val) => setFormData({ ...formData, moduleId: val })}
                    options={moduleOptions}
                    disabled={!formData.courseId}
                  />
                </label>
              </div>
            </div>
          </section>

          <QuestionEditor
            isEditMode={isEditMode}
            importMessage={importMessage}
            draft={questionDraft}
            onDraftChange={(field, val) => setQuestionDraft((p) => ({ ...p, [field]: val }))}
            onOptionChange={handleQuestionOptionChange}
            onImageUpload={handleQuestionImageUpload}
            onRemoveImage={() => setQuestionDraft((p) => ({ ...p, imageUrl: '' }))}
            uploadingImage={uploadingQuestionImage}
            onBulkImportClick={() => bulkImportInputRef.current?.click()}
            onDownloadTemplate={handleDownloadCsvTemplate}
            onSave={handleSaveQuestion}
            onCancel={resetQuestionDraft}
            onReset={resetQuestionDraft}
            editingIdx={editingQuestionIndex}
            error={error}
          />

          <input
            ref={bulkImportInputRef}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={handleBulkImportQuestions}
            hidden
          />

          <QuestionList
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
          />

          <section className="efb-card efb-card-orange">
            <div className="efb-card-header">
              <div className="efb-card-badge efb-bg-orange"><Settings2 size={15} /></div>
              <span>Cài Đặt Nâng Cao</span>
            </div>

            <div className="efb-row">
              <label className="efb-field">
                <span>Điểm sàn (%)</span>
                <input
                  type="number"
                  className="efb-input"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                />
              </label>
              <label className="efb-field">
                <span>Độ khó</span>
                <CustomSelect
                  value={formData.difficulty}
                  onChange={(val) => setFormData({ ...formData, difficulty: val })}
                  options={difficultyOptions}
                />
              </label>
            </div>

            <div className="efb-toggle-list">
              <div className="efb-toggle-item">
                <div className="efb-toggle-info">
                  <div className="efb-toggle-icon"><Shuffle size={16} /></div>
                  <div>
                    <strong>Trộn câu hỏi</strong>
                    <span>Xáo trộn câu hỏi ngẫu nhiên cho mỗi học sinh</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`efb-toggle-btn ${shuffleQuestions ? 'on' : ''}`}
                  onClick={() => setShuffleQuestions((p) => !p)}
                >
                  <span />
                </button>
              </div>

              <div className="efb-toggle-item">
                <div className="efb-toggle-info">
                  <div className="efb-toggle-icon"><EyeOff size={16} /></div>
                  <div>
                    <strong>Ẩn kết quả thi</strong>
                    <span>Giấu điểm và đáp án sau khi học sinh nộp bài</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`efb-toggle-btn ${hideResult ? 'on' : ''}`}
                  onClick={() => setHideResult((p) => !p)}
                >
                  <span />
                </button>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingBottom: '40px' }}>
            <button type="button" className="efb-btn-primary" onClick={handleSubmitExam} style={{ padding: '12px 30px' }}>
              Lưu bài thi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamEditor;
