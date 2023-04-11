import { createVuetify } from "vuetify";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: "custom",
      sets: {
        custom,
      },
      aliases,
    },
    theme: {
      defaultTheme: "dark",
      themes: { dark, light },
    },
    defaults,
  });
  nuxtApp.vueApp.use(vuetify);
});
