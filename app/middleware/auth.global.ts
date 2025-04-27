export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const whiteList = [
    "login",
    "signup",
    "mail-verification",
    "account-validated",
  ];
  if (whiteList.includes(to.name?.toString() || "undefined")) return;
  if (!userStore.isLogged) {
    return navigateTo({ name: "login" });
  }
});
