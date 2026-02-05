import React, { useState, useEffect } from 'react';

export default function EventModal({ isOpen, onClose, selectedDate, onSave, editEvent, onDelete }) {
  // 컴포넌트 내부 입력값을 관리하기 위한 로컬 상태들
  const [title, setTitle] = useState(""); // 일정 제목
  const [startTime, setStartTime] = useState(""); // 시작 시간
  const [endTime, setEndTime] = useState(""); // 종료 시간
  const [memo, setMemo] = useState(""); // 메모 내용
  const [color, setColor] = useState("#238636"); // 선택된 색상
  const [category, setCategory] = useState("업무"); // [추가] 카테고리 선택 상태

  // datetime-local 입력창이 인식하는 "YYYY-MM-DDTHH:MM" 포맷으로 변환하는 도우미 함수
const toDateTimeLocalValue = (v) => {
  if (!v) return ""; // 값이 없으면 빈문자열
  const d = v instanceof Date ? v : new Date(v); // Date 객체 생성
  if (isNaN(d.getTime())) return ""; // 유효하지 않은 날짜면 빈문자열

const pad = (n) => String(n).padStart(2, "0"); // 한 자리 숫자 앞에 0 붙이기
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};


  useEffect(() => {
    if (editEvent) { // 수정 모드인 경우
      setTitle(editEvent.title); // 기존 제목 세팅
      setStartTime(toDateTimeLocalValue(editEvent.start)); // 기존 시작 시간 세팅
      setEndTime(toDateTimeLocalValue(editEvent.end)); // 기존 종료 시간 세팅
      setMemo(editEvent.memo); // 기존 메모 세팅
      setColor(editEvent.color || "#238636"); // 기존 색상 세팅
      setCategory(editEvent.category || "업무"); // [추가] 기존 카테고리 세팅
    } else { // 신규 등록 모드인 경우
      setTitle(""); // 제목 초기화
      setStartTime(`${selectedDate}T09:00`); // 선택한 날짜의 오전 9시로 초기화
      setEndTime(`${selectedDate}T10:00`); // 선택한 날짜의 오전 10시로 초기화
      setMemo(""); // 메모 초기화
      setColor("#238636"); // 기본 색상 초록
      setCategory("업무"); // [추가] 기본 카테고리 '업무'
    }
  }, [editEvent, selectedDate, isOpen]); // 모달이 열리거나 수정 데이터가 바뀔 때 실행

  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 그리지 않음

  const handleSubmit = () => { // 저장 버튼 클릭 시 실행
    if (!title.trim()) { // 제목 미입력 검사
      alert("제목을 입력해주세요!");
      return;
    }

    if (new Date(startTime) > new Date(endTime)) { // 시간 논리 오류 검사
      alert("종료 시간이 시작 시간보다 빠를 수 없습니다.");
      return;
    }

    // [수정] 부모 컴포넌트의 onSave 함수에 현재 입력된 데이터들을 전달
    onSave({ title, start: startTime, end: endTime, memo, color, category });
  };

  // 공통 입력창 스타일
  const inputStyle = {
    width: '100%', padding: '8px', marginTop: '5px', marginBottom: '15px',
    backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '4px',
    color: 'white', boxSizing: 'border-box'
  };

  return (
    <div className="modal-overlay" style={{ // 어두운 배경 처리
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: '#1c2128', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #30363d' }}>
        <h2 style={{ marginTop: 0, color: '#58a6ff' }}>{editEvent ? "일정 수정" : "새 일정 등록"}</h2>

        <label>일정 이름</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

        <label>시작 일시</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={inputStyle} />

        <label>종료 일시</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle} />

        <label>일정 색상</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} // 컬러 피커
            style={{ width: '50px', height: '30px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }} />
          <span>{color}</span>
        </div>

        {/* [추가] 카테고리 선택 공간 */}
        <label>중요도 카테고리</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="업무">업무</option>
          <option value="중요">중요</option>
          <option value="개인">개인</option>
        </select>

        <label>메모</label>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ ...inputStyle, height: '80px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <div>
            {editEvent && ( // 수정 모드일 때만 삭제 버튼 표시
              <button onClick={() => onDelete(editEvent.id)}
                style={{ padding: '8px 16px', backgroundColor: '#da3633', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                삭제
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
            <button onClick={handleSubmit} style={{ padding: '8px 16px', backgroundColor: '#238636', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}