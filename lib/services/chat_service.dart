import 'dart:convert';
import 'package:http/http.dart' as http;

class ChatService {
  static const String _baseUrl = 'http://localhost:5000/chat';

  Future<String> getChatResponse(String message) async {
    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': message}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['reply'];
      } else {
        throw Exception('Failed to get response: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to get response: $e');
    }
  }
} 