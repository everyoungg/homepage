import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chat.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! FitBuddy AI 트레이너입니다. 운동에 관한 질문이 있으시면 언제든 물어보세요! 💪',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 인사말
    if (lowerMessage.includes('안녕') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return '안녕하세요! FitBuddy AI 트레이너입니다. 운동에 관한 질문이나 건강 관리에 대해 언제든 물어보세요! 💪';
    }
    
    // 스쿼트 관련
    if (lowerMessage.includes('스쿼트') || lowerMessage.includes('squat')) {
      if (lowerMessage.includes('자세') || lowerMessage.includes('방법')) {
        return '스쿼트 자세: 발을 어깨 너비로 벌리고, 발끝은 약간 바깥쪽으로 향하게 하세요. 무릎이 발끝을 넘지 않도록 주의하며, 엉덩이를 뒤로 빼고 앉는 느낌으로 천천히 내려가세요. 10-15회씩 3세트를 권장합니다!';
      }
      return '스쿼트는 하체 근육을 강화하는 기본 운동입니다. 대퇴사두근, 햄스트링, 둔근을 모두 자극하여 하체를 튼튼하게 만들어줍니다.';
    }
    
    // 푸시업 관련
    if (lowerMessage.includes('푸시업') || lowerMessage.includes('push up')) {
      if (lowerMessage.includes('자세') || lowerMessage.includes('방법')) {
        return '푸시업 자세: 플랭크 자세로 시작하여 팔꿈치를 90도로 구부리세요. 가슴이 바닥에 거의 닿을 때까지 내린 후 원래 자세로 돌아가세요. 처음에는 무릎을 꿇고 시작하는 것도 좋습니다.';
      }
      return '푸시업은 가슴과 팔을 강화하는 운동입니다. 대흉근, 삼두근, 삼각근을 모두 자극하여 상체를 강화해줍니다.';
    }
    
    // 플랭크 관련
    if (lowerMessage.includes('플랭크') || lowerMessage.includes('plank')) {
      if (lowerMessage.includes('자세') || lowerMessage.includes('방법')) {
        return '플랭크 자세: 팔꿈치와 발끝으로 몸을 지탱하고, 등과 엉덩이를 일직선으로 유지하세요. 복근에 힘을 주고 호흡을 자연스럽게 하세요. 처음에는 30초부터 시작하여 점진적으로 시간을 늘려가세요.';
      }
      return '플랭크는 코어 안정성을 향상시키는 운동입니다. 복근, 등근육, 둔근을 모두 자극하여 코어를 강화해줍니다.';
    }
    
    // 체중 감량 관련
    if (lowerMessage.includes('체중') || lowerMessage.includes('다이어트') || lowerMessage.includes('살빼기')) {
      if (lowerMessage.includes('운동')) {
        return '체중 감량을 위한 운동: 유산소 운동(조깅, 자전거, 수영)과 근력 운동을 병행하세요. 근력 운동은 기초대사량을 높여줍니다. 주 3-4회, 30-60분씩 운동하는 것을 권장합니다.';
      }
      if (lowerMessage.includes('식단')) {
        return '체중 감량을 위한 식단: 단백질을 충분히 섭취하고, 탄수화물과 지방을 적절히 조절하세요. 하루 3끼를 규칙적으로 먹고, 간식은 과일이나 견과류로 대체하세요.';
      }
      return '체중 감량을 위해서는 운동과 식단 관리가 모두 중요합니다. 칼로리 섭취를 조절하고, FitBuddy에서 제공하는 운동들을 꾸준히 하시면 도움이 될 것입니다!';
    }
    
    // 근육량 증가 관련
    if (lowerMessage.includes('근육') || lowerMessage.includes('근력') || lowerMessage.includes('벌크업')) {
      if (lowerMessage.includes('운동')) {
        return '근육량 증가를 위한 운동: 점진적 과부하 원칙을 적용하세요. 같은 운동을 반복하면서 점차 횟수나 무게를 늘려가세요. 주 3-4회, 각 부위별로 3-4세트씩 운동하세요.';
      }
      if (lowerMessage.includes('식단')) {
        return '근육량 증가를 위한 식단: 단백질을 체중 1kg당 1.6-2.2g 섭취하세요. 닭가슴살, 계란, 생선, 콩류가 좋습니다. 탄수화물도 충분히 섭취하여 에너지를 공급하세요.';
      }
      return '근육량 증가를 위해서는 점진적 과부하 원칙을 적용하세요. 단백질 섭취도 충분히 하시고, 휴식도 중요합니다.';
    }
    
    // 스트레칭 관련
    if (lowerMessage.includes('스트레칭') || lowerMessage.includes('유연성')) {
      return '운동 전후 스트레칭은 매우 중요합니다. 운동 전에는 동적 스트레칭(가벼운 조깅, 팔 돌리기 등)으로 시작하고, 운동 후에는 정적 스트레칭으로 마무리하세요. 각 동작을 15-30초간 유지하는 것이 좋습니다.';
    }
    
    // 고강도 운동 관련
    if (lowerMessage.includes('고강도') || lowerMessage.includes('hiit') || lowerMessage.includes('인터벌')) {
      return '고강도 인터벌 트레이닝(HIIT)은 짧은 시간에 효과적인 운동입니다. 버피, 마운틴 클라이머, 점프 스쿼트 등을 30초씩 하고 30초 휴식하는 방식으로 진행하세요. 주 2-3회, 20-30분씩 하시면 됩니다.';
    }
    
    // 운동 시간 관련
    if (lowerMessage.includes('시간') || lowerMessage.includes('얼마나')) {
      if (lowerMessage.includes('운동')) {
        return '운동 시간은 목표에 따라 다릅니다. 체중 감량: 30-60분, 근력 증진: 45-60분, 건강 유지: 20-30분을 권장합니다. 처음에는 짧게 시작해서 점진적으로 늘려가세요.';
      }
    }
    
    // 운동 빈도 관련
    if (lowerMessage.includes('몇번') || lowerMessage.includes('빈도') || lowerMessage.includes('주')) {
      return '운동 빈도는 목표와 수준에 따라 다릅니다. 초급자: 주 2-3회, 중급자: 주 3-4회, 고급자: 주 4-5회를 권장합니다. 휴식일도 충분히 가져야 합니다.';
    }
    
    // 부상 예방 관련
    if (lowerMessage.includes('부상') || lowerMessage.includes('다치') || lowerMessage.includes('아프')) {
      return '부상 예방을 위해서는 운동 전후 스트레칭, 점진적 강도 증가, 올바른 자세 유지가 중요합니다. 통증이 있으면 즉시 운동을 중단하고 전문가와 상담하세요.';
    }
    
    // 식단 관련
    if (lowerMessage.includes('식단') || lowerMessage.includes('먹') || lowerMessage.includes('영양')) {
      return '운동과 함께 균형 잡힌 식단이 중요합니다. 단백질, 탄수화물, 지방을 적절히 섭취하고, 충분한 수분 섭취도 잊지 마세요. 개인별 목표에 맞는 식단을 구성하는 것이 좋습니다.';
    }
    
    // 감사 인사
    if (lowerMessage.includes('감사') || lowerMessage.includes('고마') || lowerMessage.includes('thank')) {
      return '천만에요! 더 궁금한 것이 있으시면 언제든 물어보세요. 건강한 운동 생활 되세요! 💪';
    }
    
    // 기본 응답
    return '좋은 질문이네요! 더 구체적인 운동이나 목표에 대해 알려주시면 더 자세한 답변을 드릴 수 있습니다. 어떤 운동에 관심이 있으신가요? (예: 스쿼트 자세, 체중 감량 운동, 근육량 증가 등)';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // AI 응답 시뮬레이션 (1-2초 지연)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ←
        </button>
        <h1>FitBuddy AI 트레이너</h1>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
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

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="운동에 관한 질문을 입력하세요..."
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

export default Chat; 