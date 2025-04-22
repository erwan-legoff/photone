import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
import { useNotificationStore } from "@/stores/notificationStore";

export const useUserStore = defineStore("user-store", {
  state: () => {
    return {
      isAuthenticated: false as boolean,
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
        this.isAuthenticated = true;
        notificationStore.notifySuccess("Successfully logged in!");
      } catch (error) {
        this.isAuthenticated = false;
        notificationStore.handleError(error, "login");
      }
    },

    async createUser(
      createUserRequestDto: CreateUserRequestDto
    ): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        await $api("/user", {
          method: "POST",
          body: createUserRequestDto,
        });
        notificationStore.notifySuccess("Account created successfully!");
      } catch (error) {
        notificationStore.handleError(error, "createUser");
      }
    },

    async logout(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        await $api("/logout", {
          method: "POST",
        });
        this.isAuthenticated = false;
        notificationStore.notifyInfo("Successfully logged out!");
      } catch (error) {
        notificationStore.handleError(error, "logout");
      }
    },
  },
  persist: true,
});
