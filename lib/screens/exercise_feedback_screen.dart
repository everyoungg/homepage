import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/pose_detection_service.dart';

class ExerciseFeedbackScreen extends StatefulWidget {
  final String exerciseType;
  final String exerciseName;

  const ExerciseFeedbackScreen({
    super.key,
    required this.exerciseType,
    required this.exerciseName,
  });

  @override
  State<ExerciseFeedbackScreen> createState() => _ExerciseFeedbackScreenState();
}

class _ExerciseFeedbackScreenState extends State<ExerciseFeedbackScreen> {
  CameraController? _cameraController;
  bool _isInitialized = false;
  bool _isRecording = false;
  List<Map<String, dynamic>> _feedbackHistory = [];
  Map<String, dynamic>? _currentFeedback;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    // 카메라 권한 요청
    final status = await Permission.camera.request();
    if (status != PermissionStatus.granted) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('카메라 권한이 필요합니다')),
        );
      }
      return;
    }

    // 카메라 초기화
    final cameras = await availableCameras();
    if (cameras.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('사용 가능한 카메라가 없습니다')),
        );
      }
      return;
    }

    _cameraController = CameraController(
      cameras[0],
      ResolutionPreset.medium,
      enableAudio: false,
    );

    try {
      await _cameraController!.initialize();
      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('카메라 초기화 실패: $e')),
        );
      }
    }
  }

  void _startRecording() {
    if (_cameraController != null && _isInitialized) {
      setState(() {
        _isRecording = true;
      });
      _processFrame();
    }
  }

  void _stopRecording() {
    setState(() {
      _isRecording = false;
    });
  }

  void _processFrame() async {
    if (!_isRecording || _cameraController == null) return;

    try {
      final image = await _cameraController!.takePicture();
      // 여기서 실제 관절 인식 처리를 수행합니다
      // 현재는 시뮬레이션된 데이터를 사용합니다
      _simulatePoseDetection();
      
      // 다음 프레임 처리
      if (_isRecording) {
        Future.delayed(const Duration(milliseconds: 500), _processFrame);
      }
    } catch (e) {
      print('프레임 처리 오류: $e');
    }
  }

  void _simulatePoseDetection() {
    // 실제 구현에서는 MediaPipe나 다른 관절 인식 라이브러리를 사용합니다
    // 현재는 시뮬레이션된 데이터로 피드백을 생성합니다
    
    final random = DateTime.now().millisecondsSinceEpoch;
    final score = 60 + (random % 40); // 60-100점 사이
    
    final feedback = PoseDetectionService.evaluateExercise(
      widget.exerciseType,
      List.generate(33, (index) => [random % 100 / 100.0, random % 100 / 100.0, 1.0])
    );
    
    setState(() {
      _currentFeedback = feedback;
      _feedbackHistory.add({
        'timestamp': DateTime.now(),
        'feedback': feedback,
      });
      
      // 최근 10개만 유지
      if (_feedbackHistory.length > 10) {
        _feedbackHistory.removeAt(0);
      }
    });
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE3F2FD),
      appBar: AppBar(
        title: Text('${widget.exerciseName} 자세 교정'),
        backgroundColor: const Color(0xFF1976D2),
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // 카메라 뷰
          Expanded(
            flex: 2,
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1976D2), width: 2),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: _isInitialized && _cameraController != null
                    ? CameraPreview(_cameraController!)
                    : const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.camera_alt, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text('카메라 초기화 중...'),
                          ],
                        ),
                      ),
              ),
            ),
          ),
          
          // 현재 피드백
          if (_currentFeedback != null)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        _currentFeedback!['score'] >= 80 
                            ? Icons.check_circle 
                            : _currentFeedback!['score'] >= 60 
                                ? Icons.warning 
                                : Icons.error,
                        color: _currentFeedback!['score'] >= 80 
                            ? Colors.green 
                            : _currentFeedback!['score'] >= 60 
                                ? Colors.orange 
                                : Colors.red,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '현재 점수: ${_currentFeedback!['score']}점',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  if (_currentFeedback!['feedback'].isNotEmpty) ...[
                    const SizedBox(height: 12),
                    const Text(
                      '피드백:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...(_currentFeedback!['feedback'] as List<String>).map(
                      (feedback) => Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Row(
                          children: [
                            const Icon(Icons.arrow_right, size: 16),
                            const SizedBox(width: 8),
                            Expanded(child: Text(feedback)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          
          // 컨트롤 버튼
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: _isInitialized ? _startRecording : null,
                  icon: const Icon(Icons.play_arrow),
                  label: const Text('시작'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _isRecording ? _stopRecording : null,
                  icon: const Icon(Icons.stop),
                  label: const Text('정지'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
              ],
            ),
          ),
          
          // 피드백 히스토리
          if (_feedbackHistory.isNotEmpty)
            Expanded(
              flex: 1,
              child: Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '피드백 히스토리',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: ListView.builder(
                        itemCount: _feedbackHistory.length,
                        itemBuilder: (context, index) {
                          final item = _feedbackHistory[_feedbackHistory.length - 1 - index];
                          final feedback = item['feedback'];
                          final timestamp = item['timestamp'] as DateTime;
                          
                          return ListTile(
                            leading: CircleAvatar(
                              backgroundColor: feedback['score'] >= 80 
                                  ? Colors.green 
                                  : feedback['score'] >= 60 
                                      ? Colors.orange 
                                      : Colors.red,
                              child: Text(
                                '${feedback['score']}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            title: Text(
                              '${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}:${timestamp.second.toString().padLeft(2, '0')}',
                              style: const TextStyle(fontSize: 12),
                            ),
                            subtitle: Text(
                              feedback['feedback'].isNotEmpty 
                                  ? feedback['feedback'][0] 
                                  : '자세가 좋습니다!',
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
