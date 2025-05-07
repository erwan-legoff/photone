import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/user/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
import { useNotificationStore } from "@/stores/notificationStore";
import { deriveKeyFromPassword } from "~/tools/security/encryption/deriveKeyFromPassword";
import { useKeyStore } from "./keyStore";

export interface UserState {
  email: string;
  isLogged: boolean;
}
export const useUserStore = defineStore("user-store", {
  state: (): UserState => {
    return {
      email: "",
      isLogged: false,
    };
  },
  actions: {
    async login(loginDto: LoginDto): Promise<void> {
      const notificationStore = useNotificationStore();
      const keyStore = useKeyStore();
      const { $api } = useNuxtApp();

      const salt = crypto.getRandomValues(new Uint8Array(16));
      await keyStore.deriveAndStoreKey(loginDto.password, salt);

      try {
        const response = await $api<JwtLoginResponseDto>("api/auth/login", {
          method: "POST",
          body: loginDto,
        });
        this.isLogged = true;
        notificationStore.notifySuccess("Successfully logged in!");
        this.email = loginDto.email;
      } catch (error) {
        this.isLogged = false;
        notificationStore.handleError(error, "login");
      }
    },

    async createUser(
      createUserRequestDto: CreateUserRequestDto
    ): Promise<boolean> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await deriveKeyFromPassword(createUserRequestDto.rawPassword, salt);
      try {
        await $api("/user", {
          method: "POST",
          body: createUserRequestDto,
        });
        notificationStore.notifySuccess("Account created successfully!");
        this.email = createUserRequestDto.email;
        return true;
      } catch (error) {
        notificationStore.handleError(error, "createUser");
        return false;
      }
    },

    async logout(): Promise<void> {
      this.email = "";
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();
      this.isLogged = false;
      try {
        await $api("/logout", {
          method: "POST",
        });

        notificationStore.notifyInfo("Successfully logged out!");
      } catch (error) {
        notificationStore.handleError(error, "logout");
      }
    },
    async sendValidationEmail(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        if (!this.email) {
          notificationStore.notifyError("Email Required !");
          return;
        }
        await $api("/api/auth/send-verification-email", {
          method: "POST",
          params: {
            email: this.email,
          },
        });
        notificationStore.notifySuccess("Verification email sent!");
      } catch (error) {
        notificationStore.handleError(error, "sendValidationEmail");

        this.logout;
      }
    },
    async verifyToken(token: string): Promise<boolean> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        await $api("/api/auth/verify", {
          method: "GET",
          params: { token },
        });
        notificationStore.notifySuccess("Your account is now validated!");
        return true;
      } catch (error) {
        notificationStore.handleError(error, "verifyToken");
        return false;
      }
    },
  },
  persist: true,
});
