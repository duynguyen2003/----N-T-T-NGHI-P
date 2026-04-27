import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileCode2,
  Eye,
  Pencil,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  FileUp
} from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import AdminPagination from '../Components/AdminPagination';
import CustomSelect from '../Components/CustomSelect';
import '../../../css/Admin/AdminViews.css';

const LAB_TABS = [
  { id: 'basic', label: 'Thong tin co ban' },
  { id: 'content', label: 'Noi dung & Cac buoc' },
  { id: 'media', label: 'Tai nguyen & Cong cu' }
];

const CATEGORY_OPTIONS = [
  { value: '', label: '-- Chon danh muc --' },
  { value: 'Routing', label: 'Routing' },
  { value: 'Switching', label: 'Switching' },
  { value: 'Security', label: 'Security' },
  { value: 'Services', label: 'Services' },
  { value: 'Automation', label: 'Automation' },
  { value: 'Troubleshooting', label: 'Troubleshooting' }
];

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'De (EASY)' },
  { value: 'MEDIUM', label: 'Trung binh (MEDIUM)' },
  { value: 'HARD', label: 'Kho (HARD)' }
];

const DIFFICULTY_LABEL_MAP = {
  EASY: 'De',
  MEDIUM: 'Trung binh',
  HARD: 'Kho'
};

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Nhap' },
  { value: 'PUBLISHED', label: 'Da xuat ban' },
  { value: 'ARCHIVED', label: 'Luu tru' }
];

const STATUS_BADGE_MAP = {
  DRAFT: { label: 'Nhap', className: 'inactive' },
  PUBLISHED: { label: 'Da xuat ban', className: 'active' },
  ARCHIVED: { label: 'Luu tru', className: 'student' }
};

const createInitialFormData = () => ({
  title: '',
  category: '',
  difficulty: 'EASY',
  status: 'DRAFT',
  duration: '',
  guideContent: '',
  objective: '',
  courseId: '',
  moduleId: '',
  toolsText: '',
  filePka: null,
  thumbnailImg: null,
  topologyImg: null,
  steps: [{ title: '', commands: '', note: '' }]
});

const parseToolsInput = (toolsText) =>
  String(toolsText || '')
    .split(/[\n,]/)
    .map((tool) => tool.trim())
    .filter(Boolean);

const normalizeToolsToText = (toolsValue) => {
  if (Array.isArray(toolsValue)) return toolsValue.join(', ');
  if (typeof toolsValue === 'string') return toolsValue;
  return '';
};

const normalizeStepCommandsToText = (commandsValue) => {
  if (Array.isArray(commandsValue)) return commandsValue.join('\n');
  if (typeof commandsValue === 'string') return commandsValue;
  return '';
};

const hasRichTextContent = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
    .length > 0;

const mapLabToFormData = (lab) => {
  const normalizedSteps = Array.isArray(lab?.steps) && lab.steps.length > 0
    ? lab.steps.map((step) => ({
      title: String(step?.title || ''),
      commands: normalizeStepCommandsToText(step?.commands),
      note: String(step?.note || '')
    }))
    : [{ title: '', commands: '', note: '' }];

  return {
    title: String(lab?.title || ''),
    category: String(lab?.category || ''),
    difficulty: String(lab?.difficulty || 'EASY'),
    status: String(lab?.status || 'DRAFT'),
    duration: String(lab?.duration || ''),
    guideContent: String(lab?.guideContent || ''),
    objective: String(lab?.objective || ''),
    courseId: String(lab?.courseId || ''),
    moduleId: String(lab?.moduleId || ''),
    toolsText: normalizeToolsToText(lab?.tools),
    filePka: null,
    thumbnailImg: null,
    topologyImg: null,
    steps: normalizedSteps
  };
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const runCommand = (command, commandValue = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt('Nhap URL lien ket');
    if (!url) return;
    runCommand('createLink', url);
  };

  return (
    <div className="labm-rte-shell">
      <div className="labm-rte-toolbar">
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('bold')}
          title="In dam"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('italic')}
          title="In nghieng"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('underline')}
          title="Gach chan"
        >
          <Underline size={14} />
        </button>
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('insertUnorderedList')}
          title="Danh sach cham"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand('insertOrderedList')}
          title="Danh sach so"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          className="labm-rte-btn"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleLink}
          title="Chen lien ket"
        >
          <Link2 size={14} />
        </button>
      </div>

      <div
        ref={editorRef}
        className="labm-rte-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  );
};

const Labs = () => {
  const { token } = useContext(AuthContext);

  const [labs, setLabs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create'); // create | edit
  const [editingLabId, setEditingLabId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(createInitialFormData());
  const [previews, setPreviews] = useState({ thumbnail: null, topology: null });
  const [error, setError] = useState('');

  const [selectedLabForView, setSelectedLabForView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const toolsPreview = useMemo(() => parseToolsInput(formData.toolsText), [formData.toolsText]);

  const fetchLabs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getLabs(token, page);
      setLabs(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
        setTotalItems(res.pagination.total || 0);
        setCurrentPage(res.pagination.page || 1);
      }
    } catch (fetchError) {
      console.error(fetchError);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (fetchError) {
      console.error('Failed to load courses', fetchError);
    }
  }, [token]);

  useEffect(() => {
    fetchLabs(currentPage);
  }, [fetchLabs, currentPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const fetchModules = async () => {
      if (!formData.courseId) {
        setCourseModules([]);
        return;
      }
      try {
        setLoadingModules(true);
        const res = await adminApi.getModules(token, formData.courseId);
        setCourseModules(res.data || []);
      } catch (fetchError) {
        console.error('Failed to load modules', fetchError);
        setCourseModules([]);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [formData.courseId, token]);

  const resetFormState = useCallback(() => {
    setFormData(createInitialFormData());
    setPreviews({ thumbnail: null, topology: null });
    setCourseModules([]);
    setActiveTab('basic');
    setError('');
    setEditingLabId(null);
    setEditorMode('create');
  }, []);

  const openCreateEditor = () => {
    resetFormState();
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const openEditEditor = (lab) => {
    setEditorMode('edit');
    setEditingLabId(lab.id);
    setFormData(mapLabToFormData(lab));
    setPreviews({
      thumbnail: lab.imageUrl || null,
      topology: lab.topologyImgUrl || null
    });
    setActiveTab('basic');
    setError('');
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setError('');
  };

  const openViewModal = (lab) => {
    setSelectedLabForView(lab);
    setIsViewModalOpen(true);
  };

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, { title: '', commands: '', note: '' }]
    }));
  };

  const handleRemoveStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, stepIndex) => stepIndex !== index)
    }));
  };

  const handleStepChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (field === 'filePka' && !/\.(pkt|pka)$/i.test(file.name)) {
      setError('File Packet Tracer phai co duoi .pkt hoac .pka');
      event.target.value = '';
      return;
    }

    setError('');
    setFormData((prev) => ({ ...prev, [field]: file }));

    if (field === 'thumbnailImg' || field === 'topologyImg') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [field === 'thumbnailImg' ? 'thumbnail' : 'topology']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const title = formData.title.trim();
    if (!title) {
      setActiveTab('basic');
      setError('Vui long nhap tieu de bai Lab');
      return;
    }

    if (editorMode === 'edit' && !editingLabId) {
      setError('Khong xac dinh duoc bai Lab can cap nhat');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', title);
      payload.append('category', formData.category);
      payload.append('difficulty', formData.difficulty);
      payload.append('status', formData.status);
      payload.append('duration', formData.duration.trim());
      payload.append('guideContent', hasRichTextContent(formData.guideContent) ? formData.guideContent : '');
      payload.append('objective', formData.objective.trim());
      payload.append('tools', JSON.stringify(toolsPreview));

      if (formData.courseId) payload.append('courseId', formData.courseId);
      if (formData.moduleId) payload.append('moduleId', formData.moduleId);

      if (formData.filePka) payload.append('filePka', formData.filePka);
      if (formData.thumbnailImg) payload.append('thumbnailImg', formData.thumbnailImg);
      if (formData.topologyImg) payload.append('topologyImg', formData.topologyImg);

      const formattedSteps = formData.steps
        .map((step) => ({
          title: step.title.trim(),
          commands: step.commands
            .split('\n')
            .map((command) => command.trim())
            .filter(Boolean),
          note: step.note.trim()
        }))
        .filter((step) => step.title || step.commands.length > 0 || step.note);
      payload.append('steps', JSON.stringify(formattedSteps));

      if (editorMode === 'edit') {
        await adminApi.updateLab(token, editingLabId, payload);
      } else {
        await adminApi.createLab(token, payload);
      }

      closeEditor();
      resetFormState();
      fetchLabs(currentPage);
    } catch (submitError) {
      setError(submitError.message || 'Khong the luu bai Lab');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ban co chac muon xoa bai Lab nay?')) return;
    try {
      await adminApi.deleteLab(token, id);
      fetchLabs(currentPage);
    } catch (deleteError) {
      alert(deleteError.message);
    }
  };

  if (isEditorOpen) {
    return (
      <div className="labm-editor-page">
        <div className="labm-editor-shell">
          <div className="labm-editor-header">
            <button type="button" className="labm-back-btn" onClick={closeEditor}>
              <ArrowLeft size={14} />
              <span>TRO LAI DANH SACH</span>
            </button>
            <h2>{editorMode === 'edit' ? 'Chinh sua bai Lab' : 'Tao bai Lab moi'}</h2>
            <p>Nhap thong tin theo tung tab, bo cuc giong man quan ly bai kiem tra.</p>
          </div>

          <div className="labm-tabs">
            {LAB_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`labm-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error ? <div className="labm-form-error-banner">{error}</div> : null}

          <div className="labm-editor-scroll">
            {activeTab === 'basic' ? (
              <div className="labm-tab-panel">
                <div className="acm-field">
                  <span>Tieu de bai Lab *</span>
                  <input
                    className="acm-input"
                    placeholder="Nhap ten bai Lab..."
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </div>

                <div className="labm-grid-3">
                  <div className="acm-field">
                    <span>Danh muc</span>
                    <CustomSelect
                      value={formData.category}
                      onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      options={CATEGORY_OPTIONS}
                    />
                  </div>

                  <div className="acm-field">
                    <span>Do kho</span>
                    <CustomSelect
                      value={formData.difficulty}
                      onChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                      options={DIFFICULTY_OPTIONS}
                    />
                  </div>

                  <div className="acm-field">
                    <span>Thoi luong</span>
                    <input
                      className="acm-input"
                      placeholder="VD: 30 phut"
                      value={formData.duration}
                      onChange={(event) => setFormData((prev) => ({ ...prev, duration: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="labm-grid-3">
                  <div className="acm-field">
                    <span>Trang thai</span>
                    <CustomSelect
                      value={formData.status}
                      onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                      options={STATUS_OPTIONS}
                    />
                  </div>
                </div>

                <div className="labm-grid-2">
                  <div className="acm-field">
                    <span>Khoa hoc</span>
                    <CustomSelect
                      value={formData.courseId}
                      onChange={(value) => setFormData((prev) => ({ ...prev, courseId: value, moduleId: '' }))}
                      options={[
                        { value: '', label: '-- Khong chon --' },
                        ...courses.map((course) => ({ value: course.id, label: `${course.code} - ${course.title}` }))
                      ]}
                    />
                  </div>

                  <div className={`acm-field ${!formData.courseId ? 'labm-field-muted' : ''}`}>
                    <span>Module {loadingModules ? <small>(Dang tai...)</small> : null}</span>
                    <div className={!formData.courseId ? 'labm-select-disabled' : ''}>
                      <CustomSelect
                        value={formData.moduleId}
                        onChange={(value) => setFormData((prev) => ({ ...prev, moduleId: value }))}
                        options={[
                          { value: '', label: '-- Khong chon --' },
                          ...courseModules.map((moduleItem) => ({ value: moduleItem.id, label: moduleItem.title }))
                        ]}
                        placeholder={formData.courseId ? 'Chon module...' : 'Chon khoa hoc truoc'}
                      />
                    </div>
                    {!formData.courseId ? (
                      <p className="acm-field-hint">Chon khoa hoc truoc de chon module.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'content' ? (
              <div className="labm-tab-panel">
                <div className="acm-field">
                  <span>Muc tieu</span>
                  <textarea
                    className="acm-textarea"
                    rows="2"
                    placeholder="Neu muc tieu chinh cua bai thuc hanh..."
                    value={formData.objective}
                    onChange={(event) => setFormData((prev) => ({ ...prev, objective: event.target.value }))}
                  />
                </div>

                <div className="acm-field">
                  <span>Noi dung huong dan (Rich Text)</span>
                  <RichTextEditor
                    value={formData.guideContent}
                    onChange={(value) => setFormData((prev) => ({ ...prev, guideContent: value }))}
                    placeholder="Nhap noi dung huong dan tong quan..."
                  />
                </div>

                <div className="acm-field">
                  <div className="labm-step-header">
                    <span>Cac buoc</span>
                    <button type="button" className="acm-secondary-btn" onClick={handleAddStep}>
                      <Plus size={14} /> Them buoc
                    </button>
                  </div>

                  <div className="labm-step-scroll">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="labm-step-card">
                        <div className="labm-step-card-head">
                          <strong>Buoc {index + 1}</strong>
                          {formData.steps.length > 1 ? (
                            <button
                              type="button"
                              className="labm-step-remove"
                              onClick={() => handleRemoveStep(index)}
                              title="Xoa buoc"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : null}
                        </div>

                        <div className="labm-step-fields">
                          <input
                            className="acm-input"
                            placeholder="Tieu de buoc..."
                            value={step.title}
                            onChange={(event) => handleStepChange(index, 'title', event.target.value)}
                          />
                          <textarea
                            className="acm-textarea labm-code-input"
                            rows="3"
                            placeholder="Moi lenh mot dong"
                            value={step.commands}
                            onChange={(event) => handleStepChange(index, 'commands', event.target.value)}
                          />
                          <input
                            className="acm-input"
                            placeholder="Ghi chu them (neu co)..."
                            value={step.note}
                            onChange={(event) => handleStepChange(index, 'note', event.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'media' ? (
              <div className="labm-tab-panel">
                <div className="labm-upload-grid">
                  <div
                    className="labm-upload-card"
                    onClick={() => document.getElementById('lab-thumb').click()}
                  >
                    <div className="labm-upload-card-title">
                      <ImageIcon size={15} /> imageUrl (Thumbnail)
                    </div>
                    {previews.thumbnail ? (
                      <img src={previews.thumbnail} alt="Thumbnail preview" className="labm-upload-preview" />
                    ) : (
                      <p>Bam de tai anh len</p>
                    )}
                    <input
                      id="lab-thumb"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => handleFileChange(event, 'thumbnailImg')}
                    />
                  </div>

                  <div
                    className="labm-upload-card"
                    onClick={() => document.getElementById('lab-topology').click()}
                  >
                    <div className="labm-upload-card-title">
                      <ImageIcon size={15} /> topologyImgUrl
                    </div>
                    {previews.topology ? (
                      <img src={previews.topology} alt="Topology preview" className="labm-upload-preview" />
                    ) : (
                      <p>Bam de tai anh topology</p>
                    )}
                    <input
                      id="lab-topology"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => handleFileChange(event, 'topologyImg')}
                    />
                  </div>
                </div>

                <div className="acm-field">
                  <span>fileUrl (.pkt / .pka)</span>
                  <label className="labm-file-input">
                    <FileUp size={16} />
                    <span>{formData.filePka ? formData.filePka.name : 'Chon file Packet Tracer'}</span>
                    <input
                      type="file"
                      accept=".pkt,.pka"
                      onChange={(event) => handleFileChange(event, 'filePka')}
                    />
                  </label>
                </div>

                <div className="acm-field">
                  <span>Cong cu</span>
                  <textarea
                    className="acm-textarea"
                    rows="3"
                    placeholder="Packet Tracer, Wireshark, PuTTY..."
                    value={formData.toolsText}
                    onChange={(event) => setFormData((prev) => ({ ...prev, toolsText: event.target.value }))}
                  />
                  <div className="labm-tools-preview">
                    {toolsPreview.length > 0 ? (
                      toolsPreview.map((tool) => (
                        <span key={tool} className="labm-tool-chip">{tool}</span>
                      ))
                    ) : (
                      <span className="labm-tools-empty">Danh sach cong cu se hien thi o day.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="labm-editor-actions">
            <button
              type="button"
              className="admin-modal-btn-secondary"
              onClick={closeEditor}
              disabled={submitting}
            >
              Huy
            </button>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Dang luu...' : editorMode === 'edit' ? 'Cap nhat bai Lab' : 'Luu bai Lab'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-wrapper">
      <div className="admin-table-header" style={{ padding: '0 0 20px 0', border: 'none' }}>
        <h3>Quan ly Bai Lab (.pkt)</h3>
        <div className="admin-table-actions">
          <button className="admin-btn-primary" onClick={openCreateEditor}>
            <Plus size={18} /> Them Bai Lab
          </button>
        </div>
      </div>

      <div className="admin-datatable-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bai Lab</th>
              <th>Danh muc</th>
              <th>Do kho</th>
              <th>Trang thai</th>
              <th>Thoi luong</th>
              <th>Thuoc khoa hoc</th>
              <th>Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Dang tai...</td>
              </tr>
            ) : labs.length > 0 ? (
              labs.map((lab) => {
                const statusMeta = STATUS_BADGE_MAP[lab.status] || STATUS_BADGE_MAP.DRAFT;
                return (
                  <tr key={lab.id}>
                    <td>{lab.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'rgba(42, 133, 255, 0.1)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px'
                          }}
                        >
                          <FileCode2 size={20} />
                        </div>
                        <div>
                          <div className="labm-lab-title" title={lab.title}>{lab.title}</div>
                          {lab.fileUrl ? (
                            <div className="labm-lab-file" title={lab.fileUrl.split('/').pop()}>
                              {lab.fileUrl.split('/').pop()}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>{lab.category || '-'}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          lab.difficulty === 'EASY'
                            ? 'active'
                            : lab.difficulty === 'HARD'
                              ? 'admin'
                              : 'student'
                        }`}
                      >
                        {DIFFICULTY_LABEL_MAP[lab.difficulty] || lab.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                    </td>
                    <td>{lab.duration || '-'}</td>
                    <td>{lab.course?.title || '-'}</td>
                    <td>
                      <button
                        className="admin-action-btn"
                        title="Xem"
                        onClick={() => openViewModal(lab)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="admin-action-btn"
                        title="Sua"
                        onClick={() => openEditEditor(lab)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="admin-action-btn delete"
                        title="Xoa"
                        onClick={() => handleDelete(lab.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Chua co bai Lab nao</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <AdminModal
        title="Chi tiet bai Lab"
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onConfirm={() => setIsViewModalOpen(false)}
        confirmText="Dong"
      >
        {selectedLabForView ? (
          <div className="exam-view-details">
            <div><b>Tieu de:</b> {selectedLabForView.title}</div>
            <div><b>Danh muc:</b> {selectedLabForView.category || '-'}</div>
            <div><b>Do kho:</b> {DIFFICULTY_LABEL_MAP[selectedLabForView.difficulty] || selectedLabForView.difficulty || '-'}</div>
            <div><b>Thoi luong:</b> {selectedLabForView.duration || '-'}</div>
            <div><b>Khoa hoc:</b> {selectedLabForView.course?.title || '-'}</div>
            <div><b>Module:</b> {selectedLabForView.module?.title || selectedLabForView.moduleId || '-'}</div>
            <div><b>Muc tieu:</b> {selectedLabForView.objective || '-'}</div>
            <div><b>So buoc:</b> {Array.isArray(selectedLabForView.steps) ? selectedLabForView.steps.length : 0}</div>
            <div><b>Cong cu:</b> {Array.isArray(selectedLabForView.tools) ? selectedLabForView.tools.join(', ') : '-'}</div>
            <div><b>Anh dai dien:</b> {selectedLabForView.imageUrl ? <a href={selectedLabForView.imageUrl} target="_blank" rel="noreferrer">Mo anh</a> : '-'}</div>
            <div><b>Anh topology:</b> {selectedLabForView.topologyImgUrl ? <a href={selectedLabForView.topologyImgUrl} target="_blank" rel="noreferrer">Mo anh</a> : '-'}</div>
            <div><b>File bai tap:</b> {selectedLabForView.fileUrl ? <a href={selectedLabForView.fileUrl} target="_blank" rel="noreferrer">Mo file</a> : '-'}</div>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
};

export default Labs;
