Admin Dashboard
├─ 📊 Overview (users count, courses, active sessions)
├─ 👥 User Management (CRUD + role assignment)
├─ 📚 Course Management (Course → Module → Lesson)
├─ 🔬 Lab Management
├─ 📋 Exam Management (with question editor)
├─ 📈 Analytics & Reports
└─ 📋 System Logs (admin activity tracking)# 📊 REVIEW CODE & THIẾT KẾ ADMIN PANEL

**Ngày tạo:** 13/04/2026  
**Dự án:** CCNA Learning Platform  
**Công nghệ:** React 18 + Express + Prisma + PostgreSQL

---

## 📋 MỤC LỤC

1. [Tổng quan kiến trúc hiện tại](#tổng-quan-kiến-trúc-hiện-tại)
2. [Phân tích cấu trúc Frontend](#phân-tích-cấu-trúc-frontend)
3. [Phân tích cấu trúc Backend](#phân-tích-cấu-trúc-backend)
4. [Database Schema Review](#database-schema-review)
5. [Định hướng thiết kế Admin Panel](#định-hướng-thiết-kế-admin-panel)
6. [Kiến trúc File Structure cho Admin](#kiến-trúc-file-structure-cho-admin)
7. [Component Design Pattern](#component-design-pattern)
8. [API Endpoints cần thiết](#api-endpoints-cần-thiết)
9. [Authentication & Authorization](#authentication--authorization)
10. [UI/UX Design Recommendations](#uiux-design-recommendations)

---

## 🏗️ TỔNG QUAN KIẾN TRÚC HIỆN TẠI

### Stack Công nghệ
```
Frontend:
  ├─ React 18.3.1 (UI Library)
  ├─ React Router DOM 7.10.1 (SPA Navigation)
  ├─ Axios 1.14.0 (HTTP Client)
  ├─ Lucide React 0.556.0 (Icon Library)
  └─ CSS (Custom Styling)

Backend:
  ├─ Express 5.2.1 (REST API Server)
  ├─ Prisma 7.6.0 (ORM)
  ├─ PostgreSQL (Database)
  ├─ JWT (Token Authentication)
  └─ bcrypt (Password Hashing)

Deployment:
  ├─ React Scripts (Development & Build)
  └─ Node.js (Backend Server)
```

### Mô hình dữ liệu hiện tại
```
PostgreSQL Database
├─ User (với roles: STUDENT, SUPER_ADMIN, CONTENT_MANAGER, EXAM_MANAGER)
├─ Course → Module → Lesson
├─ Lab (thí nghiệm)
├─ Exam → ExamQuestion → ExamResult
├─ CourseTopic (chủ đề khóa học) ⭐ MỚI
├─ Resource (tài nguyên bổ sung)
├─ UserProgress (theo dõi tiến độ)
├─ UserBadge, UserActivity, UserNote
└─ AdminLog (nhật ký hành động admin)
```

---

## 📱 PHÂN TÍCH CẤU TRÚC FRONTEND

### Hiện tại có các trang:
```
src/components/
├─ Auth/
│  ├─ Login.js
│  ├─ Register.js
│  ├─ ProtectedRoute.js (Bảo vệ route theo role)
│  └─ (Chưa có Admin role check)
│
├─ Content/
│  ├─ Home.js (Trang chủ)
│  ├─ Roadmap.js (Khóa học - Publiccc)
│  ├─ Lesson.js (Bài học)
│  ├─ Labs.js (Bài thí nghiệm)
│  ├─ Exam.js (Thi trắc nghiệm)
│  ├─ Doc.js (Resources)
│  ├─ Profile.js (Thông tin cá nhân)
│  └─ Layout.js (Header + Footer wrapper)
│
├─ Header/ (Navigation)
├─ Footer/
├─ Tools/ (Subnet Calc, VLSM, Port Lookup, CLI Lookup)
└─ Toast.js (Thông báo)

css/
├─ App.css
├─ Navbar.css
├─ Home.css
├─ Roadmap.css
├─ Lesson.css
├─ Labs.css
├─ Profile.css
└─ (Chưa có Admin CSS)
```

### Context & State Management
```
src/context/
└─ AuthContext.js
   ├─ user (id, fullName, email, role, level, streak...)
   ├─ token (JWT Access Token)
   ├─ isAuthenticated (boolean)
   ├─ loading (boolean)
   ├─ login(userData, token) → lưu localStorage
   ├─ logout() → xóa localStorage
   └─ updateUser(data) → cập nhật user state

⚠️ THIẾU: 
  - GlobalAlert/Toast Context
  - Pagination Context
  - Filter/Search Context
  - Permission Provider (cho role-based access)
```

### Services (API Calls)
```
src/services/
└─ Api.js
   ├─ api.register(data)
   ├─ api.login(data)
   └─ (Chưa có các API khác)

⚠️ CẦN BỔ SUNG:
  - CRUD API cho Course, Module, Lesson
  - CRUD API cho Lab, Exam
  - User management API
  - Admin log API
  - Search/Filter API
```

---

## 🔌 PHÂN TÍCH CẤU TRÚC BACKEND

### Server.js hiện tại
```
Express Server (Port 5000)
├─ Middleware:
│  ├─ CORS (cho React ở port 3000)
│  ├─ express.json() (parse JSON body)
│  └─ (Chưa có rate limiting, logging middleware)
│
├─ API Endpoints:
│  ├─ POST /api/auth/register
│  ├─ POST /api/auth/login
│  └─ (Chưa có admin endpoints)
│
├─ Database:
│  ├─ Pool (PostgreSQL)
│  ├─ PrismaClient (ORM)
│  └─ Connection: postgresql://postgres:123456@localhost:5432/netmastery_db
│
├─ Authentication:
│  ├─ JWT_SECRET: 'netmastery_bi_mat_2026'
│  ├─ bcrypt (password hashing)
│  └─ (Chưa có role-based middleware)
│
└─ Error Handling:
   └─ Basic try-catch (cần cải thiện)

⚠️ CẦN CẢI THIỆN:
  1. Tách API routes theo module (auth, users, courses, etc.)
  2. Thêm authentication middleware cho protected routes
  3. Thêm authorization middleware cho role-based access
  4. Implement error handling middleware
  5. Thêm logging/monitoring
  6. Thêm input validation (Joi hoặc Yup)
  7. Rate limiting
  8. Database transaction support
```

### Cấu trúc hiện tại (Tất cả trong 1 file)
```
src/Backend/
├─ Server.js (ALL IN ONE - không tốt)
│  ├─ Route: /api/auth/register
│  ├─ Route: /api/auth/login
│  └─ (Logic, middleware, database query tất cả ở đây)
│
└─ db.js (Chưa dùng đến)
```

---

## 💾 DATABASE SCHEMA REVIEW

### ✅ Ưu điểm hiện tại
1. **Quan hệ rõ ràng:** Course → Module → Lesson (GOOD ✓)
2. **Role-based system:** STUDENT, SUPER_ADMIN, CONTENT_MANAGER, EXAM_MANAGER (GOOD ✓)
3. **Soft delete:** deletedAt field để giữ dữ liệu (GOOD ✓)
4. **Audit trail:** AdminLog bảng để theo dõi (GOOD ✓)
5. **Progress tracking:** UserProgress bảng chi tiết (GOOD ✓)
6. **Cascade delete:** onDelete: Cascade (GOOD ✓)
7. **New CourseTopic:** Tổ chức chủ đề theo course (GOOD ✓)

### ⚠️ Cần cải thiện
1. **Thiếu bảng Permission:** Không có granular permissions (chỉ có role)
   ```prisma
   model Permission {
     id        Int      @id @default(autoincrement())
     name      String   @unique // "CREATE_COURSE", "EDIT_EXAM", etc.
     roleId    Int
     role      Role     @relation(fields: [roleId], references: [id])
   }
   ```

2. **Thiếu audit fields cho entities chính**
   ```prisma
   Lesson {
     createdBy   Int?     // Admin nào tạo
     updatedBy   Int?     // Admin nào update
     createdByUser User?
     updatedByUser User?
   }
   ```

3. **ExamQuestion nên có status (draft/published)**
   ```prisma
   status    ExamQuestionStatus @default(DRAFT) // DRAFT, PUBLISHED
   ```

4. **Thiếu bảng Announcement/Notification cho admin**
   ```prisma
   model Announcement {
     id        Int      @id @default(autoincrement())
     title     String
     content   String   @db.Text
     type      String   // SYSTEM, MAINTENANCE, etc.
     createdBy Int
     createdAt DateTime @default(now())
   }
   ```

---

## 🎯 ĐỊNH HƯỚNG THIẾT KẾ ADMIN PANEL

### Mục tiêu Admin Panel
1. **Quản lý nội dung**: Course, Module, Lesson, Lab, Exam
2. **Quản lý người dùng**: Xem, disable/enable, phân quyền
3. **Quản lý thi**: Tạo đề thi, thêm câu hỏi, xem kết quả
4. **Thống kê & báo cáo**: Lượt xem, hoàn thành, rating
5. **Hệ thống log**: Xem hoạt động của admin

### Phân quyền chi tiết
```
STUDENT (Role hiện tại)
├─ Xem course, lesson, lab
├─ Làm exam, ghi chú
└─ Xem profile, badge

CONTENT_MANAGER (Admin nội dung) ⭐ CẦN THÊM
├─ Tạo/Sửa/Xóa Course
├─ Tạo/Sửa/Xóa Module
├─ Tạo/Sửa/Xóa Lesson
├─ Tạo/Sửa/Xóa Lab
├─ Xem AdminLog (các thay đổi của mình)
└─ Không được quản lý Exam, User, permission

EXAM_MANAGER (Admin đề thi) ⭐ CẦN THÊM
├─ Tạo/Sửa/Xóa Exam
├─ Tạo/Sửa/Xóa ExamQuestion
├─ Xem ExamResult, thống kê điểm
├─ Xem AdminLog (các thay đổi của mình)
└─ Không được quản lý Course, User, permission

SUPER_ADMIN (Admin toàn quyền) ⭐ CẦN THÊM
├─ Toàn bộ quyền của CONTENT_MANAGER + EXAM_MANAGER
├─ Quản lý User (tạo, disable, phân quyền)
├─ Xem AdminLog (toàn bộ)
├─ Quản lý System (announcement, maintenance)
└─ Report & Analytics
```

---

## 📁 KIẾN TRÚC FILE STRUCTURE CHO ADMIN

### Recommended File Structure
```
src/
├─ components/
│  ├─ Admin/ ⭐ MỚI
│  │  ├─ AdminLayout.js (Layout cho admin trang)
│  │  ├─ Sidebar.js (Menu admin)
│  │  ├─ TopBar.js (Header admin với user info)
│  │  │
│  │  ├─ Dashboard/ (Trang chính admin)
│  │  │  ├─ Dashboard.js (Overview, stats)
│  │  │  ├─ StatsCard.js (Card hiển thị chỉ số)
│  │  │  └─ Dashboard.css
│  │  │
│  │  ├─ Users/ (Quản lý người dùng)
│  │  │  ├─ UserManagement.js
│  │  │  ├─ UserList.js
│  │  │  ├─ UserForm.js (Tạo/Sửa user)
│  │  │  ├─ UserDetail.js (Xem chi tiết)
│  │  │  └─ Users.css
│  │  │
│  │  ├─ Courses/ (Quản lý khóa học)
│  │  │  ├─ CourseManagement.js
│  │  │  ├─ CourseList.js
│  │  │  ├─ CourseForm.js
│  │  │  ├─ CourseDetail.js
│  │  │  ├─ TopicManager.js (Quản lý topic)
│  │  │  └─ Courses.css
│  │  │
│  │  ├─ Modules/ (Quản lý module)
│  │  │  ├─ ModuleManagement.js
│  │  │  ├─ ModuleList.js
│  │  │  ├─ ModuleForm.js
│  │  │  ├─ ModuleDetail.js
│  │  │  └─ Modules.css
│  │  │
│  │  ├─ Lessons/ (Quản lý bài học)
│  │  │  ├─ LessonManagement.js
│  │  │  ├─ LessonList.js
│  │  │  ├─ LessonForm.js (Editor HTML/Video)
│  │  │  ├─ LessonDetail.js
│  │  │  └─ Lessons.css
│  │  │
│  │  ├─ Labs/ (Quản lý thí nghiệm)
│  │  │  ├─ LabManagement.js
│  │  │  ├─ LabList.js
│  │  │  ├─ LabForm.js
│  │  │  ├─ LabDetail.js
│  │  │  └─ Labs.css
│  │  │
│  │  ├─ Exams/ (Quản lý thi)
│  │  │  ├─ ExamManagement.js
│  │  │  ├─ ExamList.js
│  │  │  ├─ ExamForm.js
│  │  │  ├─ ExamDetail.js
│  │  │  ├─ QuestionManager.js (Quản lý câu hỏi)
│  │  │  ├─ QuestionForm.js (Tạo/Sửa câu hỏi)
│  │  │  ├─ ExamResults.js (Xem kết quả)
│  │  │  └─ Exams.css
│  │  │
│  │  ├─ Analytics/ (Thống kê & báo cáo)
│  │  │  ├─ Analytics.js (Main analytics page)
│  │  │  ├─ CourseStats.js (Thống kê course)
│  │  │  ├─ UserStats.js (Thống kê user)
│  │  │  ├─ ExamStats.js (Thống kê exam)
│  │  │  ├─ Chart.js (Biểu đồ)
│  │  │  └─ Analytics.css
│  │  │
│  │  ├─ Logs/ (Nhật ký hành động)
│  │  │  ├─ AdminLogs.js
│  │  │  ├─ LogDetail.js
│  │  │  └─ Logs.css
│  │  │
│  │  └─ Common/ (Components dùng chung)
│  │     ├─ Table.js (Data table component)
│  │     ├─ Pagination.js
│  │     ├─ Modal.js (Dialog/Modal)
│  │     ├─ Loading.js
│  │     ├─ EmptyState.js
│  │     └─ Common.css
│  │
│  ├─ Auth/
│  │  ├─ AdminProtectedRoute.js ⭐ MỚI (Check role admin)
│  │  └─ (Cũ...)
│  │
│  └─ (Cũ...)
│
├─ context/
│  ├─ AuthContext.js (cũ)
│  ├─ AdminContext.js ⭐ MỚI (Admin state, filters, etc.)
│  └─ ToastContext.js ⭐ MỚI (Thông báo toàn cục)
│
├─ services/
│  ├─ api/ ⭐ NÊN TÁCH
│  │  ├─ authApi.js
│  │  ├─ courseApi.js
│  │  ├─ moduleApi.js
│  │  ├─ lessonApi.js
│  │  ├─ labApi.js
│  │  ├─ examApi.js
│  │  ├─ userApi.js
│  │  ├─ analyticsApi.js
│  │  ├─ adminLogApi.js
│  │  └─ index.js (export tất cả)
│  │
│  ├─ Api.js (cũ, sẽ deprecated)
│  └─ utils.js (Helper functions)
│
├─ css/
│  ├─ Admin/ ⭐ MỚI
│  │  ├─ AdminLayout.css
│  │  ├─ Sidebar.css
│  │  ├─ CommonComponents.css
│  │  └─ AdminVariables.css (Màu sắc, font chung)
│  │
│  └─ (cũ...)
│
├─ App.js (Update routes)
└─ index.js
```

### Backend Structure (Refactoring)
```
src/Backend/
├─ Server.js (Main entry, Middleware setup)
│
├─ config/
│  ├─ database.js (Prisma setup)
│  └─ jwt.js (JWT config)
│
├─ middleware/
│  ├─ auth.js (Verify JWT)
│  ├─ authorization.js (Check role)
│  ├─ errorHandler.js
│  ├─ logging.js
│  ├─ validation.js
│  └─ rateLimiter.js
│
├─ routes/
│  ├─ auth.js (Register, Login, Logout)
│  ├─ users.js (User CRUD, phân quyền)
│  ├─ courses.js (Course CRUD)
│  ├─ modules.js (Module CRUD)
│  ├─ lessons.js (Lesson CRUD)
│  ├─ labs.js (Lab CRUD)
│  ├─ exams.js (Exam CRUD)
│  ├─ questions.js (ExamQuestion CRUD)
│  ├─ results.js (ExamResult, Analytics)
│  ├─ analytics.js (Statistics, Reports)
│  ├─ adminLogs.js (View logs)
│  └─ index.js (Combine all routes)
│
├─ controllers/
│  ├─ authController.js
│  ├─ userController.js
│  ├─ courseController.js
│  ├─ moduleController.js
│  ├─ lessonController.js
│  ├─ labController.js
│  ├─ examController.js
│  ├─ questionController.js
│  ├─ resultController.js
│  ├─ analyticsController.js
│  └─ adminLogController.js
│
├─ services/
│  ├─ authService.js
│  ├─ userService.js
│  ├─ courseService.js
│  ├─ moduleService.js
│  ├─ lessonService.js
│  ├─ labService.js
│  ├─ examService.js
│  ├─ analyticsService.js
│  └─ adminLogService.js
│
├─ validators/
│  ├─ authValidator.js
│  ├─ courseValidator.js
│  ├─ userValidator.js
│  └─ examValidator.js
│
└─ utils/
   ├─ errors.js (Custom error classes)
   ├─ response.js (Standard response format)
   └─ helpers.js (Utility functions)
```

---

## 🎨 COMPONENT DESIGN PATTERN

### 1. **Admin Layout Pattern** (Master-Detail)
```jsx
// AdminLayout.js
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} setCurrentPage={setCurrentPage} />
      <div className="admin-content">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-main">
          <PageContent page={currentPage} />
        </main>
      </div>
    </div>
  );
}
```

### 2. **Data Table Component Pattern**
```jsx
// DataTable.js - Reusable table component
export default function DataTable({
  columns,      // [{ key: 'name', label: 'Name', width: '30%' }, ...]
  data,         // Array of objects
  onEdit,       // Callback for edit button
  onDelete,     // Callback for delete button
  onSearch,     // Callback for search
  pagination    // { page, pageSize, total }
}) {
  return (
    <table className="data-table">
      {/* Thead */}
      {/* Tbody */}
      {/* Actions (Edit, Delete) */}
    </table>
  );
}

// Usage in CourseList.js
<DataTable
  columns={[
    { key: 'title', label: 'Tên khóa học', width: '40%' },
    { key: 'code', label: 'Mã code', width: '15%' },
    { key: 'createdAt', label: 'Ngày tạo' },
  ]}
  data={courses}
  onEdit={handleEdit}
  onDelete={handleDelete}
  pagination={pagination}
/>
```

### 3. **Form Component Pattern**
```jsx
// CourseForm.js
export default function CourseForm({ courseId, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    title: '',
    description: '',
    orderIndex: 1
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Validate
      const validation = validateForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Call API
      if (courseId) {
        await updateCourse(courseId, formData);
      } else {
        await createCourse(formData);
      }
      
      onSave(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### 4. **Modal/Dialog Pattern**
```jsx
// Modal.js - Reusable modal component
export default function Modal({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false
}) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onCancel} disabled={isLoading}>{cancelText}</button>
          <button onClick={onConfirm} disabled={isLoading} className="primary">
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Usage
const [showModal, setShowModal] = useState(false);
<Modal
  isOpen={showModal}
  title="Xóa khóa học?"
  onConfirm={handleDeleteCourse}
  onCancel={() => setShowModal(false)}
  confirmText="Xóa"
/>
```

### 5. **Search & Filter Pattern**
```jsx
// SearchAndFilter.js
export default function SearchAndFilter({
  onSearch,
  onFilter,
  filters = ['status', 'category', 'difficulty']
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...selectedFilters, [filterKey]: value };
    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {filters.map(filter => (
        <select key={filter} onChange={(e) => handleFilterChange(filter, e.target.value)}>
          {/* Options */}
        </select>
      ))}
    </div>
  );
}
```

---

## 🔌 API ENDPOINTS CẦN THIẾT

### Authentication (/api/auth)
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh token
GET    /api/auth/me              # Get current user info
```

### Users Management (/api/users)
```
GET    /api/users                # Get all users (admin only)
GET    /api/users/:id            # Get user detail
POST   /api/users                # Create new user (admin)
PUT    /api/users/:id            # Update user info (admin)
DELETE /api/users/:id            # Delete/Disable user (admin, soft delete)
PUT    /api/users/:id/role       # Change user role (SUPER_ADMIN only)
GET    /api/users/:id/activity   # Get user activity logs
```

### Courses (/api/courses)
```
GET    /api/courses              # Get all courses
GET    /api/courses/:id          # Get course detail
POST   /api/courses              # Create course (CONTENT_MANAGER+)
PUT    /api/courses/:id          # Update course
DELETE /api/courses/:id          # Delete course (soft delete)
GET    /api/courses/:id/stats    # Course statistics
```

### Course Topics (/api/course-topics)
```
GET    /api/courses/:courseId/topics      # Get topics for course
POST   /api/courses/:courseId/topics      # Create topic
PUT    /api/course-topics/:id             # Update topic
DELETE /api/course-topics/:id             # Delete topic
PUT    /api/course-topics/:id/reorder     # Reorder topics
```

### Modules (/api/modules)
```
GET    /api/courses/:courseId/modules     # Get modules for course
GET    /api/modules/:id                   # Get module detail
POST   /api/courses/:courseId/modules     # Create module
PUT    /api/modules/:id                   # Update module
DELETE /api/modules/:id                   # Delete module
PUT    /api/modules/:id/reorder           # Reorder modules
```

### Lessons (/api/lessons)
```
GET    /api/modules/:moduleId/lessons     # Get lessons for module
GET    /api/lessons/:id                   # Get lesson detail
POST   /api/modules/:moduleId/lessons     # Create lesson
PUT    /api/lessons/:id                   # Update lesson
DELETE /api/lessons/:id                   # Delete lesson
PUT    /api/lessons/:id/reorder           # Reorder lessons
PUT    /api/lessons/:id/publish           # Publish lesson
```

### Labs (/api/labs)
```
GET    /api/labs                          # Get all labs
GET    /api/labs/:id                      # Get lab detail
POST   /api/labs                          # Create lab
PUT    /api/labs/:id                      # Update lab
DELETE /api/labs/:id                      # Delete lab
PUT    /api/labs/:courseId/reorder        # Reorder labs
GET    /api/labs/stats                    # Lab statistics
```

### Exams (/api/exams)
```
GET    /api/exams                         # Get all exams
GET    /api/exams/:id                     # Get exam detail
POST   /api/exams                         # Create exam
PUT    /api/exams/:id                     # Update exam
DELETE /api/exams/:id                     # Delete exam
GET    /api/exams/:id/questions           # Get questions for exam
POST   /api/exams/:id/questions           # Add question to exam
GET    /api/exams/:id/results             # Get exam results
```

### Exam Questions (/api/exam-questions)
```
GET    /api/exams/:examId/questions      # Get all questions for exam
GET    /api/exam-questions/:id           # Get question detail
POST   /api/exams/:examId/questions      # Create question
PUT    /api/exam-questions/:id           # Update question
DELETE /api/exam-questions/:id           # Delete question
PUT    /api/exam-questions/:id/reorder   # Reorder questions
```

### Analytics (/api/analytics)
```
GET    /api/analytics/dashboard           # Dashboard stats
GET    /api/analytics/courses             # Course analytics
GET    /api/analytics/users               # User analytics
GET    /api/analytics/exams               # Exam analytics
GET    /api/analytics/export              # Export report (CSV/PDF)
```

### Admin Logs (/api/admin-logs)
```
GET    /api/admin-logs                    # Get all logs
GET    /api/admin-logs?action=UPDATE      # Filter by action
GET    /api/admin-logs?targetTable=exams  # Filter by table
GET    /api/admin-logs/:id                # Get log detail
```

---

## 👤 AUTHENTICATION & AUTHORIZATION

### Token Strategy
```javascript
// Access Token: Short-lived (15 minutes)
const accessToken = jwt.sign({
  id: user.id,
  email: user.email,
  role: user.role,
  type: 'access'
}, JWT_SECRET, { expiresIn: '15m' });

// Refresh Token: Long-lived (7 days)
const refreshToken = jwt.sign({
  id: user.id,
  type: 'refresh',
  version: 1
}, JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Response
res.json({
  accessToken,
  refreshToken,
  user: { id, email, fullName, role }
});
```

### Middleware Strategy
```javascript
// 1. Authentication Middleware (Verify JWT)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// 2. Authorization Middleware (Check Role)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// 3. Usage
app.post('/api/courses', authenticateToken, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), createCourse);
```

### Frontend Authentication Flow
```javascript
// 1. Login
const handleLogin = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  const { accessToken, refreshToken, user } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userData', JSON.stringify(user));
  
  login(user, accessToken);
};

// 2. Auto Refresh
const api = axios.create();
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (error) {
        // Logout
      }
    }
    return Promise.reject(error);
  }
);

// 3. Check Permission
const canManageCourses = (user) => {
  return ['CONTENT_MANAGER', 'SUPER_ADMIN'].includes(user.role);
};

const canManageExams = (user) => {
  return ['EXAM_MANAGER', 'SUPER_ADMIN'].includes(user.role);
};

const canManageUsers = (user) => {
  return user.role === 'SUPER_ADMIN';
};
```

---

## 🎨 UI/UX DESIGN RECOMMENDATIONS

### Color Scheme (Admin Panel)
```css
/* Primary Colors */
--primary-color: #2563eb;     /* Blue - Main actions */
--primary-light: #3b82f6;     /* Lighter blue */
--primary-dark: #1e40af;      /* Darker blue */

/* Secondary Colors */
--success-color: #10b981;     /* Green - Success messages */
--warning-color: #f59e0b;     /* Amber - Warnings */
--danger-color: #ef4444;      /* Red - Errors, Delete */
--info-color: #0ea5e9;        /* Cyan - Info */

/* Neutrals */
--bg-primary: #ffffff;        /* White background */
--bg-secondary: #f3f4f6;      /* Light gray background */
--bg-tertiary: #e5e7eb;       /* Medium gray background */
--text-primary: #1f2937;      /* Dark text */
--text-secondary: #6b7280;    /* Gray text */
--text-tertiary: #9ca3af;     /* Light gray text */
--border-color: #d1d5db;      /* Border color */

/* Sidebar */
--sidebar-bg: #1f2937;        /* Dark gray sidebar */
--sidebar-text: #ffffff;      /* White text on sidebar */
--sidebar-hover: #374151;     /* Hover color */
```

### Layout Components

#### 1. **Sidebar Navigation**
```
[LOGO]
─────────────────
📊 Dashboard
📚 Courses
  ├─ Course List
  ├─ Topics
  └─ Modules
📝 Lessons
🔬 Labs
📋 Exams
👥 Users
📈 Analytics
📋 Logs
⚙️  Settings
─────────────────
👤 Admin (Dropdown)
  ├─ Profile
  ├─ Settings
  └─ Logout
```

#### 2. **Top Bar**
```
[☰ Menu Button] [Search...] [🔔 Notifications] [👤 User] [⬇ Logout]
```

#### 3. **Dashboard Overview**
```
┌─────────────────────────────────────────────────────────┐
│ Welcome, Admin Name!                                     │
│ Last login: 2 hours ago                                  │
└─────────────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Users   │ │ Courses  │ │  Exams   │ │  Active  │
│   150    │ │    12    │ │    45    │ │  Users   │
│    📈    │ │    📊    │ │    📋    │ │    👥    │
│  +5 this │ │ +2 this  │ │ +8 this  │ │ 45 now   │
│   month  │ │  month   │ │  month   │ │ online   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

[Recent Activity Chart]

[Recent Logs Table]
```

#### 4. **Data List Page**
```
[Title: Manage Courses]

[Search...] [Filter ▼] [Sort ▼] [+ Create New]

┌──────────────────────────────────────────────────┐
│ Name      │ Code  │ Modules │ Created    │ Action│
├───────────┼───────┼─────────┼────────────┼───────┤
│ CCNA 100  │ ITN   │   10    │ 2024-01-15 │ ✏️ 🗑️ │
│ CCNA 200  │ SRWE  │    8    │ 2024-02-20 │ ✏️ 🗑️ │
│ CCNA 300  │ ENARSI│   12    │ 2024-03-10 │ ✏️ 🗑️ │
└──────────────────────────────────────────────────┘

[Showing 1-10 of 25] [< Previous] [1] [2] [3] [Next >]
```

#### 5. **Form Page**
```
[Title: Create/Edit Course]

[Form with validation]
┌─────────────────────────────────────┐
│ Course ID *                          │
│ [C001                              ] │
│ Course Code *                        │
│ [ITN                               ] │
│ Course Title *                       │
│ [CCNA 100 - Cisco Networking Basics] │
│ Description                          │
│ [                                  ] │
│ [                                  ] │
│ Order Index *                        │
│ [1                                 ] │
└─────────────────────────────────────┘

[← Back] [Clear] [Save Course]
```

### Responsive Design

```css
/* Desktop (> 1200px) */
.admin-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
}

/* Tablet (768px - 1199px) */
@media (max-width: 1199px) {
  .sidebar { position: absolute; width: 260px; transform: translateX(-100%); }
  .admin-content { grid-column: 1 / -1; }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    width: 80%;
    height: 100vh;
    z-index: 1000;
  }
  
  table {
    font-size: 12px;
  }
  
  .pagination {
    justify-content: center;
  }
}
```

### Icons (Using Lucide React)
```
Dashboard      - BarChart3
Courses        - Book
Modules        - Grid
Lessons        - FileText
Labs           - Beaker
Exams          - ClipboardList
Users          - Users
Analytics      - TrendingUp
Logs           - History
Settings       - Settings
Edit           - Edit2
Delete         - Trash2
Add            - Plus
Search         - Search
Filter         - Filter
Export         - Download
```

---

## ⚡ QUICK START DEVELOPMENT ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Refactor Backend (MVC structure)
- [ ] Create AdminProtectedRoute component
- [ ] Build AdminLayout + Sidebar
- [ ] Create reusable DataTable component
- [ ] Setup Admin routing

### Phase 2: User Management (Week 2-3)
- [ ] User list with search/filter
- [ ] User creation form
- [ ] Role assignment
- [ ] User detail view
- [ ] User deletion (soft delete)

### Phase 3: Course Management (Week 3-4)
- [ ] Course list CRUD
- [ ] Module CRUD
- [ ] Lesson CRUD
- [ ] Topic management
- [ ] Drag & drop reordering

### Phase 4: Exam Management (Week 4-5)
- [ ] Exam list CRUD
- [ ] Question editor
- [ ] Answer management
- [ ] Exam results viewer

### Phase 5: Analytics & Monitoring (Week 5-6)
- [ ] Dashboard statistics
- [ ] Charts (Chart.js)
- [ ] User activity repo
- [ ] Export functionality

### Phase 6: Polish & Testing (Week 6-7)
- [ ] Error handling
- [ ] Loading states
- [ ] Validation
- [ ] Unit tests
- [ ] E2E tests

---

## 📚 RECOMMENDED LIBRARIES TO ADD

```json
{
  "dependencies": {
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "react-table": "^8.9.0",
    "react-hook-form": "^7.48.0",
    "yup": "^1.3.0",
    "date-fns": "^2.30.0",
    "classnames": "^2.3.2",
    "zustand": "^4.4.0",
    "react-hot-toast": "^2.4.1"
  }
}
```

---

## ✅ CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Authentication & Authorization hoàn thiện
- [ ] Tất cả CRUD endpoints testéd
- [ ] Error handling toàn bộ
- [ ] Input validation trên cả frontend + backend
- [ ] Admin logs hoạt động đúng
- [ ] Soft delete implemented
- [ ] Rate limiting setup
- [ ] CORS configured correctly
- [ ] JWT refresh token working
- [ ] Responsive design tested
- [ ] Performance optimized
- [ ] Security headers added
- [ ] Database backup strategy
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Unit tests passed
- [ ] E2E tests passed

---

**Last Updated:** 13/04/2026  
**Status:** Ready for Development  
**Next Step:** Start with Phase 1 - Backend Refactoring
