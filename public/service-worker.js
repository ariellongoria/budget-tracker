const FILES_TO_CACHE = ["./index.html", "./js/index.js", "./css/styles.css", "./js/idb.js"];
const APP_NAME = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_NAME + VERSION;

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Files cached succesfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_NAME);
            });
            cacheKeepList.push(CACHE_NAME);
            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function (e) {
    console.log("fetch request : " + e.request.url);
    e.respondWith(
        caches
            .match(e.request)
            .then(function (request) {
                if (request) {
                    console.log("responding with cache : " + e.request.url);
                    return request;
                } else {
                    console.log("file is not cached, fetching : " + e.request.url);
                    return fetch(e.request);
                }
            })
            .catch(function (error) {
                return caches.match("index.html");
            })
    );
});
