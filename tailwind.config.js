/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        studio: {
          900: "#0b0f14",
          800: "#111827",
          700: "#1f2937",
          600: "#283548",
          neon: "#22d3ee",
          neonSoft: "#0ea5e9",
          amber: "#f59e0b",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 211, 238, 0.35)",
        soft: "0 20px 40px rgba(0,0,0,0.4)",
      },
      fontFamily: {
        studio: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
