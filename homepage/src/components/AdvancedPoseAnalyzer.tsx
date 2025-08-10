import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmark, JointAngle, PoseAnalysis } from '../types';

interface AdvancedPoseAnalyzerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  exerciseId: string;
  onAnalysisUpdate: (analysis: PoseAnalysis) => void;
  isActive: boolean;
}

const AdvancedPoseAnalyzer: React.FC<AdvancedPoseAnalyzerProps> = ({
  videoRef,
  canvasRef,
  exerciseId,
  onAnalysisUpdate,
  isActive
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const animationFrameRef = useRef<number>();

  // 관절 각도 계산 함수
  const calculateAngle = (p1: PoseLandmark, p2: PoseLandmark, p3: PoseLandmark): number => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  // 스쿼트 자세 분석
  const analyzeSquatPose = useCallback((landmarks: PoseLandmark[]) => {
    const LEFT_HIP = 23;
    const LEFT_KNEE = 25;
    const LEFT_ANKLE = 27;
    const RIGHT_HIP = 24;
    const RIGHT_KNEE = 26;
    const RIGHT_ANKLE = 28;
    const LEFT_SHOULDER = 11;
    const RIGHT_SHOULDER = 12;

    const lh = landmarks[LEFT_HIP];
    const lk = landmarks[LEFT_KNEE];
    const la = landmarks[LEFT_ANKLE];
    const rh = landmarks[RIGHT_HIP];
    const rk = landmarks[RIGHT_KNEE];
    const ra = landmarks[RIGHT_ANKLE];
    const ls = landmarks[LEFT_SHOULDER];
    const rs = landmarks[RIGHT_SHOULDER];

    let score = 0;
    const feedback: string[] = [];
    const jointAngles: JointAngle[] = [];

    // 무릎 각도 분석 (90-120도가 적정)
    const leftKneeAngle = calculateAngle(lh, lk, la);
    const rightKneeAngle = calculateAngle(rh, rk, ra);
    
    if (leftKneeAngle >= 90 && leftKneeAngle <= 120) {
      score += 25;
      jointAngles.push({
        joint: 'left_knee',
        angle: leftKneeAngle,
        isCorrect: true,
        feedback: '완벽한 무릎 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'left_knee',
        angle: leftKneeAngle,
        isCorrect: false,
        feedback: '무릎을 90-120도로 구부려주세요.'
      });
      feedback.push('무릎을 더 깊게 구부려주세요.');
    }

    if (rightKneeAngle >= 90 && rightKneeAngle <= 120) {
      score += 25;
      jointAngles.push({
        joint: 'right_knee',
        angle: rightKneeAngle,
        isCorrect: true,
        feedback: '완벽한 무릎 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'right_knee',
        angle: rightKneeAngle,
        isCorrect: false,
        feedback: '무릎을 90-120도로 구부려주세요.'
      });
    }

    // 무릎이 발끝을 넘지 않는지 확인
    const leftKneeOverToe = lk.x > la.x;
    const rightKneeOverToe = rk.x > ra.x;
    
    if (!leftKneeOverToe && !rightKneeOverToe) {
      score += 25;
    } else {
      feedback.push('무릎이 발끝을 넘지 않도록 하세요.');
    }

    // 등이 곧은지 확인
    const backStraight = Math.abs(lh.y - ls.y) < 0.1 && Math.abs(rh.y - rs.y) < 0.1;
    if (backStraight) {
      score += 25;
    } else {
      feedback.push('등을 곧게 펴주세요.');
    }

    // 자세 등급 결정
    let posture: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) posture = 'excellent';
    else if (score >= 70) posture = 'good';
    else if (score >= 50) posture = 'fair';
    else posture = 'poor';

    return {
      score,
      feedback,
      jointAngles,
      posture,
      timestamp: Date.now()
    };
  }, []);

  // 푸시업 자세 분석 (업그레이드)
  const analyzePushupPose = useCallback((landmarks: PoseLandmark[]) => {
    const LEFT_SHOULDER = 11;
    const LEFT_ELBOW = 13;
    const LEFT_WRIST = 15;
    const LEFT_HIP = 23;
    const RIGHT_SHOULDER = 12;
    const RIGHT_ELBOW = 14;
    const RIGHT_WRIST = 16;
    const RIGHT_HIP = 24;
    const LEFT_ANKLE = 27;
    const RIGHT_ANKLE = 28;

    const ls = landmarks[LEFT_SHOULDER];
    const le = landmarks[LEFT_ELBOW];
    const lw = landmarks[LEFT_WRIST];
    const lh = landmarks[LEFT_HIP];
    const rs = landmarks[RIGHT_SHOULDER];
    const re = landmarks[RIGHT_ELBOW];
    const rw = landmarks[RIGHT_WRIST];
    const rh = landmarks[RIGHT_HIP];
    const la = landmarks[LEFT_ANKLE];
    const ra = landmarks[RIGHT_ANKLE];

    let score = 0;
    const feedback: string[] = [];
    const jointAngles: JointAngle[] = [];

    // 팔꿈치 각도 분석 (90도가 적정, ±15도 허용)
    const leftElbowAngle = calculateAngle(ls, le, lw);
    const rightElbowAngle = calculateAngle(rs, re, rw);
    
    if (Math.abs(leftElbowAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'left_elbow',
        angle: leftElbowAngle,
        isCorrect: true,
        feedback: '완벽한 팔꿈치 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'left_elbow',
        angle: leftElbowAngle,
        isCorrect: false,
        feedback: leftElbowAngle > 105 ? '팔꿈치를 더 구부려주세요.' : '팔꿈치를 덜 구부려주세요.'
      });
      feedback.push(leftElbowAngle > 105 ? '팔꿈치를 더 깊게 구부려주세요.' : '팔꿈치를 덜 구부려주세요.');
    }

    if (Math.abs(rightElbowAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'right_elbow',
        angle: rightElbowAngle,
        isCorrect: true,
        feedback: '완벽한 팔꿈치 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'right_elbow',
        angle: rightElbowAngle,
        isCorrect: false,
        feedback: rightElbowAngle > 105 ? '팔꿈치를 더 구부려주세요.' : '팔꿈치를 덜 구부려주세요.'
      });
    }

    // 몸이 일직선인지 확인 (어깨-엉덩이-발목 정렬)
    const leftBodyAlignment = Math.abs(ls.y - lh.y) < 0.05 && Math.abs(lh.y - la.y) < 0.05;
    const rightBodyAlignment = Math.abs(rs.y - rh.y) < 0.05 && Math.abs(rh.y - ra.y) < 0.05;
    
    if (leftBodyAlignment && rightBodyAlignment) {
      score += 25;
      jointAngles.push({
        joint: 'body_alignment',
        angle: 0,
        isCorrect: true,
        feedback: '완벽한 몸 정렬입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'body_alignment',
        angle: 0,
        isCorrect: false,
        feedback: '몸을 일직선으로 유지하세요.'
      });
      feedback.push('몸을 일직선으로 유지하세요.');
    }

    // 팔꿈치가 몸에 가까운지 확인 (어깨 너비 내에서)
    const leftElbowPosition = Math.abs(le.x - ls.x) < 0.15;
    const rightElbowPosition = Math.abs(re.x - rs.x) < 0.15;
    
    if (leftElbowPosition && rightElbowPosition) {
      score += 20;
    } else {
      feedback.push('팔꿈치를 어깨 너비 내에서 유지하세요.');
    }

    // 손목 위치 확인 (어깨 아래에 위치)
    const leftWristPosition = Math.abs(lw.x - ls.x) < 0.1;
    const rightWristPosition = Math.abs(rw.x - rs.x) < 0.1;
    
    if (leftWristPosition && rightWristPosition) {
      score += 15;
    } else {
      feedback.push('손목을 어깨 아래에 위치시키세요.');
    }

    let posture: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) posture = 'excellent';
    else if (score >= 70) posture = 'good';
    else if (score >= 50) posture = 'fair';
    else posture = 'poor';

    return {
      score,
      feedback,
      jointAngles,
      posture,
      timestamp: Date.now()
    };
  }, []);

  // 크런치 자세 분석 (새로 추가)
  const analyzeCrunchPose = useCallback((landmarks: PoseLandmark[]) => {
    const LEFT_SHOULDER = 11;
    const LEFT_HIP = 23;
    const LEFT_KNEE = 25;
    const RIGHT_SHOULDER = 12;
    const RIGHT_HIP = 24;
    const RIGHT_KNEE = 26;
    const LEFT_ANKLE = 27;
    const RIGHT_ANKLE = 28;

    const ls = landmarks[LEFT_SHOULDER];
    const lh = landmarks[LEFT_HIP];
    const lk = landmarks[LEFT_KNEE];
    const la = landmarks[LEFT_ANKLE];
    const rs = landmarks[RIGHT_SHOULDER];
    const rh = landmarks[RIGHT_HIP];
    const rk = landmarks[RIGHT_KNEE];
    const ra = landmarks[RIGHT_ANKLE];

    let score = 0;
    const feedback: string[] = [];
    const jointAngles: JointAngle[] = [];

    // 무릎 각도 분석 (90도가 적정)
    const leftKneeAngle = calculateAngle(lh, lk, la);
    const rightKneeAngle = calculateAngle(rh, rk, ra);
    
    if (Math.abs(leftKneeAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'left_knee',
        angle: leftKneeAngle,
        isCorrect: true,
        feedback: '완벽한 무릎 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'left_knee',
        angle: leftKneeAngle,
        isCorrect: false,
        feedback: '무릎을 90도로 구부려주세요.'
      });
      feedback.push('무릎을 90도로 구부려주세요.');
    }

    if (Math.abs(rightKneeAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'right_knee',
        angle: rightKneeAngle,
        isCorrect: true,
        feedback: '완벽한 무릎 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'right_knee',
        angle: rightKneeAngle,
        isCorrect: false,
        feedback: '무릎을 90도로 구부려주세요.'
      });
    }

    // 상체 각도 분석 (복근 수축 확인)
    const leftTorsoAngle = calculateAngle(ls, lh, lk);
    const rightTorsoAngle = calculateAngle(rs, rh, rk);
    
    // 크런치에서 상체는 30-60도 정도 구부러져야 함
    if (leftTorsoAngle >= 30 && leftTorsoAngle <= 60) {
      score += 25;
      jointAngles.push({
        joint: 'left_torso',
        angle: leftTorsoAngle,
        isCorrect: true,
        feedback: '완벽한 상체 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'left_torso',
        angle: leftTorsoAngle,
        isCorrect: false,
        feedback: leftTorsoAngle > 60 ? '상체를 더 구부려주세요.' : '상체를 덜 구부려주세요.'
      });
      feedback.push(leftTorsoAngle > 60 ? '상체를 더 구부려주세요.' : '상체를 덜 구부려주세요.');
    }

    if (rightTorsoAngle >= 30 && rightTorsoAngle <= 60) {
      score += 25;
      jointAngles.push({
        joint: 'right_torso',
        angle: rightTorsoAngle,
        isCorrect: true,
        feedback: '완벽한 상체 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'right_torso',
        angle: rightTorsoAngle,
        isCorrect: false,
        feedback: rightTorsoAngle > 60 ? '상체를 더 구부려주세요.' : '상체를 덜 구부려주세요.'
      });
    }

    // 발 위치 확인 (바닥에 고정)
    const feetOnGround = la.y > 0.9 && ra.y > 0.9;
    if (feetOnGround) {
      score += 10;
    } else {
      feedback.push('발을 바닥에 고정하세요.');
    }

    let posture: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) posture = 'excellent';
    else if (score >= 70) posture = 'good';
    else if (score >= 50) posture = 'fair';
    else posture = 'poor';

    return {
      score,
      feedback,
      jointAngles,
      posture,
      timestamp: Date.now()
    };
  }, []);

  // 업라이트로우 자세 분석 (새로 추가)
  const analyzeUprightRowPose = useCallback((landmarks: PoseLandmark[]) => {
    const LEFT_SHOULDER = 11;
    const LEFT_ELBOW = 13;
    const LEFT_WRIST = 15;
    const LEFT_HIP = 23;
    const RIGHT_SHOULDER = 12;
    const RIGHT_ELBOW = 14;
    const RIGHT_WRIST = 16;
    const RIGHT_HIP = 24;

    const ls = landmarks[LEFT_SHOULDER];
    const le = landmarks[LEFT_ELBOW];
    const lw = landmarks[LEFT_WRIST];
    const lh = landmarks[LEFT_HIP];
    const rs = landmarks[RIGHT_SHOULDER];
    const re = landmarks[RIGHT_ELBOW];
    const rw = landmarks[RIGHT_WRIST];
    const rh = landmarks[RIGHT_HIP];

    let score = 0;
    const feedback: string[] = [];
    const jointAngles: JointAngle[] = [];

    // 팔꿈치 각도 분석 (90도가 적정)
    const leftElbowAngle = calculateAngle(ls, le, lw);
    const rightElbowAngle = calculateAngle(rs, re, rw);
    
    if (Math.abs(leftElbowAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'left_elbow',
        angle: leftElbowAngle,
        isCorrect: true,
        feedback: '완벽한 팔꿈치 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'left_elbow',
        angle: leftElbowAngle,
        isCorrect: false,
        feedback: '팔꿈치를 90도로 유지하세요.'
      });
      feedback.push('팔꿈치를 90도로 유지하세요.');
    }

    if (Math.abs(rightElbowAngle - 90) <= 15) {
      score += 20;
      jointAngles.push({
        joint: 'right_elbow',
        angle: rightElbowAngle,
        isCorrect: true,
        feedback: '완벽한 팔꿈치 각도입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'right_elbow',
        angle: rightElbowAngle,
        isCorrect: false,
        feedback: '팔꿈치를 90도로 유지하세요.'
      });
    }

    // 어깨 높이 확인 (어깨 높이까지 올리기)
    const leftShoulderHeight = ls.y < lh.y - 0.1;
    const rightShoulderHeight = rs.y < rh.y - 0.1;
    
    if (leftShoulderHeight && rightShoulderHeight) {
      score += 25;
      jointAngles.push({
        joint: 'shoulder_height',
        angle: 0,
        isCorrect: true,
        feedback: '완벽한 어깨 높이입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'shoulder_height',
        angle: 0,
        isCorrect: false,
        feedback: '어깨를 더 높이 올려주세요.'
      });
      feedback.push('어깨를 더 높이 올려주세요.');
    }

    // 팔꿈치가 몸에 가까운지 확인
    const leftElbowClose = Math.abs(le.x - ls.x) < 0.1;
    const rightElbowClose = Math.abs(re.x - rs.x) < 0.1;
    
    if (leftElbowClose && rightElbowClose) {
      score += 20;
    } else {
      feedback.push('팔꿈치를 몸에 가깝게 유지하세요.');
    }

    // 등이 곧은지 확인
    const backStraight = Math.abs(lh.y - ls.y) < 0.05 && Math.abs(rh.y - rs.y) < 0.05;
    if (backStraight) {
      score += 15;
    } else {
      feedback.push('등을 곧게 펴주세요.');
    }

    let posture: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) posture = 'excellent';
    else if (score >= 70) posture = 'good';
    else if (score >= 50) posture = 'fair';
    else posture = 'poor';

    return {
      score,
      feedback,
      jointAngles,
      posture,
      timestamp: Date.now()
    };
  }, []);

  // 플랭크 자세 분석 (기존 코드 개선)
  const analyzePlankPose = useCallback((landmarks: PoseLandmark[]) => {
    const LEFT_SHOULDER = 11;
    const LEFT_HIP = 23;
    const LEFT_ANKLE = 27;
    const RIGHT_SHOULDER = 12;
    const RIGHT_HIP = 24;
    const RIGHT_ANKLE = 28;

    const ls = landmarks[LEFT_SHOULDER];
    const lh = landmarks[LEFT_HIP];
    const la = landmarks[LEFT_ANKLE];
    const rs = landmarks[RIGHT_SHOULDER];
    const rh = landmarks[RIGHT_HIP];
    const ra = landmarks[RIGHT_ANKLE];

    let score = 0;
    const feedback: string[] = [];
    const jointAngles: JointAngle[] = [];

    // 몸이 일직선인지 확인
    const leftAlignment = Math.abs(ls.y - lh.y) < 0.05 && Math.abs(lh.y - la.y) < 0.05;
    const rightAlignment = Math.abs(rs.y - rh.y) < 0.05 && Math.abs(rh.y - ra.y) < 0.05;
    
    if (leftAlignment && rightAlignment) {
      score += 30;
      jointAngles.push({
        joint: 'body_alignment',
        angle: 0,
        isCorrect: true,
        feedback: '완벽한 몸 정렬입니다!'
      });
    } else {
      jointAngles.push({
        joint: 'body_alignment',
        angle: 0,
        isCorrect: false,
        feedback: '몸을 일직선으로 유지하세요.'
      });
      feedback.push('몸을 일직선으로 유지하세요.');
    }

    // 스쿼트에서는 팔꿈치 각도 분석을 하지 않음 (팔을 앞으로 뻗는 동작이므로)

    // 엉덩이 높이 확인
    const hipTooHigh = (lh.y < ls.y - 0.05) || (rh.y < rs.y - 0.05);
    if (!hipTooHigh) {
      score += 20;
    } else {
      feedback.push('엉덩이가 올라가지 않도록 하세요.');
    }

    let posture: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) posture = 'excellent';
    else if (score >= 70) posture = 'good';
    else if (score >= 50) posture = 'fair';
    else posture = 'poor';

    return {
      score,
      feedback,
      jointAngles,
      posture,
      timestamp: Date.now()
    };
  }, []);

  // 자세 분석 실행
  const runPoseAnalysis = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 여기서 실제 MediaPipe Pose 모델을 사용하여 랜드마크를 추출해야 합니다
    // 현재는 시뮬레이션된 데이터를 사용합니다
    const mockLandmarks: PoseLandmark[] = Array.from({ length: 33 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      visibility: Math.random()
    }));

    let analysis: PoseAnalysis;
    
    switch (exerciseId) {
      case 'squats':
        analysis = analyzeSquatPose(mockLandmarks);
        break;
      case 'push_ups':
        analysis = analyzePushupPose(mockLandmarks);
        break;
      case 'plank':
        analysis = analyzePlankPose(mockLandmarks);
        break;
      case 'crunch':
        analysis = analyzeCrunchPose(mockLandmarks);
        break;
      case 'upright_row':
        analysis = analyzeUprightRowPose(mockLandmarks);
        break;
      default:
        analysis = {
          score: 0,
          feedback: ['이 운동에 대한 자세 분석이 지원되지 않습니다.'],
          jointAngles: [],
          posture: 'poor',
          timestamp: Date.now()
        };
    }

    onAnalysisUpdate(analysis);

    // 다음 프레임 분석 예약
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(runPoseAnalysis);
    }
  }, [exerciseId, isActive, onAnalysisUpdate, analyzeSquatPose, analyzePushupPose, analyzePlankPose, videoRef, canvasRef]);

  useEffect(() => {
    if (isActive && exerciseId) {
      runPoseAnalysis();
    }
  }, [isActive, exerciseId, runPoseAnalysis]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고 분석만 수행
};

export default AdvancedPoseAnalyzer; 