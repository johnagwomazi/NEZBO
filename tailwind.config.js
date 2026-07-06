/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#14b8a6",
          600: "#0f766e",
          700: "#115e59",
        },
      },
    },
  },
  plugins: [],
};
