import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANTE: troque "NOME-DO-REPOSITORIO" pelo nome real do repositório
// GitHub que você criar para a CI. O GitHub Pages publica o site dentro de
// um subcaminho com esse nome (ex.: usuario.github.io/NOME-DO-REPOSITORIO/),
// e o Vite precisa saber disso para gerar os links dos arquivos corretamente.
export default defineConfig({
  plugins: [react()],
  base: "/NOME-DO-REPOSITORIO/",
});
