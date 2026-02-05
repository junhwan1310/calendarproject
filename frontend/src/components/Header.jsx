import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      backgroundColor: '#161b22', // 상단 바 배경색
      padding: '1rem 2rem', // 안쪽 여백
      borderBottom: '1px solid #30363d', // 하단 구분선
      display: 'flex', // 가로 정렬을 위한 flex 설정
      justifyContent: 'space-between', // 양 끝으로 요소 배치
      alignItems: 'center' // 세로 가운데 정렬
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}></span>
        <h1 style={{ color: '#58a6ff', fontSize: '20px', margin: 0 }}>일정관리 프로젝트</h1> {/* 프로젝트 제목 */}
      </div>
      <nav style={{ color: '#8b949e', fontSize: '14px' }}>
        박준환 {/* 사용자/작성자 이름 */}
      </nav>
    </header>
  );
};

export default Header;