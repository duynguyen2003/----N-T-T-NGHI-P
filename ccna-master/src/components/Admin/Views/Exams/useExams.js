import { useState, useEffect, useMemo, useCallback } from 'react';
import { adminApi } from '../../../services/api/adminApi';
import { getStatusFromExam } from './utils';
import { STATUS_FILTER_OPTIONS } from './constants';

export const useExams = (token) => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list');
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExams(token, 1);
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await adminApi.getCourses(token, 1);
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, [fetchExams, fetchCourses]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài thi này?')) {
      try {
        await adminApi.deleteExam(token, id);
        fetchExams();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredExams = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return exams.filter((exam) => {
      const status = getStatusFromExam(exam);
      const matchesStatus = statusFilter === 'ALL' || statusFilter === status;
      const matchesKeyword = !keyword
        || (exam.title || '').toLowerCase().includes(keyword)
        || (exam.examCode || '').toLowerCase().includes(keyword)
        || (exam.course?.code || '').toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [exams, searchKeyword, statusFilter]);

  const examStats = useMemo(() => {
    const total = exams.length;
    const openCount = exams.filter((exam) => getStatusFromExam(exam) === 'OPEN').length;
    const totalAttempts = exams.reduce((sum, exam) => sum + (exam?._count?.results || 0), 0);
    const avgPassing = total
      ? Math.round(exams.reduce((sum, exam) => sum + (exam.passingScore || 0), 0) / total)
      : 0;

    return { total, openCount, totalAttempts, avgPassing };
  }, [exams]);

  const currentStatusFilter = STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter) || STATUS_FILTER_OPTIONS[0];

  return {
    exams,
    courses,
    loading,
    searchKeyword,
    setSearchKeyword,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    isStatusFilterOpen,
    setIsStatusFilterOpen,
    filteredExams,
    examStats,
    currentStatusFilter,
    fetchExams,
    handleDelete
  };
};
