import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  BarChart3,
  LogOut,
  X,
  CheckCircle,
  Settings as SettingsIcon,
  FileText,
  Users,
  CalendarDays,
} from "lucide-react";
import useAuthStore from "../store/authStore";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header with Logo */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden flex-shrink-0 relative group cursor-pointer transition-transform hover:scale-105">
            <img src="/botivate-logo.jpg" alt="Botivate" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-gray-900 font-bold text-base leading-none tracking-tight">
              Botivate
            </h1>
            <span className="text-[10px] text-sky-600 font-medium uppercase tracking-wide">
              Powering Business
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={() => onClose?.()}
            className="p-2 text-gray-500 rounded-md lg:hidden hover:text-sky-600 focus:outline-none flex-shrink-0"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="overflow-y-auto flex-1 px-4 py-4 space-y-1">
        {/* Dashboard - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={onClose}
          >
            <LayoutDashboard size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>
        )}

        {/* Machines - Admin and User */}
        <NavLink
          to="/machines"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`
          }
          onClick={() => onClose?.()}
        >
          <Wrench size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Machines</span>
        </NavLink>

        {/* Assign Task - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/assign-task"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={() => onClose?.()}
          >
            <ClipboardList size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Assign Task</span>
          </NavLink>
        )}

        {/* Tasks - Admin and User */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`
          }
          onClick={onClose}
        >
          <ClipboardList size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Tasks</span>
        </NavLink>

        {/* Admin Approval - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin-approval"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={() => onClose?.()}
          >
            <CheckCircle size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Admin Approval</span>
          </NavLink>
        )}

        {/* Daily Report - Admin and User */}
        <NavLink
          to="/daily-report"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`
          }
          onClick={onClose}
        >
          <FileText size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Daily Report</span>
        </NavLink>

        {/* Calendar - Admin and User */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`
          }
          onClick={onClose}
        >
          <CalendarDays size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Calendar</span>
        </NavLink>

        {/* Reports - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={onClose}
          >
            <BarChart3 size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Reports</span>
          </NavLink>
        )}

        {/* Team Report - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/team-report"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={onClose}
          >
            <Users size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Team Report</span>
          </NavLink>
        )}

        {/* Settings - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`
            }
            onClick={() => onClose?.()}
          >
            <SettingsIcon size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Settings</span>
          </NavLink>
        )}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
          className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;