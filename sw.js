importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// ⚠️ 這裡非常重要：請務必把引號裡面的字，換成你 index.html 裡的真實金鑰！
const firebaseConfig = {
  apiKey: "AIzaSyDrp-qmXMRawTeMagEj41PIJjDMbxZL1zc",
  projectId: "kidney-sd",
  messagingSenderId: "105384986235",
  appId: "1:105384986235:web:99e564f82b61da668e04de"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 當系統收到試算表發來的通知時
messaging.onBackgroundMessage(function(payload) {
  const messageBody = payload.notification.body;
  const messageTitle = payload.notification.title;
  
  // 把回覆內容「黏」在網址後面
  const urlWithNote = 'index.html?reply=' + encodeURIComponent(messageBody);

  // 顯示通知（包含你選的愛心圖示與震動）
  return self.registration.showNotification(messageTitle, {
    body: messageBody,
    icon: 'https://img.icons8.com/color/96/medical-heart.png', // 你的醫療圖示
    vibrate: [200, 100, 200], // 你的震動設定
    data: { url: urlWithNote } // 記住這個黏了便利貼的網址
  });
});

// 當病人點擊通知時，打開上面記住的網址
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
