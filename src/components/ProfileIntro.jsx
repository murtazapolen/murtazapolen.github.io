import React from 'react';
import LightbulbLogo from './LightbulbLogo';

export default function ProfileIntro() {
  return (
    <div className="profile-intro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1>
        Murtaza Polen<br />
        Organic Interior Designer<br />
        Art Curator
      </h1>
      <LightbulbLogo scale={1} />
    </div>
  );
}
