import { defineStore } from "pinia";
import { useNotificationStore } from "@/stores/notificationStore";
interface BackofficeUserState {
  users: GetUserResponseDto[];
}

export const useBackofficeUserStore = defineStore("backoffice-user-store", {
  state: (): BackofficeUserState => ({
    users: [],
  }),
  actions: {
    async fetchUsers(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        const response = await $api<GetUserResponseDto[]>("/user", {
          method: "GET",
        });
        this.users = response;
        notificationStore.notifySuccess("Users loaded.");
      } catch (error) {
        notificationStore.handleError(error, "getUsers");
      }
    },
  },
});
