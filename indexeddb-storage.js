// IndexedDB Storage for Offline Data
class IndexedDBStorage {
    constructor() {
        this.dbName = 'MoodTrackerDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('❌ IndexedDB failed to open:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create mood entries store
                if (!db.objectStoreNames.contains('moodEntries')) {
                    const moodStore = db.createObjectStore('moodEntries', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    moodStore.createIndex('timestamp', 'timestamp', { unique: false });
                    moodStore.createIndex('mood', 'mood', { unique: false });
                    moodStore.createIndex('synced', 'synced', { unique: false });
                }

                // Create offline queue store
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    const queueStore = db.createObjectStore('offlineQueue', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    queueStore.createIndex('timestamp', 'timestamp', { unique: false });
                    queueStore.createIndex('type', 'type', { unique: false });
                }

                // Create settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                console.log('🔨 IndexedDB schema created');
            };
        });
    }

    // Mood Entries Operations
    async addMoodEntry(moodData) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['moodEntries'], 'readwrite');
            const store = transaction.objectStore('moodEntries');
            
            const entry = {
                ...moodData,
                timestamp: moodData.timestamp || new Date().toISOString(),
                synced: false,
                createdOffline: !navigator.onLine
            };

            const request = store.add(entry);

            request.onsuccess = () => {
                console.log('✅ Mood entry saved to IndexedDB:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Failed to save mood entry:', request.error);
                reject(request.error);
            };
        });
    }

    async getMoodEntry(id) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['moodEntries'], 'readonly');
            const store = transaction.objectStore('moodEntries');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllMoodEntries() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['moodEntries'], 'readonly');
            const store = transaction.objectStore('moodEntries');
            const request = store.getAll();

            request.onsuccess = () => {
                console.log(`📊 Retrieved ${request.result.length} mood entries`);
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getUnsyncedEntries() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['moodEntries'], 'readonly');
            const store = transaction.objectStore('moodEntries');
            const index = store.index('synced');
            const request = index.getAll(false);

            request.onsuccess = () => {
                console.log(`🔄 Found ${request.result.length} unsynced entries`);
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async updateMoodEntry(id, updates) {
        if (!this.db) await this.init();

        return new Promise(async (resolve, reject) => {
            const entry = await this.getMoodEntry(id);
            if (!entry) {
                reject(new Error('Entry not found'));
                return;
            }

            const transaction = this.db.transaction(['moodEntries'], 'readwrite');
            const store = transaction.objectStore('moodEntries');
            const updatedEntry = { ...entry, ...updates };
            const request = store.put(updatedEntry);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteMoodEntry(id) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['moodEntries'], 'readwrite');
            const store = transaction.objectStore('moodEntries');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('🗑️ Mood entry deleted:', id);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Offline Queue Operations
    async addToQueue(queueItem) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['offlineQueue'], 'readwrite');
            const store = transaction.objectStore('offlineQueue');
            
            const item = {
                ...queueItem,
                timestamp: queueItem.timestamp || new Date().toISOString()
            };

            const request = store.add(item);

            request.onsuccess = () => {
                console.log('📝 Item added to offline queue:', request.result);
                resolve(request.result);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getQueue() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['offlineQueue'], 'readonly');
            const store = transaction.objectStore('offlineQueue');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async removeFromQueue(id) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['offlineQueue'], 'readwrite');
            const store = transaction.objectStore('offlineQueue');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearQueue() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['offlineQueue'], 'readwrite');
            const store = transaction.objectStore('offlineQueue');
            const request = store.clear();

            request.onsuccess = () => {
                console.log('🗑️ Offline queue cleared');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Settings Operations
    async saveSetting(key, value) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSetting(key) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result?.value);
            request.onerror = () => reject(request.error);
        });
    }

    // Utility Methods
    async getStorageStats() {
        if (!this.db) await this.init();

        const moodCount = await this.getAllMoodEntries().then(e => e.length);
        const queueCount = await this.getQueue().then(q => q.length);
        const unsyncedCount = await this.getUnsyncedEntries().then(e => e.length);

        return {
            totalMoodEntries: moodCount,
            queuedItems: queueCount,
            unsyncedEntries: unsyncedCount
        };
    }

    async clearAllData() {
        if (!this.db) await this.init();

        const stores = ['moodEntries', 'offlineQueue', 'settings'];
        const promises = stores.map(storeName => {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });

        await Promise.all(promises);
        console.log('🗑️ All IndexedDB data cleared');
    }

    async exportData() {
        if (!this.db) await this.init();

        const moodEntries = await this.getAllMoodEntries();
        const queue = await this.getQueue();
        
        return {
            moodEntries,
            queue,
            exportDate: new Date().toISOString(),
            version: this.version
        };
    }

    async importData(data) {
        if (!this.db) await this.init();

        if (data.moodEntries) {
            for (const entry of data.moodEntries) {
                await this.addMoodEntry(entry);
            }
        }

        if (data.queue) {
            for (const item of data.queue) {
                await this.addToQueue(item);
            }
        }

        console.log('📥 Data imported successfully');
    }
}

// Initialize global instance
window.dbStorage = new IndexedDBStorage();

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dbStorage.init();
    });
} else {
    window.dbStorage.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndexedDBStorage;
}
