import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Zap, Activity, RefreshCcw, Info,
  AlertCircle, Shield, Download, Sliders, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import { simulateAttack } from '../services/api';

const ATTACKS = [
  { id: 'FGSM',    label: 'FGSM',     full: 'Fast Gradient Sign Method',   color: '#00d4ff', severity: 'Medium',   desc: 'One-step gradient-based attack. Fast and widely used for benchmarking robustness.' },
  { id: 'PGD',     label: 'PGD',      full: 'Projected Gradient Descent',  color: '#7c3aed', severity: 'Critical', desc: 'Iterative attack considered the strongest first-order adversary.' },
  { id: 'DeepFool',label: 'DeepFool', full: 'DeepFool',                   color: '#f59e0b', severity: 'High',     desc: 'Finds the closest decision boundary with minimal perturbation.' },
  { id: 'CW',      label: 'C&W',      full: 'Carlini & Wagner',           color: '#db2777', severity: 'Critical', desc: 'Optimization-based attack; produces visually indistinguishable adversarial examples.' },
];

const Simulation = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [attack, setAttack] = useState('FGSM');
  const [epsilon, setEpsilon] = useState(0.03);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith('image/')) { toast.error('Images only'); return; }
    setImageFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result);
    r.readAsDataURL(f);
    setResult(null);
  }, []);

  const generate = async () => {
    if (!imageFile) { toast.error('Upload an image first'); return; }
    setLoading(true);
    try {
      const data = await simulateAttack(imageFile, attack, epsilon);
      setResult(data);
      toast.success(`${attack} attack generated! PSNR: ${data.metrics.psnr_db} dB`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Backend error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImageFile(null); setPreview(null); setResult(null); };

  const selectedAttack = ATTACKS.find(a => a.id === attack);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
      <div className="mb-10">
        <h1 className="text-5xl font-black mb-3">Attack <span className="neon-text-purple">Simulation</span> Lab</h1>
        <p className="text-slate-400 max-w-xl">Generate real adversarial examples using state-of-the-art attack algorithms. Images are processed on our backend using numpy-based perturbation engines.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-3 space-y-5">
          <GlassCard>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" /> Attack Config
            </h3>

            {/* Attack selector */}
            <div className="space-y-2 mb-6">
              {ATTACKS.map(a => (
                <button key={a.id} onClick={() => { setAttack(a.id); setResult(null); }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 ${attack === a.id ? 'bg-white/8 border-current' : 'bg-white/3 border-white/8 hover:border-white/15'}`}
                  style={attack === a.id ? { borderColor: a.color, color: a.color } : {}}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-sm">{a.label}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${a.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : a.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">{a.full}</p>
                </button>
              ))}
            </div>

            {/* Epsilon slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perturbation ε</label>
                <span className="text-xs font-mono text-primary-neon font-bold">{epsilon.toFixed(3)}</span>
              </div>
              <input type="range" min="0.001" max="0.15" step="0.001" value={epsilon}
                onChange={e => setEpsilon(parseFloat(e.target.value))}
                className="w-full accent-primary-neon h-1.5 rounded-full cursor-pointer" />
              <div className="flex justify-between mt-1 text-[9px] text-slate-600 font-mono uppercase">
                <span>Subtle</span><span>Aggressive</span>
              </div>
            </div>
          </GlassCard>

          {/* Attack info */}
          {selectedAttack && (
            <GlassCard className="bg-blue-500/5 border border-blue-500/15">
              <div className="flex items-center gap-2 text-blue-400 mb-3">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Attack Intel</span>
              </div>
              <h4 className="font-bold text-slate-200 mb-2 text-sm">{selectedAttack.full}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedAttack.desc}</p>
              <div className="mt-3 font-mono text-[10px] text-blue-400 bg-blue-500/10 rounded-lg p-2">
                ε = {epsilon.toFixed(3)} | Steps = {attack === 'PGD' ? 10 : 1}
              </div>
            </GlassCard>
          )}

          {/* Generate button */}
          <button onClick={generate} disabled={loading || !imageFile}
            className={`btn-neon w-full py-3.5 flex items-center justify-center gap-2 text-sm ${(!imageFile || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? <><div className="w-4 h-4 border-2 border-cyber-black/30 border-t-cyber-black rounded-full animate-spin" /> Generating...</>
              : <><Zap className="w-4 h-4" /> Generate Attack</>}
          </button>
          {(preview || result) && (
            <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-white transition-colors py-2">
              <RefreshCcw className="w-4 h-4" /> Reset Lab
            </button>
          )}
        </div>

        {/* Visualization */}
        <div className="lg:col-span-9 space-y-6">
          {/* Upload area */}
          {!preview ? (
            <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('simFile').click()}
              className="min-h-[300px] rounded-2xl border-2 border-dashed border-slate-700 hover:border-primary-neon/40 flex flex-col items-center justify-center cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <Upload className="w-16 h-16 text-slate-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Upload Source Image</h2>
              <p className="text-slate-500 text-sm">Drag & drop or click to select</p>
              <input id="simFile" type="file" className="hidden" accept="image/*" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <>
              {/* Side-by-side images */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Original</span>
                    <span className="badge-secure"><Shield className="w-3 h-3" /> Clean</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square bg-slate-950 border border-white/8 flex items-center justify-center">
                    <img src={result ? `data:image/jpeg;base64,${result.original_b64}` : preview} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Adversarial */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Adversarial</span>
                    {result && <span className="badge-threat"><AlertCircle className="w-3 h-3" /> {attack}</span>}
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-950 border border-white/8 flex items-center justify-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 border-4 border-primary-neon/20 border-t-primary-neon rounded-full animate-spin" />
                        <p className="font-mono text-xs text-primary-neon animate-pulse tracking-widest">PERTURBING...</p>
                      </div>
                    ) : result ? (
                      <img src={`data:image/jpeg;base64,${result.adversarial_b64}`} alt="Adversarial" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center text-slate-700 opacity-50">
                        <Activity className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Select an attack and generate</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Perturbation mask + metrics */}
              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <GlassCard className="border border-cyber-purple/20" style={{ background: 'rgba(124,58,237,0.04)' }}>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Perturbation mask */}
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Perturbation Mask (×10)</h4>
                          <div className="rounded-xl overflow-hidden aspect-square bg-black border border-white/8 flex items-center justify-center">
                            <img src={`data:image/jpeg;base64,${result.perturbation_b64}`} alt="Perturbation" className="w-full h-full object-contain" />
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="md:col-span-2 space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Attack Metrics</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: 'L∞ Norm', value: result.metrics.l_inf_norm?.toFixed(6), color: 'text-red-400' },
                              { label: 'L₂ Norm', value: result.metrics.l2_norm?.toFixed(3), color: 'text-orange-400' },
                              { label: 'PSNR', value: `${result.metrics.psnr_db} dB`, color: 'text-emerald-400' },
                              { label: 'Gen. Time', value: `${result.metrics.generation_time_s}s`, color: 'text-blue-400' },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="p-4 rounded-xl bg-white/4 border border-white/8">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
                                <p className={`font-mono text-lg font-black ${color}`}>{value}</p>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 rounded-xl bg-cyber-purple/8 border border-cyber-purple/15 font-mono text-xs text-slate-400 leading-loose">
                            ΔX = ε · sign(∇ₓJ(θ, x, y)) &nbsp;|&nbsp; Attack: {selectedAttack?.full}<br />
                            Perturbation Budget: ε={epsilon.toFixed(3)} &nbsp;|&nbsp; Budget Used: {(result.metrics.l_inf_norm * 100).toFixed(1)}%
                          </div>
                          <button className="btn-glass w-full flex items-center justify-center gap-2 text-sm">
                            <Download className="w-4 h-4" /> Download Adversarial Image
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
