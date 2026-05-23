/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        room: {
          available: '#22c55e',
          occupied: '#ef4444',
          booked: '#3b82f6',
          lift: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}