// Pomiar stosu: pliki strony w pamięci iPada, żeby działała bez zasięgu.
// Własny zakres (folder stos/), niezależny od mapy terenowej. Skany nie przechodzą przez ten plik.
const CACHE = 'pomiar-stosu-v4';
const PLIKI = ['./', 'index.html', 'manifest.webmanifest', '../ikona-192.png', '../ikona-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PLIKI.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('pomiar-stosu-') && n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const z = await c.match(e.request, {ignoreSearch:true});
    const siec = fetch(e.request, {cache:'no-cache'}).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => z);
    return z || siec;
  }));
});
