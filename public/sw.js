const CACHE_NAME = "toprange-v1";

const STATIC_FILES = [
    "/",
    "/contact",
    "/Assets/Logo.png",
];

self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_FILES);
        }),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),

            caches.keys().then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)),
                ),
            ),
        ]),
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/api/")) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() =>
            caches.match(event.request),
        ),
    );
});