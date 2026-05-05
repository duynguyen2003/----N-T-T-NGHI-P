// fe/src/services/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// --- STATIC METADATA (Dữ liệu bổ sung cho UI) ---
const COURSE_METADATA = {
  ITN: {
    language: "Tiếng Việt",
    totalHours: 28,
    competencies: [
      "Hiểu mô hình OSI và TCP/IP từ lớp vật lý đến ứng dụng",
      "Cấu hình địa chỉ IPv4 và IPv6 cho thiết bị đầu cuối",
      "Phân tích và kiểm tra kết nối mạng bằng các lệnh CLI cơ bản",
      "Thiết lập và cấu hình Switch Cisco cơ bản",
      "Hiểu nguyên lý hoạt động của Ethernet và cáp mạng",
      "Nắm vững các khái niệm về Bandwidth, Latency và QoS",
    ],
    includes: [
      { icon: "play_circle", text: "28 giờ nội dung video" },
      { icon: "phone_android", text: "Truy cập trên điện thoại và TV" },
      { icon: "workspace_premium", text: "Chứng chỉ hoàn thành" },
    ],
  },
  SRWE: {
    language: "Tiếng Anh",
    totalHours: 42,
    competencies: [
      "Cấu hình và xác thực địa chỉ IPv4 và IPv6 cũng như chia mạng con trên các mạng doanh nghiệp.",
      "Triển khai VLAN và các giao thức Trunking để tối ưu hóa việc phân đoạn và bảo mật mạng.",
      "Hiểu về các giao thức định tuyến bao gồm OSPFv2 cho mạng điểm-điểm và mạng da truy cập.",
      "Làm chủ các dịch vụ IP như NAT, NTP và DHCP để duy trì thúc mạng mạnh mẽ.",
      "Bảo mật truy cập mạng với port security, DHCP snooping và kiểm tra ARP động (DAI).",
      "Cơ bản về tự động hóa và khả năng lập trình trong các mạng điều khiển bằng phần mềm hiện đại.",
    ],
    includes: [
      { icon: "play_circle", text: "42 giờ nội dung video" },
      { icon: "phone_android", text: "Truy cập trên điện thoại và TV" },
      { icon: "workspace_premium", text: "Chứng chỉ hoàn thành" },
    ],
  },
  ENSA: {
    language: "Tiếng Anh",
    totalHours: 35,
    competencies: [
      "Triển khai và tối ưu hóa giao thức OSPF trên mạng doanh nghiệp",
      "Cấu hình VPN Site-to-Site và Remote Access với IPsec",
      "Hiểu và áp dụng các khái niệm SD-WAN trong thực tế",
      "Lập trình tự động hóa mạng với Python và Ansible",
      "Sử dụng REST API để quản lý thiết bị Cisco DNA Center",
      "Phân tích và xử lý sự cố mạng doanh nghiệp phức tạp",
    ],
    includes: [
      { icon: "play_circle", text: "35 giờ nội dung video" },
      { icon: "phone_android", text: "Truy cập trên điện thoại và TV" },
      { icon: "workspace_premium", text: "Chứng chỉ hoàn thành" },
    ],
  },
};

// Aliases cho các mã rút gọn
COURSE_METADATA.SRW = COURSE_METADATA.SRWE;
COURSE_METADATA.ENA = COURSE_METADATA.ENSA;

// --- HELPER ---
const apiFetch = async (endpoint, token, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Tự động trigger logout thông qua event
    window.dispatchEvent(new Event("unauthorized"));
    throw new Error("UNAUTHORIZED");
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status >= 500) {
      window.dispatchEvent(new CustomEvent("api_error", { detail: "Lỗi máy chủ (500). Vui lòng thử lại sau." }));
    }
    throw new Error(data.message || `Lỗi API: ${response.status}`);
  }
  return data;
};

const normalizeDifficulty = (difficulty) => {
  const map = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
  return map[difficulty] ?? difficulty;
};

export const api = {
  // ========================
  // AUTH APIs
  // ========================

  register: async (fullName, email, password) => {
    return apiFetch("/auth/register", null, {
      method: "POST",
      body: JSON.stringify({ fullName, email, password }),
    });
  },

  login: async (email, password) => {
    return apiFetch("/auth/login", null, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  googleLogin: async (token) => {
    return apiFetch("/auth/google", null, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  forgotPassword: async (email) => {
    return apiFetch("/auth/forgot-password", null, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  validateResetPasswordToken: async (token) => {
    return apiFetch(`/auth/reset-password/${token}/validate`);
  },

  resetPassword: async (token, password) => {
    return apiFetch("/auth/reset-password", null, {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  logout: async (token) => {
    try {
      return await apiFetch("/auth/logout", token, { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }
  },

  // ========================
  // DATA APIs
  // ========================

  getCourses: async (token) => {
    try {
      const json = await apiFetch("/learning/courses", token);
      const courses = json.data?.courses || json.data || [];

      return courses.map((course) => {
        const metadata = COURSE_METADATA[course.code] || {};
        return {
          ...course,
          ...metadata,
          // Ưu tiên dữ liệu thật từ DB nếu có, không thì dùng metadata mẫu
          totalHours: course.totalHours || metadata.totalHours || 0,
          fullTitle: course.title,
          longDescription: course.description,
          progress: course.progress ?? 0,
          modules: (course.modules || []).map((m, idx) => ({
            ...m,
            // Mở khóa chương đầu tiên mặc định, các chương sau tạm khóa
            status: idx === 0 ? "active" : "locked",
            lessonCount: m._count?.lessons || m.lessons?.length || 0,
            // Giữ nguyên danh sách bài học với đầy đủ thông tin (sectionNumber, videoDuration)
            lessons: (m.lessons || []).map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              sectionNumber: lesson.sectionNumber || null,
              videoDuration: lesson.videoDuration || null,
              orderIndex: lesson.orderIndex,
            })),
          })),
        };
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  getLabs: async (token) => {
    try {
      const json = await apiFetch("/learning/labs", token);
      const labs = json.data?.labs || json.data || [];

      return labs.map((lab) => ({
        ...lab,
        id: lab.id.toString(),
        difficulty: normalizeDifficulty(lab.difficulty),
        topology: lab.topologyImgUrl,
        tools: Array.isArray(lab.tools) ? lab.tools : [],
        steps: Array.isArray(lab.steps) ? lab.steps : [],
      }));
    } catch (error) {
      console.error("Error fetching labs:", error);
      throw error;
    }
  },

  getResources: async (token) => {
    try {
      const json = await apiFetch("/learning/resources", token);
      return json;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return { data: [] };
    }
  },

  getUserProfile: async (token) => {
    try {
      const json = await apiFetch("/users/profile/me", token);
      return json.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  getUserProgress: async (token) => {
    try {
      const json = await apiFetch("/users/progress", token);
      const progressMap = { _raw: json.data || [] };
      (json.data || []).forEach(p => {
        if (!p.moduleId && !p.lessonId && !p.labId) {
          progressMap[p.courseId] = p.progressPercent || 0;
        }
        if (p.lessonId) {
          progressMap[`lesson_${p.lessonId}`] = {
            percent: p.progressPercent || 0,
            status: p.status,
            completedAt: p.completedAt
          };
        }
      });
      return progressMap;
    } catch (error) {
      console.error("Error fetching progress:", error);
      return { _raw: [] };
    }
  },

  updateUserProgress: async (token, progressData) => {
    try {
      return await apiFetch("/users/progress", token, {
        method: "POST",
        body: JSON.stringify(progressData),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  // EXAMS
  getExams: async (token) => {
    try {
      const json = await apiFetch("/exams", token);
      const exams = json.data || [];
      return exams
        .filter((exam) => exam.status === "OPEN")
        .map((exam) => ({
          ...exam,
          id: exam.id.toString(),
          difficulty: normalizeDifficulty(exam.difficulty),
          totalQuestions: exam._count?.questions || exam.questions?.length || 0,
        }));
    } catch (error) {
      console.error("Error fetching exams:", error);
      return [];
    }
  },

  getExamById: async (token, examId) => {
    try {
      const json = await apiFetch(`/exams/${examId}`, token);
      return json.data;
    } catch (error) {
      console.error("Error fetching exam detail:", error);
      throw error;
    }
  },

  submitExam: async (token, examId, answers) => {
    return apiFetch(`/exams/${examId}/submit`, token, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },
  // MODULES & LESSONS
  getModulesByCourse: async (token, courseId) => {
    try {
      const json = await apiFetch(`/learning/courses/${courseId}/modules`, token);
      return json.data || [];
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    }
  },

  getLessonsByModule: async (token, moduleId) => {
    try {
      const json = await apiFetch(`/learning/modules/${moduleId}/lessons`, token);
      return json.data || [];
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }
  },
};

export default api;
