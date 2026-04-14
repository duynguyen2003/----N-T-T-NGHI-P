// Controller: Xử lý logic nghiệp vụ cho userController

module.exports.getAll = async (req, res, next) => {
  try {
    res.json({ message: 'Lấy dữ liệu thành công' });
  } catch (error) {
    next(error);
  }
};
