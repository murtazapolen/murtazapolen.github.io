import React from 'react';
import SocialIcons from './SocialIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px 80px',
      width: '100%',
      gap: '30px',
      color: '#111'
    }}>
      {/* Social Icons */}
      <SocialIcons gap="25px" iconSize={30} />

      {/* Copyright Text */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '15px',
        letterSpacing: '1px',
        textAlign: 'center',
        lineHeight: '1.8'
      }}>
        {currentYear} Murtaza Polen, All images<br className="desktop-only" /> and videos are copyrighted.
      </div>
    </footer>
  );
}
