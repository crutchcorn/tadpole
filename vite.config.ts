import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    // cloudflare(),
    tanstackRouter({
      generatedRouteTree: "client-src/routeTree.gen.ts",
      routesDirectory: "client-src/routes",
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
});
