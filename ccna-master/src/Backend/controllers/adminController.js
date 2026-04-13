/**
 * ============================================================
 * FILE: controllers/adminController.js
 * PURPOSE: Handle admin dashboard and management
 * TASKS: Task 1.3 - Admin Dashboard Backend
 * SIMPLIFIED: Only 4 cards + logs (no complex reports)
 * STATUS: Stub
 * ============================================================
 */

/**
 * GET /api/admin/dashboard
 * Return 4 stats: totalUsers, totalCourses, totalExams, activeSessions
 */
const getDashboard = async (req, res, next) => {
  try {
    // TODO: Task 1.3
    // Return { totalUsers, totalCourses, totalExams, activeSessions }
    res.json({ 
      success: false, 
      message: 'Not implemented - Task 1.3' 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/logs
 * Get admin activity logs
 * Note: Database table exists, UI not required for MVP
 */
const getAdminLogs = async (req, res, next) => {
  try {
    // TODO: Task 1.3
    // Fetch from AdminLog table with pagination
    res.json({ 
      success: false, 
      message: 'Not implemented - Task 1.3' 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAdminLogs
};
