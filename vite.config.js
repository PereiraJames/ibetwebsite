import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: process.env.NETWORK_PORT, // Default to 5173 if undefined
    cors: true, // Allow CORS
    fs: {
      strict: true, // Prevent accessing files outside root
      allow: ['.'], // Allow project directory
    },
  },
});
