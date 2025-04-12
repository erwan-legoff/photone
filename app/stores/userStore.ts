//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from "pinia";
import type { CreateUserRequestDto } from "./types/CreateUserRequestDto";
const SERVICE_ROOT =
  process.env.NUXT_MEDIUM_SERVICE_ROOT || "http://localhost:8080";

export interface UserState {
  checking: boolean;
  errorMessage: string | null;
}

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
      try {
        console.log("USER");
        this.checking = true;
        const CREATE_USER_URL = SERVICE_ROOT + "/user";
        console.log("user", JSON.stringify(user));

        const response = await $fetch(CREATE_USER_URL, {
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include" // à garder si allowCredentials(true) est activé côté Spring
        });
        

        this.checking = false;
        console.log(JSON.stringify(response));
      } catch (error) {
        this.handleError(error, "createUser");
        this.checking = false;
        throw error;
      }
    },

    /**
     * Gère les erreurs en les enregistrant dans l'état et en les loggant.
     * @param error - L'erreur capturée.
     * @param action - L'action où l'erreur s'est produite.
     */
    handleError(error: unknown, action: string): void {
      if (error instanceof Error) {
        console.error(`Erreur dans ${action}:`, error.message);
        this.errorMessage = `Erreur dans ${action}: ${error.message}`;
      } else {
        console.error(`Erreur inconnue dans ${action}:`, error);
        this.errorMessage = `Erreur inconnue dans ${action}`;
      }
    },
  },
});
