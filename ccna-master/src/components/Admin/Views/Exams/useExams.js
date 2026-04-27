import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { adminApi } from '../../../../services/api/adminApi';
import { getStatusFromExam } from './utils';
import { STATUS_FILTER_OPTIONS } from './constants';

export const useExams = () => {
  const { token } = useContext(AuthContext);

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list');

  // ─── Fetchers ───────────────────────────────────────────────────────────────

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExams(token, 1);
      setExams(res.data ?? []);
    } catch (err) {
      console.error('fetchExams:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data ?? []);
    } catch (err) {
      console.error('fetchCourses:', err);
    }
  }, [token]);

  const fetchModules = useCallback(async (courseId) => {
    if (!courseId) { setModules([]); return; }
    try {
      const res = await adminApi.getModules(token, courseId);
      setModules(res.data ?? []);
    } catch (err) {
      console.error('fetchModules:', err);
      setModules([]);
    }
  }, [token]);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, [fetchExams, fetchCourses]);

  // ─── Delete ─────────────────────────────────────────────────────────────────

  const deleteExam = useCallback(async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài thi này?')) return;
    try {
      await adminApi.deleteExam(token, id);
      fetchExams();
    } catch (err) {
      alert(err.message);
    }
  }, [token, fetchExams]);

  // ─── Derived list ───────────────────────────────────────────────────────────

  const filteredExams = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchStatus = statusFilter === 'ALL' || getStatusFromExam(exam) === statusFilter;
      const matchKeyword = !kw
        || (exam.title ?? '').toLowerCase().includes(kw)
        || (exam.examCode ?? '').toLowerCase().includes(kw)
        || (exam.course?.code ?? '').toLowerCase().includes(kw);
      return matchStatus && matchKeyword;
    });
  }, [exams, searchKeyword, statusFilter]);

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const examStats = useMemo(() => {
    const total = exams.length;
    const openCount = exams.filter((e) => getStatusFromExam(e) === 'OPEN').length;
    const totalAttempts = exams.reduce((s, e) => s + (e?._count?.results ?? 0), 0);
    const avgPassing = total
      ? Math.round(exams.reduce((s, e) => s + (e.passingScore ?? 0), 0) / total)
      : 0;
    return { total, openCount, totalAttempts, avgPassing };
  }, [exams]);

  // ─── Course options for <select> ────────────────────────────────────────────

  const courseOptions = useMemo(() => [
    { value: '', label: 'Chọn khóa học' },
    ...courses.map((c) => ({ value: c.id, label: `${c.code} – ${c.title}` })),
  ], [courses]);

  return {
    // data
    exams, filteredExams, examStats,
    courses, courseOptions, modules,
    loading,
    // filter state
    searchKeyword, setSearchKeyword,
    statusFilter, setStatusFilter,
    viewMode, setViewMode,
    // actions
    fetchExams, fetchCourses, fetchModules,
    deleteExam,
    setModules,
  };
};
