import { useIdb } from '#imports'
import { defineStore } from 'pinia'
import type { WrappedKeyData } from './types/WrappedKeyData'
import { deriveKeyFromPassword } from '~/tools/security/encryption/deriveKeyFromPassword'

// In-memory key only
let inMemoryKey: CryptoKey | undefined
export interface KeyState {
  needPIN: boolean
}
// Constants for IndexedDB
const IDB_KEYS = {
  wrappedKeyData: 'wrapped-key-data',
} as const

export const useKeyStore = defineStore('key-store', {
  state: (): KeyState => {
    return {
      needPIN: false,
    }
  },
  actions: {
    // Memory key management
    setKey(key: CryptoKey) {
      inMemoryKey = key
    },

    async getKey(): Promise<CryptoKey | undefined> {
      return inMemoryKey
    },

    // PIN-based key wrapping functions
    async wrapKeyWithPIN(masterKey: CryptoKey, pin: string): Promise<void> {
      const idb = useIdb()

      // Generate a specific salt for the PIN
      const pinSalt = crypto.getRandomValues(new Uint8Array(16))

      // Derive a wrapping key from the PIN
      const wrappingKey = await deriveKeyFromPassword(pin, pinSalt)

      // Wrap the master key
      const wrappedKey = await crypto.subtle.wrapKey(
        'raw',
        masterKey,
        wrappingKey,
        'AES-GCM'
      )

      // Store the data
      const wrappedKeyData: WrappedKeyData = {
        wrappedKey,
        pinSalt,
      }

      await idb.setItem(IDB_KEYS.wrappedKeyData, wrappedKeyData)
    },

    async unwrapKeyWithPIN(pin: string): Promise<CryptoKey | undefined> {
      const idb = useIdb()

      // Retrieve stored data
      const wrappedKeyData = (await idb.getItem(IDB_KEYS.wrappedKeyData)) as
        | WrappedKeyData
        | undefined

      if (!wrappedKeyData) {
        return undefined
      }

      try {
        // Derive the wrapping key using the PIN and stored salt
        const wrappingKey = await deriveKeyFromPassword(
          pin,
          wrappedKeyData.pinSalt
        )

        // Unwrap the master key
        const unwrappedKey = await crypto.subtle.unwrapKey(
          'raw',
          wrappedKeyData.wrappedKey,
          wrappingKey,
          'AES-GCM',
          'AES-GCM',
          true,
          ['encrypt', 'decrypt']
        )

        // Store the unwrapped key in memory
        this.setKey(unwrappedKey)
        return unwrappedKey
      } catch (error) {
        console.error('Failed to unwrap key:', error)
        return undefined
      }
    },

    // Function to derive and store the master key from password
    async deriveAndStoreKey(password: string, salt: Uint8Array) {
      const masterKey = await deriveKeyFromPassword(password, salt)
      this.setKey(masterKey)
      return masterKey
    },

    // Function to check if a wrapped key exists
    async hasWrappedKey(): Promise<boolean> {
      const idb = useIdb()
      const wrappedKeyData = await idb.getItem(IDB_KEYS.wrappedKeyData)
      return !!wrappedKeyData
    },

    // Cleanup function
    async clearAll() {
      inMemoryKey = undefined
      const idb = useIdb()
      await idb.clear()
    },
  },
})
