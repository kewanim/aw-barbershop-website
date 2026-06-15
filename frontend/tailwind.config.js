/** @type {import('tailwindcss').Config} */
// Tailwind CSS configuration.
// `darkMode: "class"` lets us toggle dark mode by adding/removing the
// `dark` class on the <html> element (handled in components/ThemeProvider.js).
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm gold on a charcoal base, with Ethiopian
        // flag-inspired accents (green, red) and a habesha cream tone.
        brand: {
          gold: "#c9a14a",
          goldDark: "#a9842f",
          charcoal: "#1a1a1d",
          slate: "#2a2a2f",
          green: "#0a7b3e",
          greenDark: "#0a5c2f",
          red: "#c9111c",
          cream: "#faf6ec",
          creamDark: "#f3ebd8",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
