import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";

import EventModal from "../components/EventModal";
import {
  getEventsFB,
  addEventFB,
  updateEventFB,
  deleteEventFB,
  clearError,
  setSearchTerm
} from "../redux/modules/calendarSlice";

export default function CalendarPage() {
  const dispatch = useDispatch();
  const { events, searchTerm, isLoading, error } = useSelector((state) => state.calendar);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all"); // [수정] 색상 필터 대신 카테고리 필터 상태

  useEffect(() => {
    dispatch(getEventsFB());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(`⚠️ 에러 발생: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // [수정] 필터링 로직: 검색어와 선택된 '카테고리'에 따라 일정을 거름
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.memo && event.memo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory; // [수정] category 기준 필터
    return matchesSearch && matchesCategory;
  });

  const handleDateClick = (arg) => {
    setEditEvent(null);
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg) => {
    const eventData = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      memo: arg.event.extendedProps.memo,
      color: arg.event.backgroundColor,
      category: arg.event.extendedProps.category, // [추가] 모달에 카테고리 전달
    };
    setEditEvent(eventData);
    setIsModalOpen(true);
  };

  const handleSave = async (eventData) => {
    try {
      if (editEvent) {
        await dispatch(updateEventFB({ id: editEvent.id, patch: eventData })).unwrap();
        alert("✅ 수정되었습니다!");
      } else {
        await dispatch(addEventFB(eventData)).unwrap();
        alert("✅ 등록되었습니다!");
      }
      dispatch(getEventsFB());
      setIsModalOpen(false);
    } catch (e) { }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await dispatch(deleteEventFB(id)).unwrap();
        dispatch(getEventsFB());
        setIsModalOpen(false);
      } catch (e) { }
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#0d1117', color: '#c9d1d9', padding: '20px 0', minHeight: '100vh' }}>
      {isLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h2>데이터를 처리 중입니다...</h2>
        </div>
      )}

      <div style={{ width: '90%', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="일정 검색..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#1c2128', color: 'white', width: '250px' }}
          />
          {/* [수정] 색상값 대신 카테고리 텍스트로 필터링 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#1c2128', color: 'white' }}
          >
            <option value="all">모든 카테고리</option>
            <option value="업무">업무</option>
            <option value="중요">중요</option>
            <option value="개인">개인</option>
          </select>
          <span style={{ color: '#8b949e' }}>검색 결과: {filteredEvents.length}건</span>
        </div>

        <div style={{ backgroundColor: '#1c2128', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            contentHeight="auto"
            aspectRatio={1.8}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSave}
        editEvent={editEvent}
        onDelete={handleDelete}
      />
    </div>
  );
}