self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: '醫護回覆', body: '您有一則新的醫護回覆訊息。' };
  const options = {
    body: data.body,
    icon: 'https://img.icons8.com/color/96/medical-heart.png', // 可換成你自己的圖示
    vibrate: [200, 100, 200],
    data: { url: 'index.html' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
