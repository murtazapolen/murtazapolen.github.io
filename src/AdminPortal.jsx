import React, { useState, useEffect } from 'react';
import './AdminPortal.css';
import PhotoGrid from './components/PhotoGrid';

function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Master-Detail State
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'edit'
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftReview, setDraftReview] = useState(null); // Holds the review currently being edited

  // Hardcoded credentials simulating CI/CD environment variables
  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'salt123';

  // Load reviews on mount
  useEffect(() => {
    fetch('/src/data/reviews.json')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error loading reviews:", err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const saveChanges = async (reviewsToSave = reviews) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewsToSave, null, 2)
      });
      if (response.ok) {
        alert('Changes saved successfully! The main website will instantly update.');
      } else {
        alert('Failed to save changes. Check console.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving changes.');
    }
    setIsSaving(false);
  };

  const [settingsModalIndex, setSettingsModalIndex] = useState(null);

  // Draft Updates
  const updateDraft = (field, value) => {
    setDraftReview(prev => ({ ...prev, [field]: value }));
  };

  const updateDraftPhoto = (photoIndex, value) => {
    setDraftReview(prev => {
      const photos = [...prev.photos];
      photos[photoIndex] = value;
      return { ...prev, photos };
    });
  };

  const addDraftPhoto = () => {
    setDraftReview(prev => ({ ...prev, photos: [...prev.photos, ''] }));
  };

  const removeDraftPhoto = (photoIndex) => {
    setDraftReview(prev => {
      const photos = [...prev.photos];
      photos.splice(photoIndex, 1);
      return { ...prev, photos };
    });
  };

  const handleReorderPhotos = (fromIndex, toIndex) => {
    setDraftReview(prev => {
      const photos = [...prev.photos];
      const item = photos.splice(fromIndex, 1)[0];
      photos.splice(toIndex, 0, item);
      return { ...prev, photos };
    });
  };

  // View Transitions
  const startEditing = (index) => {
    setEditingIndex(index);
    setDraftReview(JSON.parse(JSON.stringify(reviews[index]))); // Deep copy
    setCurrentView('edit');
  };

  const startNewReview = () => {
    setEditingIndex('new');
    setDraftReview({
      name: "New Client",
      reviewsCount: "1 review",
      time: "just now",
      rating: 5,
      positiveTags: "",
      text: "New review...",
      photos: []
    });
    setCurrentView('edit');
  };

  const confirmAndSaveDraft = () => {
    let updatedReviews = [...reviews];
    if (editingIndex === 'new') {
      updatedReviews.push(draftReview);
    } else {
      updatedReviews[editingIndex] = draftReview;
    }
    
    setReviews(updatedReviews); // Update local state
    saveChanges(updatedReviews); // Save to server
    setCurrentView('list');
  };

  const cancelEditing = () => {
    setDraftReview(null);
    setCurrentView('list');
  };

  const deleteReview = (index) => {
    if (confirm("Are you sure you want to delete this review?")) {
      const updated = [...reviews];
      updated.splice(index, 1);
      setReviews(updated);
      saveChanges(updated); // auto-save on delete
    }
  };

  // Dashboard Drag and Drop for Reviews
  const [draggedReviewIndex, setDraggedReviewIndex] = useState(null);

  const handleReviewDragStart = (e, index) => {
    setDraggedReviewIndex(index);
    e.dataTransfer.setData('text/plain', index);
    e.currentTarget.classList.add('dragging-review');
  };

  const handleReviewDragEnd = (e) => {
    setDraggedReviewIndex(null);
    e.currentTarget.classList.remove('dragging-review');
  };

  const handleReviewDragOver = (e) => {
    e.preventDefault();
  };

  const handleReviewDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedReviewIndex === null || draggedReviewIndex === targetIndex) return;

    const updated = [...reviews];
    const item = updated.splice(draggedReviewIndex, 1)[0];
    updated.splice(targetIndex, 0, item);
    
    setReviews(updated);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Admin Portal /salt</h2>
          <p className="admin-subtitle">Secure Access Required</p>
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Reviews Dashboard</h1>
          <button className="save-btn" onClick={() => saveChanges(reviews)} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </header>

        <div className="admin-content">
          <button className="add-review-btn" onClick={startNewReview}>+ Add New Review</button>
          <p style={{fontSize: '13px', color: '#666', marginBottom: '15px', textAlign: 'center'}}>Drag and drop reviews to reorder them on your website.</p>
          
          <div className="review-list">
            {reviews.map((review, rIndex) => (
              <div 
                key={review.name + rIndex} // force remount when order changes
                className={`list-item ${draggedReviewIndex === rIndex ? 'dragging-active' : ''}`}
                draggable
                onDragStart={(e) => handleReviewDragStart(e, rIndex)}
                onDragEnd={handleReviewDragEnd}
                onDragOver={handleReviewDragOver}
                onDrop={(e) => handleReviewDrop(e, rIndex)}
                style={{cursor: 'grab'}}
              >
                <div className="list-item-info">
                  <div className="list-item-avatar" style={{cursor: 'grab'}}>↕</div>
                  <div>
                    <h3 style={{margin: '0 0 5px 0'}}>{review.name || "Unnamed Review"}</h3>
                    <span style={{color: '#888', fontSize: '13px'}}>{review.time} · {review.photos?.length || 0} Photos</span>
                  </div>
                </div>
                <div className="list-item-actions">
                  <button className="edit-btn" onClick={() => startEditing(rIndex)}>Edit Review</button>
                  <button className="delete-icon-btn" onClick={() => deleteReview(rIndex)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- EDIT VIEW ---
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button className="back-btn" onClick={cancelEditing}>← Back to List (Cancel)</button>
          <h1>{editingIndex === 'new' ? 'Create New Review' : `Editing: ${draftReview.name}`}</h1>
        </div>
        <button className="save-btn" onClick={confirmAndSaveDraft} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save & Return'}
        </button>
      </header>

      <div className="admin-editor-content">
        <div className="editor-form-col">
          <div className="form-group">
            <label>Client Name</label>
            <input value={draftReview.name} onChange={e => updateDraft('name', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time</label>
              <input value={draftReview.time} onChange={e => updateDraft('time', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input type="number" min="1" max="5" value={draftReview.rating} onChange={e => updateDraft('rating', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>Review Text</label>
            <textarea rows="6" value={draftReview.text} onChange={e => updateDraft('text', e.target.value)} />
          </div>

          <div className="photos-manager">
            <h4>Raw Photo URLs</h4>
            <p style={{fontSize: '12px', color: '#666', marginTop: 0}}>Add ImageKit paths here. Click an image in the preview grid to set its Shape & Focus.</p>
            {draftReview.photos && draftReview.photos.map((photo, pIndex) => (
              <div key={pIndex} className="photo-input-row">
                <input 
                  className="photo-url-input"
                  value={photo.split('?shape=')[0].split('?focus=')[0].split('&focus=')[0].split('&shape=')[0]} 
                  onChange={e => {
                    // Preserve existing params
                    let currentShape = 'auto';
                    let currentFocus = 'center';
                    const shapeMatch = photo.match(/[?&]shape=(landscape|portrait|square)/);
                    if (shapeMatch) currentShape = shapeMatch[1];
                    const focusMatch = photo.match(/[?&]focus=(top|bottom|left|right|center)/);
                    if (focusMatch) currentFocus = focusMatch[1];

                    let cleanUrl = e.target.value;
                    const params = [];
                    if (currentShape !== 'auto') params.push(`shape=${currentShape}`);
                    if (currentFocus !== 'center') params.push(`focus=${currentFocus}`);
                    if (params.length > 0) cleanUrl += `?${params.join('&')}`;
                    
                    updateDraftPhoto(pIndex, cleanUrl);
                  }} 
                  placeholder="/images/..."
                  style={{flex: 1}}
                />
                <button className="delete-photo-btn" onClick={() => removeDraftPhoto(pIndex)}>✕</button>
              </div>
            ))}
            <button className="add-photo-btn" onClick={addDraftPhoto}>+ Add Photo URL</button>
          </div>
        </div>

        <div className="editor-preview-col">
          <h3 style={{marginTop: 0}}>Grid Layout Preview</h3>
          <p style={{fontSize: '13px', color: '#666'}}>Drag and drop photos to reorder. <strong>Click an image to change its crop/focus.</strong></p>
          <div className="preview-grid-wrapper">
            <PhotoGrid 
              photos={draftReview.photos} 
              layoutClass="layout-dynamic" 
              isDraggable={true} 
              onReorder={handleReorderPhotos} 
              onPhotoClick={(index) => setSettingsModalIndex(index)}
            />
          </div>
        </div>
      </div>

      {/* PHOTO SETTINGS MODAL */}
      {settingsModalIndex !== null && (
        <div className="modal-overlay" onClick={() => setSettingsModalIndex(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Photo Settings</h3>
              <button className="modal-close" onClick={() => setSettingsModalIndex(null)}>✕</button>
            </div>
            
            {(() => {
              const photoUrl = draftReview.photos[settingsModalIndex];
              const shapeMatch = photoUrl.match(/[?&]shape=(landscape|portrait|square)/);
              const currentShape = shapeMatch ? shapeMatch[1] : 'auto';
              const focusMatch = photoUrl.match(/[?&]focus=(top|bottom|left|right|center)/);
              const currentFocus = focusMatch ? focusMatch[1] : 'center';

              const handleSettingChange = (newShape, newFocus) => {
                let cleanUrl = photoUrl.split('?shape=')[0].split('?focus=')[0].split('&focus=')[0].split('&shape=')[0];
                const params = [];
                if (newShape !== 'auto') params.push(`shape=${newShape}`);
                if (newFocus !== 'center') params.push(`focus=${newFocus}`);
                
                if (params.length > 0) cleanUrl += `?${params.join('&')}`;
                updateDraftPhoto(settingsModalIndex, cleanUrl);
              };

              // Helper for tiny preview ImageKit url
              const cleanPath = photoUrl.split('?')[0].startsWith('/') ? photoUrl.split('?')[0].substring(1) : photoUrl.split('?')[0];
              const previewImageUrl = `https://ik.imagekit.io/murtazapolen/${cleanPath}?tr=w-400`;

              return (
                <div className="settings-modal-body">
                  <div className="settings-preview-box">
                    <img src={previewImageUrl} alt="Preview" style={{width: '100%', maxHeight: '300px', objectFit: 'cover', objectPosition: currentFocus}} />
                  </div>
                  
                  <div className="form-group" style={{marginTop: '20px'}}>
                    <label>Grid Shape Override</label>
                    <select 
                      value={currentShape} 
                      onChange={e => handleSettingChange(e.target.value, currentFocus)}
                      style={{padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%'}}
                    >
                      <option value="auto">Auto-Detect (Recommended)</option>
                      <option value="landscape">Force Landscape Span</option>
                      <option value="portrait">Force Portrait Span</option>
                      <option value="square">Force Square Span</option>
                    </select>
                  </div>

                  <div className="form-group" style={{marginTop: '15px'}}>
                    <label>Crop Focus Position</label>
                    <select 
                      value={currentFocus} 
                      onChange={e => handleSettingChange(currentShape, e.target.value)}
                      style={{padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%'}}
                    >
                      <option value="center">Center Focus (Default)</option>
                      <option value="top">Top Focus</option>
                      <option value="bottom">Bottom Focus</option>
                      <option value="left">Left Focus</option>
                      <option value="right">Right Focus</option>
                    </select>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPortal;
