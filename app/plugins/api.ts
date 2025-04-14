export default defineNuxtPlugin(async () => {
  const service_root =
    process.env.NUXT_MEDIUM_SERVICE_ROOT || "http://localhost:8080";

  const apiFetch = $fetch.create({
    baseURL: service_root,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return {
    provide: {
      api: apiFetch,
    },
  };
});
