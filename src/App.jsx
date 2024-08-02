
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PcScreen from './components/PcScreen/PcScreen.jsx'; 
import AboutMe from './pages/aboutme/aboutMe.astro';
import Projects from './pages/projects/projects.astro';
import Contact from './pages/contact/contact.astro';
import PcComponent from './components/pcComponent/PcComponent.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PcComponent />} />
        <Route path="/pc" element={<PcScreen />} />
        
      </Routes>
    </Router>
  );
}

export default App;


