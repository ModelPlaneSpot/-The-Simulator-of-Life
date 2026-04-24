import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(() => ({
  base: process.env.BASE_URL || "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/jsx") || id.includes("/react/")) return "react-vendor";
            if (id.includes("@radix-ui/")) return "radix-vendor";
            if (id.includes("lucide-react") || id.includes("framer-motion") || id.includes("/motion")) return "motion-icons";
            if (id.includes("@tanstack/") || id.includes("react-hook-form") || id.includes("zod") || id.includes("sonner")) return "state-form";
            if (id.includes("recharts") || id.includes("date-fns") || id.includes("cmdk") || id.includes("vaul")) return "ui-widgets";
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR !== 'true' ? {
      overlay: false,
    } : false,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
