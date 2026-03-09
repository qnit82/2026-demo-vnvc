/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e17',
        'dark-card': '#111827',
        'dark-primary': '#6366f1',
        'dark-secondary': '#374151',
        'dark-text': '#f9fafb',
      }
    },
  },
  plugins: [],
}
