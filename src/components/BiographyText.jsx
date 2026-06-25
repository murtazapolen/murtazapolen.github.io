import React from 'react';

export default function BiographyText({ children }) {
  if (children) {
    return <div className="biography">{children}</div>;
  }

  return (
    <div className="biography">
      <p>
        That guy is an artist by heart and profession leading a minimalist lifestyle, an animal lover, explorer and a hobby photographer.
      </p>
      <p>
        That guy is also an avid planter who specialises with indoor plants & also works with a lot of growers to promote use of house hold waste as a fertiliser.
      </p>
      <p className="hashtag-bio">
        #interiorwala likes to calculate his personal carbon footprint too, along with that of his sites.
      </p>
    </div>
  );
}
