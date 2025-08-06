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