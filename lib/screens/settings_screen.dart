import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD), // 연한 하늘색 배경
      appBar: AppBar(
        title: const Text('설정'),
        backgroundColor: const Color(0xFF1976D2), // 진한 하늘색
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('프로필 설정'),
            onTap: () {
              // 프로필 설정 화면으로 이동
            },
          ),
          ListTile(
            leading: const Icon(Icons.notifications),
            title: const Text('알림 설정'),
            onTap: () {
              // 알림 설정 화면으로 이동
            },
          ),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('언어 설정'),
            onTap: () {
              // 언어 설정 화면으로 이동
            },
          ),
          ListTile(
            leading: const Icon(Icons.help),
            title: const Text('도움말'),
            onTap: () {
              // 도움말 화면으로 이동
            },
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('앱 정보'),
            onTap: () {
              // 앱 정보 화면으로 이동
            },
          ),
        ],
      ),
    );
  }
} 