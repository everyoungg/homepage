import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.email) newErrors.push('이메일을 입력해주세요.');
    if (!formData.password) newErrors.push('비밀번호를 입력해주세요.');
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('비밀번호가 일치하지 않습니다.');
    }
    if (!formData.name) newErrors.push('이름을 입력해주세요.');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // 회원가입 성공 시 사용자 정보 입력 페이지로 이동
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.name);
    navigate('/user-info');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>FitBuddy 회원가입</h1>
        <p>당신의 피트니스 여정을 시작하세요!</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="홍길동"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="8자 이상 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력해주세요"
              required
            />
          </div>

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index} className="error-message">{error}</p>
              ))}
            </div>
          )}

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <div className="login-link">
          이미 계정이 있으신가요? <span onClick={() => navigate('/login')}>로그인</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 