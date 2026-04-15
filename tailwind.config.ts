import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6fbf8',
          100: '#c0f5ec',
          200: '#86ecdc',
          300: '#4ddccb',
          400: '#1fc7b8',
          500: '#00b5a5',
          600: '#009285',
          700: '#00756c',
          800: '#005c55',
          900: '#003e3a',
        },
        sun: {
          400: '#ffe066',
          500: '#ffd93d',
          600: '#ffc40c',
        },
        coral: {
          400: '#ff8585',
          500: '#ff6b6b',
          600: '#e84a4a',
        },
        ink: '#0f172a',
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(0, 181, 165, 0.25)',
        pop: '0 12px 32px -8px rgba(255, 107, 107, 0.45)',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease-out both',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.03)' } },
      },
    },
  },
  plugins: [],
};
export default config;
