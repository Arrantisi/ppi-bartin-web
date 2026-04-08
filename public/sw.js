// public/sw.js

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/logo-ppi.png', // Logo PPI Bartin
      badge: '/logo-ppi.png', // Ikon kecil di bar notifikasi Android
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/home', // Alamat yang dibuka saat notifikasi di-klik
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Aksi ketika notifikasi di-klik oleh user
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});