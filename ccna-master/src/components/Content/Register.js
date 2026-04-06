import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import { useToast } from '../Toast';

const Register = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu gõ lại
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (globalError) setGlobalError('');
  };

  // Validate form tại chỗ
  const validateForm = () => {
    const newErrors = {};

    // Họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng (phải có @)';
    }

    // Mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Nhập lại mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.register(formData.fullName.trim(), formData.email.trim(), formData.password);
      showToast('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
      
      // Chuyển hướng sang trang đăng nhập sau 1.5s
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setGlobalError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {ToastComponent}
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-round">person_add</span>
          </div>
          <h1 className="auth-title">Tạo tài khoản mới</h1>
          <p className="auth-subtitle">
            Tham gia cộng đồng NetMastery để bắt đầu hành trình chinh phục CCNA
          </p>
        </div>

        {/* Global Error */}
        {globalError && (
          <div className="form-global-error">
            <span className="material-icons-round">error_outline</span>
            {globalError}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Họ tên */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-fullname">Họ và tên</label>
            <div className="form-input-wrapper">
              <input
                id="register-fullname"
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
              <span className="form-input-icon material-icons-round">person</span>
            </div>
            {errors.fullName && (
              <div className="form-error">
                <span className="material-icons-round">error</span>
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Địa chỉ Email</label>
            <div className="form-input-wrapper">
              <input
                id="register-email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <span className="form-input-icon material-icons-round">mail</span>
            </div>
            {errors.email && (
              <div className="form-error">
                <span className="material-icons-round">error</span>
                {errors.email}
              </div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Mật khẩu</label>
            <div className="form-input-wrapper">
              <input
                id="register-password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="form-input-icon material-icons-round">lock</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <span className="material-icons-round">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <div className="form-error">
                <span className="material-icons-round">error</span>
                {errors.password}
              </div>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Nhập lại mật khẩu</label>
            <div className="form-input-wrapper">
              <input
                id="register-confirm"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="form-input-icon material-icons-round">lock</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <span className="material-icons-round">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="form-error">
                <span className="material-icons-round">error</span>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Đang đăng ký...
              </>
            ) : (
              <>
                <span className="material-icons-round" style={{ fontSize: 20 }}>how_to_reg</span>
                Đăng ký
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
