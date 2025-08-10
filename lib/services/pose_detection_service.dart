import 'dart:io';
import 'dart:math';
import 'package:camera/camera.dart';
import 'package:image/image.dart' as img;

class PoseDetectionService {
  static const List<String> landmarkNames = [
    'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer', 'right_eye_inner', 'right_eye', 'right_eye_outer',
    'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist',
    'left_pinky', 'right_pinky', 'left_index', 'right_index', 'left_thumb', 'right_thumb',
    'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle',
    'left_heel', 'right_heel', 'left_foot_index', 'right_foot_index'
  ];

  // 3점 각도 계산
  static double calculateAngle3Point(List<double> a, List<double> b, List<double> c) {
    try {
      List<double> ab = [a[0] - b[0], a[1] - b[1]];
      List<double> cb = [c[0] - b[0], c[1] - b[1]];
      
      double dot = ab[0] * cb[0] + ab[1] * cb[1];
      double nab = sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
      double ncb = sqrt(cb[0] * cb[0] + cb[1] * cb[1]);
      
      double cosang = (dot / (nab * ncb + 1e-9)).clamp(-1.0, 1.0);
      return acos(cosang) * 180 / pi;
    } catch (e) {
      return double.nan;
    }
  }

  // 두 점 사이의 거리 계산
  static double calculateDistance(List<double> a, List<double> b) {
    return sqrt(pow(a[0] - b[0], 2) + pow(a[1] - b[1], 2));
  }

  // 두 점의 중점 계산
  static List<double> calculateMidpoint(List<double> a, List<double> b) {
    return [(a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0];
  }

  // 업라이트로우 자세 평가
  static Map<String, dynamic> evaluateUprightRow(List<List<double>> landmarks) {
    if (landmarks.length < 33) return {'score': 0, 'feedback': '관절 인식 실패'};

    // 주요 관절 인덱스
    const int lEar = 7, rEar = 8;
    const int lSho = 11, rSho = 12;
    const int lElb = 13, rElb = 14;
    const int lWri = 15, rWri = 16;
    const int lHip = 23, rHip = 24;

    // 1) 팔꿈치가 손목 리드 (양팔 모두 만족 권장)
    bool elbowLeads = (landmarks[lElb][1] + 0.03 < landmarks[lWri][1]) &&
                      (landmarks[rElb][1] + 0.03 < landmarks[rWri][1]);

    // 2) 견갑골 하강 유지
    double earShoGap = ((landmarks[lEar][1] - landmarks[lSho][1]) + 
                        (landmarks[rEar][1] - landmarks[rSho][1])) / 2.0;
    double hipMinusSho = ((landmarks[lHip][1] - landmarks[lSho][1]) + 
                          (landmarks[rHip][1] - landmarks[rSho][1])) / 2.0;
    bool scapDepress = (earShoGap >= 0.03) && (hipMinusSho >= 0.10);

    // 3) 바벨 상체 밀착
    List<double> chest = calculateMidpoint(landmarks[lSho], landmarks[rSho]);
    double handToChestTol = (calculateDistance(landmarks[lWri], chest) + 
                             calculateDistance(landmarks[rWri], chest)) / 2.0;
    bool barClose = handToChestTol <= 0.08;

    // 4) 체간 좌우 기울임 억제
    double torsoCenterTol = (landmarks[lSho][0] + landmarks[rSho][0]) / 2.0;
    bool torsoStraight = (torsoCenterTol - 0.5).abs() <= 0.06;

    // 점수 계산
    int score = 0;
    List<String> feedback = [];
    
    if (elbowLeads) { score += 25; } else { feedback.add('팔꿈치를 손목보다 위로 올려주세요'); }
    if (scapDepress) { score += 25; } else { feedback.add('어깨를 내리고 견갑골을 모아주세요'); }
    if (barClose) { score += 25; } else { feedback.add('바벨을 몸에 더 가깝게 가져오세요'); }
    if (torsoStraight) { score += 25; } else { feedback.add('몸을 좌우로 기울이지 마세요'); }

    return {
      'score': score,
      'feedback': feedback,
      'details': {
        'elbowLeads': elbowLeads,
        'scapDepress': scapDepress,
        'barClose': barClose,
        'torsoStraight': torsoStraight,
      }
    };
  }

  // 크런치 자세 평가
  static Map<String, dynamic> evaluateCrunch(List<List<double>> landmarks) {
    if (landmarks.length < 33) return {'score': 0, 'feedback': '관절 인식 실패'};

    const int nose = 0, lSho = 11, rSho = 12, lHip = 23, rHip = 24;

    // 1) 상체 각도 (45도 이하)
    double upperBodyAngle = calculateAngle3Point(
      landmarks[nose], 
      calculateMidpoint(landmarks[lSho], landmarks[rSho]),
      calculateMidpoint(landmarks[lHip], landmarks[rHip])
    );
    bool goodAngle = upperBodyAngle <= 45;

    // 2) 어깨-엉덩이 거리 (최소 간격 유지)
    double shoulderHipDistance = calculateDistance(
      calculateMidpoint(landmarks[lSho], landmarks[rSho]),
      calculateMidpoint(landmarks[lHip], landmarks[rHip])
    );
    bool goodDistance = shoulderHipDistance >= 0.15;

    // 점수 계산
    int score = 0;
    List<String> feedback = [];
    
    if (goodAngle) { score += 50; } else { feedback.add('상체를 더 많이 들어올려주세요 (45도 이하)'); }
    if (goodDistance) { score += 50; } else { feedback.add('어깨와 엉덩이 사이 거리를 유지해주세요'); }

    return {
      'score': score,
      'feedback': feedback,
      'details': {
        'upperBodyAngle': upperBodyAngle,
        'shoulderHipDistance': shoulderHipDistance,
        'goodAngle': goodAngle,
        'goodDistance': goodDistance,
      }
    };
  }

  // 푸시업 자세 평가
  static Map<String, dynamic> evaluatePushup(List<List<double>> landmarks) {
    if (landmarks.length < 33) return {'score': 0, 'feedback': '관절 인식 실패'};

    const int lSho = 11, rSho = 12, lElb = 13, rElb = 14, lWri = 15, rWri = 16;
    const int lHip = 23, rHip = 24, lKnee = 25, rKnee = 26, lAnk = 27, rAnk = 28;

    // 1) 체간 직선 유지 (어깨-엉덩이-발목)
    double torsoAngle = calculateAngle3Point(
      calculateMidpoint(landmarks[lSho], landmarks[rSho]),
      calculateMidpoint(landmarks[lHip], landmarks[rHip]),
      calculateMidpoint(landmarks[lAnk], landmarks[rAnk])
    );
    bool torsoStraight = (torsoAngle >= 165) && (torsoAngle <= 180);

    // 2) 팔꿈치 각도 (90도 근처)
    double leftElbowAngle = calculateAngle3Point(
      landmarks[lSho], landmarks[lElb], landmarks[lWri]
    );
    double rightElbowAngle = calculateAngle3Point(
      landmarks[rSho], landmarks[rElb], landmarks[rWri]
    );
    bool goodElbowAngle = (leftElbowAngle >= 80 && leftElbowAngle <= 100) &&
                          (rightElbowAngle >= 80 && rightElbowAngle <= 100);

    // 3) 손목 위치 (어깨 아래)
    bool wristPosition = (landmarks[lWri][0] - landmarks[lSho][0]).abs() <= 0.1 &&
                        (landmarks[rWri][0] - landmarks[rSho][0]).abs() <= 0.1;

    // 점수 계산
    int score = 0;
    List<String> feedback = [];
    
    if (torsoStraight) { score += 40; } else { feedback.add('몸을 직선으로 유지해주세요'); }
    if (goodElbowAngle) { score += 40; } else { feedback.add('팔꿈치 각도를 90도로 유지해주세요'); }
    if (wristPosition) { score += 20; } else { feedback.add('손목을 어깨 아래에 위치시켜주세요'); }

    return {
      'score': score,
      'feedback': feedback,
      'details': {
        'torsoAngle': torsoAngle,
        'leftElbowAngle': leftElbowAngle,
        'rightElbowAngle': rightElbowAngle,
        'torsoStraight': torsoStraight,
        'goodElbowAngle': goodElbowAngle,
        'wristPosition': wristPosition,
      }
    };
  }

  // 운동 타입에 따른 자세 평가
  static Map<String, dynamic> evaluateExercise(String exerciseType, List<List<double>> landmarks) {
    switch (exerciseType.toLowerCase()) {
      case 'uprightrow':
      case '업라이트로우':
        return evaluateUprightRow(landmarks);
      case 'crunch':
      case '크런치':
        return evaluateCrunch(landmarks);
      case 'pushup':
      case '푸시업':
        return evaluatePushup(landmarks);
      default:
        return {'score': 0, 'feedback': '지원하지 않는 운동입니다'};
    }
  }
}
