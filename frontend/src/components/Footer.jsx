import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#0d1117', // 하단 배경색
      padding: '2rem', // 안쪽 여백
      textAlign: 'center', // 텍스트 중앙 정렬
      borderTop: '1px solid #30363d', // 상단 구분선
      marginTop: '40px', // 위쪽 외부 여백
      color: '#8b949e' // 글자색
    }}>
      <p style={{ margin: '0 0 10px 0' }}>© 2026 KOSMO. All rights reserved.</p> {/* 카피라이트 문구 */}
      <div style={{ fontSize: '12px' }}>
        <span style={{ color: '#eeff00' }}></span> 박준환 {/* 작성자 이름 */}
      </div>
    </footer>
  );
};

export default Footer;