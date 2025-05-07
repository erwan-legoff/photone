import { defineStore } from "pinia";
import { deriveKeyFromPassword } from "~/tools/security/encryption/deriveKeyFromPassword";

let inMemoryKey: CryptoKey | undefined;
let inMemorySalt: Uint8Array | undefined;

export const useKeyStore = defineStore("key-store", {
  actions: {
    setKey(key: CryptoKey) {
      inMemoryKey = key;
    },
    getKey(): CryptoKey | undefined {
      return inMemoryKey;
    },
    clearKey() {
      inMemoryKey = undefined;
    },

    setSalt(salt: Uint8Array) {
      inMemorySalt = salt;
    },
    getSalt(): Uint8Array | undefined {
      return inMemorySalt;
    },
    clearSalt() {
      inMemorySalt = undefined;
    },

    async deriveAndStoreKey(password: string, salt: Uint8Array) {
      this.setKey(await deriveKeyFromPassword(password, salt));
      this.setSalt(salt);
    },

    clearAll() {
      inMemoryKey = undefined;
      inMemorySalt = undefined;
    },
  },
});
