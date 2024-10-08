// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  app: {
      head: {
          link: [
              { rel: 'icon', type: 'image/x-icon', href: '/logo2.png' }]
      }
  },

  // app: {
  //     head: {
  //         script: [
  //             {src: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"},
  //             {src: "https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js"}
  //         ]
  //     }
  // }
  routeRules: {
      '/api/compile': {
          cors: true
      }
  },

  compatibilityDate: '2024-08-16'
})