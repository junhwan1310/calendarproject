# 일정관리 프로젝트

React로 만든 일정관리 웹 애플리케이션입니다.  
달력 화면에서 일정을 등록, 수정, 삭제할 수 있으며  
Express 서버와 Firestore DB를 연동해  
새로고침 후에도 데이터가 유지되도록 구현했습니다.

---

## 기능

- 달력에서 일정 조회 (월 / 주 / 일 보기)
- 날짜 클릭을 통한 일정 등록
- 일정 클릭을 통한 수정 및 삭제
- 검색 및 카테고리 필터 기능
- Firestore DB 저장

---

## 기술 스택

- Frontend: React (Vite), FullCalendar, Redux Toolkit
- Backend: Node.js, Express
- Database: Firestore (Firebase)

---

### 프론트엔드

```bash
npm install
npm run dev
```

### 백엔드

node index.js

### 구조도

### 구조도

```text
frontend
├─ src/
│ ├─ pages/
│ │ └─ CalendarPage.jsx      # 달력 메인 화면
│ ├─ components/
│ │ ├─ EventModal.jsx        # 일정 등록/수정 모달
│ │ ├─ Header.jsx
│ │ └─ Footer.jsx
│ ├─ redux/
│ │ ├─ config/
│ │ │ └─ configStore.js      # Redux Store 설정
│ │ └─ modules/
│ │   └─ calendarSlice.js    # 일정 CRUD 상태 관리
│ ├─ App.jsx
│ └─ main.jsx
│
backend
└─ index.js                  # Express API 서버


### 과정

Week 1
FullCalendar를 이용한 달력 화면 구현

Week 2
일정 조회 / 등록 / 수정 / 삭제 기능 구현 (CRUD)
모달을 이용한 일정 입력 및 관리

Week 3
Express 기반 REST API 구현
Firestore DB 연동
Postman을 이용한 백엔드 API 테스트
새로고침 후에도 데이터 유지 확인

Week 4
검색 및 카테고리 기능 추가
```
