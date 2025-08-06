# FitBuddy - AI 헬스트레이닝 웹 애플리케이션

FitBuddy는 AI 기술을 활용한 개인 맞춤형 헬스트레이닝 웹 애플리케이션입니다. 카메라를 통한 실시간 자세 분석과 AI 피드백을 제공하여 효과적인 운동을 도와줍니다.

## 🚀 주요 기능

### 1. 회원가입 및 사용자 정보 입력
- 이메일, 이름, 비밀번호를 통한 회원가입
- 키, 몸무게, 성별, 운동 목적 입력
- 개인화된 운동 경험 제공

### 2. 홈 대시보드
- 현재 체중 표시 및 체중 기록 기능
- 체중 변화 추이 그래프 (Chart.js 활용)
- 운동하기, 채팅하기 메인 버튼

### 3. 운동 카테고리 및 선택
- 6개 운동 부위: 전신, 팔, 다리, 복부, 어깨, 가슴
- 각 부위별 2가지 운동 선택 가능
- 난이도 및 소요 시간 표시

### 4. AI 운동 세션
- 카메라를 통한 실시간 운동 모니터링
- AI 자세 분석 및 피드백 제공
- 음성 TTS를 통한 음성 피드백
- 운동 방법 단계별 안내
- 실시간 타이머 기능

### 5. AI 채팅 시스템
- 운동 관련 질문에 대한 AI 응답
- 다양한 운동 주제 지원
- 실시간 타이핑 애니메이션

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router DOM
- **Charts**: Chart.js + React-Chartjs-2
- **Styling**: CSS3 (Grid, Flexbox, Animations)
- **AI Features**: Web Speech API (TTS)
- **Camera**: MediaDevices API
- **Deployment**: Vercel

## 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 지원
- 터치 친화적 인터페이스
- 최적화된 사용자 경험

## 🎨 디자인 특징

- 모던하고 깔끔한 UI/UX
- 그라데이션 배경과 카드 스타일 디자인
- 부드러운 애니메이션 효과
- 직관적인 네비게이션

## 🚀 배포

이 프로젝트는 Vercel을 통해 배포됩니다.

### 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 프로덕션 빌드
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── SignUp.tsx      # 회원가입
│   ├── UserInfo.tsx    # 사용자 정보 입력
│   ├── Home.tsx        # 홈 대시보드
│   ├── WorkoutCategories.tsx  # 운동 카테고리
│   ├── WorkoutExercises.tsx   # 운동 선택
│   ├── WorkoutSession.tsx     # 운동 세션
│   └── Chat.tsx        # AI 채팅
├── styles/             # CSS 스타일 파일
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🔧 환경 설정

### 필수 요구사항
- Node.js 16+
- npm 또는 yarn
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 권장사항
- 카메라가 있는 디바이스 (운동 세션 기능 사용 시)
- 마이크 권한 (음성 피드백 사용 시)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**FitBuddy** - AI와 함께하는 건강한 운동 생활을 시작하세요! 💪
