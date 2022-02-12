let cacheData = "catchOp"
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                "/static/js/vendors~main.chunk.js",
                 "/static/js/bundle.js",
                "/static/js/main.chunk.js",
                 "/"
            ])
        })
    )
})
console.log("Hello")
this.addEventListener('fetch', (event) => {
    if (!navigator.onLine) {
        event.respondWith(caches.match(event.request).then((response) => {
            if (response !== undefined) {
                return response;
            }
        }));
    }
});