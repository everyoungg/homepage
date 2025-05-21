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
      // Get bot response
      final response = await _chatService.getChatResponse(text);
      
      // Add bot response
      _messages.add(ChatMessage(text: response, isUser: false));
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
} 