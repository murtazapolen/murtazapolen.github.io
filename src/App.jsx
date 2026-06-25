import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainSite from './MainSite';
import AdminPortal from './AdminPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/salt" element={<AdminPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
