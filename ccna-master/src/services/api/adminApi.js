const API_URL = "http://localhost:5000/api";

const getHeaders = (token, isFormData = false) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const adminApi = {
  // --- STATS & LOGS ---
  getStats: async (token) => {
    const response = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy thống kê');
    return data;
  },
  getLogs: async (token, page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/admin/logs?page=${page}&limit=${limit}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy nhật ký');
    return data;
  },

  // --- USERS ---
  getUsers: async (token, page = 1, search = '') => {
    const response = await fetch(`${API_URL}/admin/users?page=${page}&search=${search}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy danh sách người dùng');
    return data;
  },
  createUser: async (token, payload) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi tạo người dùng');
    return data;
  },
  updateUserRole: async (token, userId, role) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PATCH', headers: getHeaders(token), body: JSON.stringify({ role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật quyền');
    return data;
  },
  toggleUserActive: async (token, userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/toggle`, {
      method: 'PATCH', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật trạng thái');
    return data;
  },
  deleteUser: async (token, userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi xóa người dùng');
    return data;
  },

  // --- COURSES ---
  getCourses: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/learning/courses?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy danh sách khóa học');
    return data;
  },
  createCourse: async (token, formData) => {
    const response = await fetch(`${API_URL}/learning/courses`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi tạo khóa học');
    return data;
  },
  updateCourse: async (token, id, formData) => {
    const response = await fetch(`${API_URL}/learning/courses/${id}`, {
      method: 'PUT', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật khóa học');
    return data;
  },
  deleteCourse: async (token, id) => {
    const response = await fetch(`${API_URL}/learning/courses/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi xóa khóa học');
    return data;
  },

  // --- LABS ---
  getLabs: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/learning/labs?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy danh sách Labs');
    return data;
  },
  createLab: async (token, formData) => {
    const response = await fetch(`${API_URL}/learning/labs`, {
      method: 'POST', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi tạo Lab');
    return data;
  },
  updateLab: async (token, id, formData) => {
    const response = await fetch(`${API_URL}/learning/labs/${id}`, {
      method: 'PUT', headers: getHeaders(token, true), body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật Lab');
    return data;
  },
  deleteLab: async (token, id) => {
    const response = await fetch(`${API_URL}/learning/labs/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi xóa Lab');
    return data;
  },

  // --- EXAMS ---
  getExams: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/exams?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy danh sách Exams');
    return data;
  },
  createExam: async (token, payload) => {
    const response = await fetch(`${API_URL}/exams`, {
      method: 'POST', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi tạo Exam');
    return data;
  },
  updateExam: async (token, id, payload) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'PUT', headers: getHeaders(token), body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật Exam');
    return data;
  },
  deleteExam: async (token, id) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'DELETE', headers: getHeaders(token)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi xóa Exam');
    return data;
  },
  getExamResults: async (token, page = 1) => {
    const response = await fetch(`${API_URL}/exams/results?page=${page}`, { headers: getHeaders(token) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lỗi lấy kết quả thi');
    return data;
  }
};
