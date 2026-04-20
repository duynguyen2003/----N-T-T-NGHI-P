const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === 'filePka') {
      cb(null, 'uploads/labs/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

module.exports = upload;
