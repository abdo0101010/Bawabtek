/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F0EA',
          100: '#C9E0CD',
          200: '#9FC4A7',
          300: '#6FA079',
          400: '#3E7B4A',
          500: '#1E5E3A',
          600: '#174B2E',
          700: '#0F3823',
          800: '#0A2A18',
          900: '#061D10',
        },
        terracotta: {
          50: '#FDF3E7',
          100: '#FAE2C4',
          200: '#F5C789',
          300: '#EFA94F',
          400: '#E68A2A',
          500: '#D97706',
          600: '#C2410C',
          700: '#9A3409',
          800: '#722706',
          900: '#4D1B04',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FBFBFA',
          200: '#F4F3EF',
          300: '#E8E5DA',
          400: '#D4D0C2',
          500: '#B8B3A1',
        },
        sage: {
          50: '#EDF2ED',
          100: '#D4E2D5',
          200: '#A8C5AA',
          300: '#7BA07F',
          400: '#5A8360',
          500: '#426747',
        },
        ink: {
          50: '#F0F1F2',
          100: '#DDE0E3',
          200: '#B8BDC4',
          300: '#8B929D',
          400: '#5C6470',
          500: '#3B424E',
          600: '#2A303A',
          700: '#1C222C',
          800: '#111827',
          900: '#0A0F16',
        },
        gold: {
          400: '#C9A227',
          500: '#A67C00',
          600: '#8A6600',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'organic': '0 4px 24px -6px rgba(15, 56, 35, 0.12), 0 2px 8px -2px rgba(15, 56, 35, 0.08)',
        'organic-lg': '0 12px 48px -8px rgba(15, 56, 35, 0.18), 0 4px 16px -4px rgba(15, 56, 35, 0.10)',
        'organic-xl': '0 24px 72px -12px rgba(15, 56, 35, 0.22), 0 8px 24px -6px rgba(15, 56, 35, 0.12)',
        'warm': '0 4px 20px -4px rgba(217, 119, 6, 0.15)',
        'door': '0 30px 80px -20px rgba(10, 42, 24, 0.45)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'sway': 'sway 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
