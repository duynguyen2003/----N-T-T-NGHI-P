/**
 * ============================================================
 * FILE: middleware/logging.js
 * PURPOSE: Request/Response logging middleware
 * PERFORMANCE: Minimal overhead logging
 * ============================================================
 */

/**
 * Request logging middleware
 * Log incoming requests với method, path, timestamp
 * @middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Intercept response.json để log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    console.log(`
📨 ${req.method} ${req.path}
   From: ${req.ip || req.connection.remoteAddress}
   Status: ${res.statusCode}
   Duration: ${duration}ms
    `);

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Admin action logging middleware
 * Log mọi hành động của admin (CREATE, UPDATE, DELETE)
 * @middleware
 */
const adminActionLogger = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Chỉ log admin actions (PUT, POST, DELETE)
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.user) {
      console.log(`
🔐 ADMIN ACTION
   User: ${req.user.id} (${req.user.role})
   Action: ${req.method} ${req.path}
   Status: ${res.statusCode}
   Timestamp: ${new Date().toISOString()}
      `);
    }
    
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  requestLogger,
  adminActionLogger
};
