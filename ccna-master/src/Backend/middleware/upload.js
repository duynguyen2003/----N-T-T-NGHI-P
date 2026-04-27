const multer = require('multer');
const { ValidationError } = require('../errors/validation-error');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ValidationError('File tải lên phải là hình ảnh'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

module.exports = upload;
