import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detection from './pages/Detection';
import Simulation from './pages/Simulation';
import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-cyber text-slate-200">
        <Navbar />
        <main className="container mx-auto px-4 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<Research />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }} />
      </div>
    </Router>
  );
}

export default App;
