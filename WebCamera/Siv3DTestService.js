// https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers

var cacheName = "Siv3DTest-v1";

var appShellFiles = [
  "./Siv3DTest.html",
  "./Siv3DTest.js",
  "./Siv3DTest.wasm",
  "./Siv3DTest.data",
  "./icon.png",
];

self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching all: app shell and content");
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      console.log("[Service Worker] Fetching resource: " + e.request.url);
      return (
        r ||
        fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            console.log(
              "[Service Worker] Caching new resource: " + e.request.url
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
