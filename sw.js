
## sw.js

```javascript
const CACHE = 'reisefuehrer-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json', './icon.svg']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Wikipedia: Netz zuerst, Antwort für Offline-Gebiete cachen
  if (url.includes('wikipedia.org')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // App-Dateien: Cache zuerst
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
```

---

## icon.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#6d4aff"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#fff" stroke-width="24"/>
  <polygon points="256,140 300,300 256,268 212,300" fill="#ffd54d"
           stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
  <circle cx="256" cy="256" r="14" fill="#fff"/>
</svg>
```
