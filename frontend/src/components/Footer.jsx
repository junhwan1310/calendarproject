import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#0d1117', 
      padding: '2rem', 
      textAlign: 'center', 
      borderTop: '1px solid #30363d',
      marginTop: '40px',
      color: '#8b949e'
    }}>
      <p style={{ margin: '0 0 10px 0' }}>© 2026 KOSMO. All rights reserved.</p>
      <div style={{ fontSize: '12px' }}>
        <span style={{ color: '#eeff00' }}></span> 박준환
      </div>
    </footer>
  );
};

export default Footer;