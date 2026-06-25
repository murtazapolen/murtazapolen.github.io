import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainSite from './MainSite';
import AdminPortal from './AdminPortal';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/salt" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
