console.log('Hello from Service Worker!');

const CACHE_NAME = 'PWA-budget-tracker-version_01';

const FILES_TO_CACHE = [
    "/index.html",
    "/css/styles.css",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
    "/js/idb.js",
    "/js/index.js",
    "/manifest.json"
];

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
});

self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf('PWA-budget-tracker');
        });
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
});

self.addEventListener('fetch', event => {
console.log('Fetch: ' + event.request.url)
event.respondWith(
    caches.match(event.request).then(request => {
    if (request) {
        console.log('Cache response: ' + event.request.url);
        return request;
    } else {     
        console.log('File not cached. Fetching: ' + event.request.url);
        return fetch(event.request);
    }
    })
)
});