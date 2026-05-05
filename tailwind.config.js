/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366f1',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
          neon: '#00d4ff',
        },
        cyber: {
          black: '#020617',
          darker: '#0a0f1e',
          dark: '#1e293b',
          purple: '#7c3aed',
          pink: '#db2777',
        }
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #020617 0%, #0a0f1e 50%, #1e1b4b 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #4f46e5, 0 0 10px #4f46e5' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        }
      }
    },
  },
  plugins: [],
}
