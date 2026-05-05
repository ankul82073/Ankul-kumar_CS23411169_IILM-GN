import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Login successful! Redirecting...');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-neon/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyber-purple/8 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Shield className="w-8 h-8 text-primary-neon" />
          </div>
          <h1 className="text-3xl font-black mb-1">Welcome <span className="neon-text-blue">Back</span></h1>
          <p className="text-slate-500 text-sm">Sign in to your Advershield AI account</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-neon/50 transition-colors"
                  placeholder="analyst@advershield.ai" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-neon/50 transition-colors"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-primary-neon" /> Remember me
              </label>
              <a href="#" className="text-primary-neon hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="btn-neon w-full py-3.5 flex items-center justify-center gap-2 text-sm">
              {loading ? <><div className="w-4 h-4 border-2 border-cyber-black/30 border-t-cyber-black rounded-full animate-spin" /> Authenticating...</>
                : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/" className="text-primary-neon hover:underline font-medium">Request Access <ArrowRight className="inline w-3.5 h-3.5" /></Link>
          </div>
        </GlassCard>

        <p className="text-center text-slate-700 text-xs mt-6">Protected by Advershield AI Security Layer v2.0</p>
      </motion.div>
    </div>
  );
};

export default Login;
