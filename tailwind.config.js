module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          dark: '#004C99',
          light: '#3399FF',
        },
        secondary: {
          DEFAULT: '#FF6600',
          dark: '#CC5200',
          light: '#FF944D',
        },
        background: {
          light: '#F5F7FA',
          dark: '#1A202C',
        },
        text: {
          light: '#4A5568',
          dark: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
}