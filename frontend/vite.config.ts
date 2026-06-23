import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // necesario para HMR dentro de Docker en macOS
    watch: { usePolling: true },
  },
});
