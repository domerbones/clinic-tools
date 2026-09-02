const CACHE = "rolf-tools-b585c2a52ec6";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "Op_Report_Generator_Coded.html",
  "Plan_Sheet.html",
  "Billing_Coder.html",
  "Op_Report_Generator.html",
  "Surgery_Booking_Form.html"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// HTML: network-first so updates appear as soon as they're uploaded (cache is the
// offline fallback). Everything else: cache-first for speed.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const isHTML = e.request.mode === "navigate" || e.request.url.split("?")[0].endsWith(".html");
  if (isHTML) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return resp;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match("index.html")))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return resp;
      }))
    );
  }
});
