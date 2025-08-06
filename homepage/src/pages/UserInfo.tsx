import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserInfo.css';

const UserInfo: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: '',
    fitnessGoal: ''
  });

  const fitnessGoals = [
    '체중 감량',
    '근력 증진',
    '체력 향상',
    '근육량 증가',
    '전신 밸런스 개선'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalSelect = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoal: goal
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.height || !formData.weight || !formData.gender || !formData.fitnessGoal) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    // 사용자 정보 저장
    const userInfo = {
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      gender: formData.gender,
      fitnessGoal: formData.fitnessGoal
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // 초기 체중 기록
    const weightRecord = {
      id: Date.now().toString(),
      weight: parseFloat(formData.weight),
      date: new Date().toISOString()
    };

    const existingRecords = JSON.parse(localStorage.getItem('weightRecords') || '[]');
    existingRecords.push(weightRecord);
    localStorage.setItem('weightRecords', JSON.stringify(existingRecords));

    navigate('/home');
  };

  return (
    <div className="userinfo-container">
      <div className="userinfo-card">
        <h1>사용자 정보 입력</h1>
        <p>더 나은 운동 경험을 위해 정보를 입력해주세요</p>
        
        <form onSubmit={handleSubmit} className="userinfo-form">
          <div className="form-group">
            <label htmlFor="height">키 (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="170"
              min="100"
              max="250"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">몸무게 (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="65"
              min="30"
              max="200"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">성별을 선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          <div className="form-group">
            <label>운동 목적</label>
            <div className="goal-options">
              {fitnessGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`goal-option ${formData.fitnessGoal === goal ? 'selected' : ''}`}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button">
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo; 