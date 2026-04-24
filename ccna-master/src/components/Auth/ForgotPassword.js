import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/Api';
import { useToast } from '../Toast';

const ForgotPassword = () => {
  const { showToast, ToastComponent } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Email không đúng định dạng');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await api.forgotPassword(email.trim());
      setResult(data);
      showToast(data.message || 'Đã gửi yêu cầu đặt lại mật khẩu.', 'success');
    } catch (submitError) {
      setGlobalError(submitError.message || 'Không thể xử lý yêu cầu lúc này.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {ToastComponent}
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-round">lock_reset</span>
          </div>
          <h1 className="auth-title">Quên mật khẩu</h1>
          <p className="auth-subtitle">
            Nhập email đã đăng ký để tạo yêu cầu đặt lại mật khẩu.
          </p>
        </div>

        {globalError && (
          <div className="form-global-error">
            <span className="material-icons-round">error_outline</span>
            {globalError}
          </div>
        )}

        {result && (
          <div className="auth-success-box">
            <span className="material-icons-round">mark_email_read</span>
            <div>
              <strong>Yêu cầu đã được tạo</strong>
              <p>{result.message}</p>
              {result.resetUrl && (
                <a className="auth-debug-link" href={result.resetUrl}>
                  Mở link đặt lại mật khẩu
                </a>
              )}
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-password-email">Địa chỉ Email</label>
            <div className="form-input-wrapper">
              <input
                id="forgot-password-email"
                className={`form-input ${error ? 'input-error' : ''}`}
                type="email"
                name="email"
                placeholder="email@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                  if (globalError) setGlobalError('');
                }}
                autoComplete="email"
              />
              <span className="form-input-icon material-icons-round">mail</span>
            </div>
            {error && (
              <div className="form-error">
                <span className="material-icons-round">error</span>
                {error}
              </div>
            )}
          </div>

          <div className="auth-info-box">
            <span className="material-icons-round">info</span>
            <div>
              Link đặt lại mật khẩu sẽ có hiệu lực trong 30 phút.
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-icons-round" style={{ fontSize: 20 }}>send</span>
                Gửi yêu cầu
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã nhớ mật khẩu? <Link to="/login" className="auth-link">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
