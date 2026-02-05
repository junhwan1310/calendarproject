import { useState, useEffect } from "react"; // React 훅(상태관리, 생명주기) 로드
import FullCalendar from "@fullcalendar/react"; // FullCalendar 컴포넌트 로드
import dayGridPlugin from "@fullcalendar/daygrid"; // 달력 월별 보기 플러그인
import timeGridPlugin from "@fullcalendar/timegrid"; // 달력 주/일별 시간 단위 보기 플러그인
import interactionPlugin from "@fullcalendar/interaction"; // 달력 클릭 및 드래그 인터랙션 플러그인
import { useDispatch, useSelector } from "react-redux"; // Redux 액션 실행 및 상태 조회를 위한 훅

import EventModal from "../components/EventModal"; // 일정 등록/수정 모달 컴포넌트 로드
import {
  getEventsFB,
  addEventFB,
  updateEventFB,
  deleteEventFB,
  clearError,
  setSearchTerm
} from "../redux/modules/calendarSlice"; // Redux Thunk 및 일반 액션 로드

export default function CalendarPage() {
  const dispatch = useDispatch(); // Redux 액션을 보내기 위한 함수 생성
  const { events, searchTerm, isLoading, error } = useSelector((state) => state.calendar); // 스토어에서 일정 데이터, 검색어, 로딩상태, 에러상태 추출

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 열림/닫힘 상태 관리
  const [selectedDate, setSelectedDate] = useState(null); // 달력에서 클릭한 날짜 정보 저장
  const [editEvent, setEditEvent] = useState(null); // 수정을 위해 선택한 일정 정보 저장
  const [selectedCategory, setSelectedCategory] = useState("all"); // [수정] 카테고리 필터링 상태 (기본값: 전체)

  useEffect(() => {
    dispatch(getEventsFB()); // 페이지 로드 시 Firebase에서 일정 데이터 가져오기 실행
  }, [dispatch]); // dispatch 함수 변경 시에만 실행 (최초 1회)

  useEffect(() => {
    if (error) { // 에러 상태가 존재할 경우
      alert(`⚠️ 에러 발생: ${error}`); // 사용자에게 알림
      dispatch(clearError()); // 에러 상태 초기화
    }
  }, [error, dispatch]); // error가 변경될 때마다 감시

  // [수정] 필터링 로직: 검색어와 선택된 '카테고리'에 따라 일정을 거름
  const filteredEvents = events.filter(event => { // 현재 불러온 일정들을 필터링
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || // 제목에 검색어 포함 여부
      (event.memo && event.memo.toLowerCase().includes(searchTerm.toLowerCase())); // 메모에 검색어 포함 여부
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory; // [수정] 선택된 카테고리와 일치 여부
    return matchesSearch && matchesCategory; // 검색어와 카테고리 조건을 모두 만족하는 일정만 반환
  });

  const handleDateClick = (arg) => { // 달력의 날짜 칸을 클릭했을 때 실행
    setEditEvent(null); // 신규 등록이므로 수정 데이터 비움
    setSelectedDate(arg.dateStr); // 클릭된 날짜 문자열 저장
    setIsModalOpen(true); // 모달창 열기
  };

  const handleEventClick = (arg) => { // 이미 등록된 일정을 클릭했을 때 실행
    const eventData = { // 클릭된 일정의 상세 정보를 객체로 구성
      id: arg.event.id, // 일정 고유 ID
      title: arg.event.title, // 일정 제목
      start: arg.event.startStr, // 일정 시작 시간
      end: arg.event.endStr, // 일정 종료 시간
      memo: arg.event.extendedProps.memo, // 확장 속성에서 메모 추출
      color: arg.event.backgroundColor, // 배경색 추출
      category: arg.event.extendedProps.category, // [추가] 확장 속성에서 카테고리 추출
    };
    setEditEvent(eventData); // 수정할 데이터 상태에 저장
    setIsModalOpen(true); // 모달창 열기
  };

  const handleSave = async (eventData) => { // 모달에서 '저장' 버튼을 눌렀을 때 실행
    try {
      if (editEvent) { // 수정 모드인 경우
        await dispatch(updateEventFB({ id: editEvent.id, patch: eventData })).unwrap(); // 업데이트 Thunk 실행
        alert("✅ 수정되었습니다!"); // 성공 메시지
      } else { // 신규 등록 모드인 경우
        await dispatch(addEventFB(eventData)).unwrap(); // 등록 Thunk 실행
        alert("✅ 등록되었습니다!"); // 성공 메시지
      }
      dispatch(getEventsFB()); // 데이터 변경 후 최신 목록 다시 불러오기
      setIsModalOpen(false); // 모달 닫기
    } catch (e) { } // 에러는 Slice에서 처리하므로 여기선 무시
  };

  const handleDelete = async (id) => { // 모달에서 '삭제' 버튼을 눌렀을 때 실행
    if (window.confirm("정말 삭제하시겠습니까?")) { // 삭제 확인 팝업
      try {
        await dispatch(deleteEventFB(id)).unwrap(); // 삭제 Thunk 실행
        dispatch(getEventsFB()); // 최신 목록 새로고침
        setIsModalOpen(false); // 모달 닫기
      } catch (e) { }
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#0d1117', color: '#c9d1d9', padding: '20px 0', minHeight: '100vh' }}>
      {isLoading && ( // 로딩 중일 때 표시할 화면
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h2>데이터를 처리 중입니다...</h2>
        </div>
      )}

      <div style={{ width: '90%', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input // 검색 입력창
            type="text"
            placeholder="일정 검색..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))} // 입력할 때마다 Redux 검색어 상태 업데이트
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#1c2128', color: 'white', width: '250px' }}
          />
          {/* [수정] 색상값 대신 카테고리 텍스트로 필터링 */}
          <select // 카테고리 선택 드롭다운
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)} // 선택 변경 시 필터 상태 업데이트
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#1c2128', color: 'white' }}
          >
            <option value="all">모든 카테고리</option>
            <option value="업무">업무</option>
            <option value="중요">중요</option>
            <option value="개인">개인</option>
          </select>
          <span style={{ color: '#8b949e' }}>검색 결과: {filteredEvents.length}건</span> {/* 현재 필터링된 일정 개수 표시 */}
        </div>

        <div style={{ backgroundColor: '#1c2128', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <FullCalendar // 메인 달력 컴포넌트
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 플러그인 장착
            initialView="dayGridMonth" // 최초 화면은 월별 보기
            events={filteredEvents} // 필터링된 일정을 달력에 표시
            dateClick={handleDateClick} // 날짜 클릭 이벤트 바인딩
            eventClick={handleEventClick} // 일정 클릭 이벤트 바인딩
            contentHeight="auto" // 높이 자동 조정
            aspectRatio={1.8} // 가로세로 비율 설정
            headerToolbar={{ // 상단 툴바 구성
              left: 'prev,next today', // 왼쪽: 이전/다음/오늘 버튼
              center: 'title', // 중앙: 연월 표시
              right: 'dayGridMonth,timeGridWeek,timeGridDay' // 오른쪽: 월/주/일 보기 전환
            }}
          />
        </div>
      </div>

      <EventModal // 일정 등록/수정용 모달 팝업
        isOpen={isModalOpen} // 열림 여부 전달
        onClose={() => setIsModalOpen(false)} // 닫기 함수 전달
        selectedDate={selectedDate} // 클릭된 날짜 전달
        onSave={handleSave} // 저장 처리 함수 전달
        editEvent={editEvent} // 수정할 데이터 전달 (없으면 신규)
        onDelete={handleDelete} // 삭제 처리 함수 전달
      />
    </div>
  );
}