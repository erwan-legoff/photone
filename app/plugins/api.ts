export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const service_root =
    config.public.mediumServiceRoute || "http://localhost:8080";
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
