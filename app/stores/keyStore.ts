import { useIdb } from "#imports";
import { defineStore } from "pinia";
import type { WrappedKeyData } from "./types/WrappedKeyData";
import { deriveKeyFromPassword } from "~/tools/security/encryption/deriveKeyFromPassword";

// In-memory key only
let inMemoryKey: CryptoKey | undefined;
export interface KeyState {
  needsPIN: boolean;
}
// Constants for IndexedDB
const IDB_KEYS = {
  wrappedKeyData: "wrapped-key-data",
} as const;

export const useKeyStore = defineStore("key-store", {
  state: (): KeyState => {
    return {
      needsPIN: false,
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

      notificationStore.notifyInfo(
        "We're encrypting your private key that will be used to encrypt and decrypt your photos..."
      );
      try {
        // Generate a specific salt for the PIN
        const pinSalt = crypto.getRandomValues(new Uint8Array(16));

        const wrappingKey = await deriveKeyFromPassword(pin, pinSalt, true, [
          "encrypt",
          "decrypt",
        ]);

        if (!inMemoryKey) {
          notificationStore.notifyError("No key to wrap, please relogin.");
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
          notificationStore.notifyInfo("JWK chiffré avec succès.");
        } catch (wrapError) {
          notificationStore.notifyError(
            "Erreur lors du chiffrement du JWK: " + (wrapError as any)?.message
          );
          throw wrapError;
        }

        // Store the data (serialize buffers)
        const wrappedKeyData = {
          wrappedKey: bufferToBase64(wrappedKey),
          pinSalt: uint8ToBase64(pinSalt),
          iv: uint8ToBase64(initializationVector),
        };
        notificationStore.notifyInfo("Stockage de la clé wrap dans l'idb...");
        await idb.setItem(IDB_KEYS.wrappedKeyData, wrappedKeyData);
        this.needsPIN = false;
        if (!await this.hasWrappedKey()) {
          notificationStore.notifyError("No wrapped key stored");
          return false;
        }


        notificationStore.notifySuccess("Key successfully wrapped !");
        console.log("Key successfully wrapped.");
        return true;
      } catch (error: any) {
        console.error("Failed to wrap key:", error);
        notificationStore.notifyError(`Failed to wrap key: ${error.message}`);
        return false;
      }
    },

    async unwrapKeyWithPIN(pin: string): Promise<CryptoKey | undefined> {
      const idb = useIdb();

      // Retrieve stored data
      let wrappedKeyData = (await idb.getItem(IDB_KEYS.wrappedKeyData)) as any;
      if (!wrappedKeyData) {
        this.needsPIN = true;
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
          console.error("Erreur lors du déchiffrement du JWK:", decryptError);
          this.needsPIN = true;
          return undefined;
        }
        const decoder = new TextDecoder();
        const jwkString = decoder.decode(decryptedJwkBuffer);
        let jwk;
        try {
          jwk = JSON.parse(jwkString);
        } catch (parseError) {
          console.error("Erreur lors du parsing du JWK:", parseError);
          this.needsPIN = true;
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
        return unwrappedKey;
      } catch (error) {
        console.error("Failed to unwrap key:", error);
        this.needsPIN = true;
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
      const wrappedKeyData = await idb.getItem(IDB_KEYS.wrappedKeyData);
      return !!wrappedKeyData;
    },

    async checkIfNeedsPin(): Promise<boolean> {
      const userStore = useUserStore()
      const hasWrappedKey = await this.hasWrappedKey()
      const needsPin = hasWrappedKey && userStore.isLogged
      this.needsPIN = needsPin
      return needsPin
    },

    async checkIfNeedsToRelogin(): Promise<boolean> {
      const needsPIN = await this.checkIfNeedsPin()
      return needsPIN && !this.getKey()
    },

    // Cleanup function
    async clearAll() {
      inMemoryKey = undefined;
      const idb = useIdb();
      await idb.clear();
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
