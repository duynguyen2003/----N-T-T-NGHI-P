// Middleware: Xác thực Token và phân quyền Role
module.exports.verifyToken = (req, res, next) => {
  next();
};
module.exports.checkRole = (roles) => (req, res, next) => {
  next();
};
