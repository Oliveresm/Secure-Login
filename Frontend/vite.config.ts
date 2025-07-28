import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tsconfigPaths({ projects: ['./tsconfig.app.json'] }),
      createHtmlPlugin({
        inject: {
          tags: [
            {
              tag: 'meta',
              injectTo: 'head',
              attrs: {
                'http-equiv': 'Cross-Origin-Opener-Policy',
                content: 'same-origin',
              },
            },
            {
              tag: 'meta',
              injectTo: 'head',
              attrs: {
                'http-equiv': 'Cross-Origin-Embedder-Policy',
                content: 'require-corp',
              },
            },
          ],
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.ts",
    },
  };
});
