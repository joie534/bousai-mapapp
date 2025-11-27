const CACHE_NAME = 'bouhan-map-v2025-11-22-footer-v58';

// ★重要：ここには画像と設定ファイルだけを入れる。
// HTMLファイル（./ や index.html）は絶対に入れない。
const urlsToCache = [
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
    // HTMLページへのアクセス（navigate）は、キャッシュを見ずに必ずネットに取りに行く
    // これでリダイレクトエラーは100%回避できる
    if (event.request.mode === 'navigate') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    );
});