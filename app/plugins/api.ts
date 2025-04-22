export default defineNuxtPlugin(() => {
  const service_root =
    process.env.NUXT_MEDIUM_SERVICE_ROOT || "http://localhost:8080";

  const apiFetch = $fetch.create({
    baseURL: service_root,
    credentials: "include",
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
