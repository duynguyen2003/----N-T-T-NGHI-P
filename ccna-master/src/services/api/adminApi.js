const API_URL = "http://localhost:5000/api";

const getErrorMessage = (data, fallback) => data?.message || data?.error?.message || fallback;
const getHeaders = (token, isFormData = false) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json;charset=utf-8';
  }
  return headers;
};

export const adminApi = {
  // --- STATS & LOGS ---
  getStats: async (token) => {
    const response = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy thống kê'));
    return data;
  },
  getLogs: async (token, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/admin/logs?page=${page}&limit=${limit}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy nhật ký'));
    return data;
  },

  // --- USERS ---
  getUsers: async (token, page = 1, search = '', options = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      search: search || ''
    });
    if (options.limit) params.set('limit', String(options.limit));
    if (options.role && options.role !== 'ALL') params.set('role', options.role);
    if (options.status && options.status !== 'ALL') params.set('status', options.status);
    const response = await fetch(`${API_URL}/admin/users?${params.toString()}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách người dùng'));
    return data;
  },
  createUser: async (token, payload) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo người dùng'));
    return data;
  },
  updateUserRole: async (token, userId, role) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PATCH', headers: getHeaders(token), body: JSON.stringify({ role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật quyền'));
    return data;
  },
  toggleUserActive: async (token, userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/toggle`, {
      method: 'PATCH', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật trạng thái'));
    return data;
  },
  deleteUser: async (token, userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa người dùng'));
    return data;
  },

  // --- COURSES ---
  getCourses: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/learning/courses?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách khóa học'));
    return data;
  },
  createCourse: async (token, formData) => {
    const response = await fetch(`${API_URL}/learning/courses`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo khóa học'));
    return data;
  },
  updateCourse: async (token, id, formData) => {
    const response = await fetch(`${API_URL}/learning/courses/${id}`, {
      method: 'PUT', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật khóa học'));
    return data;
  },
  deleteCourse: async (token, id) => {
    const response = await fetch(`${API_URL}/learning/courses/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa khóa học'));
    return data;
  },

  // --- LABS ---
  getLabs: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/learning/labs?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách Labs'));
    return data;
  },
  createLab: async (token, formData) => {
    const response = await fetch(`${API_URL}/learning/labs`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo Lab'));
    return data;
  },
  updateLab: async (token, id, formData) => {
    const response = await fetch(`${API_URL}/learning/labs/${id}`, {
      method: 'PUT', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật Lab'));
    return data;
  },
  deleteLab: async (token, id) => {
    const response = await fetch(`${API_URL}/learning/labs/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa Lab'));
    return data;
  },

  // --- MODULES (CHƯƠNG) ---
  getModules: async (token, courseId) => {
    const response = await fetch(`${API_URL}/learning/courses/${courseId}/modules`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách chương'));
    return data;
  },
  createModule: async (token, courseId, payload) => {
    const response = await fetch(`${API_URL}/learning/courses/${courseId}/modules`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo chương'));
    return data;
  },
  deleteModule: async (token, moduleId) => {
    const response = await fetch(`${API_URL}/learning/modules/${moduleId}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa chương'));
    return data;
  },

  // --- LESSONS (BÀI HỌC) ---
  getLessons: async (token, moduleId) => {
    const response = await fetch(`${API_URL}/learning/modules/${moduleId}/lessons`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách bài học'));
    return data;
  },
  createLesson: async (token, moduleId, payload) => {
    const response = await fetch(`${API_URL}/learning/modules/${moduleId}/lessons`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo bài học'));
    return data;
  },
  deleteLesson: async (token, lessonId) => {
    const response = await fetch(`${API_URL}/learning/lessons/${lessonId}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa bài học'));
    return data;
  },

  // --- EXAMS ---
  getExams: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/exams?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy danh sách Exams'));
    return data;
  },
  getExamById: async (token, id) => {
    const response = await fetch(`${API_URL}/exams/detail/${id}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy chi tiết Exam'));
    return data;
  },
  createExam: async (token, payload) => {
    const response = await fetch(`${API_URL}/exams`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo Exam'));
    return data;
  },
  uploadExamQuestionImage: async (token, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_URL}/exams/question-image`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Loi tai anh cau hoi'));
    return data;
  },
  updateExam: async (token, id, payload) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'PUT', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật Exam'));
    return data;
  },
  deleteExam: async (token, id) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa Exam'));
    return data;
  },
  getExamResults: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/exams/results?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy kết quả thi'));
    return data;
  },

  // --- COURSE TOPICS ---
  getTopics: async (token, courseId) => {
    const response = await fetch(`${API_URL}/learning/courses/${courseId}/topics`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy chủ đề'));
    return data;
  },
  createTopic: async (token, courseId, payload) => {
    const response = await fetch(`${API_URL}/learning/courses/${courseId}/topics`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo chủ đề'));
    return data;
  },
  deleteTopic: async (token, topicId) => {
    const response = await fetch(`${API_URL}/learning/topics/${topicId}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa chủ đề'));
    return data;
  },

  // --- RESOURCES ---
  getResources: async (token, courseId) => {
    const url = courseId ? `${API_URL}/learning/resources?courseId=${courseId}` : `${API_URL}/learning/resources`;
    const response = await fetch(url, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy tài liệu'));
    return data;
  },
  createResource: async (token, formData) => {
    const response = await fetch(`${API_URL}/learning/resources`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tải tài liệu'));
    return data;
  },
  deleteResource: async (token, id) => {
    const response = await fetch(`${API_URL}/learning/resources/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa tài liệu'));
    return data;
  },

  // --- TOOLS ---
  getTools: async (token) => {
    const response = await fetch(`${API_URL}/tools`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi lấy công cụ'));
    return data;
  },
  createTool: async (token, payload) => {
    const response = await fetch(`${API_URL}/tools`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi tạo công cụ'));
    return data;
  },
  toggleTool: async (token, id) => {
    const response = await fetch(`${API_URL}/tools/${id}/toggle`, {
      method: 'PATCH', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi cập nhật công cụ'));
    return data;
  },
  deleteTool: async (token, id) => {
    const response = await fetch(`${API_URL}/tools/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(data, 'Lỗi xóa công cụ'));
    return data;
  }
};



