"# calendarproject"

# 일정관리 프로젝트

React로 만든 일정관리 웹 애플리케이션입니다.  
달력 화면에서 일정을 등록, 수정, 삭제할 수 있고  
서버와 DB를 연동해 새로고침 후에도 데이터가 유지됩니다.

---

## 기능

- 달력에서 일정 조회
- 날짜 클릭을 통한 일정 등록, 수정, 삭제
- 검색 및 카테고리
- Firestore DB 저장

---

## 기술 스택

- Frontend: React (Vite), FullCalendar, Redux Toolkit
- Backend: Node.js, Express
- Database: Firestore

---

## 실행 방법

### 프론트엔드

```bash
npm run dev
```

### 백엔드

node index.js

### 구조도

src/
├─ pages/CalendarPage.jsx
├─ components/EventModal.jsx
├─ redux/calendarSlice.js
└─ main.jsx

server/
└─ index.js

Week 1
달력 화면 구현

Week 2
일정 등록 / 수정 / 삭제 기능 구현

Week 3
Express API와 Firestore 연동
Postman으로 백엔드 API 테스트
