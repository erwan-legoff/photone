export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  if (to.name === "login" || to.name === "signup") return;
  if (!userStore.isLogged) {
    return navigateTo({ name: "login" });
  }
});
