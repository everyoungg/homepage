const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const feedback = document.getElementById("feedback");

// ✅ 관절 각도 계산 함수
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180.0 / Math.PI));
  if (angle > 180.0) angle = 360 - angle;
  return parseFloat(angle.toFixed(2));
}

// 🦴 전신 관절 각도 계산
function getJointAngles(landmarks) {
  return {
    팔꿈치: calculateAngle(landmarks[11], landmarks[13], landmarks[15]),
    어깨: calculateAngle(landmarks[23], landmarks[11], landmarks[13]),
    가슴: calculateAngle(landmarks[11], landmarks[23], landmarks[24]),
    등: calculateAngle(landmarks[13], landmarks[11], landmarks[23]),
    복부: calculateAngle(landmarks[23], landmarks[11], landmarks[24]),
    엉덩이: calculateAngle(landmarks[11], landmarks[23], landmarks[25]),
    무릎: calculateAngle(landmarks[23], landmarks[25], landmarks[27]),
    다리: calculateAngle(landmarks[25], landmarks[27], landmarks[31])
  };
}

// 📢 피드백 조건 (예: 팔꿈치)
function checkFeedback(angles) {
  if (angles["팔꿈치"] > 160) {
    feedback.innerText = "팔꿈치를 너무 폈어요!";
  } else if (angles["팔꿈치"] < 70) {
    feedback.innerText = "팔꿈치를 너무 굽혔어요!";
  } else if (angles["무릎"] > 170) {
    feedback.innerText = "무릎이 너무 펴졌어요!";
  } else if (angles["무릎"] < 90) {
    feedback.innerText = "무릎을 너무 굽혔어요!";
  } else {
    feedback.innerText = "📍 자세 좋아요!";
  }
}

// 📸 Mediapipe Pose 설정
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
});
pose.setOptions({
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// 🎯 결과 받아 처리
pose.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.poseLandmarks) {
    drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
    drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });

    const angles = getJointAngles(results.poseLandmarks);
    checkFeedback(angles);
  }
});

// 🎥 카메라 연결
const camera = new Camera(video, {
  onFrame: async () => {
    await pose.send({ image: video });
  },
  width: 640,
  height: 480,
});
camera.start();

  