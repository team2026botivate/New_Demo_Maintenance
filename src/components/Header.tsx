import React, { useState, useRef, useEffect } from "react";
import { Bell, User, X, AlertTriangle } from "lucide-react";
import useAuthStore from "../store/authStore";
import useAlertStore, { getSeverityColor } from "../store/alertStore";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { alerts, getUnreadCount, markAsRead, markAllAsRead, dismissAlert } = useAlertStore();
  const [showAlerts, setShowAlerts] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount();
  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 shadow-lg">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          {children}
          <h1 className="text-lg font-bold text-gray-800">
            Maintenance<span className="text-sky-500">Pro</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Alert Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="alert-bell-btn"
              onClick={() => {
                setShowAlerts(!showAlerts);
                if (!showAlerts && unreadCount > 0) markAllAsRead();
              }}
              className="relative p-1.5 text-gray-500 hover:text-sky-600 transition-colors"
              title={`${unreadCount} unread alerts`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 top-10 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-sky-50 border-b">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-sky-600" />
                    <span className="text-sm font-semibold text-gray-800">Alerts</span>
                    {alerts.length > 0 && (
                      <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">
                        {alerts.length}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setShowAlerts(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {recentAlerts.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      <Bell size={24} className="mx-auto mb-2 opacity-40" />
                      No alerts at this time
                    </div>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors ${!alert.isRead ? "bg-sky-50/50" : ""}`}
                      >
                        <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{alert.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.machineName}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(alert.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                          className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {alerts.length > 6 && (
                  <div className="px-4 py-2 bg-gray-50 border-t text-center text-xs text-sky-600 font-medium">
                    + {alerts.length - 6} more alerts
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="flex justify-center items-center w-9 h-9 bg-sky-100 rounded-full">
              <User size={20} className="text-sky-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-medium">{user?.id || "Guest"}</p>
              <p className="text-xs text-gray-500">
                {user?.role === "admin" ? "Administrator" : "Maintenance Team"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;