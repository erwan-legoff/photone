import { openDB, type IDBPDatabase } from 'idb'

export interface VaultOptions {
  dbName?: string
  storeName?: string
  version?: number
}

export function useIdb<T = unknown>(options: VaultOptions = {}) {
  const dbName = options.dbName ?? 'app-db'
  const storeName = options.storeName ?? 'default'
  const version = options.version ?? 1

  const dbInstances: Record<string, Promise<IDBPDatabase>> = {}

  const getDb = async () => {
    if (!import.meta.client) {
      throw new Error('IndexedDB is not available on the server.')
    }
    const instanceKey = `${dbName}:${storeName}`
    if (!dbInstances[instanceKey]) {
      dbInstances[instanceKey] = openDB(dbName, version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName)
          }
        },
        blocked() {
          console.error(
            'IndexedDB open blocked. Maybe another tab is using it with an older version?'
          )
        },
        blocking() {
          console.warn(
            'IndexedDB is blocking. Another tab may be trying to upgrade.'
          )
        },
      })
    }
    return dbInstances[instanceKey]
  }

  return {
    async setItem(key: string, value: T): Promise<void> {
      if (!this.isClient) {
        console.warn(
          `IndexedDB setItem('${key}') called on server. Returning undefined.`
        )
        return undefined // Retourner undefined côté serveur
      }
      const db = await getDb()
      await db.put(storeName, value, key)
    },

    async getItem(key: string): Promise<T | undefined> {
      if (!this.isClient) {
        console.warn(
          `IndexedDB getItem('${key}') called on server. Returning undefined.`
        )
        return undefined // Retourner undefined côté serveur
      }
      const db = await getDb()
      return db.get(storeName, key)
    },

    async deleteItem(key: string): Promise<void> {
      if (!this.isClient) {
        console.warn(
          `IndexedDB deleteItem('${key}') called on server. Ignored.`
        )
        return
      }
      const db = await getDb()
      await db.delete(storeName, key)
    },

    async clear(): Promise<void> {
      if (!this.isClient) {
        console.warn(`IndexedDB clear() called on server. Ignored.`)
        return
      }
      const db = await getDb()
      await db.clear(storeName)
    },

    async keys(): Promise<IDBValidKey[]> {
      if (!this.isClient) {
        console.warn(
          `IndexedDB keys() called on server. Returning empty array.`
        )
        return []
      }
      const db = await getDb()
      return db.getAllKeys(storeName)
    },
    isClient: import.meta.client,
  }
}
