import 'package:flutter/foundation.dart';
import '../services/chat_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;

  ChatMessage({required this.text, required this.isUser});
}

class ChatProvider with ChangeNotifier {
  final ChatService _chatService = ChatService();
  List<ChatMessage> _messages = [];
  bool _isLoading = false;

  List<ChatMessage> get messages => _messages;
  bool get isLoading => _isLoading;

  ChatProvider() {
    // Add welcome message
    _messages.add(
      ChatMessage(
        text: '안녕하세요! Fit Buddy입니다. 어떤 도움이 필요하신가요?',
        isUser: false,
      ),
    );
  }

  Future<void> sendMessage(String text) async {
    // Add user message
    _messages.add(ChatMessage(text: text, isUser: true));
    notifyListeners();

    // Set loading state
    _isLoading = true;
    notifyListeners();

    try {
      // Check if user is asking for diet recommendation
      if (text.toLowerCase().contains('식단') || 
          text.toLowerCase().contains('추천') || 
          text.toLowerCase().contains('먹을') ||
          text.toLowerCase().contains('음식')) {
        
        // Generate diet recommendation
        final dietRecommendation = _generateDietRecommendation();
        _messages.add(ChatMessage(text: dietRecommendation, isUser: false));
      } else {
        // Get bot response from service
        final response = await _chatService.getChatResponse(text);
        
        // Add bot response
        _messages.add(ChatMessage(text: response, isUser: false));
      }
    } catch (e) {
      // Add error message
      _messages.add(
        ChatMessage(
          text: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          isUser: false,
        ),
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  String _generateDietRecommendation() {
    final breakfast = [
      '아침: 오트밀 + 바나나 + 견과류 + 우유',
      '아침: 토스트 + 계란 + 아보카도 + 우유',
      '아침: 요거트 + 그라놀라 + 베리류 + 꿀',
      '아침: 샌드위치 + 채소 + 치즈 + 주스',
      '아침: 죽 + 김치 + 생선 + 미역국'
    ];
    
    final lunch = [
      '점심: 현미밥 + 닭가슴살 + 브로콜리 + 된장국',
      '점심: 샐러드 + 퀴노아 + 연어 + 견과류',
      '점심: 비빔밥 + 계란 + 채소 + 미소국',
      '점심: 파스타 + 새우 + 토마토소스 + 샐러드',
      '점심: 김밥 + 계란말이 + 미역국 + 김치'
    ];
    
    final dinner = [
      '저녁: 고구마 + 닭가슴살 + 시금치 + 두부',
      '저녁: 현미밥 + 생선구이 + 나물 + 된장국',
      '저녁: 샐러드 + 연어 + 아보카도 + 견과류',
      '저녁: 스프 + 빵 + 치킨 + 채소',
      '저녁: 잡곡밥 + 두부 + 채소 + 미소국'
    ];
    
    final snacks = [
      '간식: 견과류 + 과일',
      '간식: 요거트 + 베리류',
      '간식: 바나나 + 우유',
      '간식: 사과 + 견과류',
      '간식: 오렌지 + 아몬드'
    ];
    
    // Randomly select one meal from each category
    final random = DateTime.now().millisecondsSinceEpoch;
    final breakfastChoice = breakfast[random % breakfast.length];
    final lunchChoice = lunch[random % lunch.length];
    final dinnerChoice = dinner[random % dinner.length];
    final snackChoice = snacks[random % snacks.length];
    
    return '''🍽️ 오늘의 식단 추천입니다!

$breakfastChoice
$lunchChoice
$dinnerChoice
$snackChoice

💡 건강한 식단을 위한 팁:
• 하루 8잔 이상의 물 마시기
• 채소와 과일을 충분히 섭취하기
• 정기적인 식사 시간 지키기
• 과식 피하고 천천히 씹어 먹기

오늘도 건강한 하루 되세요! 😊''';
  }
} 