const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const feedback = document.getElementById("feedback");

let selectedExercise = "스쿼트"; // 기본 운동
window.setExercise = function(name) {
  selectedExercise = name;
  console.log("선택된 운동:", selectedExercise);
};

let lastSpoken = ""; // 같은 멘트 반복 방지
function speak(text) {
  if (lastSpoken === text) return;
  lastSpoken = text;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// ✅ 각도 계산
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180.0 / Math.PI));
  if (angle > 180.0) angle = 360 - angle;
  return parseFloat(angle.toFixed(2));
}

function getJointAngles(landmarks) {
  return {
    팔꿈치: calculateAngle(landmarks[11], landmarks[13], landmarks[15]),
    어깨: calculateAngle(landmarks[23], landmarks[11], landmarks[13]),
    가슴: calculateAngle(landmarks[11], landmarks[23], landmarks[24]),
    복부: calculateAngle(landmarks[23], landmarks[11], landmarks[24]),
    무릎: calculateAngle(landmarks[23], landmarks[25], landmarks[27]),
    다리: calculateAngle(landmarks[25], landmarks[27], landmarks[31]),
    몸통: calculateAngle(landmarks[11], landmarks[23], landmarks[27])
  };
}

// 💪 운동별 피드백
function checkSquat(angles) {
  if (angles["무릎"] > 170) {
    feedback.innerText = "무릎이 너무 펴졌어요! 살짝 굽혀주세요.";
    speak("무릎이 너무 펴졌어요. 살짝 굽혀주세요."); return;
  }
  if (angles["무릎"] < 90) {
    feedback.innerText = "무릎을 너무 많이 굽혔어요.";
    speak("무릎을 너무 많이 굽혔어요."); return;
  }
  feedback.innerText = "스쿼트 자세 좋아요! 👍";
  speak("스쿼트 자세 좋아요");
}

function checkPlank(angles) {
  if (angles["팔꿈치"] > 110 || angles["팔꿈치"] < 70) {
    feedback.innerText = "팔꿈치 각도 조절해주세요.";
    speak("팔꿈치 각도 조절해주세요."); return;
  }
  if (angles["몸통"] < 150) {
    feedback.innerText = "엉덩이가 너무 내려갔어요! 몸을 일자로 유지해주세요.";
    speak("엉덩이가 너무 내려갔어요. 몸을 일자로 유지해주세요."); return;
  }
  feedback.innerText = "플랭크 자세 좋아요! 👍";
  speak("플랭크 자세 좋아요");
}

function checkPushup(angles) {
  if (angles["팔꿈치"] < 60) {
    feedback.innerText = "팔꿈치를 너무 굽혔어요! 더 펴보세요.";
    speak("팔꿈치를 너무 굽혔어요. 더 펴보세요."); return;
  }
  if (angles["팔꿈치"] > 120) {
    feedback.innerText = "팔꿈치를 너무 폈어요! 부상 위험이 있어요.";
    speak("팔꿈치를 너무 폈어요. 부상 위험이 있어요."); return;
  }
  if (angles["몸통"] < 150) {
    feedback.innerText = "몸이 처졌어요! 일직선 유지해주세요.";
    speak("몸이 처졌어요. 일직선 유지해주세요."); return;
  }
  feedback.innerText = "푸쉬업 자세 좋아요! 👍";
  speak("푸쉬업 자세 좋아요");
}

const feedbackRules = {
  "스쿼트": checkSquat,
  "플랭크": checkPlank,
  "푸쉬업": checkPushup
};

// ✅ Mediapipe Pose 설정
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.poseLandmarks) {
    drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
    drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });

    const angles = getJointAngles(results.poseLandmarks);

    if (feedbackRules[selectedExercise]) {
      feedbackRules[selectedExercise](angles);
    } else {
      feedback.innerText = "운동을 선택해주세요!";
      speak("운동을 선택해주세요");
    }
  }
});

// ✅ 카메라 시작
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 640,
        height: 480,
        facingMode: "user"
      } 
    });
    video.srcObject = stream;
    
    const camera = new Camera.Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    
    await camera.start();
    console.log("카메라가 시작되었습니다.");
  } catch (error) {
    console.error("카메라 시작 중 오류 발생:", error);
    feedback.innerText = "카메라 접근 권한이 필요합니다.";
  }
}

// 페이지 로드 시 카메라 시작
window.addEventListener('load', startCamera); 