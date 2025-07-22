import { useIdb } from "#imports";
import { defineStore } from "pinia";
import type { WrappedKeyData } from "./types/WrappedKeyData";
import { deriveKeyFromPassword } from "~/tools/security/encryption/deriveKeyFromPassword";

import { decryptFileBinary } from "~/tools/security/encryption/decryptFileBinary";
import { useNotificationStore } from "./notificationStore";
import { useUserStore } from "./userStore";

// In-memory key only
let inMemoryKey: CryptoKey | undefined;
export interface KeyState {
  hasAlreadyWrappedTheKey: boolean;
  needsPinVerification: boolean;
  needsPinInitialization: boolean;
}
// Constants for IndexedDB
const IDB_KEYS = {
  wrappedKeyData: "wrapped-key-data",
} as const;

export const useKeyStore = defineStore("key-store", {
  state: (): KeyState => {
    return {
      hasAlreadyWrappedTheKey: false,
      needsPinVerification: false,
      needsPinInitialization: false,
    };
  },
  actions: {
    async getKey(): Promise<CryptoKey | undefined> {
      return inMemoryKey;
    },

    // PIN-based key wrapping functions
    async wrapKeyWithPIN(pin: string): Promise<boolean> {
      const notificationStore = useNotificationStore();
      const idb = useIdb();
      //

      notificationStore.notifyInfo('Encrypting your private key for your photos...');
      try {
        // Generate a specific salt for the PIN
        const pinSalt = crypto.getRandomValues(new Uint8Array(16));

        const wrappingKey = await deriveKeyFromPassword(pin, pinSalt, true, [
          "encrypt",
          "decrypt",
        ]);

        if (!inMemoryKey) {
          notificationStore.notifyError('No key to encrypt, please reconnect.');
          return false;
        }

        const jwkBuffer = await convertCryptoKeyToBinaryJwk(inMemoryKey);

        const initializationVector = crypto.getRandomValues(new Uint8Array(12));

        let wrappedKey;
        try {
          wrappedKey = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: initializationVector },
            wrappingKey,
            jwkBuffer
          );
          notificationStore.notifyInfo('JWK successfully encrypted.');
        } catch (wrapError) {
          notificationStore.notifyError(
            'Error encrypting JWK: ' + (wrapError as any)?.message
          );
          throw wrapError;
        }

        // Store the data (serialize buffers)
        const wrappedKeyData = {
          wrappedKey: bufferToBase64(wrappedKey),
          pinSalt: uint8ToBase64(pinSalt),
          iv: uint8ToBase64(initializationVector),
        };
        notificationStore.notifyInfo("Storing the encrypted key in idb...");
        await idb.setItem(IDB_KEYS.wrappedKeyData, wrappedKeyData);
        this.needsPinVerification = false;
        if (!(await this.hasWrappedKey())) {
          notificationStore.notifyError('No encrypted key is stored.');
          return false;
        }

        notificationStore.notifySuccess("Key successfully wrapped!");
        console.log("Key successfully wrapped.");
        this.hasAlreadyWrappedTheKey = true;
        return true;
      } catch (error: any) {
        console.error("Failed to wrap key:", error);
        notificationStore.notifyError('Failed to wrap key: ' + error.message);
        return false;
      }
    },

    async unwrapKeyWithPIN(pin: string): Promise<CryptoKey | undefined> {
      const idb = useIdb();
      const notificationStore = useNotificationStore();
      //
      // Retrieve stored data
      let wrappedKeyData = (await idb.getItem(IDB_KEYS.wrappedKeyData)) as any;
      if (!wrappedKeyData) {
        this.needsPinVerification = true;
        notificationStore.notifyError('No encrypted key found.');
        return undefined;
      }
      // Désérialise les buffers
      const wrappedKey = base64ToBuffer(wrappedKeyData.wrappedKey);
      const pinSalt = base64ToUint8(wrappedKeyData.pinSalt);
      const iv = base64ToUint8(wrappedKeyData.iv);

      try {
        // Derive the wrapping key using the PIN and stored salt
        const wrappingKey = await deriveKeyFromPassword(pin, pinSalt, true, [
          "encrypt",
          "decrypt",
        ]);
        // Déchiffre le buffer pour obtenir le JWK
        let decryptedJwkBuffer;
        try {
          decryptedJwkBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            wrappingKey,
            wrappedKey
          );
        } catch (decryptError) {
          console.error("Error decrypting JWK:", decryptError);
          this.needsPinVerification = true;
          notificationStore.notifyError('Error decrypting JWK.');
          return undefined;
        }
        const decoder = new TextDecoder();
        const jwkString = decoder.decode(decryptedJwkBuffer);
        let jwk;
        try {
          jwk = JSON.parse(jwkString);
        } catch (parseError) {
          console.error("Error parsing JWK:", parseError);
          this.needsPinVerification = true;
          notificationStore.notifyError('Error parsing JWK.');
          return undefined;
        }
        // Importe la clé maître à partir du JWK
        const unwrappedKey = await crypto.subtle.importKey(
          "jwk",
          jwk,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
        inMemoryKey = unwrappedKey;
        this.needsPinVerification = false;
        return unwrappedKey;
      } catch (error) {
        console.error("Failed to unwrap key:", error);
        this.needsPinVerification = true;
        return undefined;
      }
    },

    // Function to derive and store the master key from password
    async deriveAndStoreKey(password: string, salt: Uint8Array) {
      const clearKeyToStore = await deriveKeyFromPassword(
        password,
        salt,
        true,
        ["encrypt", "decrypt"]
      );
      inMemoryKey = clearKeyToStore;
    },

    // Function to check if a wrapped key exists
    async hasWrappedKey(): Promise<boolean> {
      const idb = useIdb();
      const notificationStore = useNotificationStore();
      const wrappedKeyData = await idb.getItem(IDB_KEYS.wrappedKeyData);
      return !!wrappedKeyData;
    },
    async requiresPinInitialization(): Promise<boolean> {
      const userStore = useUserStore();
      const notificationStore = useNotificationStore();
      //
      const hasNoWrappedKey = !(await this.hasWrappedKey());
      const needsPin = hasNoWrappedKey && userStore.isLogged;
      this.needsPinInitialization = needsPin;
      if (needsPin) {
        notificationStore.notifyInfo('Please create your PIN.');
      }
      return needsPin;
    },

    async shouldPromptForPin(): Promise<boolean> {
      if (await this.requiresAuthentication()) {
        this.needsPinVerification = false;
        return false;
      }

      if (!!(await this.getKey())) {
        this.needsPinVerification = false;
        return false;
      }
      this.needsPinVerification = true;
      //
      useNotificationStore().notifyWarning('PIN code is required.');
      return true;
    },

    async requiresAuthentication(): Promise<boolean> {
      const userStore = useUserStore();
      const notificationStore = useNotificationStore();
      //

      const hasNoWrappedKey = !(await this.hasWrappedKey());
      const requiresAuthentication = hasNoWrappedKey && !this.getKey();
      if (requiresAuthentication || !userStore.isLogged) {
        userStore.logout();
        notificationStore.notifyWarning('A problem occurred, please reconnect.');
        return true;
      }

      return false;
    },

    async decryptFile(file: File): Promise<File> {
      if (await this.shouldPromptForPin())
        throw new Error("Veuillez rentrer un nouveau mdp");
      const notificationStore = useNotificationStore();
      const userStore = useUserStore();
      const key = await this.getKey();
      if (!key) throw new Error("Aucune clé disponible pour le déchiffrement");
      try {
        return await decryptFileBinary(file, key);
      } catch (error: any) {
        notificationStore.notifyError(
          "Erreur lors du déchiffrement du fichier : " +
            (error?.message || error)
        );
        throw error;
      }
    },

    // Cleanup function
    async clearAll() {
      const idb = useIdb();
      await idb.clear();
      inMemoryKey = undefined;
      this.needsPinInitialization = false;
      this.needsPinVerification = false;
    },
  },
});
async function convertCryptoKeyToBinaryJwk(
  inMemoryKey: CryptoKey
): Promise<Uint8Array> {
  const jwk = await crypto.subtle.exportKey("jwk", inMemoryKey);
  const jwkString = JSON.stringify(jwk);
  const encoder = new TextEncoder();
  const binaryJwk = encoder.encode(jwkString);
  return binaryJwk;
}
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
function uint8ToBase64(arr: Uint8Array): string {
  // Polyfill for ArrayBuffer.slice for compatibility
  const buffer = arr.buffer.slice
    ? arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
    : arr.subarray(0).buffer;
  return bufferToBase64(buffer as ArrayBuffer);
}
function base64ToUint8(base64: string): Uint8Array {
  return new Uint8Array(base64ToBuffer(base64));
}
