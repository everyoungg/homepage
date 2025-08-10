export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  fitnessGoal: string;
  createdAt: Date;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weight: number;
  date: Date;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'fullbody' | 'arms' | 'legs' | 'abs' | 'shoulders' | 'chest';
  description: string;
  instructions: string[];
  feedbackMessages: string[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  exerciseId: string;
  startTime: Date;
  endTime?: Date;
  feedback: string[];
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseData {
  landmarks: PoseLandmark[];
  timestamp: number;
}

// 새로운 타입들 추가
export interface JointAngle {
  joint: string;
  angle: number;
  isCorrect: boolean;
  feedback: string;
}

export interface PoseAnalysis {
  score: number;
  feedback: string[];
  jointAngles: JointAngle[];
  posture: 'excellent' | 'good' | 'fair' | 'poor';
  timestamp: number;
}

export interface ExerciseFeedback {
  id: string;
  exerciseId: string;
  userId: string;
  sessionId: string;
  poseAnalysis: PoseAnalysis;
  audioFeedback: string;
  visualFeedback: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'exercise_feedback' | 'pose_analysis' | 'workout_tip' | 'workout_recommendation' | 'health_tip';
  metadata?: {
    exerciseId?: string;
    poseScore?: number;
    feedbackType?: string;
  };
}

export interface WorkoutTip {
  id: string;
  category: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

// 음성 인식 관련 타입 추가
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
} 