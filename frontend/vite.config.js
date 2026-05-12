import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                voluntario: "index.html",
                ong: "index-ong.html",
            },
        },
    },
    server: {
        port: 5173,
    },
});