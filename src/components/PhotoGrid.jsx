import React, { useState, useEffect, useCallback } from 'react';

export default function PhotoGrid({ photos = [], layoutClass = "layout-default", isDraggable = false, onReorder, onPhotoClick }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLayoutReady, setIsLayoutReady] = useState(layoutClass !== 'layout-dynamic');

  // If no photos passed, use the default from the first card
  const defaultPhotos = [
    "/images/aboutme/Murtu%204.0-3.jpg",
    "/images/aboutme/Murtu-10.jpg",
    "/images/aboutme/Murtu-9.jpg",
    "/images/aboutme/Murtu-20.jpg",
    "/images/aboutme/Murtu%204.0-5.jpg"
  ];

  const imagesToRender = photos.length > 0 ? photos : defaultPhotos;

  const openLightbox = (index) => {
    if (isDraggable) {
      if (onPhotoClick) onPhotoClick(index);
      return; 
    }
    setIsLoading(true);
    setLightboxIndex(index);
  };

  // ... (keeping lightbox functions the same)
  const closeLightbox = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setLightboxIndex(null);
      setIsClosing(false);
    }, 300); // matches CSS animation duration
  }, []);

  const nextPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (imagesToRender.length <= 1) return;
    setIsLoading(true);
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % imagesToRender.length : null));
  }, [imagesToRender.length]);

  const prevPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (imagesToRender.length <= 1) return;
    setIsLoading(true);
    setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? imagesToRender.length - 1 : prev - 1) : null));
  }, [imagesToRender.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling when lightbox is open
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto]);

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPhoto();
    }
    if (isRightSwipe) {
      prevPhoto();
    }
  };

  // ImageKit Integration
  const IMAGEKIT_URL = "https://ik.imagekit.io/murtazapolen/";

  const getOptimizedImage = (rawPath, width = 800) => {
    if (!rawPath) return "";
    // Strip our custom shape and focus override query params
    let imagePath = rawPath.split('?shape=')[0].split('?focus=')[0].split('&focus=')[0].split('&shape=')[0];
    
    // If it's an external URL (like Unsplash), don't touch it
    if (imagePath.startsWith('http')) return imagePath;

    // Remove leading slash so we don't get double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    // Apply automatic format, automatic quality, and resize
    return `${IMAGEKIT_URL}${cleanPath}?tr=w-${width},f-auto,q-auto`;
  };

  const [imageShapes, setImageShapes] = useState({});

  useEffect(() => {
    if (layoutClass !== 'layout-dynamic') return;

    const unmeasuredPhotos = imagesToRender
      .map((photo, index) => ({ photo, index }))
      .filter(item => !imageShapes[item.index]);
      
    if (unmeasuredPhotos.length === 0) return;

    const shapePromises = unmeasuredPhotos.map(({ photo, index }) => {
      return new Promise((resolve) => {
        // Check for explicit override in the string e.g. "path.jpg?shape=landscape"
        const shapeMatch = photo.match(/[?&]shape=(landscape|portrait|square)/);
        if (shapeMatch) {
          resolve({ index, shape: shapeMatch[1] });
          return;
        }

        const img = new Image();
        // Load a tiny version to get dimensions blazingly fast
        img.src = getOptimizedImage(photo, 100);
        img.onload = () => {
          const ratio = img.width / img.height;
          let shape = 'square';

          // Very sensitive thresholds to catch slight rectangles
          if (ratio > 1.05) {
            shape = 'landscape';
          } else if (ratio < 0.95) {
            shape = 'portrait';
          } else {
            // If it's perfectly square, force it into an assorted layout
            shape = index % 2 === 0 ? 'portrait' : 'landscape';
          }

          resolve({ index, shape });
        };
        img.onerror = () => resolve({ index, shape: 'square' });
      });
    });

    Promise.all(shapePromises).then(results => {
      setImageShapes(prev => {
        const nextShapes = { ...prev };
        results.forEach(res => {
          nextShapes[res.index] = res.shape;
        });
        return nextShapes;
      });
      // Allow a tiny tick for React to apply the CSS classes before fading in
      setTimeout(() => setIsLayoutReady(true), 50);
    });
  }, [imagesToRender, layoutClass]);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    if (!isDraggable) return;
    setDraggedIndex(index);
    // Set data for the drag operation (needed for Firefox)
    e.dataTransfer.setData('text/plain', index);
    // Add styling class
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    if (!isDraggable) return;
    setDraggedIndex(null);
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    if (!isDraggable) return;
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, targetIndex) => {
    if (!isDraggable) return;
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    // Call the parent callback to actually perform the reorder
    if (onReorder) {
      onReorder(draggedIndex, targetIndex);
    }
  };

  return (
    <>
      <div 
        className={`photo-grid ${layoutClass}`}
        style={{ 
          opacity: isLayoutReady ? 1 : 0, 
          transition: 'opacity 0.5s ease-in-out',
          visibility: isLayoutReady ? 'visible' : 'hidden'
        }}
      >
        {imagesToRender.map((photo, index) => {
          let shapeClass = '';
          if (layoutClass === 'layout-dynamic') {
            shapeClass = `shape-${imageShapes[index] || 'square'}`;
          }

          // Parse focus override
          const focusMatch = photo.match(/[?&]focus=(top|bottom|left|right|center)/);
          const objectPosition = focusMatch ? focusMatch[1] : 'center';

          return (
            <img 
              key={photo + index} // unique key ensures remounts when order changes
              src={getOptimizedImage(photo)} 
              alt={`Gallery ${index + 1}`} 
              className={`photo-item photo-${index + 1} ${shapeClass} ${draggedIndex === index ? 'dragging-active' : ''}`}
              style={{ objectPosition }}
              onClick={() => openLightbox(index)}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              loading="lazy"
            />
          );
        })}
      </div>

      {(lightboxIndex !== null || isClosing) && (
        <div
          className={`lightbox-overlay ${isClosing ? 'closing' : ''}`}
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndEvent}
        >
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          {imagesToRender.length > 1 && <button className="lightbox-prev" onClick={prevPhoto}>‹</button>}

          {isLoading && <div className="spinner"></div>}
          <img
            key={lightboxIndex}
            src={getOptimizedImage(imagesToRender[lightboxIndex], 1600)}
            alt="Fullscreen View"
            className={`lightbox-image ${!isLoading ? 'loaded' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setIsLoading(false)}
          />

          {imagesToRender.length > 1 && <button className="lightbox-next" onClick={nextPhoto}>›</button>}

          <div className="lightbox-counter">
            {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {imagesToRender.length}
          </div>
        </div>
      )}
    </>
  );
}
