// App.jsx (Final Version)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import PlannerApp from './components/PlannerApp';
import Daily from './components/Daily';
import About from './components/About';
import { ProtectedRoute } from './components/ProtectedRoute'; // Import it
import PricingPage from './components/PricingPage';
import './App.css';

function App() {
  return (
    <div className="App" id="wrapper">
      <Header />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          {/* All routes nested inside here will be protected */}
          <Route path="/planner" element={<PlannerApp />} />
          <Route path="/daily" element={<Daily />} />
          {/* You can add more protected routes here, like /settings, /dashboard, etc. */}
         <Route path="/pricing" element={<PricingPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;