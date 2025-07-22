import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/user/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import type { JwtLoginResponseDto } from "./types/responses/JwtLoginResponseDto";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
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

      try {
        console.info("[login] Sending POST api/auth/login with:", loginDto);

        const response = await $api<JwtLoginResponseDto>("api/auth/login", {
          method: "POST",
          body: loginDto,
        });

        console.info("[login] Login API response:", response);

        this.isLogged = true;
        console.info("[login] isLogged set to true");

        // Log token si stocké côté front (optionnel)
        try {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
          if (token) {
            console.info(
              "[login] Token found in localStorage/sessionStorage:",
              token.slice(0, 20) + "..."
            );
          } else {
            console.info("[login] No token in localStorage/sessionStorage");
          }
        } catch (e) {
          // Ignore si storage désactivé
        }

        const getMeResponse = await this.getMe(false);
        console.info("[login] getMe response:", getMeResponse);

        this.email = getMeResponse.email;
        console.info("[login] Email set:", this.email);

        const salt = Uint8Array.from(atob(getMeResponse.salt), (c) =>
          c.charCodeAt(0)
        );
        console.info("[login] Salt extracted (len):", salt.length);

        keyStore.deriveAndStoreKey(loginDto.password, salt);
        console.info("[login] Key derived and stored");

        notificationStore.notifySuccess("Successfully logged in!");
      } catch (error) {
        this.isLogged = false;
        console.warn(
          "[login] Login failed, isLogged set to false. Error:",
          error
        );
        useNotificationStore().handleError(error, "login");
      }
    },

    async getMe(withNotification: boolean = true): Promise<GetMeResponseDto> {
      const { $api } = useNuxtApp();
      const notificationStore = useNotificationStore();

      try {
        console.info("[getMe] Calling user/me");
        const result = await $api<GetMeResponseDto>("user/me", {
          method: "GET",
        });
        console.info("[getMe] API response:", result);
        return result;
      } catch (error) {
        console.warn("[getMe] Error on user/me:", error);
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
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await deriveKeyFromPassword(createUserRequestDto.rawPassword, salt);

      try {
        await $api("/user", {
          method: "POST",
          body: createUserRequestDto,
        });
        notificationStore.notifySuccess("Your account has been created!");
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

      this.email = "";
      this.isLogged = false;
      keyStore.clearAll();

      try {
        await $api("/api/auth/logout", {
          method: "POST",
        });
        notificationStore.notifyInfo("Successfully logged out.");
      } catch (error) {
        notificationStore.handleError(error, "logout");
      }
      router.push("/login");
    },

    async sendValidationEmail(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        if (!this.email) {
          notificationStore.notifyError("Email address is required.");
          return;
        }

        await $api("/api/auth/send-verification-email", {
          method: "POST",
          params: { email: this.email },
        });

        notificationStore.notifySuccess("Verification email sent.");
      } catch (error) {
        notificationStore.handleError(error, "sendValidationEmail");
        this.logout();
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

        notificationStore.notifySuccess("Your account has been validated.");
        return true;
      } catch (error) {
        notificationStore.handleError(error, "verifyToken");
        return false;
      }
    },
  },

  persist: true,
});
