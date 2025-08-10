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
  type: 'text' | 'exercise_feedback' | 'pose_analysis' | 'workout_tip';
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