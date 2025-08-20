/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#161616", //bg-main
        2: "#262626", // bg-2
        3: "#333333", // bg-3
        advantages: "#1616165a",
        "primary-main": "#4EF432", // Основной цвет
        "primary-10": "#4EF4321A", // Цвет с 10% прозрачностью
        "primary-20": "#4EF4322A", // Цвет с 10% прозрачностью
        "primary-light": "#6df656",
        "primary-dark": "#2ef20d",
        "primary-light-2": "#abfa9e",
        "gray-60": "#999999",
        "gray-68": "#ADADAD",
        "gray-icon": "#8D8D8D", // Начальный цвет SVG
        sale: "#E61E50",
        DLS: "rgba(255, 255, 255, 0.05)",
        red: "#D64431",
        playstation: "#0070D1",
        nintendo: "#E60012",
      },
      fontFamily: {
        "usuzi-condensed": ["Usuzi Condensed", "sans-serif"],
        "usuzi-halftone": ["Usuzi Halftone", "sans-serif"],
        usuzi: ["Usuzi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "393px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1440px",
        mainCustom: "1608px",
        bodyCustom: "1920px",
      },
    },
  },
  plugins: [],
};
