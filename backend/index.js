const express = require("express"); // Express 프레임워크 로드
const cors = require("cors"); // 교차 출처 리소스 공유(CORS) 허용 설정 로드
const admin = require("firebase-admin"); // Firebase Admin SDK 로드
const serviceAccount = require("./serviceAccountKey.json"); // Firebase 서비스 계정 키 로드

const app = express(); // Express 애플리케이션 객체 생성
const PORT = 5000; // 서버가 사용할 포트 번호 설정

admin.initializeApp({ // Firebase Admin SDK 초기화
  credential: admin.credential.cert(serviceAccount), // 인증 정보 설정
});

const db = admin.firestore(); // Firestore 데이터베이스 객체 생성
app.use(cors()); // 모든 도메인에서의 API 요청 허용
app.use(express.json()); // JSON 형태의 요청 본문(body)을 해석할 수 있게 설정

const COLLECTION = "schedules"; // Firestore에서 사용할 컬렉션 이름 정의

/**
 * ✅ [추가] 응답 JSON의 키 순서를 강제로 고정하는 헬퍼
 * - 기능에는 영향 없음
 * - Postman에서 보기 좋게 "항상 같은 순서"로 출력되게 함
 */
const orderScheduleFields = (raw) => { // 데이터 객체의 키 순서를 정렬하는 함수
  return {
    id: raw.id, // 문서 ID

    // 원하는 순서대로 배치
    SCHEDULE_TITLE: raw.SCHEDULE_TITLE, // 일정 제목
    SCHEDULE_CONTENT: raw.SCHEDULE_CONTENT, // 일정 내용(메모)
    CATEGORY: raw.CATEGORY, // 카테고리
    SCHEDULE_START: raw.SCHEDULE_START, // 시작 시간
    SCHEDULE_END: raw.SCHEDULE_END, // 종료 시간
    COLOR: raw.COLOR, // 일정 색상

    // Firestore timestamp는 객체라 뒤쪽으로
    createdAt: raw.createdAt, // 생성 일시
    updatedAt: raw.updatedAt, // 수정 일시
  };
};

// 1. [GET] 일정 조회
app.get("/api/schedules", async (req, res) => { // 전체 일정 조회 API 경로
  try {
    const snapshot = await db // DB에서 데이터 가져오기 시작
      .collection(COLLECTION) // 'schedules' 컬렉션 접근
      .orderBy("createdAt", "desc") // 생성일 기준 내림차순 정렬
      .get(); // 데이터 스냅샷 획득

    // 기존: { id, ...doc.data() } 로 뿌려서 키 순서가 들쑥날쑥 보였음
    const schedules = snapshot.docs.map((doc) => ({ // 문서 배열을 순회하며 변환
      id: doc.id, // 문서의 고유 ID 추출
      ...doc.data(), // 문서의 나머지 필드 데이터 결합
    }));

    // ✅ [추가] 키 순서 고정해서 응답
    const orderedSchedules = schedules.map(orderScheduleFields); // 모든 데이터를 정렬된 형태로 변환

    res.json(orderedSchedules); // 클라이언트에 JSON 형식으로 응답
  } catch (error) { // 에러 발생 시 처리
    res
      .status(500) // 500 에러 코드 설정
      .json({ message: "데이터를 불러오지 못했습니다.", error: error.message }); // 에러 메시지 반환
  }
});

// 2. [POST] 일정 등록
app.post("/api/schedules", async (req, res) => { // 새로운 일정 등록 API 경로
  try {
    // [수정] category 필드 추가 수신
    const { title, start, end, memo, color, category } = req.body; // 요청 본문에서 데이터 추출

    if (!start.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) { // 시작 시간 형식 유효성 검사
      return res
        .status(400) // 잘못된 요청 코드
        .json({ message: "시작 시간 형식이 올바르지 않습니다." }); // 경고 메시지
    }
    if (!end.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) { // 종료 시간 형식 유효성 검사
      return res
        .status(400) // 잘못된 요청 코드
        .json({ message: "종료 시간 형식이 올바르지 않습니다." }); // 경고 메시지
    }

    const newSchedule = { // DB에 저장할 객체 구조 생성
      SCHEDULE_TITLE: title, // 제목 매핑
      SCHEDULE_START: start, // 시작 시간 매핑
      SCHEDULE_END: end, // 종료 시간 매핑
      SCHEDULE_CONTENT: memo || "", // 메모 매핑 (없으면 빈 문자열)
      COLOR: color || "#238636", // 색상 매핑 (없으면 기본 초록색)
      CATEGORY: category || "업무", // [추가] 카테고리 매핑 (없으면 '업무')
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // 서버 기준 현재 시간 저장
    };

    const docRef = await db.collection(COLLECTION).add(newSchedule); // Firestore에 데이터 추가

    // ✅ 응답도 순서 고정해서 보기 좋게(선택이지만 같이 적용)
    res.status(201).json( // 201 생성 성공 코드 반환
      orderScheduleFields({ // 생성된 데이터 정렬하여 응답
        id: docRef.id, // 생성된 문서의 ID 포함
        ...newSchedule, // 저장된 필드 포함
        updatedAt: undefined, // 새로 생성된 것이므로 수정일은 없음
      })
    );
  } catch (error) { // 에러 발생 시 처리
    res.status(500).json({ message: "일정 등록에 실패했습니다.", error: error.message }); // 에러 정보 응답
  }
});

// 3. [PUT] 일정 수정
app.put("/api/schedules/:id", async (req, res) => { // 특정 일정 수정 API 경로
  try {
    const { id } = req.params; // URL 파라미터에서 문서 ID 추출
    // [수정] category 필드 추가 수신
    const { title, start, end, memo, color, category } = req.body; // 수정할 정보 추출

    const updateData = { // DB 업데이트용 데이터 객체 생성
      SCHEDULE_TITLE: title, // 제목 업데이트
      SCHEDULE_START: start, // 시작 시간 업데이트
      SCHEDULE_END: end, // 종료 시간 업데이트
      SCHEDULE_CONTENT: memo, // 메모 업데이트
      COLOR: color, // 색상 업데이트
      CATEGORY: category, // [추가] 카테고리 필드 업데이트
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // 수정 일시를 서버 시간으로 기록
    };

    await db.collection(COLLECTION).doc(id).update(updateData); // 해당 ID의 문서 업데이트 실행

    // ✅ 응답도 순서 고정해서 보기 좋게(선택이지만 같이 적용)
    res.json(orderScheduleFields({ id, ...updateData })); // 수정된 결과 정렬하여 응답
  } catch (error) { // 에러 발생 시 처리
    res.status(500).json({ message: "수정 실패", error: error.message }); // 에러 정보 응답
  }
});

// 4. [DELETE] 일정 삭제
app.delete("/api/schedules/:id", async (req, res) => { // 특정 일정 삭제 API 경로
  try {
    const { id } = req.params; // URL 파라미터에서 문서 ID 추출
    await db.collection(COLLECTION).doc(id).delete(); // Firestore에서 해당 문서 삭제
    res.json({ id, message: "삭제 성공" }); // 삭제 성공 결과 응답
  } catch (error) { // 에러 발생 시 처리
    res.status(500).json({ message: "삭제 실패", error: error.message }); // 에러 정보 응답
  }
});

app.listen(PORT, () => { // 서버 실행 시작
  console.log(`Firebase 연동 서버 가동 중: http://localhost:${PORT}`); // 실행 확인 메시지 출력
});