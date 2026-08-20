/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          primary: '#214E86',
          dark: '#17365F',
          light: '#EAF2FA',
          bg: '#FBFCFD',
          text: '#172033',
          muted: '#64748B',
          border: '#E2E8F0',
          accent: '#D4AF37', // Subtle classic bronze/gold
          hover: '#1B406E',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(33, 78, 134, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(33, 78, 134, 0.12), 0 8px 10px -6px rgba(33, 78, 134, 0.08)',
        'qr': '0 4px 20px rgba(33, 78, 134, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
