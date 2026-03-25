import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Alert, AlertSeverity, AlertType } from '../models/types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'isRead' | 'autoTaskCreated' | 'createdAt'>) => Alert;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
  markTaskCreated: (id: string) => void;
  getUnreadCount: () => number;
  getUnreadAlerts: () => Alert[];
  hasAlert: (machineId: number, type: AlertType) => boolean;
}

const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],

      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          isRead: false,
          autoTaskCreated: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ alerts: [newAlert, ...state.alerts] }));
        return newAlert;
      },

      markAsRead: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          alerts: state.alerts.map((a) => ({ ...a, isRead: true })),
        }));
      },

      dismissAlert: (id) => {
        set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
      },

      clearAll: () => set({ alerts: [] }),

      markTaskCreated: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, autoTaskCreated: true } : a
          ),
        }));
      },

      getUnreadCount: () => get().alerts.filter((a) => !a.isRead).length,

      getUnreadAlerts: () =>
        get()
          .alerts.filter((a) => !a.isRead)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

      // Deduplication: prevent the same alert type for same machine within same session
      hasAlert: (machineId, type) => {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return get().alerts.some(
          (a) =>
            a.machineId === machineId &&
            a.type === type &&
            new Date(a.createdAt) >= oneDayAgo
        );
      },
    }),
    { name: 'alert-store' }
  )
);

// Severity label helper
export const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
    case 'High':     return 'text-orange-700 bg-orange-100 border-orange-200';
    case 'Medium':   return 'text-amber-700 bg-amber-100 border-amber-200';
    case 'Low':      return 'text-blue-700 bg-blue-100 border-blue-200';
    default:         return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

export default useAlertStore;
