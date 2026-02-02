const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = 5000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.use(cors());
app.use(express.json());

const COLLECTION = "schedules";

/**
 * ✅ [추가] 응답 JSON의 키 순서를 강제로 고정하는 헬퍼
 * - 기능에는 영향 없음
 * - Postman에서 보기 좋게 "항상 같은 순서"로 출력되게 함
 */
const orderScheduleFields = (raw) => {
  return {
    id: raw.id,

    // 원하는 순서대로 배치
    SCHEDULE_TITLE: raw.SCHEDULE_TITLE,
    SCHEDULE_CONTENT: raw.SCHEDULE_CONTENT,
    CATEGORY: raw.CATEGORY,
    SCHEDULE_START: raw.SCHEDULE_START,
    SCHEDULE_END: raw.SCHEDULE_END,
    COLOR: raw.COLOR,

    // Firestore timestamp는 객체라 뒤쪽으로
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

// 1. [GET] 일정 조회
app.get("/api/schedules", async (req, res) => {
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    // 기존: { id, ...doc.data() } 로 뿌려서 키 순서가 들쑥날쑥 보였음
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ [추가] 키 순서 고정해서 응답
    const orderedSchedules = schedules.map(orderScheduleFields);

    res.json(orderedSchedules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "데이터를 불러오지 못했습니다.", error: error.message });
  }
});

// 2. [POST] 일정 등록
app.post("/api/schedules", async (req, res) => {
  try {
    // [수정] category 필드 추가 수신
    const { title, start, end, memo, color, category } = req.body;

    if (!start.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      return res
        .status(400)
        .json({ message: "시작 시간 형식이 올바르지 않습니다." });
    }
    if (!end.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      return res
        .status(400)
        .json({ message: "종료 시간 형식이 올바르지 않습니다." });
    }

    const newSchedule = {
      SCHEDULE_TITLE: title,
      SCHEDULE_START: start,
      SCHEDULE_END: end,
      SCHEDULE_CONTENT: memo || "",
      COLOR: color || "#238636",
      CATEGORY: category || "업무", // [추가] 카테고리 필드 저장
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTION).add(newSchedule);

    // ✅ 응답도 순서 고정해서 보기 좋게(선택이지만 같이 적용)
    res.status(201).json(
      orderScheduleFields({
        id: docRef.id,
        ...newSchedule,
        updatedAt: undefined,
      })
    );
  } catch (error) {
    res.status(500).json({ message: "일정 등록에 실패했습니다.", error: error.message });
  }
});

// 3. [PUT] 일정 수정
app.put("/api/schedules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // [수정] category 필드 추가 수신
    const { title, start, end, memo, color, category } = req.body;

    const updateData = {
      SCHEDULE_TITLE: title,
      SCHEDULE_START: start,
      SCHEDULE_END: end,
      SCHEDULE_CONTENT: memo,
      COLOR: color,
      CATEGORY: category, // [추가] 카테고리 필드 업데이트
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(COLLECTION).doc(id).update(updateData);

    // ✅ 응답도 순서 고정해서 보기 좋게(선택이지만 같이 적용)
    res.json(orderScheduleFields({ id, ...updateData }));
  } catch (error) {
    res.status(500).json({ message: "수정 실패", error: error.message });
  }
});

// 4. [DELETE] 일정 삭제
app.delete("/api/schedules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    res.json({ id, message: "삭제 성공" });
  } catch (error) {
    res.status(500).json({ message: "삭제 실패", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Firebase 연동 서버 가동 중: http://localhost:${PORT}`);
});
