import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
import { useNotificationStore } from "@/stores/notificationStore";

export const useUserStore = defineStore("user-store", {
  state: () => {
    return {
      email: "",
      isLogged: false,
    };
  },
  actions: {
    async login(loginDto: LoginDto): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

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
          method: "GET",
          params: {
            email: this.email,
          },
        });
        notificationStore.notifySuccess("Verification email sent!");
      } catch (error) {
        notificationStore.handleError(error, "sendValidationEmail");
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
