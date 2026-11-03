// Mapa terenowa: pliki strony w pamięci telefonu, żeby działała bez zasięgu.
// Najpierw z pamięci (szybko, offline), w tle pobiera nowszą wersję na następne otwarcie.
// Paczki mLasa ten plik nie dotyka: ZIP siedzi w IndexedDB strony i nigdzie nie jest wysyłany.
const CACHE = 'mapa-teren-v5';
const PLIKI = ['./', 'index.html', 'manifest.webmanifest', 'ikona-192.png', 'ikona-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const z = await c.match(e.request, {ignoreSearch:true});
    const sieć = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => z);
    return z || sieć;
  }));
});
