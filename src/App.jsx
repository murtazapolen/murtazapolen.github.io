import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainSite from './MainSite';
import AdminPortal from './AdminPortal';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/salt" element={<AdminPortal />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
