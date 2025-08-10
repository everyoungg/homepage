import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PoseAnalysis, WorkoutTip } from '../types';
import '../styles/AdvancedChat.css';

interface AdvancedChatProps {
  onNavigate: (path: string) => void;
}

const AdvancedChat: React.FC<AdvancedChatProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '안녕하세요! FitBuddy AI 트레이너입니다. 🏃‍♂️\n\n오늘은 어떤 운동을 도와드릴까요?\n• 자세 분석 및 피드백\n• 운동 방법 가이드\n• 개인 맞춤 운동 추천\n• 건강 관리 팁',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 운동 팁 데이터
  const workoutTips: WorkoutTip[] = [
    {
      id: '1',
      category: 'beginner',
      title: '초보자를 위한 운동 가이드',
      content: '처음 운동을 시작하는 분들을 위한 기본 가이드입니다. 천천히 시작해서 점진적으로 강도를 높여가세요.',
      difficulty: 'beginner',
      tags: ['초보자', '기본', '안전']
    },
    {
      id: '2',
      category: 'posture',
      title: '올바른 자세의 중요성',
      content: '올바른 자세는 부상 예방과 운동 효과를 높이는 핵심입니다. 각 운동의 정확한 자세를 익혀보세요.',
      difficulty: 'beginner',
      tags: ['자세', '부상예방', '효과']
    },
    {
      id: '3',
      category: 'recovery',
      title: '운동 후 회복 방법',
      content: '운동 후 적절한 회복은 다음 운동을 위한 준비입니다. 스트레칭과 휴식을 충분히 취하세요.',
      difficulty: 'beginner',
      tags: ['회복', '스트레칭', '휴식']
    }
  ];

  // AI 응답 생성 함수
  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 자세 분석 관련
    if (lowerMessage.includes('자세') || lowerMessage.includes('분석')) {
      if (lowerMessage.includes('스쿼트')) {
        return {
          id: Date.now().toString(),
          text: '스쿼트 자세 분석을 도와드리겠습니다! 🦵\n\n**주요 체크 포인트:**\n• 무릎 각도: 90-120도\n• 무릎이 발끝을 넘지 않기\n• 등을 곧게 펴기\n• 발꿈치를 바닥에서 떼지 않기\n\n실시간 자세 분석을 원하시면 운동 세션을 시작해보세요!',
          isUser: false,
          timestamp: new Date(),
          type: 'exercise_feedback',
          metadata: { exerciseId: 'squats', feedbackType: 'posture_analysis' }
        };
      }
      if (lowerMessage.includes('푸시업')) {
        return {
          id: Date.now().toString(),
          text: '푸시업 자세 분석을 도와드리겠습니다! 💪\n\n**주요 체크 포인트:**\n• 팔꿈치 각도: 90도\n• 몸을 일직선으로 유지\n• 팔꿈치를 몸에 가깝게\n• 가슴을 바닥에 가깝게\n\nAI가 실시간으로 자세를 분석해드립니다!',
          isUser: false,
          timestamp: new Date(),
          type: 'exercise_feedback',
          metadata: { exerciseId: 'push_ups', feedbackType: 'posture_analysis' }
        };
      }
      if (lowerMessage.includes('플랭크')) {
        return {
          id: Date.now().toString(),
          text: '플랭크 자세 분석을 도와드리겠습니다! 📏\n\n**주요 체크 포인트:**\n• 몸을 일직선으로 유지\n• 팔꿈치 90도 유지\n• 복근에 힘 주기\n• 엉덩이가 올라가지 않도록\n\n실시간 자세 점수를 확인해보세요!',
          isUser: false,
          timestamp: new Date(),
          type: 'pose_analysis',
          metadata: { exerciseId: 'plank', feedbackType: 'posture_analysis' }
        };
      }
      return {
        id: Date.now().toString(),
        text: '자세 분석에 대해 궁금하시군요! 🎯\n\n**지원하는 운동:**\n• 스쿼트 - 무릎 각도, 등 자세\n• 푸시업 - 팔꿈치 각도, 몸 정렬\n• 플랭크 - 몸 정렬, 팔꿈치 각도\n\n어떤 운동의 자세를 분석하고 싶으신가요?',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // 관절 관련
    if (lowerMessage.includes('관절') || lowerMessage.includes('각도')) {
      return {
        id: Date.now().toString(),
        text: '관절 각도 분석에 대해 설명드리겠습니다! 🔍\n\n**분석하는 관절:**\n• 무릎: 스쿼트 시 90-120도\n• 팔꿈치: 푸시업 시 90도\n• 몸 정렬: 일직선 유지\n\n**측정 방법:**\nAI가 카메라로 실시간 관절 각도를 측정하고 피드백을 제공합니다.',
        isUser: false,
        timestamp: new Date(),
        type: 'pose_analysis',
        metadata: { feedbackType: 'joint_analysis' }
      };
    }

    // 운동 추천
    if (lowerMessage.includes('추천') || lowerMessage.includes('운동')) {
      if (lowerMessage.includes('초보자') || lowerMessage.includes('처음')) {
        return {
          id: Date.now().toString(),
          text: '초보자를 위한 운동을 추천해드리겠습니다! 🌟\n\n**추천 운동:**\n• 스쿼트: 하체 근력 강화\n• 플랭크: 코어 안정성\n• 벽 푸시업: 상체 근력\n\n**운동 순서:**\n1. 스트레칭 (5분)\n2. 스쿼트 10회 × 3세트\n3. 플랭크 30초 × 3세트\n4. 벽 푸시업 10회 × 3세트\n\n천천히 시작해서 점진적으로 늘려가세요!',
          isUser: false,
          timestamp: new Date(),
          type: 'workout_tip',
          metadata: { feedbackType: 'workout_recommendation' }
        };
      }
      if (lowerMessage.includes('체중') || lowerMessage.includes('다이어트')) {
        return {
          id: Date.now().toString(),
          text: '체중 감량을 위한 운동을 추천해드리겠습니다! 🏃‍♀️\n\n**유산소 운동:**\n• 조깅: 30분\n• 자전거: 45분\n• 수영: 30분\n\n**근력 운동:**\n• 스쿼트: 15회 × 4세트\n• 푸시업: 12회 × 4세트\n• 플랭크: 45초 × 4세트\n\n**운동 빈도:** 주 4-5회\n**운동 시간:** 45-60분\n\n칼로리 소모와 근력 향상을 동시에!',
          isUser: false,
          timestamp: new Date(),
          type: 'workout_tip',
          metadata: { feedbackType: 'weight_loss_workout' }
        };
      }
    }

    // 부상 예방
    if (lowerMessage.includes('부상') || lowerMessage.includes('다치') || lowerMessage.includes('아프')) {
      return {
        id: Date.now().toString(),
        text: '부상 예방에 대해 알려드리겠습니다! 🛡️\n\n**부상 예방 수칙:**\n• 운동 전후 스트레칭 필수\n• 점진적 강도 증가\n• 올바른 자세 유지\n• 충분한 휴식\n\n**주의사항:**\n• 통증 시 즉시 운동 중단\n• 전문가와 상담\n• 개인 수준에 맞는 운동\n\n**스트레칭 가이드:**\n• 동적 스트레칭 (운동 전)\n• 정적 스트레칭 (운동 후)\n• 각 동작 15-30초 유지',
        isUser: false,
          timestamp: new Date(),
          type: 'workout_tip',
          metadata: { feedbackType: 'injury_prevention' }
      };
    }

    // 기본 응답
    return {
      id: Date.now().toString(),
      text: '좋은 질문이네요! 🤔\n\n**도움을 받을 수 있는 영역:**\n• 운동 자세 분석 및 피드백\n• 개인 맞춤 운동 추천\n• 부상 예방 및 회복 방법\n• 운동 효과 향상 팁\n\n어떤 부분에 대해 더 자세히 알고 싶으신가요?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI 응답 생성 (1-2초 지연)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'posture':
        message = '운동 자세 분석에 대해 알려주세요';
        break;
      case 'joints':
        message = '관절 각도 분석은 어떻게 하나요?';
        break;
      case 'recommend':
        message = '초보자를 위한 운동을 추천해주세요';
        break;
      case 'injury':
        message = '부상 예방 방법을 알려주세요';
        break;
    }
    
    if (message) {
      setInputText(message);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  return (
    <div className="advanced-chat-container">
      <div className="chat-header">
        <button onClick={() => onNavigate('/home')} className="back-btn">
          ←
        </button>
        <h1>FitBuddy AI 트레이너</h1>
        <div className="header-subtitle">실시간 자세 분석 & 맞춤 피드백</div>
      </div>

      {/* 빠른 액션 버튼 */}
      <div className="quick-actions">
        <button onClick={() => handleQuickAction('posture')} className="quick-action-btn">
          🎯 자세 분석
        </button>
        <button onClick={() => handleQuickAction('joints')} className="quick-action-btn">
          🔍 관절 분석
        </button>
        <button onClick={() => handleQuickAction('recommend')} className="quick-action-btn">
          💪 운동 추천
        </button>
        <button onClick={() => handleQuickAction('injury')} className="quick-action-btn">
          🛡️ 부상 예방
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'} ${message.type}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, index) => (
                <div key={index} className="message-line">
                  {line}
                </div>
              ))}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {message.type !== 'text' && (
              <div className="message-type-indicator">
                {message.type === 'exercise_feedback' && '🎯'}
                {message.type === 'pose_analysis' && '📊'}
                {message.type === 'workout_tip' && '💡'}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="운동에 관한 질문을 입력하세요... (자세, 관절, 추천 등)"
          className="message-input"
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="send-button"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default AdvancedChat; 