import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Microscope, Zap, LayoutDashboard, BookOpen, Menu, X, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    checkHealth().then(() => setOnline(true)).catch(() => setOnline(false));
    const t = setInterval(() => {
      checkHealth().then(() => setOnline(true)).catch(() => setOnline(false));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Home',       path: '/',           icon: Shield },
    { name: 'Detection',  path: '/detection',  icon: Microscope },
    { name: 'Simulation', path: '/simulation', icon: Zap },
    { name: 'Dashboard',  path: '/dashboard',  icon: LayoutDashboard },
    { name: 'Research',   path: '/research',   icon: BookOpen },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-card px-5 py-3 flex items-center justify-between" style={{ padding: '10px 20px', borderRadius: '16px' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff22, #7c3aed22)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <Shield className="w-5 h-5 text-primary-neon group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-black text-base tracking-wider neon-text-blue">ADVERSHIELD AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ name, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-primary-neon ${active ? 'text-primary-neon' : 'text-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Right: status + login */}
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${online ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              {online ? 'AI ONLINE' : 'OFFLINE'}
            </div>
            <Link to="/login" className="btn-neon py-1.5 px-4 text-xs">Login</Link>
            <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass-card mt-2 p-4 space-y-2">
            {links.map(({ name, path, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === path ? 'bg-primary-neon/10 text-primary-neon' : 'text-slate-400 hover:text-white'}`}>
                <Icon className="w-4 h-4" />{name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
