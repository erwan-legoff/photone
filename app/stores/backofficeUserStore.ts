import { defineStore } from "pinia";
import { useNotificationStore } from "@/stores/notificationStore";
import type { GetUserResponseDto } from "./types/user/GetUserResponseDto";

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
      //

      try {
        const response = await $api<GetUserResponseDto[]>("/user", {
          method: "GET",
        });
        this.users = response;
        notificationStore.notifySuccess('Users loaded successfully.');
      } catch (error) {
        notificationStore.handleError(error, "getUsers");
      }
    },
    async validateUserAccount(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      //

      try {
        await $api(`/user/${id}/validate`, {
          method: "PUT",
        });
        notificationStore.notifySuccess('User account validated.');
      } catch (error) {
        notificationStore.handleError(error, "validateUserAccount");
      }
    },
    async blockUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      //

      try {
        await $api(`/user/${id}/block`, {
          method: "PUT",
        });
        notificationStore.notifySuccess('User account blocked.');
      } catch (error) {
        notificationStore.handleError(error, "blockUser");
      }
    },
    async unblockUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      //

      try {
        await $api(`/user/${id}/unblock`, {
          method: "PUT",
        });
        notificationStore.notifySuccess('User account unblocked.');
      } catch (error) {
        notificationStore.handleError(error, "unblockUser");
      }
    },
    async sendVerifyEmailUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      //

      try {
        await $api(`/user/${id}/send-email-validation`, {
          method: "PUT",
        });
        notificationStore.notifySuccess('Verification email sent to user.');
      } catch (error) {
        notificationStore.handleError(error, "sendVerifyEmailUser");
      }
    },
  },
});
