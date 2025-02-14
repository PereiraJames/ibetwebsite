import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.NETWORK_PORT, // Change to the port you prefer
    allowedHosts: [
      process.env.SITE_NAME, // Add the blocked host here
    ],
  },
});
