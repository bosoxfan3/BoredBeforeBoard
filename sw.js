// sw.js
self.addEventListener('install', (e) => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    // Not handling caching, just letting requests go to network
});
