import { defineStore } from "pinia";

type Message = {
  text: string;
  timeout: number;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
};

interface NotificationState {
  messages: Message[];
}
const defaultTimeout = 3000;
export const useNotificationStore = defineStore("notification-store", {
  state: (): NotificationState => ({
    messages: [],
  }),

  actions: {
    notify(message: Message) {
      this.messages.push(message);
    },

    notifySuccess(msg: string, timeout = defaultTimeout) {
      this.notify({ text: msg, color: "success", timeout: timeout });
    },
    notifyError(msg: string, timeout = defaultTimeout) {
      this.notify({ text: msg, color: "error", timeout: timeout });
    },
    /**
     * Gère les erreurs en les enregistrant dans l'état et en les loggant.
     * @param error - L'erreur capturée.
     * @param action - L'action où l'erreur s'est produite.
     */
    handleError(error: unknown, action: string): void {
        let errorMessage = `Erreur dans ${action}: `;
      
        if (error && typeof error === 'object') {
          const status = (error as any)?.response?.status;
          const statusText = (error as any)?.response?.statusText;
          const method = (error as any)?.request?.method;
          const url = (error as any)?.request?.url;
          const message = (error as any)?.data?.message || (error as any)?.message;
      
          if (status) {
            errorMessage += `[${method || 'FETCH'}] ${url || ''} → ${status} ${statusText || ''}`;
            if (message) {
              errorMessage += ` | ${message}`;
            }
          } else if ((error as Error).message?.includes('NetworkError')) {
            errorMessage += `Erreur réseau : ${message || (error as Error).message}`;
          } else if (error instanceof Error) {
            errorMessage += error.message;
          } else {
            errorMessage += JSON.stringify(error);
          }
      
        } else {
          errorMessage += String(error);
        }
      
        console.error(errorMessage);
        this.notifyError(errorMessage);
      }
  },
});
