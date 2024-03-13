/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')  

module.exports = {
  purge:["./src/**/*.tsx"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        load: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        load: "load 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

