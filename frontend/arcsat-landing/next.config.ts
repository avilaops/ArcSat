import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Configuração para Azure Static Web Apps
  output: 'export',
  
  // Otimizações
  images: {
    unoptimized: true, // Azure Static Web Apps não suporta Image Optimization
  },
  
  // Trailing slashes para compatibilidade
  trailingSlash: true,
};

export default nextConfig;
