import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "client",
  base: "/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@/components": path.resolve(__dirname, "client/src/components"),
      "@/lib": path.resolve(__dirname, "client/src/lib"),
      "@/hooks": path.resolve(__dirname, "client/src/hooks"),
      "@/contexts": path.resolve(__dirname, "client/src/contexts"),
      "@/utils": path.resolve(__dirname, "client/src/utils"),
      "@/types": path.resolve(__dirname, "client/src/types"),
      "@/assets": path.resolve(__dirname, "client/src/assets")
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "client/index.html"),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
