import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/WorkoutExercises.css';

const WorkoutExercises: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const exercises = {
    fullbody: [
      {
        id: 'plank',
        name: '플랭크',
        description: '전신 안정성과 코어 강화',
        difficulty: '중급',
        duration: '8분'
      },
      {
        id: 'burpees',
        name: '버피테스트',
        description: '전신을 사용하는 고강도 운동',
        difficulty: '고급',
        duration: '10분'
      }
    ],
    upperbody: [
      {
        id: 'push_ups',
        name: '푸시업',
        description: '가슴과 팔을 강화하는 운동',
        difficulty: '중급',
        duration: '12분'
      },
      {
        id: 'upright_row',
        name: '업라이트로우',
        description: '어깨와 상완이두근 강화',
        difficulty: '중급',
        duration: '10분'
      }
    ],
    lowerbody: [
      {
        id: 'squats',
        name: '스쿼트',
        description: '하체 근육을 강화하는 기본 운동',
        difficulty: '초급',
        duration: '15분'
      },
      {
        id: 'side_lunge',
        name: '사이드 런지',
        description: '측면 하체와 균형감각 강화',
        difficulty: '중급',
        duration: '12분'
      }
    ],
    abs: [
      {
        id: 'crunches',
        name: '크런치',
        description: '복근을 집중적으로 강화',
        difficulty: '초급',
        duration: '10분'
      },
      {
        id: 'scissor_cross',
        name: '시저크로스',
        description: '대각선 복근과 코어 강화',
        difficulty: '중급',
        duration: '8분'
      }
    ]
  };

  const categoryNames = {
    fullbody: '전신',
    upperbody: '상체',
    lowerbody: '하체',
    abs: '복부'
  };

  const handleExerciseSelect = (exerciseId: string) => {
    navigate(`/workout-session/${categoryId}/${exerciseId}`);
  };

  const currentExercises = exercises[categoryId as keyof typeof exercises] || [];

  return (
    <div className="workout-exercises-container">
      <div className="exercises-header">
        <h1>{categoryNames[categoryId as keyof typeof categoryNames]} 운동</h1>
        <p>원하는 운동을 선택해주세요</p>
      </div>

      <div className="exercises-grid">
        {currentExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="exercise-card"
            onClick={() => handleExerciseSelect(exercise.id)}
          >
            <div className="exercise-header">
              <h3>{exercise.name}</h3>
              <span className={`difficulty ${exercise.difficulty}`}>
                {exercise.difficulty}
              </span>
            </div>
            <p className="exercise-description">{exercise.description}</p>
            <div className="exercise-footer">
              <span className="duration">⏱️ {exercise.duration}</span>
              <div className="start-button">시작하기</div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/workout-categories')} 
        className="back-button"
      >
        카테고리로 돌아가기
      </button>
    </div>
  );
};

export default WorkoutExercises; 