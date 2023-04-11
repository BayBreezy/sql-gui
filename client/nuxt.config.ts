import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  // disable generating shim for .vue files
  typescript: { shim: false },
  modules: [
    "@nuxtjs/google-fonts",
    "@davestewart/nuxt-scrollbar",
    async (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook("vite:extendConfig", (config) => config.plugins.push(vuetify()));
    },
  ],
  // transpile vuetify
  build: { transpile: ["vuetify"] },

  // import styles
  css: ["@/assets/main.scss"],

  // setup ruintime config
  runtimeConfig: {
    public: {
      API: process.env.API,
    },
  },

  // Set font
  googleFonts: {
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  app: {
    head: {
      //  Add app title
      title: "SQL GUI",
    },
  },
});
