import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 👈 penting: biar bisa di-export jadi static
  domains: ['localhost'], // tambahkan di sini
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3002',
      pathname: '/evidence/**',
    },
  ]
};

module.exports = {
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '172.24.4.33',       // Add the IP address directly
    'http://172.24.4.33:3002', // Optionally add with protocol
    'http://localhost:3002',   // Common for local development
    'localhost:3002'          // Also allow bare localhost
  ]
}


export default nextConfig;
