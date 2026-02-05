import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // Slice 및 비동기 함수 생성 도구
import axios from "axios"; // HTTP 통신 라이브러리

const API_URL = "http://localhost:5000/api/schedules"; // 백엔드 서버 주소

const getErrorMessage = (error) => { // 에러 객체에서 메시지를 추출하는 도우미 함수
  return error.response?.data?.message || "서버와 통신하는 중 문제가 발생했습니다.";
};

// [비동기] 서버에서 일정 목록 가져오기
export const getEventsFB = createAsyncThunk(
  "calendar/getEvents",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL); // GET 요청
      return response.data.map((item) => ({ // 서버 필드명을 FullCalendar 포맷에 맞게 변환
        id: item.id,
        title: item.SCHEDULE_TITLE,
        start: item.SCHEDULE_START,
        end: item.SCHEDULE_END,
        memo: item.SCHEDULE_CONTENT,
        color: item.COLOR,
        category: item.CATEGORY, // [추가] DB의 CATEGORY 필드 가져오기
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error)); // 에러 발생 시 처리
    }
  }
);

// [비동기] 새로운 일정 추가하기
export const addEventFB = createAsyncThunk(
  "calendar/addEvent",
  async (newEvent, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, newEvent); // POST 요청
      return response.data; // 등록된 결과 반환
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// [비동기] 기존 일정 수정하기
export const updateEventFB = createAsyncThunk(
  "calendar/updateEvent",
  async ({ id, patch }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, patch); // PUT 요청
      return response.data; // 수정된 결과 반환
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// [비동기] 일정 삭제하기
export const deleteEventFB = createAsyncThunk(
  "calendar/deleteEvent",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // DELETE 요청
      return id; // 삭제된 ID 반환
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar", // 슬라이스 이름
  initialState: { // 초기 상태값
    events: [], // 일정 배열
    searchTerm: "", // 검색어
    isLoading: false, // 로딩 상태
    error: null, // 에러 메시지
  },
  reducers: { // 동기적인 액션 처리
    setSearchTerm: (state, action) => { // 검색어 변경 시
      state.searchTerm = action.payload; // 상태 업데이트
    },
    clearError: (state) => { // 에러 초기화 시
      state.error = null; // 상태 초기화
    }
  },
  extraReducers: (builder) => { // 비동기 액션(createAsyncThunk)의 상태별 처리
    builder
      .addCase(getEventsFB.pending, (state) => { // 가져오기 시작
        state.isLoading = true; // 로딩 중
        state.error = null;
      })
      .addCase(getEventsFB.fulfilled, (state, action) => { // 가져오기 완료
        state.isLoading = false; // 로딩 해제
        state.events = action.payload; // 데이터 저장
      })
      .addCase(getEventsFB.rejected, (state, action) => { // 가져오기 실패
        state.isLoading = false;
        state.error = action.payload; // 에러 저장
      })
      .addCase(addEventFB.pending, (state) => { // 등록 시작
        state.isLoading = true;
      })
      .addCase(addEventFB.fulfilled, (state) => { // 등록 완료
        state.isLoading = false;
      })
      .addCase(addEventFB.rejected, (state, action) => { // 등록 실패
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSearchTerm } = calendarSlice.actions; // 외부에서 쓸 액션 내보내기
export default calendarSlice.reducer; // 스토어에 등록할 리듀서 내보내기