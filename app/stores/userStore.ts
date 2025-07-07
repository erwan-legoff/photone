import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/user/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from 'vue-i18n';
import { deriveKeyFromPassword } from "~/tools/security/encryption/deriveKeyFromPassword";
import { useKeyStore } from "./keyStore";
import type { GetMeResponseDto } from "./types/responses/GetMeResponseDto";

export interface UserState {
  email: string;
  isLogged: boolean;
}

export const useUserStore = defineStore("user-store", {
  state: (): UserState => ({
    email: "",
    isLogged: false,
  }),

  actions: {
    async login(loginDto: LoginDto): Promise<void> {
      const notificationStore = useNotificationStore();
      const keyStore = useKeyStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        const response = await $api<JwtLoginResponseDto>("api/auth/login", {
          method: "POST",
          body: loginDto,
        });

        this.isLogged = true;

        const getMeResponse = await this.getMe(false);
        this.email = getMeResponse.email;

        const salt = Uint8Array.from(atob(getMeResponse.salt), (c) =>
          c.charCodeAt(0)
        );

        keyStore.deriveAndStoreKey(loginDto.password, salt);
        notificationStore.notifySuccess(t('global.success_logged_in'));
      } catch (error) {
        this.isLogged = false;
        useNotificationStore().handleError(error, "login");
      }
    },

    async getMe(withNotification: boolean = true): Promise<GetMeResponseDto> {
      const { $api } = useNuxtApp();
      const notificationStore = useNotificationStore();

      try {
        return await $api<GetMeResponseDto>("user/me", {
          method: "GET",
        });
      } catch (error) {
        if (withNotification) {
          notificationStore.handleError(error, "getMe");
        }
        throw error;
      }
    },

    async createUser(
      createUserRequestDto: CreateUserRequestDto
    ): Promise<boolean> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await deriveKeyFromPassword(createUserRequestDto.rawPassword, salt);

      try {
        await $api("/user", {
          method: "POST",
          body: createUserRequestDto,
        });
        notificationStore.notifySuccess(t('global.account_created_successfully'));
        this.email = createUserRequestDto.email;
        return true;
      } catch (error) {
        notificationStore.handleError(error, "createUser");
        return false;
      }
    },

    async logout(): Promise<void> {
      const notificationStore = useNotificationStore();
      const keyStore = useKeyStore();
      const { $api } = useNuxtApp();
      const router = useRouter();
      const { t } = useI18n();

      this.email = "";
      this.isLogged = false;
      keyStore.clearAll();

      try {
        await $api("/api/auth/logout", {
          method: "POST",
        });
        notificationStore.notifyInfo(t('global.info_logged_out'));
      } catch (error) {
        notificationStore.handleError(error, "logout");
      }
      router.push("/login");
    },

    async sendValidationEmail(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        if (!this.email) {
          notificationStore.notifyError(t('global.email_required'));
          return;
        }

        await $api("/api/auth/send-verification-email", {
          method: "POST",
          params: { email: this.email },
        });

        notificationStore.notifySuccess(t('global.verification_email_sent'));
      } catch (error) {
        notificationStore.handleError(error, "sendValidationEmail");
        this.logout();
      }
    },

    async verifyToken(token: string): Promise<boolean> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const { t } = useI18n();

      try {
        await $api("/api/auth/verify", {
          method: "GET",
          params: { token },
        });

        notificationStore.notifySuccess(t('global.account_validated'));
        return true;
      } catch (error) {
        notificationStore.handleError(error, "verifyToken");
        return false;
      }
    },
  },

  persist: true,
});
