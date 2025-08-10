import 'package:flutter/material.dart';

class WorkoutScreen extends StatelessWidget {
  const WorkoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD), // 연한 하늘색 배경
      appBar: AppBar(
        title: const Text('운동'),
        backgroundColor: const Color(0xFF1976D2), // 진한 하늘색
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildWorkoutCard(
            '유산소 운동',
            ['러닝', '자전거', '수영', '걷기'],
            Icons.directions_run,
          ),
          const SizedBox(height: 16),
          _buildWorkoutCard(
            '근력 운동',
            ['스쿼트', '플랭크', '푸시업', '덤벨 운동'],
            Icons.fitness_center,
          ),
          const SizedBox(height: 16),
          _buildWorkoutCard(
            '스트레칭',
            ['요가', '필라테스', '기본 스트레칭'],
            Icons.self_improvement,
          ),
        ],
      ),
    );
  }

  Widget _buildWorkoutCard(String title, List<String> exercises, IconData icon) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 24, color: const Color(0xFF1976D2)), // 진한 하늘색
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...exercises.map((exercise) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  const Icon(Icons.arrow_right, color: Color(0xFF1976D2)), // 진한 하늘색
                  const SizedBox(width: 8),
                  Text(
                    exercise,
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
} 