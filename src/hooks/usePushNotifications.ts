import { useState, useEffect, useCallback } from "react";

const SW_PATH = "/sw.js";

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = "serviceWorker" in navigator && "Notification" in window;
    setSupported(ok);
    if (ok) setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      try {
        const reg = await navigator.serviceWorker.register(SW_PATH);
        await navigator.serviceWorker.ready;
        setSubscribed(true);
        // Notificação de boas-vindas
        reg.showNotification("🔔 Mine Addons News", {
          body: "Você receberá alertas de novos add-ons!",
          icon: "/icon-192.png",
          badge: "/icon-96.png",
          tag: "welcome",
        });
      } catch (e) {
        console.error("SW error:", e);
      }
    }
  }, [supported]);

  const sendLocalNotification = useCallback(async (title: string, body: string) => {
    if (!supported || permission !== "granted") return;
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-96.png",
      tag: `addon-${Date.now()}`,
    });
  }, [supported, permission]);

  return { supported, permission, subscribed, requestPermission, sendLocalNotification };
}
