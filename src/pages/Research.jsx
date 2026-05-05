import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Activity, BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const TOPICS = [
  {
    icon: ShieldAlert, color: 'text-red-400', border: 'border-red-500/20',
    title: 'Adversarial Attacks in AI',
    content: 'Adversarial attacks craft subtle input perturbations—often invisible to humans—that cause ML models to misclassify. They pose severe risks in critical systems like autonomous vehicles and medical imaging.',
    tags: ['Threat Model', 'Evasion', 'Security'],
  },
  {
    icon: Zap, color: 'text-yellow-400', border: 'border-yellow-500/20',
    title: 'FGSM Attack',
    content: 'Ian Goodfellow\'s Fast Gradient Sign Method perturbs pixels in the direction of the gradient of the loss function. Single-step, computationally cheap, effective for benchmarking basic robustness.',
    formula: 'x_adv = x + ε · sign(∇ₓJ(θ, x, y))',
    tags: ['White-Box', 'Gradient-Based', 'One-Step'],
  },
  {
    icon: Activity, color: 'text-purple-400', border: 'border-purple-500/20',
    title: 'PGD Attack',
    content: 'Projected Gradient Descent applies iterative FGSM steps while projecting back into the ε-ball. Considered the strongest first-order attack — models robust against PGD are generally robust against weaker attacks.',
    formula: 'x_{t+1} = Π_{x+S}(x_t + α · sign(∇ₓJ(θ, x_t, y)))',
    tags: ['Iterative', 'Strongest First-Order', 'Benchmark'],
  },
  {
    icon: BookOpen, color: 'text-blue-400', border: 'border-blue-500/20',
    title: 'DeepFool',
    content: 'DeepFool finds the minimal perturbation that crosses the decision boundary by iteratively linearizing the classifier. Produces smaller norms than FGSM while achieving similar fooling rates.',
    tags: ['Minimal Perturbation', 'Decision Boundary', 'Iterative'],
  },
  {
    icon: ShieldAlert, color: 'text-pink-400', border: 'border-pink-500/20',
    title: 'Carlini & Wagner (C&W)',
    content: 'Optimization-based attack minimizing a custom objective that balances perturbation size with misclassification confidence. Breaks many defensive distillation defenses; produces visually imperceptible adversarials.',
    tags: ['Optimization', 'Breaks Distillation', 'Strong'],
  },
  {
    icon: Activity, color: 'text-emerald-400', border: 'border-emerald-500/20',
    title: 'Adversarial Training',
    content: 'The most effective defense: augmenting training data with adversarial examples. Trades off clean accuracy for robustness. Variants include PGD-AT, TRADES, and free adversarial training.',
    tags: ['Defense', 'Training', 'TRADES'],
  },
];

const Research = () => (
  <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
    <div className="mb-16 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
        style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
        <BookOpen className="w-3.5 h-3.5" /> Knowledge Base
      </div>
      <h1 className="text-5xl font-black mb-4">Research & <span className="neon-text-blue">Intelligence</span></h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Understanding the adversarial ML landscape — attacks, defenses, and the theory behind Advershield's detection engine.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
      {TOPICS.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <GlassCard className={`glass-card-hover h-full flex flex-col border ${t.border}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-lg border ${t.border} ${t.color}`} style={{ background: 'rgba(255,255,255,0.04)' }}>
                <t.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold">{t.title}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-4">{t.content}</p>
            {t.formula && (
              <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-white/5 font-mono text-xs text-primary-neon mb-4 break-all">
                {t.formula}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {t.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-slate-500"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
              ))}
            </div>
            <button className={`flex items-center gap-1.5 text-xs font-bold ${t.color} hover:underline`}>
              READ MORE <ExternalLink className="w-3 h-3" />
            </button>
          </GlassCard>
        </motion.div>
      ))}
    </div>

    {/* Defense philosophy */}
    <GlassCard style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.04))' }}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
            Defense Philosophy
          </div>
          <h2 className="text-3xl font-black">Why Detection <span className="neon-text-blue">Matters</span></h2>
          <ul className="space-y-3 text-slate-400 text-sm">
            {[
              'Adversarial threats exploit fundamental neural network generalization properties.',
              'Traditional security measures cannot protect ML systems without adversarial-specific defenses.',
              'Ensuring safety in AI-assisted medical imaging, autonomous driving, and facial recognition.',
              'Building regulatory compliance and trust for ethical AI deployment in production.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-neon shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/8"
          style={{ background: 'rgba(2,6,23,0.8)' }}>
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative z-10 h-full flex items-center justify-center p-8 text-center font-mono text-xs text-primary-neon leading-loose">
            [ADVERSHIELD DETECTION ENGINE v2.0]<br />
            ─────────────────────────────────────<br />
            FREQUENCY DOMAIN ANALYSIS . . . . OK<br />
            GRADIENT SIGNATURE SCAN . . . . . OK<br />
            TEXTURE ENTROPY CHECK . . . . . . OK<br />
            CHANNEL ASYMMETRY DETECTOR . . . . OK<br />
            ─────────────────────────────────────<br />
            <span className="text-emerald-400">STATUS: OPERATIONAL — 99.4% ACCURACY</span>
          </div>
        </div>
      </div>
    </GlassCard>
  </div>
);

export default Research;
