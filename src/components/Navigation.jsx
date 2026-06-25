import React, { useState } from 'react';
import SocialIcons from './SocialIcons';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* <LightbulbLogo scale={0.4} hideText={false} /> */}
          MURTAZA POLEN
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Desktop Menu */}
          <div className="nav-links desktop-only">
            <button onClick={() => scrollTo('about')}>About Me</button>
            <button onClick={() => scrollTo('reviews')}>Testimonials</button>
            <button onClick={() => scrollTo('contact')}>Contact Me</button>
          </div>

          {/* Socials */}
          <div className="nav-socials" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <SocialIcons gap="15px" iconSize={24} />
          </div>

          {/* Mobile Hamburger */}
          <button className="hamburger mobile-only" onClick={() => setIsOpen(!isOpen)}>
            {/* Sleek hamburger lines matching the screenshot */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="15" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <button onClick={() => scrollTo('about')}>About Me</button>
        <button onClick={() => scrollTo('reviews')}>Testimonials</button>
        <button onClick={() => scrollTo('contact')}>Contact Me</button>
      </div>
    </nav>
  );
}
