// Offline Support Module
class OfflineSupport {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineQueue = [];
        this.init();
    }

    init() {
        // Create offline indicator
        this.createOfflineIndicator();
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Check initial status
        this.updateStatus();
        
        // Load offline queue from localStorage
        this.loadOfflineQueue();
    }

    createOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator hidden';
        indicator.innerHTML = `
            <div class="offline-content">
                <i class="fas fa-wifi-slash"></i>
                <span class="offline-text">You're offline</span>
                <span class="offline-subtext">Changes will sync when you're back online</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    handleOnline() {
        console.log('🟢 Back online');
        this.isOnline = true;
        this.updateStatus();
        this.syncOfflineQueue();
        this.showToast('Connected! Syncing your data...', 'success');
    }

    handleOffline() {
        console.log('🔴 Gone offline');
        this.isOnline = false;
        this.updateStatus();
        this.showToast('You\'re offline. Your data will be saved locally.', 'warning');
    }

    updateStatus() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            if (this.isOnline) {
                indicator.classList.add('hidden');
            } else {
                indicator.classList.remove('hidden');
            }
        }
    }

    // Queue management
    addToQueue(action) {
        const queueItem = {
            id: Date.now(),
            action: action,
            timestamp: new Date().toISOString(),
            data: action.data
        };
        
        this.offlineQueue.push(queueItem);
        this.saveOfflineQueue();
        
        console.log('📝 Added to offline queue:', queueItem);
        return queueItem.id;
    }

    loadOfflineQueue() {
        const saved = localStorage.getItem('offlineQueue');
        if (saved) {
            try {
                this.offlineQueue = JSON.parse(saved);
                console.log(`📦 Loaded ${this.offlineQueue.length} items from offline queue`);
            } catch (error) {
                console.error('Failed to load offline queue:', error);
                this.offlineQueue = [];
            }
        }
    }

    saveOfflineQueue() {
        try {
            localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    }

    async syncOfflineQueue() {
        if (!this.isOnline || this.offlineQueue.length === 0) return;

        console.log(`🔄 Syncing ${this.offlineQueue.length} offline items...`);
        
        const itemsToSync = [...this.offlineQueue];
        const successfulSyncs = [];

        for (const item of itemsToSync) {
            try {
                await this.processQueueItem(item);
                successfulSyncs.push(item.id);
                console.log('✅ Synced:', item.id);
            } catch (error) {
                console.error('❌ Failed to sync:', item.id, error);
            }
        }

        // Remove successfully synced items
        this.offlineQueue = this.offlineQueue.filter(
            item => !successfulSyncs.includes(item.id)
        );
        this.saveOfflineQueue();

        if (successfulSyncs.length > 0) {
            this.showToast(`Synced ${successfulSyncs.length} items`, 'success');
        }
    }

    async processQueueItem(item) {
        // This would process the queued action
        // For now, just simulate success
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Processing queue item:', item);
                resolve();
            }, 100);
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `offline-toast offline-toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Cache management
    async getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
                quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
                percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
        }
        return null;
    }

    async clearCache() {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('🗑️ Cache cleared successfully');
            this.showToast('Cache cleared successfully', 'success');
            return true;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            this.showToast('Failed to clear cache', 'error');
            return false;
        }
    }
}

// Initialize offline support
window.offlineSupport = new OfflineSupport();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineSupport;
}
