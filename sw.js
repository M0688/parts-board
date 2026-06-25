// Service worker for Parts Board PWA
const CACHE='parts-board-v1';

self.addEventListener('install', e=>{
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});

// Allow the page to trigger a notification through the service worker,
// so it shows at the OS level (notification shade) even when the PWA
// is backgrounded but still running.
self.addEventListener('message', e=>{
  const d=e.data||{};
  if(d.type==='notify'){
    self.registration.showNotification(d.title||'New parts', {
      body: d.body||'',
      tag: d.tag||'parts',
      renotify: true,
      requireInteraction: true,
      vibrate: [200,100,200],
      icon: d.icon||undefined,
      badge: d.icon||undefined
    });
  }
});

// Tapping the notification focuses/opens the app.
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list=>{
      for(const c of list){ if('focus' in c) return c.focus(); }
      if(self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
