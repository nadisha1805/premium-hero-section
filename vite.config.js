import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const appUrl =
  process.env.SHOPIFY_APP_URL ||
  "https://premium-hero-section.vercel.app";

const host = new URL(appUrl).hostname;

export default defineConfig({
  server: {
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),

    hmr: false,

    fs: {
      allow: ["app", "node_modules"],
    },
  },

  plugins: [reactRouter(), tsconfigPaths()],

  build: {
    assetsInlineLimit: 0,
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },

  optimizeDeps: {
    include: ["@shopify/app-bridge-react"],
  },
});