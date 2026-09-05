// اسم مخزن الكاش - غيّره لو حدّثت الملفات مستقبلاً عشان يحدّث النسخة
const CACHE_NAME = 'attendance-app-cache-v1';

// الملفات التي يتم تخزينها محلياً ليعمل التطبيق بدون إنترنت
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// عند تثبيت الـ Service Worker: نخزن كل الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// عند التفعيل: نحذف أي نسخ كاش قديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// عند أي طلب: نحاول نجيبه من الكاش أولاً، ولو ما موجود نجيبه من الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
