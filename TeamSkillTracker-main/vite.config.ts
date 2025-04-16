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
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@shared', replacement: path.resolve(__dirname, 'shared') },
      { find: '@/components', replacement: path.resolve(__dirname, 'client/src/components') },
      { find: '@/lib', replacement: path.resolve(__dirname, 'client/src/lib') },
      { find: '@/hooks', replacement: path.resolve(__dirname, 'client/src/hooks') },
      { find: '@/contexts', replacement: path.resolve(__dirname, 'client/src/contexts') },
      { find: '@/utils', replacement: path.resolve(__dirname, 'client/src/utils') },
      { find: '@/types', replacement: path.resolve(__dirname, 'client/src/types') },
      { find: '@/assets', replacement: path.resolve(__dirname, 'client/src/assets') }
    ],
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
