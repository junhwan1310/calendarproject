import React from 'react';
import CalendarPage from './pages/CalendarPage'; // 달력 페이지 로드
import Header from './components/Header'; // 헤더 컴포넌트 로드
import Footer from './components/Footer'; // 푸터 컴포넌트 로드

function App() {
  return (
    <div style={{ 
      display: 'flex', // 플렉스 레이아웃 사용
      flexDirection: 'column', // 요소를 세로로 배치
      minHeight: '100vh', // 전체 화면 높이를 최소 100%로 설정 (Footer 고정 목적)
      backgroundColor: '#0d1117' // 전체 배경색
    }}>
      <Header /> {/* 상단바 표시 */}
      
      <main style={{ flex: 1 }}> {/* 남은 공간을 모두 차지하여 Footer를 바닥으로 밀어냄 */}
        <CalendarPage /> {/* 실제 달력 콘텐츠 표시 */}
      </main>
      
      <Footer /> {/* 하단바 표시 */}
    </div>
  );
}

export default App;