/* eslint-env node */
import { configure } from 'quasar/wrappers'

export default configure(function (/* ctx */) {
  return {
    boot: ['axios', 'auth'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons', 'mdi-v7'],
    build: {
      target: { browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'] },
      vueRouterMode: 'history',
      vitePlugins: []
    },
    devServer: {
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage']
    },
    animations: [],
    ssr: { pwa: false },
    pwa: {},
    cordova: {},
    capacitor: { hideSplashscreen: true },
    electron: { bundler: 'packager' }
  }
})
