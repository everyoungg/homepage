

const webcamElement = document.getElementById('webcam');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    webcamElement.srcObject = stream;
  })
  .catch((err) => {
    console.error("❌ 카메라 연결 실패:", err);
    alert("카메라 권한이 필요합니다.");
  });

  