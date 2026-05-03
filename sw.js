// sw.js — Service Worker（修正版）
// Firebase 8.x compat 版本（與 sw.js 格式相容）
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDrp-qmXMRawTeMagEj41PIJjDMbxZL1zc",
  authDomain: "kidney-sd.firebaseapp.com",
  projectId: "kidney-sd",
  storageBucket: "kidney-sd.firebasestorage.app",
  messagingSenderId: "105384986235",
  appId: "1:105384986235:web:99e564f82b61da668e04de"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ── 背景收到推播通知 ──
messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || '醫護人員已回覆';
  const body  = (payload.notification && payload.notification.body)  || '請點擊查看回覆內容';

  // 把回覆內容黏在網址後面（便利貼功能）
  const urlWithReply = 'index.html?reply=' + encodeURIComponent(body);

  return self.registration.showNotification(title, {
    body:    body,
    icon:    'https://img.icons8.com/color/96/medical-heart.png',
    badge:   'https://img.icons8.com/color/96/medical-heart.png',
    vibrate: [200, 100, 200],
    tag:     'nurse-reply',   // 同 tag 的通知會合併，不重疊
    renotify: true,
    data:    { url: urlWithReply }
  });
});

// ── 點擊通知後開啟對應網址 ──
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || 'index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // 如果已有開啟的視窗，focus 它
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) return client.focus();
      }
      // 沒有則開新視窗
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
