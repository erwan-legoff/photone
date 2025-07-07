import { defineStore } from "pinia";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from 'vue-i18n';
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
      const { t } = useI18n();

      try {
        const response = await $api<GetUserResponseDto[]>("/user", {
          method: "GET",
        });
        this.users = response;
        notificationStore.notifySuccess(t('backoffice.users_loaded'));
      } catch (error) {
        notificationStore.handleError(error, "getUsers");
      }
    },
    async validateUserAccount(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        await $api(`/user/${id}/validate`, {
          method: "PUT",
        });
        notificationStore.notifySuccess(t('backoffice.user_validated'));
      } catch (error) {
        notificationStore.handleError(error, "validateUserAccount");
      }
    },
    async blockUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        await $api(`/user/${id}/block`, {
          method: "PUT",
        });
        notificationStore.notifySuccess(t('backoffice.user_blocked'));
      } catch (error) {
        notificationStore.handleError(error, "blockUser");
      }
    },
    async unblockUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        await $api(`/user/${id}/unblock`, {
          method: "PUT",
        });
        notificationStore.notifySuccess(t('backoffice.user_unblocked'));
      } catch (error) {
        notificationStore.handleError(error, "unblockUser");
      }
    },
    async sendVerifyEmailUser(id: number): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        await $api(`/user/${id}/send-email-validation`, {
          method: "PUT",
        });
        notificationStore.notifySuccess(t('backoffice.email_sent'));
      } catch (error) {
        notificationStore.handleError(error, "sendVerifyEmailUser");
      }
    },
  },
});
