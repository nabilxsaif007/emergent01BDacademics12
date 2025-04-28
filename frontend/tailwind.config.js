/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        primary: "#4285F4",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 255, 255, 0.2)",
      },
    },
  },
  plugins: [],
}
