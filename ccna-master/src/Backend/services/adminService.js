/**
 * ============================================================
 * FILE: services/adminService.js
 * PURPOSE: Business logic for admin operations
 * TASKS: Task 1.3 - Admin Dashboard Backend
 * SIMPLIFIED: Only dashboard stats + logs
 * STATUS: Stub
 * ============================================================
 */

/**
 * Get dashboard statistics
 * Returns: { totalUsers, totalCourses, totalExams, activeSessions }
 */
const getDashboardStats = async () => {
  throw new Error('Not implemented - Task 1.3');
};

/**
 * Get admin activity logs with pagination
 */
const getAdminLogs = async (pagination) => {
  throw new Error('Not implemented - Task 1.3');
};

module.exports = {
  getDashboardStats,
  getAdminLogs
};
