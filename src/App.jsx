// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/index.astro';
import PcScreen from './pages/PcScreen/PcScreen.jsx'; // Importa la nueva página para la PC

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pc" element={<PcScreen />} /> {/* Ruta para la pantalla de la PC */}
      </Routes>
    </Router>
  );
}

export default App;
