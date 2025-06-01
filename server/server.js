const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// CORS 설정 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../fitbuddy_web_demo')));

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Web demo available at http://localhost:${port}/index.html`);
}); 