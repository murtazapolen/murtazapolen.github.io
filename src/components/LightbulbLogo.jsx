import React from 'react';

export default function LightbulbLogo({ scale = 1, hideText = false }) {
  const w = 60 * scale;
  const h = 90 * scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <svg width={w} height={h} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Main Body Gradient - Golden/Amber Photorealistic */}
          <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fffaf0" stopOpacity="1" />
            <stop offset="20%" stopColor="#ffe066" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
          </radialGradient>
          
          {/* Intense center glow behind filament */}
          <radialGradient id="coreGlow" cx="50%" cy="45%" r="30%" fx="50%" fy="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Base Metal Gradient */}
          <linearGradient id="metalBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8c8c8c" />
            <stop offset="25%" stopColor="#d9d9d9" />
            <stop offset="50%" stopColor="#f2f2f2" />
            <stop offset="75%" stopColor="#a6a6a6" />
            <stop offset="100%" stopColor="#595959" />
          </linearGradient>

          {/* Filament Glow Filter */}
          <filter id="filamentGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Bulb Outer Blur (Ambient Glow) */}
          <filter id="ambientGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Ambient Outer Glow */}
        <path d="M50 5 C20 5, 5 28, 5 55 C5 80, 25 90, 30 105 L70 105 C75 90, 95 80, 95 55 C95 28, 80 5, 50 5 Z" fill="#fbbf24" filter="url(#ambientGlow)" opacity="0.4"/>
        
        {/* Main Bulb Body */}
        <path d="M50 5 C20 5, 5 28, 5 55 C5 80, 25 90, 30 105 L70 105 C75 90, 95 80, 95 55 C95 28, 80 5, 50 5 Z" fill="url(#bulbGlow)"/>
        
        {/* Core Brightness */}
        <path d="M50 5 C20 5, 5 28, 5 55 C5 80, 25 90, 30 105 L70 105 C75 90, 95 80, 95 55 C95 28, 80 5, 50 5 Z" fill="url(#coreGlow)" opacity="0.9"/>
        
        {/* Glass Reflections / Specular Highlights */}
        <path d="M40 10 C25 12, 12 28, 12 50" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" filter="url(#filamentGlow)"/>
        <path d="M85 45 C88 65, 75 85, 65 95" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
        
        {/* Internal Glass Stem */}
        <path d="M42 105 L45 80 C45 75, 55 75, 55 80 L58 105" fill="#fcd34d" opacity="0.6"/>
        <path d="M47 80 L47 55 M53 80 L53 55" stroke="#78350f" strokeWidth="2" opacity="0.8"/>

        {/* The Pink/White Filament */}
        <path d="M35 48 Q40 43 50 48 T65 48" stroke="#ffccdd" strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#filamentGlow)"/>
        <path d="M35 48 Q40 43 50 48 T65 48" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Base / Threads */}
        <rect x="30" y="105" width="40" height="6" fill="url(#metalBase)" rx="2"/>
        <rect x="32" y="112" width="36" height="6" fill="url(#metalBase)" rx="2"/>
        <rect x="32" y="119" width="36" height="6" fill="url(#metalBase)" rx="2"/>
        <rect x="34" y="126" width="32" height="5" fill="url(#metalBase)" rx="2"/>
        <path d="M38 132 L62 132 L55 142 L45 142 Z" fill="#262626"/>
      </svg>
      
      {!hideText && (
        <div style={{ textAlign: 'center', lineHeight: '0.85', marginTop: '5px' }}>
          <div style={{ 
            fontFamily: '"Arial Black", "Impact", sans-serif', 
            fontWeight: '900', 
            fontSize: `${14 * scale}px`, 
            color: 'transparent', 
            WebkitTextStroke: '1px #b3b3b3',
            letterSpacing: '-0.5px',
            textTransform: 'lowercase'
          }}>
            ideas inside
          </div>
          <div style={{ 
            fontFamily: '"Arial Black", "Impact", sans-serif', 
            fontWeight: '900', 
            fontSize: `${14 * scale}px`, 
            color: '#b3b3b3', 
            letterSpacing: '-0.5px',
            textTransform: 'lowercase'
          }}>
            inside ideas
          </div>
        </div>
      )}
    </div>
  );
}
