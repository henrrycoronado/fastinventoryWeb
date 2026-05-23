/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        accent: 'var(--color-accent)',
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
          5: 'var(--surface-5)',
        },
        ink: {
          primary:   'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          muted:     'var(--ink-muted)',
        },
      },
      borderRadius: {
        sm: '6px', DEFAULT: '8px', md: '10px',
        lg: '14px', xl: '18px', '2xl': '24px',
      },
      boxShadow: {
        panel:   '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.3)',
        'glow-sm': '0 0 12px var(--glow)',
        glow:      '0 0 24px var(--glow)',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                          '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}