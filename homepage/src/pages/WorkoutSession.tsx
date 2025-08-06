import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/WorkoutSession.css';


const WorkoutSession: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, exerciseId } = useParams<{ categoryId: string; exerciseId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const exerciseData = {
    plank: {
      name: '플랭크',
      instructions: [
        '팔꿈치와 발끝으로 지지',
        '몸을 일직선으로 유지',
        '복근에 힘을 주어 고정',
        '호흡을 자연스럽게 유지'
      ],
      feedbackMessages: [
        '등을 곧게 펴주세요',
        '복근에 더 힘을 주세요',
        '엉덩이가 올라가지 않도록 하세요',
        '머리를 자연스럽게 유지하세요'
      ]
    },
    burpees: {
      name: '버피테스트',
      instructions: [
        '시작 자세: 서서 시작',
        '스쿼트 자세로 앉기',
        '플랭크 자세로 전환',
        '푸시업 한 번',
        '스쿼트 자세로 돌아가기',
        '점프하며 팔 올리기'
      ],
      feedbackMessages: [
        '무릎을 더 깊게 구부려주세요',
        '등을 곧게 펴주세요',
        '팔꿈치를 몸에 가깝게 유지하세요',
        '점프할 때 팔을 더 높이 올려주세요'
      ]
    },
    push_ups: {
      name: '푸시업',
      instructions: [
        '플랭크 자세로 시작',
        '팔꿈치를 90도로 구부리기',
        '가슴이 바닥에 거의 닿을 때까지 내리기',
        '팔을 펴서 원래 자세로 돌아가기'
      ],
      feedbackMessages: [
        '등을 곧게 펴주세요',
        '팔꿈치를 몸에 가깝게 유지하세요',
        '가슴을 더 깊게 내려주세요',
        '무릎을 바닥에 닿지 않게 하세요'
      ]
    },
    upright_row: {
      name: '업라이트로우',
      instructions: [
        '발을 어깨 너비로 벌리고 서기',
        '덤벨을 앞쪽에 잡기',
        '어깨 높이까지 올리기',
        '천천히 내리기'
      ],
      feedbackMessages: [
        '어깨를 더 높이 올려주세요',
        '팔꿈치를 몸에 가깝게 유지하세요',
        '등을 곧게 펴주세요',
        '천천히 움직여주세요'
      ]
    },
    squats: {
      name: '스쿼트',
      instructions: [
        '발을 어깨 너비로 벌리고 서기',
        '무릎을 구부리며 앉기',
        '대퇴가 바닥과 평행이 되도록',
        '원래 자세로 돌아가기'
      ],
      feedbackMessages: [
        '무릎을 더 깊게 구부려주세요',
        '무릎이 발끝을 넘지 않도록 하세요',
        '등을 곧게 펴주세요',
        '발꿈치를 바닥에서 떼지 마세요'
      ]
    },
    side_lunge: {
      name: '사이드 런지',
      instructions: [
        '서서 시작',
        '한쪽 발을 옆으로 내딛기',
        '무릎을 구부리며 앉기',
        '원래 자세로 돌아가기'
      ],
      feedbackMessages: [
        '무릎을 더 깊게 구부려주세요',
        '등을 곧게 펴주세요',
        '무릎이 발끝을 넘지 않도록 하세요',
        '균형을 잘 잡아주세요'
      ]
    },
    crunches: {
      name: '크런치',
      instructions: [
        '바닥에 누워 무릎 구부리기',
        '손을 머리 뒤에 대기',
        '어깨를 바닥에서 들어올리기',
        '천천히 원래 자세로 돌아가기'
      ],
      feedbackMessages: [
        '목을 더 구부려주세요',
        '어깨를 더 높이 들어올려주세요',
        '발을 바닥에 고정하세요',
        '천천히 움직여주세요'
      ]
    },
    scissor_cross: {
      name: '시저크로스',
      instructions: [
        '바닥에 누워 다리 펴기',
        '한쪽 다리를 들어올리기',
        '반대쪽 팔로 다리 터치하기',
        '다른 쪽으로 반복'
      ],
      feedbackMessages: [
        '다리를 더 높이 올려주세요',
        '팔을 더 멀리 뻗어주세요',
        '등을 바닥에 붙여주세요',
        '천천히 움직여주세요'
      ]
    }
  };

  const currentExercise = exerciseData[exerciseId as keyof typeof exerciseData];

  useEffect(() => {
    if (sessionStartTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionStartTime]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setSessionStartTime(new Date());
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      alert('카메라 접근이 거부되었습니다. 카메라 권한을 확인해주세요.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const generateFeedback = () => {
    if (!currentExercise) return;
    
    const randomIndex = Math.floor(Math.random() * currentExercise.feedbackMessages.length);
    const feedback = currentExercise.feedbackMessages[randomIndex];
    setCurrentFeedback(feedback);
    speakFeedback(feedback);
  };

  const handleStartWorkout = () => {
    startCamera();
    // 3초 후 첫 피드백 시작
    setTimeout(() => {
      generateFeedback();
      // 10초마다 피드백 업데이트
      setInterval(generateFeedback, 10000);
    }, 3000);
  };

  const handleEndWorkout = () => {
    stopCamera();
    navigate('/home');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-session-container">
      <div className="session-header">
        <h1>{currentExercise?.name || '운동'}</h1>
        <div className="session-timer">
          <span>⏱️ {formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="camera-section">
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <canvas
            ref={canvasRef}
            className="pose-canvas"
            width={640}
            height={480}
          />
        </div>
        
        {!isCameraActive && (
          <div className="camera-overlay">
            <p>카메라를 시작하여 AI 피드백을 받아보세요</p>
            <button onClick={handleStartWorkout} className="start-camera-btn">
              카메라 시작
            </button>
          </div>
        )}
      </div>

      <div className="feedback-section">
        <div className="feedback-display">
          <h3>AI 피드백</h3>
          <div className={`feedback-text ${isSpeaking ? 'speaking' : ''}`}>
            {currentFeedback || '운동을 시작하면 AI가 자세를 분석하고 피드백을 제공합니다.'}
          </div>
        </div>
      </div>

      <div className="instructions-section">
        <h3>운동 방법</h3>
        <div className="instructions-list">
          {currentExercise?.instructions.map((instruction, index) => (
            <div key={index} className="instruction-item">
              <span className="instruction-number">{index + 1}</span>
              <span className="instruction-text">{instruction}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="session-controls">
        {isCameraActive ? (
          <button onClick={handleEndWorkout} className="end-workout-btn">
            운동 종료
          </button>
        ) : (
          <button onClick={() => navigate('/workout-exercises/' + categoryId)} className="back-btn">
            뒤로 가기
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutSession; 
