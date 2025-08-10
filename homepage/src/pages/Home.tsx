import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleWorkoutClick = () => {
    navigate('/workout-categories');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleExerciseClick = () => {
    navigate('/workout-exercises');
  };

  const handleSessionClick = () => {
    navigate('/workout-session');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">FitBuddy AI 트레이너</h1>
        <p className="hero-subtitle">
          {userName ? `${userName}님, 오늘도 건강한 하루 되세요! 💪` : 'AI와 함께하는 스마트한 운동 라이프'}
        </p>
        <p className="hero-subtitle">
          실시간 자세 분석과 맞춤형 운동 가이드로 더 효과적인 운동을 경험해보세요
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="feature-icon">🤖</span>
          <h3 className="feature-title">AI 자세 분석</h3>
          <p className="feature-description">
            실시간으로 운동 자세를 분석하고 정확한 피드백을 제공합니다. 
            카메라를 통해 관절 각도와 몸 정렬을 체크해보세요.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">💪</span>
          <h3 className="feature-title">맞춤 운동 추천</h3>
          <p className="feature-description">
            개인의 체력 수준과 목표에 맞는 운동을 추천합니다. 
            초보자부터 고급자까지 단계별로 진행할 수 있어요.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3 className="feature-title">진행 상황 추적</h3>
          <p className="feature-description">
            운동 기록과 체중 변화를 차트로 확인할 수 있습니다. 
            꾸준한 발전을 시각적으로 확인해보세요.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3 className="feature-title">목표 달성</h3>
          <p className="feature-description">
            체계적인 운동 계획과 목표 설정으로 동기부여를 유지합니다. 
            작은 성취를 통해 큰 목표를 달성해보세요.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🏥</span>
          <h3 className="feature-title">부상 예방</h3>
          <p className="feature-description">
            올바른 자세와 안전한 운동 방법을 가이드합니다. 
            부상 없이 건강하게 운동할 수 있어요.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🥗</span>
          <h3 className="feature-title">건강 관리</h3>
          <p className="feature-description">
            운동과 영양에 대한 전문적인 조언을 제공합니다. 
            종합적인 건강 관리를 도와드려요.
          </p>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-number">5+</span>
          <div className="stat-label">지원 운동</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">24/7</span>
          <div className="stat-label">AI 지원</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">100%</span>
          <div className="stat-label">자세 분석</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">AI</span>
          <div className="stat-label">실시간 피드백</div>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">지금 바로 시작해보세요!</h2>
        <p className="cta-description">
          FitBuddy AI 트레이너와 함께 더 스마트하고 효과적인 운동을 경험해보세요.
          개인 맞춤형 운동 계획과 실시간 자세 분석으로 목표 달성을 도와드립니다.
        </p>
        <div className="cta-buttons">
          <button onClick={handleWorkoutClick} className="cta-button">
            🏃‍♂️ 운동 시작하기
          </button>
          <button onClick={handleChatClick} className="cta-button secondary">
            💬 AI 트레이너와 상담
          </button>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card" onClick={handleExerciseClick}>
          <span className="feature-icon">📋</span>
          <h3 className="feature-title">운동 목록</h3>
          <p className="feature-description">
            다양한 운동 종류와 방법을 확인하고 
            원하는 운동을 선택해보세요.
          </p>
        </div>

        <div className="feature-card" onClick={handleSessionClick}>
          <span className="feature-icon">🎥</span>
          <h3 className="feature-title">실시간 세션</h3>
          <p className="feature-description">
            카메라를 통해 실시간으로 운동 자세를 분석하고 
            즉시 피드백을 받아보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 