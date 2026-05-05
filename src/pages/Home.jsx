import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Search, ArrowRight, Activity, Cpu, Database, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay, color = 'text-primary-neon', border = 'border-primary-neon/20' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card glass-card-hover p-8 group relative overflow-hidden"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${border} ${color}`}
      style={{ background: 'rgba(0,212,255,0.06)' }}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className={`text-lg font-bold mb-3 ${color}`}>{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity" style={{ background: 'var(--neon)' }} />
  </motion.div>
);

const Home = () => {
  const features = [
    { icon: Search,  title: 'Multi-Attack Detection',  description: 'Detects FGSM, PGD, DeepFool, and C&W perturbations in real-time using frequency-domain heuristics and gradient analysis.',           delay: 0.1 },
    { icon: Zap,     title: 'Real-Time Analysis',       description: 'Sub-second detection with detailed confidence scores, heatmap visualizations, and per-pixel perturbation analysis.',              delay: 0.2, color: 'text-cyber-purple', border: 'border-cyber-purple/20' },
    { icon: Lock,    title: 'Robust Defense Pipeline',  description: 'Generate adversarial examples with epsilon control, compare originals vs. adversarials, and download perturbation masks.',         delay: 0.3, color: 'text-emerald-400', border: 'border-emerald-500/20' },
  ];

  const steps = [
    { icon: Database, title: 'Upload Image',  desc: 'Drag & drop any image from CIFAR-10, ImageNet, COCO or your own dataset.' },
    { icon: Cpu,      title: 'AI Analysis',   desc: 'Our backend engine analyzes frequency signatures, gradient magnitudes, and texture patterns.' },
    { icon: Activity, title: 'Get Results',   desc: 'Receive confidence score, attack type classification, and visual heatmap overlay.' },
  ];

  const techStats = [
    { label: 'Attacks Supported', value: '4+' },
    { label: 'Detection Accuracy', value: '99.4%' },
    { label: 'Analysis Time', value: '<1s' },
    { label: 'Images Processed', value: '12K+' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* BG grid + blobs */}
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-neon/8 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyber-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="w-full h-0.5 bg-primary-neon animate-scanline" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
              <Shield className="w-4 h-4" />
              Real-Time Adversarial Attack Detection Platform
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              Advershield<br /><span className="neon-text-blue">AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-4 max-w-2xl mx-auto leading-relaxed">
              Trust Your AI. <span className="text-slate-200 font-semibold italic">Detect the Invisible.</span>
            </p>
            <p className="text-sm text-slate-500 mb-10 max-w-xl mx-auto">
              Full-stack adversarial detection platform powered by a FastAPI backend with real ML heuristics, frequency analysis, and attack simulation engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/detection" className="btn-neon text-base px-10 py-4 flex items-center gap-2 group">
                Start Detection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/simulation" className="btn-glass text-base px-10 py-4">
                Run Simulation
              </Link>
            </div>

            {/* Tech stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {techStats.map(({ label, value }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <div className="text-2xl font-black neon-text-blue mb-1">{value}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">How it <span className="neon-text-purple">Works</span></h2>
          <p className="text-slate-400">Three steps to detect and analyze adversarial threats</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/3 left-[16%] w-[68%] h-0.5 bg-gradient-to-r from-primary-neon/30 via-cyber-purple/30 to-emerald-500/30" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full border border-primary-neon/30 flex items-center justify-center mb-5 relative z-10"
                  style={{ background: 'rgba(0,212,255,0.06)' }}>
                  <Icon className="w-8 h-8 text-primary-neon" />
                </div>
                <span className="text-4xl font-black text-slate-800 absolute -top-2 -left-2 select-none">0{i+1}</span>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm max-w-xs">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Platform <span className="neon-text-blue">Capabilities</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="glass-card p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))' }}>
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative">
            <h2 className="text-4xl font-black mb-4">Ready to Secure Your <span className="neon-text-blue">AI Models?</span></h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Deploy our detection engine in your pipeline. Full REST API with FastAPI backend, CORS support, and real-time analytics.</p>
            <div className="flex justify-center gap-3">
              <Link to="/detection" className="btn-neon px-10 py-3">Start Free Detection</Link>
              <Link to="/research"  className="btn-glass px-10 py-3">Read Research</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-neon" />
            <span className="font-black tracking-wider neon-text-blue text-sm">ADVERSHIELD AI</span>
          </div>
          <div className="text-slate-600 text-xs">© 2026 Advershield AI. Full-stack adversarial detection platform.</div>
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link to="/research" className="hover:text-primary-neon transition-colors">Research</Link>
            <Link to="/dashboard" className="hover:text-primary-neon transition-colors">Dashboard</Link>
            <a href="#" className="hover:text-primary-neon transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
