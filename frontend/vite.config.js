import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isBuild = command === 'build'

  return {
    plugins: [react()],
    base: isProduction ? './' : '/',

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react'
              }
              if (id.includes('axios') || id.includes('react-router')) {
                return 'vendor-utils'
              }
              if (id.includes('framer-motion')) {
                return 'vendor-animations'
              }
              return 'vendor-other'
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name.split('.')[1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            if (/css/i.test(extType)) {
              return 'assets/css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      chunkSizeWarningLimit: 1600,
    },

    // Server configuration
    server: {
      port: 3000,
      host: true,
      open: !isBuild,
      cors: true,
      strictPort: true,
      historyApiFallback: {
        disableDotRule: true,
        index: '/index.html'
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // Preview configuration
    preview: {
      port: 4173,
      host: true,
      cors: true,
      historyApiFallback: true,
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@context': resolve(__dirname, 'src/context'),
        '@services': resolve(__dirname, 'src/services'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@layouts': resolve(__dirname, 'src/layouts'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    // CSS configuration
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction
          ? '[hash:base64:8]'
          : '[name]__[local]--[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
      ],
      exclude: ['js-big-decimal'],
    },

    // Esbuild configuration
    esbuild: {
      pure: isProduction ? ['console.log', 'debugger'] : [],
      legalComments: 'none',
    },

    // ✅ FIXED: Worker configuration - removed or simplified
    // worker: {
    //   format: 'es',
    // },
  }
})