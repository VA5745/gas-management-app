import React, { useEffect } from 'react';
import { create } from 'zustand';

// Types
export type Notification = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
};

// Store
const useNotificationStore = create<{
  notifications: Notification[];
  add: (n: Notification) => void;
  remove: (id: string) => void;
}>((set) => ({
  notifications: [],
  add: (n) => set((s) => ({ notifications: [...s.notifications, n] })),
  remove: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));

// Toast container
const ToastContainer = () => {
  const { notifications, remove } = useNotificationStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      notifications.forEach((n) => {
        if (now - n.timestamp > 5000) remove(n.id);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [notifications, remove]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded shadow text-white ${n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-blue-500'}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

// Auto notifier
const useAutoNotifier = () => {
  const add = useNotificationStore((s) => s.add);
  useEffect(() => {
    const id = setInterval(() => {
      const reminder: Notification = {
        id: crypto.randomUUID(),
        message: 'Maintenance planifiée dans 24h.',
        type: 'warning',
        timestamp: Date.now(),
      };
      console.warn('[ALERTE]', reminder.message);
      add(reminder);
    }, 15000);
    return () => clearInterval(id);
  }, [add]);
};

const NotificationPage = () => {
  useAutoNotifier();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Notifications & Alertes</h1>
      <p>Des rappels de maintenance s’afficheront automatiquement.</p>
      <ToastContainer />
    </div>
  );
};

export default NotificationPage;
