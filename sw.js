// BANJO! のオフライン対応。
// サイトのファイルは「まずネットから最新を取り、つながらない時だけ保存版を使う」ので、更新はすぐ反映されます。
const CACHE = 'banjo-v2';
const SHELL = ['./', './index.html', './firebase-config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase の通信(ログイン・データベース)には手を出さない
  if (/googleapis\.com|firebaseio\.com|identitytoolkit|securetoken/.test(url.hostname)) return;

  if (url.origin === location.origin) {
    // 自分のサイトのファイル:ネット優先、だめなら保存版
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }
        // 404 などのときは、前に保存した正常な版があればそちらを出す
        return caches.match(req).then(r => r || res);
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  } else if (url.hostname === 'www.gstatic.com' || url.hostname === 'fonts.gstatic.com') {
    // Firebase の読み込み用ファイルとフォント:保存版優先(バージョン固定なので変わらない)
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
