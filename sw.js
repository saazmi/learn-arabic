/* Kill-worker.
   The previous service worker cached HTML too aggressively, leaving mobile
   devices stuck on stale JS with no way to update short of clearing browser
   data. This replacement worker installs, deletes every cache, unregisters
   itself, and reloads all open clients so the page runs the network-fresh
   assets. After it self-destructs, the site runs with no service worker,
   no offline cache, and no stale-JS risk. */

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    // 1. Delete every cache this origin has ever created.
    const keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    // 2. Unregister self so future navigations don't touch a worker at all.
    try { await self.registration.unregister(); } catch (_) {}
    // 3. Claim + reload all client windows so they pick up the fresh HTML/JS.
    const clientsList = await self.clients.matchAll({ type: "window" });
    for (const c of clientsList) {
      try { c.navigate(c.url); } catch (_) {}
    }
  })());
});

/* No fetch handler → every request goes straight to the network. */
