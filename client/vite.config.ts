import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy API requests to the backend server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'we.png'],
      manifest: {
        name: "Zakaria & Lia's Digital Garden",
        short_name: "Lia & Zekk",
        description: "A romantic retro-pixel digital garden for Zakaria Mujur Prasetyo & Lia Nur Khasanah.",
        icons: [
          {
            src: "/we.webp",
            sizes: "192x192",
            type: "image/webp"
          },
          {
            src: "/we.webp",
            sizes: "512x512",
            type: "image/webp"
          }
        ],
        theme_color: "#ffe6f2",
        background_color: "#ffe6f2",
        display: "standalone"
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React instances (fixes hooks dispatcher null errors)
    dedupe: ["react", "react-dom"],
  },
}));
