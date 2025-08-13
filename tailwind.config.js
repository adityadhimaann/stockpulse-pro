/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'electric-green': '#00ff88',
        'dark-gray': '#1a1a1a',
        'light-gray': '#2a2a2a',
        'gold': '#ffd700',
        'cyber-purple': '#b026ff',
        'neon-blue': '#00d4ff'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px #00ff88' },
          '100%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      }
    },
  },
  plugins: [],
}
