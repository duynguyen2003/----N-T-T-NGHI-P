import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast, ToastComponent } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (globalError) setGlobalError('');
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
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
      const data = await api.login(formData.email.trim(), formData.password);
      
      // Cất "Vé thông hành" (accessToken) vào localStorage + Context
      login(data.user, data.accessToken);
      
      showToast(`Xin chào, ${data.user.fullName}!`, 'success');
      
      // Chuyển hướng vào trang Admin hoặc Lộ trình học tùy vai trò
      setTimeout(() => {
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          const redirectPath = location.state?.from || '/roadmap';
          navigate(redirectPath);
        }
      }, 800);
    } catch (error) {
      setGlobalError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
            <span className="material-icons-round">login</span>
          </div>
          <h1 className="auth-title">Chào mừng trở lại!</h1>
          <p className="auth-subtitle">
            Đăng nhập để tiếp tục hành trình học CCNA của bạn
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
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Địa chỉ Email</label>
            <div className="form-input-wrapper">
              <input
                id="login-email"
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
            <label className="form-label" htmlFor="login-password">Mật khẩu</label>
            <div className="form-input-wrapper">
              <input
                id="login-password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          <div className="auth-form-meta">
            <Link to="/forgot-password" className="auth-inline-link">Quên mật khẩu?</Link>
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
                Đang đăng nhập...
              </>
            ) : (
              <>
                <span className="material-icons-round" style={{ fontSize: 20 }}>login</span>
                Đăng nhập
              </>
            )}
          </button>
        </form>


        {/* Footer link */}
        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
