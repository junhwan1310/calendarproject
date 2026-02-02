import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/schedules";

const getErrorMessage = (error) => {
  return error.response?.data?.message || "서버와 통신하는 중 문제가 발생했습니다.";
};

export const getEventsFB = createAsyncThunk(
  "calendar/getEvents",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.map((item) => ({
        id: item.id,
        title: item.SCHEDULE_TITLE,
        start: item.SCHEDULE_START,
        end: item.SCHEDULE_END,
        memo: item.SCHEDULE_CONTENT,
        color: item.COLOR,
        category: item.CATEGORY, // [추가] DB의 CATEGORY 필드 가져오기
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addEventFB = createAsyncThunk(
  "calendar/addEvent",
  async (newEvent, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, newEvent);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateEventFB = createAsyncThunk(
  "calendar/updateEvent",
  async ({ id, patch }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, patch);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteEventFB = createAsyncThunk(
  "calendar/deleteEvent",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events: [],
    searchTerm: "",
    isLoading: false,
    error: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventsFB.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventsFB.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(getEventsFB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addEventFB.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addEventFB.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addEventFB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSearchTerm } = calendarSlice.actions;
export default calendarSlice.reducer;