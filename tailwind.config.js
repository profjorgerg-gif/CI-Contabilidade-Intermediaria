/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5EF",
        paperline: "#DCD6C6",
        ink: "#1C2B2D",
        inksoft: "#5B6B6C",
        ledger: "#28513F",
        ledgersoft: "#E7EEE9",
        debit: "#8A5A2B",
        credit: "#28513F",
        alert: "#9C3B3B",
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Georgia", "Times New Roman", "serif"],
        mono: ["Courier New", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
