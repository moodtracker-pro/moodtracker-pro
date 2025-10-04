// Cache Management Functions

// Show offline cache panel
document.getElementById('offlineCacheSettings')?.addEventListener('click', () => {
    document.getElementById('offlineCachePanel').style.display = 'flex';
    refreshCacheStats();
    updateConnectionStatus();
    checkServiceWorkerStatus();
});

// Refresh cache statistics
async function refreshCacheStats() {
    try {
        // Get cache size
        const cacheSize = await getCacheSize();
        document.getElementById('cacheSizeValue').textContent = cacheSize;

        // Get storage estimate
        if (window.offlineSupport) {
            const stats = await window.offlineSupport.getCacheSize();
            if (stats) {
                document.getElementById('storageUsedValue').textContent = `${stats.usageInMB} MB`;
                document.getElementById('quotaValue').textContent = `${stats.quotaInMB} MB`;
                document.getElementById('storagePercentText').textContent = `${stats.percentUsed}%`;
                document.getElementById('cacheProgressBar').style.width = `${stats.percentUsed}%`;
            }
        }

        // Get offline entries count
        if (window.dbStorage) {
            const storageStats = await window.dbStorage.getStorageStats();
            document.getElementById('offlineEntriesValue').textContent = storageStats.totalMoodEntries;
            
            // Update queue info
            if (storageStats.queuedItems > 0) {
                document.getElementById('offlineQueueInfo').style.display = 'block';
                document.getElementById('queuedItemsText').textContent = 
                    `${storageStats.queuedItems} items waiting to sync`;
            } else {
                document.getElementById('offlineQueueInfo').style.display = 'none';
            }
        }

        console.log('📊 Cache stats refreshed');
    } catch (error) {
        console.error('Failed to refresh cache stats:', error);
    }
}

// Get cache size
async function getCacheSize() {
    try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }

        return formatBytes(totalSize);
    } catch (error) {
        console.error('Failed to calculate cache size:', error);
        return '--';
    }
}

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Update connection status
function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    const icon = document.getElementById('connectionStatusIcon');
    const text = document.getElementById('connectionStatusText');

    if (isOnline) {
        icon.style.color = '#00ff88';
        text.textContent = 'Online - All features available';
        text.style.color = '#00ff88';
    } else {
        icon.style.color = '#dc3545';
        text.textContent = 'Offline - Working in offline mode';
        text.style.color = '#dc3545';
    }
}

// Listen for online/offline changes
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Clear app cache
async function clearAppCache() {
    if (!confirm('Are you sure you want to clear all cached data? This will remove offline functionality until the app is reloaded.')) {
        return;
    }

    try {
        if (window.offlineSupport) {
            await window.offlineSupport.clearCache();
        } else {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        alert('Cache cleared successfully! Please reload the page.');
        refreshCacheStats();
    } catch (error) {
        console.error('Failed to clear cache:', error);
        alert('Failed to clear cache. Please try again.');
    }
}

// Force sync offline data
async function forceSyncOfflineData() {
    if (!navigator.onLine) {
        alert('You need to be online to sync data.');
        return;
    }

    try {
        if (window.offlineSupport) {
            await window.offlineSupport.syncOfflineQueue();
        }
        
        if (window.dbStorage) {
            const unsyncedEntries = await window.dbStorage.getUnsyncedEntries();
            
            for (const entry of unsyncedEntries) {
                // Mark as synced
                await window.dbStorage.updateMoodEntry(entry.id, { synced: true });
            }
        }

        alert('Data synced successfully!');
        refreshCacheStats();
    } catch (error) {
        console.error('Failed to sync data:', error);
        alert('Failed to sync data. Please try again.');
    }
}

// Export offline data
async function exportOfflineData() {
    try {
        if (!window.dbStorage) {
            alert('IndexedDB is not available.');
            return;
        }

        const data = await window.dbStorage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moodtracker-offline-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📥 Offline data exported');
    } catch (error) {
        console.error('Failed to export offline data:', error);
        alert('Failed to export data. Please try again.');
    }
}

// Check Service Worker status
async function checkServiceWorkerStatus() {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            
            if (registration) {
                const swStatus = document.getElementById('swStatus');
                const swVersion = document.getElementById('swVersion');
                
                if (registration.active) {
                    swStatus.textContent = 'Active';
                    swStatus.style.color = '#00ff88';
                    
                    // Try to get version from Service Worker
                    if (navigator.serviceWorker.controller) {
                        const messageChannel = new MessageChannel();
                        messageChannel.port1.onmessage = (event) => {
                            if (event.data.version) {
                                swVersion.textContent = event.data.version;
                            }
                        };
                        navigator.serviceWorker.controller.postMessage(
                            { type: 'GET_VERSION' },
                            [messageChannel.port2]
                        );
                    } else {
                        swVersion.textContent = 'v1.0.0';
                    }
                } else {
                    swStatus.textContent = 'Inactive';
                    swStatus.style.color = '#ffc107';
                    swVersion.textContent = '--';
                }
            } else {
                document.getElementById('swStatus').textContent = 'Not Registered';
                document.getElementById('swStatus').style.color = '#dc3545';
                document.getElementById('swVersion').textContent = '--';
            }
        } else {
            document.getElementById('swStatus').textContent = 'Not Supported';
            document.getElementById('swStatus').style.color = '#dc3545';
            document.getElementById('swVersion').textContent = '--';
        }
    } catch (error) {
        console.error('Failed to check Service Worker status:', error);
    }
}

// Auto-refresh stats when panel is visible
setInterval(() => {
    const panel = document.getElementById('offlineCachePanel');
    if (panel && panel.style.display !== 'none') {
        updateConnectionStatus();
    }
}, 5000);

console.log('✅ Cache management module loaded');
