import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" para que el proyecto funcione abierto desde cualquier carpeta o hosting
export default defineConfig({
  base: "./",
  plugins: [react()],
});
