// ============================================================
// FILE: Server.js
// MÔ TẢ: Đây là "Anh Bảo Vệ" - Backend Server của ứng dụng.
//         Anh ta đứng ở cổng 5000, tiếp nhận yêu cầu từ React
//         và trả kết quả về.
// CÁCH CHẠY: node src/Backend/Server.js
// ============================================================

// --- BƯỚC 1: GỌI CÁC THƯ VIỆN CẦN DÙNG ---

// Express: Thư viện giúp tạo Server dễ dàng (giống như thuê 1 anh bảo vệ)
const express = require('express');

// CORS: Cho phép React (cổng 3000) gọi API đến Server (cổng 5000)
// Nếu không có CORS, trình duyệt sẽ chặn không cho gọi API
const cors = require('cors');

// Prisma Client: "Người phiên dịch" giúp ta nói chuyện với Database PostgreSQL
// Thay vì viết SQL thủ công, ta dùng Prisma để đọc/ghi dữ liệu
const { PrismaClient } = require('@prisma/client');

// pg: Thư viện gốc để kết nối PostgreSQL
// PrismaPg: "Cái ổ chuyển đổi" giúp Prisma v7 nói chuyện với PostgreSQL
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// bcrypt: Thư viện mã hóa mật khẩu. Biến "123456" thành một chuỗi ngoằn ngoèo
// để dù hacker có lấy được database cũng không đọc được mật khẩu gốc
const bcrypt = require('bcrypt');

// jsonwebtoken (JWT): Thư viện tạo "Vé thông hành" (Token).
// Sau khi đăng nhập đúng, Server cấp 1 cái Vé cho người dùng.
// Mỗi lần người dùng gọi API sau đó, họ phải đưa Vé này ra để Server xác minh.
const jwt = require('jsonwebtoken');

// --- BƯỚC 2: KHỞI TẠO CÁC CÔNG CỤ ---

const app = express();           // Tạo ứng dụng Express (anh bảo vệ)

// Tạo kết nối đến Database PostgreSQL
// Prisma v7 yêu cầu dùng "adapter" (ổ chuyển đổi) thay vì truyền URL trực tiếp
const pool = new Pool({
    connectionString: 'postgresql://postgres:123456@localhost:5432/netmastery_db'
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// "Chìa khóa bí mật" để tạo và giải mã Token.
// QUAN TRỌNG: Trong dự án thật phải đặt trong file .env, không để lộ trên code.
const JWT_SECRET = 'netmastery_bi_mat_2026';

// --- BƯỚC 3: CẤU HÌNH MIDDLEWARE ---
// Middleware giống như "cửa soi chiếu" - mọi yêu cầu phải đi qua đây trước

app.use(cors());           // Mở cửa cho React ở cổng 3000 gọi vào
app.use(express.json());   // Cho phép Server đọc được dữ liệu JSON từ body request

// ============================================================
// API 1: ĐĂNG KÝ TÀI KHOẢN MỚI
// Đường dẫn: POST /api/auth/register
// Nhiệm vụ: Nhận thông tin từ form đăng ký, kiểm tra, rồi lưu vào Database
// ============================================================
app.post('/api/auth/register', async (req, res) => {
    try {
        // --- Bước 1: Lấy dữ liệu từ body mà React gửi lên ---
        const { fullName, email, password } = req.body;

        // --- Bước 2: Kiểm tra dữ liệu đầu vào (Validation) ---
        // Nếu thiếu bất kỳ trường nào thì trả lỗi 400 (Bad Request)
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ: Họ tên, Email và Mật khẩu'
            });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // --- Bước 3: Kiểm tra email đã tồn tại trong Database chưa ---
        // Dùng Prisma để tìm 1 user có email trùng khớp
        const nguoiDungCu = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        // Nếu tìm thấy => email đã bị trùng => trả lỗi 409 (Conflict)
        if (nguoiDungCu) {
            return res.status(409).json({
                message: 'Email này đã được đăng ký. Vui lòng dùng email khác.'
            });
        }

        // --- Bước 4: Mã hóa (Hash) mật khẩu ---
        // saltRounds = 10: Số lần xáo trộn. Càng cao càng an toàn nhưng càng chậm.
        // Ví dụ: "123456" => "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
        const saltRounds = 10;
        const matKhauDaMaHoa = await bcrypt.hash(password, saltRounds);

        // --- Bước 5: Lưu người dùng mới vào Database ---
        // Prisma sẽ tự động chạy lệnh INSERT INTO users (...) VALUES (...)
        const nguoiDungMoi = await prisma.user.create({
            data: {
                fullName: fullName,                // Họ tên
                email: email.toLowerCase(),        // Email (chuyển về chữ thường)
                passwordHash: matKhauDaMaHoa,      // Mật khẩu ĐÃ mã hóa (KHÔNG lưu mật khẩu gốc!)
                // role mặc định là STUDENT (đã set trong schema)
                // isActive mặc định là true (đã set trong schema)
            }
        });

        // --- Bước 6: Trả về kết quả thành công ---
        // Status 201 = Created (Đã tạo thành công)
        console.log(`✅ Đăng ký thành công: ${nguoiDungMoi.email}`);
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            user: {
                id: nguoiDungMoi.id,
                fullName: nguoiDungMoi.fullName,
                email: nguoiDungMoi.email
            }
        });

    } catch (error) {
        // Nếu có bất kỳ lỗi gì xảy ra (mất kết nối DB, lỗi code...)
        // => Bắt lại ở đây và trả lỗi 500 (Internal Server Error)
        console.error('❌ Lỗi API Đăng ký:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi ở Server. Vui lòng thử lại sau.'
        });
    }
});

// ============================================================
// API 2: ĐĂNG NHẬP
// Đường dẫn: POST /api/auth/login
// Nhiệm vụ: Kiểm tra email + mật khẩu, nếu đúng thì cấp Token (Vé thông hành)
// ============================================================
app.post('/api/auth/login', async (req, res) => {
    try {
        // --- Bước 1: Lấy dữ liệu từ body ---
        const { email, password } = req.body;

        // --- Bước 2: Kiểm tra dữ liệu đầu vào ---
        if (!email || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập Email và Mật khẩu'
            });
        }

        // --- Bước 3: Tìm người dùng theo email trong Database ---
        const nguoiDung = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        // Nếu không tìm thấy => email chưa đăng ký
        // Lưu ý: Ta cố tình KHÔNG nói rõ "email không tồn tại" vì lý do bảo mật
        // (tránh hacker biết email nào đã đăng ký)
        if (!nguoiDung) {
            return res.status(401).json({
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // --- Bước 4: Kiểm tra tài khoản có bị khóa không ---
        if (!nguoiDung.isActive) {
            return res.status(403).json({
                message: 'Tài khoản của bạn đã bị vô hiệu hóa. Liên hệ Admin.'
            });
        }

        // --- Bước 5: So sánh mật khẩu ---
        // bcrypt.compare sẽ mã hóa mật khẩu người dùng vừa nhập
        // rồi so sánh với mật khẩu đã mã hóa trong Database
        // Ví dụ: compare("123456", "$2b$10$N9qo8u...") => true nếu khớp
        const matKhauDung = await bcrypt.compare(password, nguoiDung.passwordHash);

        if (!matKhauDung) {
            return res.status(401).json({
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // --- Bước 6: Tạo Access Token (Vé thông hành) ---
        // jwt.sign() nhận vào:
        //   - Payload: Thông tin gắn vào vé (userId, email, role)
        //   - Secret: Chìa khóa bí mật để ký vé
        //   - Options: expiresIn = thời gian hết hạn
        const accessToken = jwt.sign(
            {
                userId: nguoiDung.id,
                email: nguoiDung.email,
                role: nguoiDung.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }  // Vé có hiệu lực 7 ngày
        );

        // --- Bước 7: Trả về kết quả thành công ---
        // Gửi Token + thông tin người dùng về cho React
        // React sẽ cất Token vào localStorage và dùng thông tin user để hiển thị
        console.log(`✅ Đăng nhập thành công: ${nguoiDung.email}`);
        res.json({
            success: true,
            accessToken: accessToken,
            user: {
                id: nguoiDung.id,
                fullName: nguoiDung.fullName,
                email: nguoiDung.email,
                avatarUrl: nguoiDung.avatarUrl || null,
                role: nguoiDung.role,
                level: nguoiDung.level,
                streak: nguoiDung.streak
            }
        });

    } catch (error) {
        console.error('❌ Lỗi API Đăng nhập:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi ở Server. Vui lòng thử lại sau.'
        });
    }
});

// ============================================================
// API PHỤ: KIỂM TRA SERVER CÒN SỐNG KHÔNG
// Đường dẫn: GET /api/health
// ============================================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy bình thường 🟢' });
});

// ============================================================
// BƯỚC CUỐI: BẬT SERVER LÊN
// ============================================================
const PORT = 5500;
app.listen(PORT, () => {
    console.log('');
    console.log('===========================================');
    console.log(`🚀 Server đã khởi động tại: http://localhost:${PORT}`);
    console.log('===========================================');
    console.log('📋 Danh sách API:');
    console.log(`   POST  http://localhost:${PORT}/api/auth/register  → Đăng ký`);
    console.log(`   POST  http://localhost:${PORT}/api/auth/login     → Đăng nhập`);
    console.log(`   GET   http://localhost:${PORT}/api/health         → Kiểm tra Server`);
    console.log('===========================================');
    console.log('');
});