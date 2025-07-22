export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const service_root =
    config.public.mediumServiceRoute || "http://localhost:8080";

  const apiFetch = $fetch.create({
    baseURL: service_root,
    onRequest({ options }) {
      const token = process.client ? localStorage.getItem("token") : null;
      if (token) {
        const h = new Headers(options.headers as HeadersInit);
        h.set("authorization", `Bearer ${token}`);
        options.headers = h;
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const userStore = useUserStore();
        userStore.logout();
        navigateTo("/login", { replace: true });
      }
    },
  });

  return {
    provide: {
      api: apiFetch,
    },
  };
});
