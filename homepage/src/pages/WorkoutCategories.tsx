import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WorkoutCategories.css';

const WorkoutCategories: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'fullbody',
      name: '전신',
      icon: '🏃‍♂️',
      description: '전신을 골고루 운동'
    },
    {
      id: 'upperbody',
      name: '상체',
      icon: '💪',
      description: '상체 근육 운동'
    },
    {
      id: 'lowerbody',
      name: '하체',
      icon: '🦵',
      description: '하체 근육 운동'
    },
    {
      id: 'abs',
      name: '복부',
      icon: '🫁',
      description: '복근, 코어 운동'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/workout-exercises/${categoryId}`);
  };

  return (
    <div className="workout-categories-container">
      <div className="categories-header">
        <h1>운동 카테고리</h1>
        <p>원하는 부위를 선택해주세요</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="category-arrow">→</div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/home')} 
        className="back-button"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default WorkoutCategories; 