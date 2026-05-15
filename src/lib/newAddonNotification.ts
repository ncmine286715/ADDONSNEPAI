import { useCallback, useEffect, useState } from "react";

const LAST_VISIT_KEY = "man.lastVisit.v1";
const NOTIFICATION_SHOWN_KEY = "man.notificationShown.v1";

export function useNewAddonNotification() {
  const [lastVisit, setLastVisit] = useState<Date | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LAST_VISIT_KEY);
    const shownRaw = localStorage.getItem(NOTIFICATION_SHOWN_KEY);
    const last = raw ? new Date(raw) : null;
    setLastVisit(last);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (last && shownRaw !== today.toISOString().split("T")[0]) {
      setShowNotification(true);
    }
  }, []);

  const updateLastVisit = useCallback(() => {
    const today = new Date().toISOString();
    localStorage.setItem(LAST_VISIT_KEY, today);
    const todayKey = new Date().toISOString().split("T")[0];
    localStorage.setItem(NOTIFICATION_SHOWN_KEY, todayKey);
    setLastVisit(new Date(today));
    setShowNotification(false);
  }, []);

  const checkNewAddons = useCallback((getNewestDate: () => string | null) => {
    if (!lastVisit) return false;
    const newest = getNewestDate();
    if (!newest) return false;
    return new Date(newest) > lastVisit;
  }, [lastVisit]);

  return { lastVisit, updateLastVisit, checkNewAddons, showNotification };
}