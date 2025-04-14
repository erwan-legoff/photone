//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
const SERVICE_ROOT =
  process.env.NUXT_MEDIUM_SERVICE_ROOT || "http://localhost:8080";

export interface UserState {
  checking: boolean;
  errorMessage: string | null;
}
import { useNotificationStore } from "@/stores/notificationStore";

export const useUserStore = defineStore("user-store", {
  state: (): UserState => {
    return {
      checking: false,
      errorMessage: null,
    };
  },
  actions: {
    /**
     * Create user
     * @param user - the user to create
     */
    async createUser(user: CreateUserRequestDto): Promise<void> {
      const notificationStore = useNotificationStore();
      try {
        this.checking = true;
        const CREATE_USER_URL = SERVICE_ROOT + "/user";

        const response = await $fetch(CREATE_USER_URL, {
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });
        notificationStore.notifySuccess("Account created successfully !");
        this.checking = false;
      } catch (error) {
        notificationStore.handleError(error, "createUser");
        this.checking = false;
        throw error;
      }
    },

    async login(login: LoginDto) {
      const notificationStore = useNotificationStore();
      try {
        this.checking = true;
        const LOGIN_URL = SERVICE_ROOT + "/api/auth/login";

        const response = await $fetch<JwtLoginResponseDto>(LOGIN_URL, {
          method: "POST",
          body: login,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });
        this.checking = false;
        notificationStore.notifySuccess("Connected successfully !");
      } catch (error) {
        notificationStore.handleError(error, "createUser");
        this.checking = false;
        throw error;
      }
    },
  },
});
