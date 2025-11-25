import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = mode === 'production'
  const isBuild = command === 'build'

  return {
    plugins: [react()],

    // Base public path when served in production or development
    base: isProduction ? './' : '/',

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // Disable sourcemaps in production for smaller bundle
      minify: isProduction ? 'terser' : 'esbuild', // Use terser for better minification in production
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remove console.log in production
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // Code splitting for better caching
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
          // File naming for better caching
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
        // External dependencies that shouldn't be bundled
        external: [],
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1600,
    },

    // Server configuration
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      open: !isBuild, // Automatically open browser only in dev
      cors: true,
      strictPort: true, // Throw error if port is occupied
      historyApiFallback: {
        disableDotRule: true,
        index: '/index.html'
      },
      // Proxy API requests in development
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      // Watch configuration
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
    },

    // Preview configuration (preview production build)
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
      devSourcemap: true, // Source maps for CSS in development
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction
          ? '[hash:base64:8]'
          : '[name]__[local]--[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `
            @import "@styles/variables.scss";
            @import "@styles/mixins.scss";
          `,
        },
      },
    },

    // Environment variables that will be available in your app
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
      force: false, // Set to true to force dependency pre-bundling
    },

    // Esbuild configuration
    esbuild: {
      pure: isProduction ? ['console.log', 'debugger'] : [],
      legalComments: 'none', // Remove legal comments
    },

    // Worker configuration
    worker: {
      format: 'es',
      plugins: [react()],
    },
  }
})