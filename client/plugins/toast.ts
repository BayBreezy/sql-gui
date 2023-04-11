import Vue3Toastify, { toast, ToastOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 7000,
    toastClassName: "text-body-2",
  } as ToastOptions);

  return {
    provide: { toast },
  };
});
