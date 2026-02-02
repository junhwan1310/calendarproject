import React, { useState, useEffect } from 'react';

export default function EventModal({ isOpen, onClose, selectedDate, onSave, editEvent, onDelete }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [memo, setMemo] = useState("");
  const [color, setColor] = useState("#238636");
  const [category, setCategory] = useState("업무"); // [추가] 카테고리 로컬 상태

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setStartTime(editEvent.start);
      setEndTime(editEvent.end);
      setMemo(editEvent.memo);
      setColor(editEvent.color || "#238636");
      setCategory(editEvent.category || "업무"); // [추가] 수정 시 기존 카테고리 로드
    } else {
      setTitle("");
      setStartTime(`${selectedDate}T09:00`);
      setEndTime(`${selectedDate}T10:00`);
      setMemo("");
      setColor("#238636");
      setCategory("업무"); // [추가] 등록 시 기본값 설정
    }
  }, [editEvent, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    if (new Date(startTime) > new Date(endTime)) {
      alert("종료 시간이 시작 시간보다 빠를 수 없습니다.");
      return;
    }

    // [수정] onSave 호출 시 category 데이터 포함
    onSave({ title, start: startTime, end: endTime, memo, color, category });
  };

  const inputStyle = { 
    width: '100%', padding: '8px', marginTop: '5px', marginBottom: '15px', 
    backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '4px', 
    color: 'white', boxSizing: 'border-box' 
  };

  return (
    <div className="modal-overlay" style={{
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
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} 
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
            {editEvent && (
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