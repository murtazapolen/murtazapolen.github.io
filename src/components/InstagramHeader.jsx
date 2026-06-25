import React from 'react';

export default function InstagramHeader() {
  return (
    <div className="instagram-header">
      <a href="https://instagram.com/that_interiorwala" target="_blank" rel="noopener noreferrer" className="ig-link">
        <div className="ig-logo-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ig-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
        <h2>@that_interiorwala</h2>
      </a>
    </div>
  );
}
