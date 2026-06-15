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
        // Brand palette — warm gold accent on a barbershop charcoal base.
        brand: {
          gold: "#c9a14a",
          goldDark: "#a9842f",
          charcoal: "#1a1a1d",
          slate: "#2a2a2f",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
