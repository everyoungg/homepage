import 'package:flutter/material.dart';
import 'exercise_feedback_screen.dart';

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
            [
              {'name': '푸시업', 'type': 'pushup', 'hasFeedback': true},
              {'name': '크런치', 'type': 'crunch', 'hasFeedback': true},
              {'name': '업라이트로우', 'type': 'uprightrow', 'hasFeedback': true},
              {'name': '스쿼트', 'type': 'squat', 'hasFeedback': false},
            ],
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

  Widget _buildWorkoutCard(String title, List<String> exercises, IconData icon, [List<Map<String, dynamic>>? detailedExercises]) {
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
            ...(detailedExercises != null 
                ? detailedExercises.map((exercise) => _buildExerciseItem(exercise))
                : exercises.map((exercise) => _buildExerciseItem({'name': exercise, 'type': exercise.toLowerCase(), 'hasFeedback': false}))
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseItem(Map<String, dynamic> exercise) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(Icons.arrow_right, color: Color(0xFF1976D2)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              exercise['name'],
              style: const TextStyle(fontSize: 16),
            ),
          ),
          if (exercise['hasFeedback'] == true)
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ExerciseFeedbackScreen(
                      exerciseType: exercise['type'],
                      exerciseName: exercise['name'],
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1976D2),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                minimumSize: const Size(0, 32),
              ),
              child: const Text('자세 교정'),
            ),
        ],
      ),
    );
  }
} 