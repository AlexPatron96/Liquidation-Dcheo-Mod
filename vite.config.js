// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//cargando en servidor
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // Ruta base de tu aplicaci      n
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components", // Alias para la carpeta de componentes
    },
  },
  build: {
    target: "es2018", // VersiOn de ECMAScript para compilar tu cdigo
    outDir: "dist", // Directorio de salida para los archivos generados
    sourcemap: true, // Generar archivos de mapas de origen para depuracin
    minify: "terser", // Minificar el cdigo con Terser
    assetsInlineLimit: 4096, // Tamaño máximo de archivo (en bytes) para incluir como datos URI
    chunkSizeWarningLimit: 2500, // Tamaño máximo (en kilobytes) para mostrar una advertencia sobre el tamaño de un chunk
  },
});
