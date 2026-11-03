module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { extend: { fontFamily: { display: ['var(--font-display)'], sans: ['var(--font-body)'] } } },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      { studiolight: { primary: '#5b3df5', 'primary-content': '#ffffff', secondary: '#0f1b2d', accent: '#ff4d6d', neutral: '#0f1b2d', 'base-100': '#ffffff', 'base-200': '#f1f4f9', 'base-300': '#dfe5ee', 'base-content': '#0f1b2d', info: '#2563eb', success: '#16a34a', warning: '#d97706', error: '#dc2626' } },
      { studiodark: { primary: '#8b7bff', 'primary-content': '#0b0d12', secondary: '#c9d4ea', accent: '#ff6b87', neutral: '#1b212c', 'base-100': '#0e1117', 'base-200': '#151a23', 'base-300': '#222a37', 'base-content': '#e8edf6', info: '#60a5fa', success: '#4ade80', warning: '#fbbf24', error: '#f87171' } },
    ],
  },
};