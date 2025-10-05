// MoodTracker Pro - Service Worker
// Version 1.1.0 - Enhanced Offline Support

const CACHE_NAME = 'moodtracker-pro-v1.1.0';
const RUNTIME_CACHE = 'moodtracker-runtime-v1.1.0';

// Core files to cache immediately
const CORE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './wellness-tips.js',
    './help-panels.js',
    './i18n.js',
    './indexeddb-storage.js',
    './offline-support.js',
    './cache-management.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './icon-192-maskable.png',
    './icon-512-maskable.png',
    './icon-192.svg',
    './icon-512.svg',
    './icon-192-maskable.svg',
    './icon-512-maskable.svg',
    './screenshot-mobile.png',
    './screenshot-desktop.png',
    './screenshot-mobile.svg',
    './screenshot-desktop.svg',
    './mobile-responsive.css',
    './ai-assistant.css',
    './keyboard-shortcuts.css',
    './accessibility.css',
    './webhook-integration.css',
    './plugin-marketplace.css',
    './wellness.css',
    './voice-input.css',
    './help-system.css',
    './offline-support.css',
    './print.css'
];

// External resources (CDN)
const EXTERNAL_RESOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event - Cache core assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching core assets');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Core assets cached successfully');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activated successfully');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests that aren't in our external resources
    if (url.origin !== location.origin && !EXTERNAL_RESOURCES.includes(request.url)) {
        return;
    }

    // Handle API calls differently - always try network first
    if (request.url.includes('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // For HTML pages, use network first strategy
    const acceptHeader = request.headers.get('Accept');
    if (acceptHeader && acceptHeader.includes('text/html')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // For navigation requests (page loads)
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // For other resources, use cache first strategy
    event.respondWith(cacheFirst(request));
});

// Cache First Strategy - Serve from cache, fallback to network
async function cacheFirst(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[Service Worker] ✅ Serving from cache:', request.url);
            return cachedResponse;
        }

        console.log('[Service Worker] 🌐 Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            // Clone the response before caching
            cache.put(request, networkResponse.clone()).catch(err => {
                console.warn('[Service Worker] Failed to cache:', request.url, err);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] ❌ Fetch failed:', error);
        
        // Try cache again as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[Service Worker] 🔄 Serving stale cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate' || request.destination === 'document') {
            const cache = await caches.open(CACHE_NAME);
            const offlinePage = await cache.match('./index.html');
            if (offlinePage) {
                return offlinePage;
            }
        }
        
        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// Network First Strategy - Try network, fallback to cache
async function networkFirst(request) {
    try {
        console.log('[Service Worker] 🌐 Network first:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone()).catch(err => {
                console.warn('[Service Worker] Failed to cache:', request.url, err);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[Service Worker] 📴 Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] ✅ Serving from cache (offline):', request.url);
            return cachedResponse;
        }
        
        // For navigation requests, return index.html from cache
        if (request.mode === 'navigate' || request.destination === 'document') {
            const cache = await caches.open(CACHE_NAME);
            const offlinePage = await cache.match('./index.html');
            if (offlinePage) {
                console.log('[Service Worker] 🏠 Serving index.html (offline)');
                return offlinePage;
            }
        }
        
        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
    
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Background Sync for offline mood entries
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-mood-data') {
        event.waitUntil(syncMoodData());
    }
});

async function syncMoodData() {
    try {
        // This would sync with a backend server if available
        console.log('[Service Worker] Syncing mood data...');
        // Implementation would depend on backend API
        return Promise.resolve();
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        return Promise.reject(error);
    }
}

// Push Notification Handler
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Time to check in with your mood!',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" fill="%230a0a0a" rx="32"/%3E%3Ctext x="96" y="130" font-size="100" text-anchor="middle" fill="%2300ff88"%3E😊%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Ccircle cx="48" cy="48" r="48" fill="%2300ff88"/%3E%3Ctext x="48" y="65" font-size="50" text-anchor="middle" fill="%230a0a0a"%3E😊%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200],
        tag: 'mood-reminder',
        requireInteraction: false,
        data: {
            url: './',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'log',
                title: 'Log Mood'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('MoodTracker Pro', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'log') {
        event.waitUntil(
            clients.openWindow('./?action=log')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
    } else {
        // Default action - open app
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    // Focus existing window if available
                    for (let client of clientList) {
                        if (client.url.includes(location.origin) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Otherwise open new window
                    if (clients.openWindow) {
                        return clients.openWindow('./');
                    }
                })
        );
    }
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Periodic sync:', event.tag);
    
    if (event.tag === 'daily-reminder') {
        event.waitUntil(showDailyReminder());
    }
});

async function showDailyReminder() {
    const options = {
        body: 'Don\'t forget to log your mood today! 😊',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" fill="%230a0a0a" rx="32"/%3E%3Ctext x="96" y="130" font-size="100" text-anchor="middle" fill="%2300ff88"%3E📝%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Ccircle cx="48" cy="48" r="48" fill="%2300ff88"/%3E%3Ctext x="48" y="65" font-size="50" text-anchor="middle" fill="%230a0a0a"%3E📝%3C/text%3E%3C/svg%3E',
        tag: 'daily-reminder'
    };
    
    return self.registration.showNotification('Daily Mood Check-in', options);
}

console.log('[Service Worker] Loaded successfully');
