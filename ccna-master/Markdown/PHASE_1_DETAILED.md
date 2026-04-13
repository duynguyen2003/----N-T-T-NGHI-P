# 📅 CHI TIẾT TỪNG PHASE THỰC HIỆN

**Dự án:** CCNA Learning Platform  
**Giai đoạn:** Phase 1 - Admin Panel Cơ Bản  
**Thời gian:** 23 ngày → Rút gọn thành 11 ngày  
**Ngày bắt đầu:** 01/04/2026  
**Ngày kết thúc dự kiến:** 13/04/2026

---

## 📊 Thời Gian Biểu Tổng Thể

```
PHASE 1: Admin Panel Cơ Bản
├─ WEEK 1: Foundation (Tuần 1)
│  ├─ Day 1-2: Setup & Architecture
│  ├─ Day 3-4: Role & Permission System
│  ├─ Day 5-7: User Management
│
├─ WEEK 2: Content Management (Tuần 2)
│  ├─ Day 8-9: Course Management
│  ├─ Day 10: Module & Lesson Management
│  ├─ Day 11: Lab Management
│
└─ PHASE 2: Advanced Features (Phase Tiếp Theo - Ngoài scope hiện tại)
   ├─ Analytics & Reports
   ├─ Notification System
   ├─ Backup & Recovery
   └─ Performance Optimization
```

---

## 🔴 PHASE 1: TUẦN 1 - FOUNDATION (NỀN TẢNG)

### NGÀY 1-2: Setup & Kiến Trúc

**Mục tiêu:** 
- Hiểu rõ kiến trúc hiện tại
- Chuẩn bị môi trường phát triển
- Thiết kế database schema cho admin features

**Công việc thực hiện:**

#### Day 1
```
1. Phân tích kiến trúc hiện tại
   ✓ Đọc ADMIN_PANEL_DESIGN_REVIEW.md
   ✓ Hiểu stack: React + Express + Prisma + PostgreSQL
   ✓ Xem file structure hiện tại

2. Thiết lập môi trường dev
   ✓ npm install
   ✓ Cấu hình .env
   ✓ Tạo database development
   ✓ npx prisma migrate dev

3. Kiểm tra server
   ✓ npm start (Frontend)
   ✓ npm run server (Backend)
   ✓ Kiểm tra http://localhost:3000 & http://localhost:5000
```

#### Day 2
```
1. Thiết kế Admin Panel Architecture
   ✓ Xác định 2 Roles:
     - STUDENT: Người học
     - ADMIN: Quản trị viên
   ✓ Xác định Permissions cấp bậc

2. Database Schema Updates
   ✓ Cập nhật prisma/schema.prisma:
     - User model: thêm isActive, createdAt, updatedAt
     - AdminLog model: tạo audit trail mới
     - Role enum: STUDENT, ADMIN (xóa CONTENT_MANAGER, EXAM_MANAGER)

3. Tạo migration
   ✓ npx prisma migrate dev --name "add_admin_system"
   ✓ Test database changes
```

**Kết quả:**
- ✅ Hiểu rõ kiến trúc và workflow
- ✅ Database updated với admin features
- ✅ Dev environment ready

---

### NGÀY 3-4: Role & Permission System

**Mục tiêu:**
- Tạo middleware xác thực & phân quyền
- Cập nhật authentication logic

**Công việc thực hiện:**

#### Day 3
```
1. Cập nhật Authentication Middleware
   
   File: src/Backend/middleware/auth.js
   
   ✓ Middleware.authenticateToken()
     - Verify JWT token
     - Lấy user info từ token
     - Gán req.user
   
   ✓ Middleware.requireAdmin()
     - Kiểm tra: req.user.role === 'ADMIN'
     - Nếu không → 403 Forbidden
     - Nếu yes → next()

2. Cập nhật Login Logic
   File: src/Backend/controllers/authController.js
   
   ✓ Login endpoint:
     - Kiểm tra email & password
     - Check user.isActive (phải true)
     - Lấy role từ database
     - Tạo JWT token + refresh token
     - Return: { token, role, userId, email }

3. Test Authentication
   ✓ POST /api/auth/login (student)
   ✓ POST /api/auth/login (admin)
   ✓ Kiểm tra tokens khác nhau
```

#### Day 4
```
1. Tạo Admin-Only Protected Routes
   
   Ví dụ cấu trúc routes:
   
   // routes/admin.js
   router.get('/dashboard', 
     authenticateToken, 
     requireAdmin,          ← Chỉ ADMIN qua được
     adminController.getDashboard
   );

2. Cập nhật tất cả routes admin với middleware:
   ✓ routes/users.js
   ✓ routes/courses.js
   ✓ routes/exams.js
   ✓ routes/labs.js
   ✓ routes/modules.js
   ✓ routes/lessons.js

3. Test Authorization
   ✓ Thử access /api/admin endpoints với STUDENT token → 403
   ✓ Thử access /api/admin endpoints với ADMIN token → 200 OK
```

**Kết quả:**
- ✅ Middleware auth & admin check hoạt động
- ✅ Token-based authentication đẩy đủ
- ✅ Admin routes được bảo vệ

---

### NGÀY 5-7: User Management Backend

**Mục tiêu:**
- Tạo API endpoints quản lý người dùng
- Tạo frontend admin dashboard cơ bản

**Công việc thực hiện:**

#### Day 5
```
1. Tạo User Management Endpoints

   GET    /api/users
   ├─ Lấy danh sách tất cả users
   ├─ Response: { userId, email, role, isActive, createdAt }
   └─ Phân trang: ?page=1&limit=20

   POST   /api/users
   ├─ Tạo user mới (admin tạo)
   ├─ Body: { email, password, role (default: STUDENT) }
   └─ Return: user object + token

   GET    /api/users/:id
   ├─ Chi tiết user
   └─ Return: full user info

   PUT    /api/users/:id
   ├─ Cập nhật user (email, role, isActive)
   └─ Log: ghi lại ai thay đổi gì

   PUT    /api/users/:id/toggle-active
   ├─ Kích hoạt/Vô hiệu hóa tài khoản
   └─ isActive: true → false (hoặc ngược lại)

   DELETE /api/users/:id
   ├─ Xóa user (soft delete)
   └─ Đặt isActive = false

2. Tạo AdminLog Service
   - Mỗi hành động admin sẽ ghi log
   - Table: AdminLog { id, adminId, action, details, timestamp }

3. Implement Error Handling
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error
```

#### Day 6
```
1. Tạo Frontend: Admin Dashboard Layout

   File: src/components/Admin/AdminLayout.js
   
   Cấu trúc:
   ┌────────────────────────────────────┐
   │         Top Navbar                 │
   │ Logo | Breadcrumb | User Settings  │
   ├─────────┬──────────────────────────┤
   │  Sidebar│     Main Content         │
   │  Menu   │                          │
   │         │                          │
   │────────┼──────────────────────────┤
   │         Footer                     │
   └────────────────────────────────────┘

   Sidebar Menu:
   ├─ 📊 Dashboard
   ├─ 👥 User Management
   ├─ 📚 Course Management
   ├─ 🔬 Lab Management
   ├─ 📋 Exam Management
   ├─ 📈 Analytics
   └─ ⚙️ Settings

2. Tạo User Management Component
   File: src/components/Admin/UserManagement.js
   
   Features:
   ✓ Table hiển thị danh sách users
   ✓ Tìm kiếm (search by email)
   ✓ Filter (role, isActive)
   ✓ Pagination
   ✓ Nút: Edit, Deactivate, Delete

3. Cập nhật ProtectedRoute
   - Kiểm tra role === 'ADMIN'
   - Redirect to /login nếu không phải admin
```

#### Day 7
```
1. Tạo User Edit Form
   File: src/components/Admin/UserEditForm.js
   
   Fields:
   ├─ Email (read-only)
   ├─ Role (select: STUDENT, ADMIN)
   ├─ Active Status (toggle)
   ├─ Reset Password (button)
   └─ Save / Cancel buttons

2. Integrate API Calls
   File: src/services/AdminApi.js
   
   Functions:
   ✓ getUsers(page, limit)
   ✓ getUserDetail(userId)
   ✓ updateUser(userId, data)
   ✓ toggleUserActive(userId)
   ✓ resetUserPassword(userId)

3. Add Toast Notifications
   ✓ Success: "User updated successfully"
   ✓ Error: "Failed to update user"
   ✓ Confirm: "Are you sure?"

4. Testing
   ✓ Create test admin account
   ✓ Test CRUD operations
   ✓ Test error handling
```

**Kết quả:**
- ✅ User Management API endpoints hoàn tất
- ✅ Admin Dashboard UI cơ bản
- ✅ User CRUD operations hoạt động

---

## 🟡 PHASE 1: TUẦN 2 - CONTENT MANAGEMENT

### NGÀY 8-9: Course Management

**Mục tiêu:**
- Tạo endpoints quản lý khóa học
- Tạo Course Management UI

**Công việc thực hiện:**

#### Day 8
```
1. Tạo Course Management Endpoints

   GET    /api/courses/admin
   ├─ Danh sách tất cả courses (include draft)
   └─ Chỉ ADMIN thấy draft courses

   POST   /api/courses
   ├─ Tạo course mới
   ├─ Body: { title, description, thumbnail, courseCode }
   ├─ Default: status = 'DRAFT'
   └─ Log: Admin tạo course nào

   PUT    /api/courses/:id
   ├─ Update course info
   ├─ Chỉ ADMIN của khóa atau SUPER_ADMIN mới sửa
   └─ Log change

   PUT    /api/courses/:id/publish
   ├─ Publish course
   ├─ status: DRAFT → PUBLISHED
   └─ Log publish

   DELETE /api/courses/:id
   ├─ Soft delete course
   ├─ isActive = false
   └─ Log delete

2. Database Updates (nếu cần)
   - Cập nhật Course model
   - Thêm: status enum (DRAFT, PUBLISHED, ARCHIVED)
   - Thêm: createdBy (admin ID), publishedDate

3. Tạo Service Layer
   File: src/Backend/services/courseService.js
   - getCoursesList()
   - createCourse()
   - updateCourse()
   - publishCourse()
   - deleteCourse()
```

#### Day 9
```
1. Tạo Frontend: Course Management UI
   
   File: src/components/Admin/CourseManagement.js
   
   Components:
   ├─ CourseList
   │  ├─ Table (title, courseCode, status, students)
   │  ├─ Buttons: Edit, Publish, Delete
   │  └─ Filters: Status (DRAFT, PUBLISHED, ARCHIVED)
   │
   ├─ CourseForm
   │  ├─ Form: Title, Description, Code, Thumbnail
   │  ├─ Submit button
   │  └─ Cancel button
   │
   └─ CourseDetail
      ├─ View course info
      ├─ List modules
      ├─ Add/Edit/Delete module buttons
      └─ Publish button

2. Add API Integration
   - Call /api/courses endpoints
   - Handle loading, error, success states
   - Add confirmation dialogs for delete

3. Test Course Management
   ✓ Create new course → appears in admin list
   ✓ Edit course → updates reflect
   ✓ Publish course → status changes
   ✓ Delete course → soft deleted
```

**Kết quả:**
- ✅ Course Management API endpoints
- ✅ Frontend UI cho course management
- ✅ CRUD operations hoạt động

---

### NGÀY 10: Module & Lesson Management

**Mục tiêu:**
- Tạo API cho Module & Lesson
- UI interface cho module/lesson management

**Công việc thực hiện:**

```
1. Tạo Module Management Endpoints

   GET    /api/courses/:courseId/modules
   └─ Danh sách modules của course

   POST   /api/modules
   ├─ Body: { courseId, title, description, order }
   └─ Tạo module mới

   PUT    /api/modules/:id
   ├─ Update module
   └─ Log change

   DELETE /api/modules/:id
   └─ Xóa module

2. Tạo Lesson Management Endpoints

   GET    /api/modules/:moduleId/lessons
   └─ Danh sách lessons của module

   POST   /api/lessons
   ├─ Body: { moduleId, title, content, videoUrl, order }
   └─ Tạo lesson mới

   PUT    /api/lessons/:id
   ├─ Update lesson content
   └─ Log change

   DELETE /api/lessons/:id
   └─ Xóa lesson

3. Frontend: Module & Lesson Form
   
   File: src/components/Admin/ModuleLessonForm.js
   
   Features:
   ├─ Add Module button
   ├─ For each module:
   │  ├─ Module title (editable)
   │  ├─ Add Lesson button
   │  └─ List of lessons:
   │     ├─ Lesson title (editable)
   │     ├─ Video URL (editable)
   │     ├─ Edit / Delete buttons
   │     └─ Drag to reorder
   │
   └─ Save all changes

4. Testing
   ✓ Create course → Add modules → Add lessons
   ✓ Reorder modules/lessons
   ✓ Edit lesson content
   ✓ Delete module (should delete all lessons)
```

**Kết quả:**
- ✅ Module & Lesson API endpoints
- ✅ Nested management UI (Course → Modules → Lessons)
- ✅ Full CRUD operations

---

### NGÀY 11: Lab Management

**Mục tiêu:**
- Tạo Lab Management endpoints
- Tạo UI cho admin quản lý labs

**Công việc thực hiện:**

```
1. Tạo Lab Management Endpoints

   GET    /api/labs/admin
   └─ Danh sách labs (admin view)

   POST   /api/labs
   ├─ Body: { title, description, difficulty, objective, steps }
   └─ Tạo lab mới

   GET    /api/labs/:id/submissions
   ├─ Danh sách student submissions
   └─ Filter: pending, approved, rejected

   PUT    /api/labs/submissions/:id/grade
   ├─ Body: { score, feedback, status }
   ├─ Chấm điểm lab submission
   └─ Log grading

2. Frontend: Lab Management UI

   File: src/components/Admin/LabManagement.js
   
   Sections:
   ├─ Lab List
   │  ├─ Table: title, difficulty, students_enrolled
   │  └─ Actions: Edit, View Submissions
   │
   ├─ Lab Form
   │  ├─ Title, Description
   │  ├─ Difficulty (Easy/Medium/Hard)
   │  ├─ Objectives
   │  ├─ Steps (Text editor)
   │  └─ Topology file upload
   │
   └─ Submissions
      ├─ List student submissions
      ├─ View submitted files
      ├─ Grade form
      └─ Send feedback

3. File Upload Handler
   - Student upload: screenshot/config files
   - Admin view: show files
   - File type validation: .pdf, .doc, .txt, .jpg, .png
   - Max file size: 25MB

4. Testing
   ✓ Create lab → students enroll → submit → grade
   ✓ Upload file handling
   ✓ Notification when graded
```

**Kết quả:**
- ✅ Lab Management API endpoints
- ✅ Submission grading system
- ✅ File upload/download features

---

## ✅ PHASE 1 COMPLETION CHECKLIST

```
BACKEND
├─ ✅ Role & Permission Middleware
├─ ✅ User Management Endpoints (CRUD)
├─ ✅ Course Management Endpoints
├─ ✅ Module & Lesson Endpoints
├─ ✅ Lab Management Endpoints
├─ ✅ Admin Activity Logging
├─ ✅ Error Handling & Validation
└─ ✅ Database Schema & Migrations

FRONTEND
├─ ✅ Admin Protected Routes
├─ ✅ Admin Dashboard Layout
├─ ✅ User Management UI
├─ ✅ Course Management UI
├─ ✅ Module/Lesson Management UI
├─ ✅ Lab Management UI
├─ ✅ File Upload/Download
└─ ✅ Toast Notifications

TESTING
├─ ✅ Manual API testing (Postman/Insomnia)
├─ ✅ Frontend functionality testing
├─ ✅ Error cases testing
├─ ✅ Authentication & Authorization testing
└─ ✅ Database consistency check

DOCUMENTATION
├─ ✅ API endpoints documented
├─ ✅ Admin guide created
├─ ✅ Database schema documented
└─ ✅ Deployment guide ready
```

---

## 📈 Số Liệu Tiến Độ

```
Phase 1 - Day by Day Progress:

Day 1:  [████░░░░░░░░░░░░░░░░░░] 10% - Setup & Architecture
Day 2:  [████████░░░░░░░░░░░░░░] 20% - Database Schema
Day 3:  [████████████░░░░░░░░░░] 30% - Auth Middleware
Day 4:  [████████████████░░░░░░] 40% - Admin Permission
Day 5:  [████████████████████░░] 50% - User Management Backend
Day 6:  [██████████████████████] 60% - User Management Frontend
Day 7:  [██████████████████████] 70% - User Management Complete
Day 8:  [██████████████████████] 80% - Course Management
Day 9:  [██████████████████████] 85% - Course Frontend
Day 10: [██████████████████████] 90% - Module/Lesson Management
Day 11: [██████████████████████] 100% - Lab Management Complete
```

---

**Cập nhật lần cuối:** 13/04/2026  
**Phiên bản:** 1.0  
**Trạng thái:** ✅ Hoàn thành
