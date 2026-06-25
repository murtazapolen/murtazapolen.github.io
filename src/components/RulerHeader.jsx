import React from 'react';

export default function RulerHeader() {
  const ticks = [];
  // Generate 250 ticks to cover up to 2500px width (ultra-wide monitors)
  for (let i = 0; i <= 250; i++) {
    const x = i * 10;
    const isMajor = i % 10 === 0;
    const isHalf = i % 5 === 0 && !isMajor;
    
    // Ticks extend downward to touch the main horizontal line
    const y1 = isMajor ? 10 : (isHalf ? 20 : 28);
    
    ticks.push(
      <line key={`tick-${i}`} x1={x} y1={y1} x2={x} y2={45} stroke="#333" strokeWidth={isMajor ? 1.5 : 1} />
    );
  }

  const numbers = [];
  for (let i = 1; i <= 25; i++) {
    numbers.push(
      <text key={`num-${i}`} x={i * 100} y={65} fontSize="13" fontFamily="Arial, sans-serif" fill="#555" textAnchor="middle">
        {i}
      </text>
    );
  }

  return (
    <div className="ruler-header-container" style={{ position: 'relative', width: '100%', borderBottom: '1px solid #eee', backgroundColor: '#fff', height: '80px', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
      
      {/* Absolute size SVG to prevent scaling */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Main horizontal line */}
        <line x1="0" y1="45" x2="3000" y2="45" stroke="#333" strokeWidth="1.5" />
        
        {/* Ticks */}
        {ticks}
        
        {/* 'mm' text at the start */}
        <text x="10" y={65} fontSize="12" fontFamily="Arial, sans-serif" fill="#555" textAnchor="start">
          mm
        </text>

        {/* Numbers */}
        {numbers}
      </svg>

      {/* Overlaid Name Block (Responsive positioning) */}
      <div style={{ 
        position: 'absolute', 
        top: '28px', 
        right: '5%', 
        backgroundColor: '#fff', 
        padding: '0 20px', 
        fontSize: 'clamp(18px, 4vw, 24px)', 
        fontWeight: 'bold', 
        fontFamily: 'Arial, sans-serif', 
        color: '#000', 
        letterSpacing: '1px',
        zIndex: 10
      }}>
        MURTAZA POLEN
      </div>
      
    </div>
  );
}
