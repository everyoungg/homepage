import React, { useState, useEffect } from 'react';
import { PoseAnalysis, JointAngle } from '../types';
import '../styles/AdvancedFeedback.css';

interface AdvancedFeedbackDisplayProps {
  poseAnalysis: PoseAnalysis | null;
  exerciseId: string;
  isActive: boolean;
}

const AdvancedFeedbackDisplay: React.FC<AdvancedFeedbackDisplayProps> = ({
  poseAnalysis,
  exerciseId,
  isActive
}) => {
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  const [showJointDetails, setShowJointDetails] = useState(false);

  useEffect(() => {
    if (poseAnalysis && poseAnalysis.feedback.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex(prev => 
          (prev + 1) % poseAnalysis.feedback.length
        );
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [poseAnalysis]);

  if (!poseAnalysis) {
    return (
      <div className="feedback-container">
        <div className="feedback-placeholder">
          <div className="placeholder-icon">🎯</div>
          <h3>자세 분석 대기 중</h3>
          <p>운동을 시작하면 AI가 실시간으로 자세를 분석하고 피드백을 제공합니다.</p>
        </div>
      </div>
    );
  }

  const getPostureColor = (posture: string) => {
    switch (posture) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getPostureText = (posture: string) => {
    switch (posture) {
      case 'excellent': return '완벽!';
      case 'good': return '좋음';
      case 'fair': return '보통';
      case 'poor': return '개선 필요';
      default: return '분석 중';
    }
  };

  const getJointIcon = (joint: string) => {
    switch (joint) {
      case 'left_knee':
      case 'right_knee': return '🦵';
      case 'left_elbow':
      case 'right_elbow': return '💪';
      case 'body_alignment': return '📏';
      default: return '🔗';
    }
  };

  return (
    <div className="feedback-container">
      {/* 점수 및 등급 표시 */}
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: getPostureColor(poseAnalysis.posture) }}>
          <span className="score-number">{poseAnalysis.score}</span>
          <span className="score-label">점</span>
        </div>
        <div className="posture-grade">
          <span 
            className="grade-badge"
            style={{ backgroundColor: getPostureColor(poseAnalysis.posture) }}
          >
            {getPostureText(poseAnalysis.posture)}
          </span>
        </div>
      </div>

      {/* 현재 피드백 메시지 */}
      <div className="current-feedback">
        <h3>실시간 피드백</h3>
        <div className="feedback-message">
          {poseAnalysis.feedback[currentFeedbackIndex] || '자세를 분석하고 있습니다...'}
        </div>
        {poseAnalysis.feedback.length > 1 && (
          <div className="feedback-indicator">
            {poseAnalysis.feedback.map((_, index) => (
              <span 
                key={index}
                className={`indicator-dot ${index === currentFeedbackIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 관절 상세 정보 */}
      <div className="joint-details-section">
        <button 
          className="toggle-joint-details"
          onClick={() => setShowJointDetails(!showJointDetails)}
        >
          {showJointDetails ? '관절 정보 숨기기' : '관절 정보 보기'} 
          <span className="toggle-icon">{showJointDetails ? '▲' : '▼'}</span>
        </button>
        
        {showJointDetails && (
          <div className="joint-details">
            <h4>관절별 분석</h4>
            <div className="joint-list">
              {poseAnalysis.jointAngles.map((joint, index) => (
                <div 
                  key={index} 
                  className={`joint-item ${joint.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="joint-header">
                    <span className="joint-icon">{getJointIcon(joint.joint)}</span>
                    <span className="joint-name">
                      {joint.joint === 'left_knee' ? '왼쪽 무릎' :
                       joint.joint === 'right_knee' ? '오른쪽 무릎' :
                       joint.joint === 'left_elbow' ? '왼쪽 팔꿈치' :
                       joint.joint === 'right_elbow' ? '오른쪽 팔꿈치' :
                       joint.joint === 'body_alignment' ? '몸 정렬' : joint.joint}
                    </span>
                    <span className={`joint-status ${joint.isCorrect ? 'correct' : 'incorrect'}`}>
                      {joint.isCorrect ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="joint-info">
                    {joint.angle > 0 && (
                      <span className="joint-angle">각도: {joint.angle.toFixed(1)}°</span>
                    )}
                    <span className="joint-feedback">{joint.feedback}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 운동별 특화 피드백 */}
      <div className="exercise-specific-feedback">
        <h4>{exerciseId === 'squats' ? '스쿼트' : 
              exerciseId === 'push_ups' ? '푸시업' :
              exerciseId === 'plank' ? '플랭크' : '운동'} 특화 팁</h4>
        <div className="tips-container">
          {exerciseId === 'squats' && (
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span className="tip-text">무릎이 발끝을 넘지 않도록 주의하세요</span>
            </div>
          )}
          {exerciseId === 'push_ups' && (
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span className="tip-text">팔꿈치를 90도로 구부려 가슴을 바닥에 가깝게</span>
            </div>
          )}
          {exerciseId === 'plank' && (
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span className="tip-text">몸을 일직선으로 유지하고 복근에 힘을 주세요</span>
            </div>
          )}
        </div>
      </div>

      {/* 진행률 표시 */}
      {isActive && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${poseAnalysis.score}%` }}
            />
          </div>
          <span className="progress-text">목표: 90점 이상</span>
        </div>
      )}
    </div>
  );
};

export default AdvancedFeedbackDisplay; 