import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import { adminApi } from '../../../services/api/adminApi';
import { AuthContext } from '../../../context/AuthContext';
import AdminModal from '../Components/AdminModal';
import '../../../css/Admin/AdminViews.css';

const Users = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers(token, 1, search);
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError('');
      await adminApi.createUser(token, formData);
      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', role: 'STUDENT' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handeToggleRole = async (user) => {
    try {
      const newRole = user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
      if (window.confirm(`Bạn có chắc muốn đổi quyền của ${user.fullName} thành ${newRole}?`)) {
        await adminApi.updateUserRole(token, user.id, newRole);
        fetchUsers();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await adminApi.toggleUserActive(token, user.id);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) {
        await adminApi.deleteUser(token, id);
        fetchUsers();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="users-wrapper">
      <div className="admin-table-header" style={{ padding: '0 0 20px 0', border: 'none' }}>
        <h3>Quản lý Người Dùng</h3>
        <div className="admin-table-actions">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--admin-text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm email, tên..." 
              className="admin-search-input"
              style={{ paddingLeft: '35px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Thêm Mới
          </button>
        </div>
      </div>

      <div className="admin-datatable-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign: 'center'}}>Đang tải...</td></tr> : 
             users.length > 0 ? users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`admin-badge ${u.role === 'ADMIN' ? 'admin' : 'student'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>
                    {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="admin-action-btn" title="Đổi quyền" onClick={() => handeToggleRole(u)}>
                      <Shield size={16} color={u.role === 'ADMIN' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)'} />
                    </button>
                    <button className="admin-action-btn" title={u.isActive ? 'Khóa' : 'Mở khóa'} onClick={() => handleToggleActive(u)}>
                      {u.isActive ? <UserX size={16} /> : <UserCheck size={16} color="var(--admin-success)" />}
                    </button>
                    <button className="admin-action-btn delete" title="Xóa" onClick={() => handleDelete(u.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Không tìm thấy tài khoản nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal 
        title="Tạo Tài Khoản Mới" 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateUser}
      >
        {error && <p style={{ color: 'var(--admin-danger)', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Họ và tên</label>
            <input className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Email</label>
            <input type="email" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Mật khẩu tạm</label>
            <input type="password" className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--admin-text-secondary)' }}>Vai trò</label>
            <select className="admin-search-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="STUDENT">Học viên</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default Users;
