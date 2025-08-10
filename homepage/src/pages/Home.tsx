import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/Home.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightData, setWeightData] = useState<any>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const weightRecords = JSON.parse(localStorage.getItem('weightRecords') || '[]');

    if (storedName) {
      setUserName(storedName);
    }

    if (userInfo.weight) {
      setCurrentWeight(userInfo.weight);
    }

    if (weightRecords.length > 0) {
      const chartData = {
        labels: weightRecords.map((record: any) => {
          const date = new Date(record.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: '체중 (kg)',
            data: weightRecords.map((record: any) => record.weight),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          }
        ]
      };
      setWeightData(chartData);
    }
  }, []);

  const handleWorkoutClick = () => {
    navigate('/workout-categories');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const addWeightRecord = () => {
    const newWeight = prompt('현재 체중을 입력해주세요 (kg):');
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      const weightRecord = {
        id: Date.now().toString(),
        weight: parseFloat(newWeight),
        date: new Date().toISOString()
      };

      const existingRecords = JSON.parse(localStorage.getItem('weightRecords') || '[]');
      existingRecords.push(weightRecord);
      localStorage.setItem('weightRecords', JSON.stringify(existingRecords));

      setCurrentWeight(parseFloat(newWeight));
      
      // 차트 데이터 업데이트
      const chartData = {
        labels: existingRecords.map((record: any) => {
          const date = new Date(record.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: '체중 (kg)',
            data: existingRecords.map((record: any) => record.weight),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          }
        ]
      };
      setWeightData(chartData);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="logo-section">
          <div className="robot-logo">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              {/* 로봇 머리 */}
              <rect x="15" y="10" width="30" height="25" rx="5" stroke="white" strokeWidth="2" fill="none"/>
              {/* 로봇 몸체 */}
              <rect x="20" y="35" width="20" height="20" rx="3" stroke="white" strokeWidth="2" fill="none"/>
              {/* 눈 */}
              <circle cx="25" cy="22" r="2" fill="white"/>
              <circle cx="35" cy="22" r="2" fill="white"/>
              {/* 입 */}
              <path d="M 28 28 Q 30 30 32 28" stroke="white" strokeWidth="2" fill="none"/>
              {/* 안테나 */}
              <line x1="30" y1="10" x2="30" y2="5" stroke="white" strokeWidth="2"/>
              <circle cx="30" cy="5" r="1.5" fill="white"/>
              {/* 팔 */}
              <line x1="20" y1="40" x2="15" y2="45" stroke="white" strokeWidth="2"/>
              <line x1="40" y1="40" x2="45" y2="35" stroke="white" strokeWidth="2"/>

            </svg>
          </div>
          <div className="brand-text">
            <h1>안녕하세요, {userName}님!</h1>
            <p>오늘도 건강한 하루 되세요 💪</p>
          </div>
        </div>
      </div>

      <div className="weight-section">
        <div className="weight-info">
          <h2>현재 체중</h2>
          <div className="current-weight">
            <span className="weight-number">{currentWeight}</span>
            <span className="weight-unit">kg</span>
          </div>
          <button onClick={addWeightRecord} className="add-weight-btn">
            체중 기록하기
          </button>
        </div>

        {weightData && (
          <div className="weight-chart">
            <h3>체중 변화 추이</h3>
            <div className="chart-container">
              <Line 
                data={weightData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={handleWorkoutClick} className="workout-btn">
          <div className="btn-icon">🏋️</div>
          <div className="btn-text">
            <h3>운동하기</h3>
            <p>AI와 함께 운동해보세요</p>
          </div>
        </button>

        <button onClick={handleChatClick} className="chat-btn">
          <div className="btn-icon">💬</div>
          <div className="btn-text">
            <h3>채팅하기</h3>
            <p>운동 관련 질문을 해보세요</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home; 