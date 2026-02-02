import React from 'react';
import CalendarPage from './pages/CalendarPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', // Footer를 바닥에 고정하기 위한 설정
      backgroundColor: '#0d1117' 
    }}>
      <Header />
      
      <main style={{ flex: 1 }}> {/* 남은 공간을 다 차지하게 함 */}
        <CalendarPage />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;