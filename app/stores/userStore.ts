import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/user/CreateUserRequestDto";
import type { LoginDto } from "./types/LoginDto";
import { useNotificationStore } from "@/stores/notificationStore";
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
        const response = await $api<string>("api/auth/login", {
          method: "POST",
          body: loginDto,
        });

        localStorage.setItem("token", response);

        this.isLogged = true;

        try {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        } catch (e) {
          // Ignore si storage désactivé
        }

        const getMeResponse = await this.getMe(false);

        this.email = getMeResponse.email;

        const salt = Uint8Array.from(atob(getMeResponse.salt), (c) =>
          c.charCodeAt(0)
        );

        keyStore.deriveAndStoreKey(loginDto.password, salt);

        notificationStore.notifySuccess("Successfully logged in!");
      } catch (error: any) {
        this.isLogged = false;
        if (error?.status === 409) {
          if (error?.data?.message?.includes("account is not validated")) {
            notificationStore.notifyWarning(
              "Votre compte n'est pas encore validé par l'administrateur, veuillez attendre sa validation, si cela persiste, contactez le.",
              10000
            );
          }

          return;
        }
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
      const salt = crypto.getRandomValues(new Uint8Array(16));
      await deriveKeyFromPassword(createUserRequestDto.rawPassword, salt);

      try {
        await $api("/user", {
          method: "POST",
          body: createUserRequestDto,
        });
        notificationStore.notifySuccess("Le compte a été créé avec succès.");
        this.email = createUserRequestDto.email;
        return true;
      } catch (error: any) {
        if (error?.data?.message?.includes("USER_MAIL_ALREADY_EXISTS")) {
          notificationStore.notifyWarning(
            "Un compte existe déjà avec cette adresse email.",
            10000
          );
          return false;
        }
        if (error?.data?.message?.includes("USER_PSEUDO_ALREADY_EXISTS")) {
          notificationStore.notifyWarning(
            "Un compte existe déjà avec ce pseudo.",
            10000
          );
          return false;
        }

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
      localStorage.removeItem("token");
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

        notificationStore.notifySuccess("Mail de validation envoyé.");
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

        notificationStore.notifySuccess(
          "Votre adresse mail a été validée avec succès."
        );
        notificationStore.notifyWarning(
          "Il faudra attendre la validation de l'administrateur pour vous connecter.",
          15000
        );
        return true;
      } catch (error) {
        notificationStore.handleError(error, "verifyToken");
        return false;
      }
    },
  },

  persist: true,
});
