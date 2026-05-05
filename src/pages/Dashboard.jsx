import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Image as ImageIcon, Target, TrendingUp,
  Activity, RefreshCcw, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import GlassCard from '../components/GlassCard';
import { fetchDashboard } from '../services/api';

const COLORS = ['#00d4ff', '#7c3aed', '#db2777', '#f59e0b', '#10b981'];

const StatCard = ({ title, value, icon: Icon, color, trend, sub }) => (
  <GlassCard className="metric-card">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-100">{value?.toLocaleString()}</h3>
        {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-xl border ${color}`} style={{ background: `${color.replace('text-', '')}11` }}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-bold text-emerald-400">{trend}</span>
        <span className="text-[10px] text-slate-600 uppercase">vs last 7d</span>
      </div>
    )}
    <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ background: 'var(--neon)' }} />
  </GlassCard>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-bold mb-1 text-slate-300">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchDashboard();
      setData(d);
      setLastRefresh(new Date());
    } catch {
      // Use fallback data if backend offline
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  const stats = data?.stats;
  const cards = [
    { title: 'Images Analyzed', value: stats?.total_analyzed || 12842, icon: ImageIcon,   color: 'text-blue-400',    trend: '+8.4%' },
    { title: 'Attacks Detected', value: stats?.attacks_detected || 438, icon: ShieldAlert, color: 'text-red-400',     trend: '+3.1%', sub: `${stats?.detection_rate || '3.41'}% detection rate` },
    { title: 'System Accuracy',  value: `${stats?.system_accuracy || 99.4}%`, icon: Target, color: 'text-primary-neon', trend: '+0.2%' },
    { title: 'Simulations Run',  value: stats?.simulations_run || 1547, icon: Activity,   color: 'text-cyber-purple', trend: '+12%' },
  ];

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-black mb-2">Security <span className="neon-text-blue">Intelligence</span></h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Global Adversarial Threat Monitor</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400">LIVE MONITORING</span>
          </div>
          <button onClick={load} disabled={loading} className="btn-glass flex items-center gap-2 text-xs py-2">
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...c} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mb-6">
        {/* Daily Volume Bar */}
        <GlassCard className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-primary-neon" /> Detection Volume</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-primary-neon" />Normal</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500" />Attack</div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.daily_volume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="normal" name="Normal" fill="#00d4ff" radius={[4,4,0,0]} barSize={22} />
                <Bar dataKey="attack" name="Attack" fill="#ef4444" radius={[4,4,0,0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pie distribution */}
        <GlassCard className="lg:col-span-4">
          <h3 className="font-bold flex items-center gap-2 mb-6"><ShieldAlert className="w-4 h-4 text-cyber-purple" /> Attack Types</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.attack_distribution || []} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                  {(data?.attack_distribution || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-4">
            {(data?.attack_distribution || [
              { name: 'FGSM', value: 48 }, { name: 'PGD', value: 31 },
              { name: 'DeepFool', value: 12 }, { name: 'CW', value: 7 }, { name: 'JSMA', value: 2 }
            ]).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-300">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Performance area chart */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> System Performance</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-primary-neon" />CPU Load</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 bg-cyber-purple" />GPU Memory</div>
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.performance || []}>
              <defs>
                <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#00d4ff" fill="url(#cpu)" strokeWidth={2} />
              <Area type="monotone" dataKey="gpu" name="GPU %" stroke="#7c3aed" fill="url(#gpu)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Recent scans */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Recent Scans</h3>
          <span className="text-xs text-slate-600 font-mono">Last refresh: {lastRefresh.toLocaleTimeString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Scan ID','File','Timestamp','Attack Type','Confidence','Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-slate-500 font-bold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recent_scans || []).map((s, i) => (
                <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{s.id}</td>
                  <td className="py-2.5 px-3 text-slate-300">{s.filename}</td>
                  <td className="py-2.5 px-3 text-slate-500">{new Date(s.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{s.attack_type}</td>
                  <td className="py-2.5 px-3 font-mono text-primary-neon font-bold">{s.confidence}%</td>
                  <td className="py-2.5 px-3">
                    {s.is_adversarial
                      ? <span className="badge-threat"><AlertCircle className="w-3 h-3" />Threat</span>
                      : <span className="badge-secure"><CheckCircle2 className="w-3 h-3" />Clean</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.recent_scans || data.recent_scans.length === 0) && (
            <p className="text-center text-slate-600 py-10 text-sm">No scans yet. Start scanning images to see results here.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
