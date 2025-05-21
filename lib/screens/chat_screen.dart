import 'package:flutter/material.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  List<types.Message> _messages = [];
  final _user = const types.User(id: '1');
  final _bot = const types.User(id: '2', firstName: 'Fit Buddy');
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _addMessage(
      types.TextMessage(
        author: _bot,
        id: '1',
        text: '안녕하세요! Fit Buddy입니다. 어떤 도움이 필요하신가요?',
      ),
    );
  }

  void _addMessage(types.Message message) {
    setState(() {
      _messages.insert(0, message);
    });
  }

  void _handleSendPressed(types.PartialText message) {
    final textMessage = types.TextMessage(
      author: _user,
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      text: message.text,
    );

    _addMessage(textMessage);
    _getBotResponse(message.text);
  }

  Future<void> _getBotResponse(String userMessage) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final apiKey = dotenv.env['OPENAI_API_KEY'] ?? '';
      final url = Uri.parse('https://api.openai.com/v1/chat/completions');
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $apiKey',
      };
      final body = jsonEncode({
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': '당신은 Fit Buddy라는 피트니스 트레이너 챗봇입니다. 사용자의 운동과 건강에 관한 질문에 답변해주세요. 답변은 친절하고 전문적이어야 합니다.'
          },
          {
            'role': 'user',
            'content': userMessage,
          },
        ],
      });

      final response = await http.post(url, headers: headers, body: body);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final botResponse = data['choices'][0]['message']['content'];
        final botMessage = types.TextMessage(
          author: _bot,
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          text: botResponse,
        );
        _addMessage(botMessage);
      } else {
        final errorMessage = types.TextMessage(
          author: _bot,
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          text: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. (${response.statusCode})',
        );
        _addMessage(errorMessage);
      }
    } catch (e) {
      final errorMessage = types.TextMessage(
        author: _bot,
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
      _addMessage(errorMessage);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Fit Buddy 챗봇',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade50,
              Colors.white,
            ],
          ),
        ),
        child: Stack(
          children: [
            Chat(
              messages: _messages,
              onSendPressed: _handleSendPressed,
              showUserAvatars: true,
              showUserNames: true,
              user: _user,
              theme: DefaultChatTheme(
                primaryColor: Colors.blue,
                secondaryColor: Colors.blue.shade100,
                backgroundColor: Colors.transparent,
                userAvatarNameColors: [Colors.blue],
                sentMessageBodyTextStyle: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                ),
                receivedMessageBodyTextStyle: const TextStyle(
                  color: Colors.black87,
                  fontSize: 16,
                ),
              ),
            ),
            if (_isLoading)
              Container(
                color: Colors.black.withOpacity(0.1),
                child: const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
} 