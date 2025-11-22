// ★バージョンを上げて、古いバグったキャッシュを捨てさせる
const CACHE_NAME = 'bouhan-map-v23';

const urlsToCache = [
    './',
    // './index.html', ←【削除】これを消してください！これがリダイレクトの犯人です。
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

// 古いキャッシュを消す処理（そのまま）
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
                // リダイレクトされたレスポンスは使わないようにする安全策
                if (response && response.redirected) {
                    return fetch(event.request);
                }
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});