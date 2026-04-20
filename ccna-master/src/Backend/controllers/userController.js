const bcrypt = require('bcrypt');
const { getPrisma } = require('../config/database');
const prisma = getPrisma();

module.exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const whereParams = {
      deletedAt: null,
      ...(search ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereParams,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, fullName: true, email: true, role: true, 
          isActive: true, createdAt: true, lastLogin: true
        }
      }),
      prisma.user.count({ where: whereParams })
    ]);

    res.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true, fullName: true, email: true, role: true, 
        isActive: true, createdAt: true, lastLogin: true,
        level: true, streak: true, totalStudyTime: true
      }
    });
    if (!user || user.deletedAt) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getProfileMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, fullName: true, email: true, role: true, 
        isActive: true, avatarUrl: true, createdAt: true, 
        level: true, streak: true, totalStudyTime: true
      }
    });
    if (!user || user.deletedAt) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && !existingUser.deletedAt) {
      return res.status(409).json({ message: 'Email này đã được sử dụng' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existingUser && existingUser.deletedAt) {
      // Restore user if soft deleted
      const restoredUser = await prisma.user.update({
        where: { email },
        data: {
          fullName,
          passwordHash,
          role: role || 'STUDENT',
          deletedAt: null,
          isActive: true
        },
        select: { id: true, fullName: true, email: true, role: true, isActive: true }
      });
      return res.status(201).json({ message: 'Tạo tài khoản thành công', user: restoredUser });
    }

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: role || 'STUDENT'
      },
      select: { id: true, fullName: true, email: true, role: true, isActive: true }
    });

    res.status(201).json({ message: 'Tạo tài khoản thành công', user: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['STUDENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Role không hợp lệ' });
    }
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, fullName: true, email: true, role: true }
    });
    res.json({ message: 'Cập nhật quyền thành công', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive: !user.isActive },
      select: { id: true, fullName: true, email: true, isActive: true }
    });
    res.json({ message: `Đã ${updatedUser.isActive ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date(), isActive: false }
    });
    res.json({ message: 'Xóa tài khoản thành công' });
  } catch (error) {
    next(error);
  }
};
