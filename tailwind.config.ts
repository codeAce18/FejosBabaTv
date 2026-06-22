import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand Colors (from FejosBaba Logo) ───
        brand: {
          orange: '#FF7200',      // camera orange from logo
          'orange-light': '#FF9A3C',
          'orange-dim': '#FF720015',
          navy: '#1B1464',        // circle/text navy from logo
          'navy-light': '#2D2299',
        },
        // ─── Dark Cinema Palette ───
        cinema: {
          black: '#07070D',       // deepest background
          dark: '#0E0E18',        // main background
          surface: '#14141F',     // card background
          elevated: '#1C1C2A',    // elevated cards/modals
          border: '#2A2A3D',      // subtle borders
          muted: '#3D3D55',       // muted borders
        },
        // ─── Text ───
        ink: {
          primary: '#FFFFFF',
          secondary: '#A0A0BC',
          muted: '#606078',
          inverse: '#07070D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'orange-glow': 'radial-gradient(ellipse at center, #FF720030 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(to right, #07070D 40%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, #07070D 0%, transparent 60%)',
        'navy-gradient': 'linear-gradient(135deg, #1B1464 0%, #0E0E18 100%)',
      },
      boxShadow: {
        'orange-glow': '0 0 30px #FF720040, 0 0 60px #FF720015',
        'orange-glow-sm': '0 0 15px #FF720030',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), 0 0 20px #FF720020',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-orange': 'pulseOrange 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseOrange: { '0%,100%': { boxShadow: '0 0 20px #FF720040' }, '50%': { boxShadow: '0 0 40px #FF720080' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config