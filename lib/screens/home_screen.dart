import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD), // 연한 하늘색 배경
      appBar: AppBar(
        title: const Text('홈'),
        backgroundColor: const Color(0xFF1976D2), // 진한 하늘색
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '오늘의 운동',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            // 여기에 오늘의 운동 추천 위젯을 추가할 수 있습니다
          ],
        ),
      ),
    );
  }
} 