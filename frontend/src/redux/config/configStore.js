import { configureStore } from "@reduxjs/toolkit"; // 리덕스 창고를 만드는 도구
import calendarReducer from "../modules/calendarSlice"; // 우리가 만든 일정 관리 로직

const store = configureStore({
  // 1. reducer: 창고 안에 어떤 섹션(부서)을 만들지 정합니다.
  reducer: {
    calendar: calendarReducer, // 'calendar'라는 이름의 부서에서 모든 일정을 관리합니다.
  },
  // 2. middleware: 데이터가 오고 갈 때 중간에서 검사하는 역할입니다.
  // serializableCheck: false는 파이어베이스의 특수한 데이터 형식(타임스탬프 등) 때문에 발생하는 에러를 무시해줍니다.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store; // 다른 파일(main.jsx)에서 이 창고를 쓸 수 있게 내보냅니다.