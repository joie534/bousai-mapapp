// ★ここを 'v1' から 'v2' に変えるだけで、スマホが強制更新されます
const CACHE_NAME = 'bouhan-map-v22'; // ←ここを変える
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-180.png',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// 古いキャッシュを消す処理を追加（重要）
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});