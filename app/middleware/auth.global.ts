import { useLocalePath } from "#i18n";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const localePath = useLocalePath();

  if (to.meta?.public === true) return;


  if (!userStore.isLogged) {
    return navigateTo(localePath({ name: "login" }));
  }
});
