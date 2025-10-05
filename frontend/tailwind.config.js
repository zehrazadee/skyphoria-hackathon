/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        'deep-space': '#0A1F44',
        'celestial': '#1E3A5F',
        'bright-cyan': '#00D9FF',
        'electric-blue': '#0099CC',
        'soft-sky': '#87CEEB',
        
        // AQI colors
        'aqi-good': '#00E676',
        'aqi-moderate': '#FFEB3B',
        'aqi-sensitive': '#FF9800',
        'aqi-unhealthy': '#F44336',
        'aqi-very-unhealthy': '#9C27B0',
        'aqi-hazardous': '#880E4F',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}