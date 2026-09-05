/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mesma paleta escura aprovada para a tela de login (Modelo B),
        // agora aplicada em todo o interior do sistema para consistência.
        paper: "#14201F",       // fundo de página (era #F7F5EF, claro)
        surface: "#1E302E",     // fundo de cartão/caixa (era branco puro)
        paperline: "#33443F",   // bordas (era #DCD6C6, clara)
        ink: "#EDEAE0",         // texto principal (era #1C2B2D, escuro)
        inksoft: "#93A39F",     // texto secundário (era #5B6B6C)
        ledger: "#C79A56",      // destaque/ação principal (era verde #28513F, agora dourado)
        ledgersoft: "#2E4643",  // fundo de destaque suave (era #E7EEE9, claro)
        debit: "#B8834A",       // destaque secundário (era #8A5A2B)
        credit: "#C79A56",
        alert: "#E08A8A",       // erro/alerta (era #9C3B3B, mais visível no fundo escuro)
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Georgia", "Times New Roman", "serif"],
        mono: ["Courier New", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
