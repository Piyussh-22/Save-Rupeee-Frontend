import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        name: "Save Rupeee",
        short_name: "Save Rupeee",
        description: "Track your expenses, earnings and investments",
        start_url: "/",
        display: "standalone",
        background_color: "#030712",
        theme_color: "#030712",
        orientation: "portrait",
        icons: [
          { src: "/SaveRupeeeLogo.png", sizes: "192x192", type: "image/png" },
          { src: "/SaveRupeeeLogo.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
});
