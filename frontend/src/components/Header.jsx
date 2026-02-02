import React from 'react';

const Header = () => {
  return (
    <header style={{ 
      backgroundColor: '#161b22', 
      padding: '1rem 2rem', 
      borderBottom: '1px solid #30363d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}></span>
        <h1 style={{ color: '#58a6ff', fontSize: '20px', margin: 0 }}>일정관리 프로젝트</h1>
      </div>
      <nav style={{ color: '#8b949e', fontSize: '14px' }}>
        박준환
      </nav>
    </header>
  );
};

export default Header;