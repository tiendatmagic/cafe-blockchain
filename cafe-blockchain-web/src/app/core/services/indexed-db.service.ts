import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbStorageService {
  private readonly dbName = 'cafe_blockchain_db';
  private readonly dbVersion = 1;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDb(): Promise<IDBDatabase> {
    if (typeof window === 'undefined') {
      return Promise.reject('IndexedDB is not available on server-side');
    }
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('store_cart')) {
          db.createObjectStore('store_cart');
        }
        if (!db.objectStoreNames.contains('store_favorites')) {
          db.createObjectStore('store_favorites');
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  }

  public async get(storeName: string, key: string): Promise<any> {
    try {
      const db = await this.initDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.warn('IndexedDB read error, falling back to null', e);
      return null;
    }
  }

  public async set(storeName: string, key: string, value: any): Promise<void> {
    try {
      const db = await this.initDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('IndexedDB write error', e);
    }
  }

  public async remove(storeName: string, key: string): Promise<void> {
    try {
      const db = await this.initDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('IndexedDB remove error', e);
    }
  }

  public async clear(storeName: string): Promise<void> {
    try {
      const db = await this.initDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('IndexedDB clear error', e);
    }
  }
}
