import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PoseAnalysis, WorkoutTip, SpeechRecognition } from '../types';
import '../styles/AdvancedChat.css';

interface AdvancedChatProps {
  onNavigate: (path: string) => void;
}

const AdvancedChat: React.FC<AdvancedChatProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '안녕하세요! FitBuddy AI 트레이너입니다. 🏃‍♂️\n\n오늘은 어떤 운동을 도와드릴까요?\n• 자세 분석 및 피드백\n• 운동 방법 가이드\n• 개인 맞춤 운동 추천\n• 건강 관리 팁\n• 음성으로 대화하기',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fitnessLevel: 'beginner',
    goals: ['weight_loss', 'muscle_gain'],
    preferredExercises: ['squats', 'push_ups'],
    injuries: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 음성 인식 초기화
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // 운동 팁 데이터 확장
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
    },
    {
      id: '4',
      category: 'nutrition',
      title: '운동과 영양의 관계',
      content: '운동 효과를 극대화하려면 적절한 영양 섭취가 필수입니다. 단백질, 탄수화물, 지방의 균형을 맞추세요.',
      difficulty: 'intermediate',
      tags: ['영양', '단백질', '균형']
    },
    {
      id: '5',
      category: 'motivation',
      title: '운동 동기 부여 방법',
      content: '지속적인 운동을 위해서는 동기 부여가 중요합니다. 목표 설정과 성취감을 통해 동기를 유지하세요.',
      difficulty: 'beginner',
      tags: ['동기부여', '목표', '성취감']
    }
  ];

  // AI 응답 생성 함수 확장
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
      if (lowerMessage.includes('크런치')) {
        return {
          id: Date.now().toString(),
          text: '크런치 자세 분석을 도와드리겠습니다! 🫁\n\n**주요 체크 포인트:**\n• 무릎 각도: 90도 ±15도\n• 상체 각도: 30-60도\n• 발을 바닥에 고정\n• 복근에 집중하여 올리기\n\nAI가 실시간으로 자세를 분석해드립니다!',
          isUser: false,
          timestamp: new Date(),
          type: 'exercise_feedback',
          metadata: { exerciseId: 'crunch', feedbackType: 'posture_analysis' }
        };
      }
      if (lowerMessage.includes('업라이트로우')) {
        return {
          id: Date.now().toString(),
          text: '업라이트로우 자세 분석을 도와드리겠습니다! 🏋️\n\n**주요 체크 포인트:**\n• 팔꿈치 각도: 90도 ±15도\n• 어깨 높이까지 올리기\n• 팔꿈치를 몸에 가깝게\n• 등을 곧게 유지\n\nAI가 실시간으로 자세를 분석해드립니다!',
          isUser: false,
          timestamp: new Date(),
          type: 'exercise_feedback',
          metadata: { exerciseId: 'upright_row', feedbackType: 'posture_analysis' }
        };
      }
      return {
        id: Date.now().toString(),
        text: '자세 분석에 대해 궁금하시군요! 🎯\n\n**지원하는 운동:**\n• 스쿼트 - 무릎 각도, 등 자세\n• 푸시업 - 팔꿈치 각도, 몸 정렬\n• 플랭크 - 몸 정렬, 팔꿈치 각도\n• 크런치 - 무릎 각도, 상체 각도\n• 업라이트로우 - 팔꿈치 각도, 어깨 높이\n\n어떤 운동의 자세를 분석하고 싶으신가요?',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // 운동 추천 관련
    if (lowerMessage.includes('추천') || lowerMessage.includes('운동')) {
      if (lowerMessage.includes('초보자') || lowerMessage.includes('처음')) {
        return {
          id: Date.now().toString(),
          text: '초보자를 위한 운동을 추천해드리겠습니다! 🌟\n\n**추천 운동:**\n• 스쿼트 (10회 × 3세트)\n• 플랭크 (30초 × 3세트)\n• 벽 푸시업 (10회 × 3세트)\n• 브리지 (15회 × 3세트)\n\n**운동 순서:**\n1. 준비운동 (5-10분)\n2. 본운동 (20-30분)\n3. 정리운동 (5-10분)\n\n천천히 시작해서 점진적으로 강도를 높여가세요!',
          isUser: false,
          timestamp: new Date(),
          type: 'workout_recommendation'
        };
      }
      if (lowerMessage.includes('다이어트') || lowerMessage.includes('체중감량')) {
        return {
          id: Date.now().toString(),
          text: '체중감량을 위한 운동을 추천해드리겠습니다! 🔥\n\n**추천 운동:**\n• 버피 (10회 × 5세트)\n• 점프 스쿼트 (15회 × 4세트)\n• 마운틴 클라이머 (30초 × 5세트)\n• 런지 (각 다리 10회 × 3세트)\n\n**운동 강도:**\n• 중간~고강도\n• 휴식시간 최소화\n• 총 운동시간: 30-45분\n\n**영양 팁:**\n• 단백질 섭취 증가\n• 탄수화물 조절\n• 충분한 수분 섭취',
          isUser: false,
          timestamp: new Date(),
          type: 'workout_recommendation'
        };
      }
      if (lowerMessage.includes('근력') || lowerMessage.includes('근육')) {
        return {
          id: Date.now().toString(),
          text: '근력 향상을 위한 운동을 추천해드리겠습니다! 💪\n\n**추천 운동:**\n• 푸시업 (15회 × 4세트)\n• 풀업 (8회 × 4세트)\n• 딥스 (12회 × 4세트)\n• 핸드스탠드 푸시업 (5회 × 3세트)\n\n**운동 원칙:**\n• 점진적 과부하\n• 적절한 휴식 (48-72시간)\n• 정확한 자세\n• 충분한 단백질 섭취\n\n**진행 방법:**\n• 2-3일마다 운동\n• 세트당 8-12회\n• 점진적으로 무게/횟수 증가',
          isUser: false,
          timestamp: new Date(),
          type: 'workout_recommendation'
        };
      }
    }

    // 건강 관리 관련
    if (lowerMessage.includes('건강') || lowerMessage.includes('영양') || lowerMessage.includes('식단')) {
      return {
        id: Date.now().toString(),
        text: '건강 관리에 대해 도와드리겠습니다! 🥗\n\n**운동 전 영양:**\n• 운동 2-3시간 전: 탄수화물 + 단백질\n• 운동 1시간 전: 가벼운 간식\n• 운동 중: 수분 보충\n\n**운동 후 영양:**\n• 운동 후 30분 내: 단백질 + 탄수화물\n• 2시간 내: 본격적인 식사\n\n**일일 권장량:**\n• 단백질: 체중 1kg당 1.2-2.0g\n• 탄수화물: 총 칼로리의 45-65%\n• 지방: 총 칼로리의 20-35%\n\n**수분 섭취:**\n• 하루 2-3L\n• 운동 시 추가 500ml-1L',
        isUser: false,
        timestamp: new Date(),
        type: 'health_tip'
      };
    }

    // 부상 예방 관련
    if (lowerMessage.includes('부상') || lowerMessage.includes('아픔') || lowerMessage.includes('통증')) {
      return {
        id: Date.now().toString(),
        text: '부상 예방과 관리에 대해 안내해드리겠습니다! 🚨\n\n**부상 예방 원칙:**\n• 충분한 준비운동 (5-10분)\n• 점진적 강도 증가\n• 정확한 자세 유지\n• 적절한 휴식\n\n**운동 중 주의사항:**\n• 통증이 있으면 즉시 중단\n• 무리한 동작 피하기\n• 호흡 규칙적으로\n\n**부상 시 대처법:**\n• RICE 원칙 적용\n• R: Rest (휴식)\n• I: Ice (얼음)\n• C: Compression (압박)\n• E: Elevation (거상)\n\n**의료진 상담이 필요한 경우:**\n• 심한 통증\n• 부종이나 변형\n• 기능 장애',
        isUser: false,
        timestamp: new Date(),
        type: 'health_tip'
      };
    }

    // 일반적인 대화
    if (lowerMessage.includes('안녕') || lowerMessage.includes('하이')) {
      return {
        id: Date.now().toString(),
        text: '안녕하세요! 오늘도 건강한 하루 되세요! 😊\n\n어떤 도움이 필요하신가요?\n• 운동 자세 분석\n• 맞춤 운동 추천\n• 건강 관리 팁\n• 부상 예방 방법',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // 기본 응답
    return {
      id: Date.now().toString(),
      text: '흥미로운 질문이네요! 🤔\n\n제가 도와드릴 수 있는 것들:\n• 🏃‍♂️ 운동 자세 분석 및 피드백\n• 💪 개인 맞춤 운동 추천\n• 🥗 영양 및 건강 관리 팁\n• 🚨 부상 예방 및 관리\n• 🎯 운동 목표 설정 및 동기 부여\n\n더 구체적으로 말씀해 주시면 더 정확한 답변을 드릴 수 있어요!',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  };

  // 음성 인식 시작/중지
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI 응답 생성 (실제로는 API 호출)
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText);
      setMessages((prev: ChatMessage[]) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // 키보드 이벤트
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 빠른 액션
  const handleQuickAction = (action: string) => {
    const actions = {
      '자세분석': '운동 자세 분석에 대해 궁금하신가요?',
      '운동추천': '어떤 목표의 운동을 원하시나요?',
      '건강팁': '건강 관리에 대해 궁금한 점이 있으신가요?',
      '부상예방': '부상 예방에 대해 안내해드릴까요?'
    };

    if (actions[action as keyof typeof actions]) {
      setInputText(actions[action as keyof typeof actions]);
      handleSendMessage(actions[action as keyof typeof actions]);
    }
  };

  return (
    <div className="advanced-chat-container">
      <div className="chat-header">
        <h2>🤖 FitBuddy AI 트레이너</h2>
        <p>24/7 운동 코칭과 건강 관리</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.type === 'text' && (
                <div className="text-message">
                  {message.text.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
              {message.type === 'exercise_feedback' && (
                <div className="exercise-feedback">
                  <div className="feedback-header">🏃‍♂️ 운동 피드백</div>
                  <div className="feedback-content">
                    {message.text.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => onNavigate('/workout-session')}
                  >
                    운동 시작하기
                  </button>
                </div>
              )}
              {message.type === 'workout_recommendation' && (
                <div className="workout-recommendation">
                  <div className="recommendation-header">💪 운동 추천</div>
                  <div className="recommendation-content">
                    {message.text.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
              {message.type === 'health_tip' && (
                <div className="health-tip">
                  <div className="tip-header">💡 건강 팁</div>
                  <div className="tip-content">
                    {message.text.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
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

      <div className="quick-actions">
        <button onClick={() => handleQuickAction('자세분석')} className="quick-action-btn">
          🎯 자세분석
        </button>
        <button onClick={() => handleQuickAction('운동추천')} className="quick-action-btn">
          💪 운동추천
        </button>
        <button onClick={() => handleQuickAction('건강팁')} className="quick-action-btn">
          💡 건강팁
        </button>
        <button onClick={() => handleQuickAction('부상예방')} className="quick-action-btn">
          🚨 부상예방
        </button>
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하거나 음성으로 말해보세요..."
            className="chat-input"
            rows={1}
          />
          <button
            onClick={toggleVoiceRecognition}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title={isListening ? '음성 인식 중지' : '음성 인식 시작'}
          >
            {isListening ? '🎤' : '🎤'}
          </button>
          <button
            onClick={() => handleSendMessage()}
            className="send-btn"
            disabled={!inputText.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChat; 