import React, { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  Users,
  TrendingUp,
  Activity,
  Filter,
  User,
} from "lucide-react";
import useAuthStore from "../store/authStore";

// Define types based on your project structure
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  machineId?: string;
  assignedTo?: string;
  createdAt: string;
}

interface Machine {
  id: string;
  name: string;
  status: "operational" | "maintenance" | "down";
}

const DailyReport = () => {
  const { user } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Dummy users list
  const users = [
    { id: "all", name: "All Users" },
    { id: "raj", name: "Rajesh Kumar" },
    { id: "priya", name: "Priya Sharma" },
    { id: "amit", name: "Amit Patel" },
    { id: "sneha", name: "Sneha Singh" },
    { id: "vikram", name: "Vikram Reddy" },
    { id: "anjali", name: "Anjali Deshmukh" },
    { id: "arjun", name: "Arjun Verma" },
    { id: "kavita", name: "Kavita Joshi" },
  ];

  // Dummy data - Replace with your actual data fetching logic
  const allTasks: Task[] = (() => {
    const todayDate = new Date().toISOString();
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString();
    
    return [
      {
        id: "1",
        title: "Routine Maintenance - CNC Machine A",
        description: "Perform daily inspection and lubrication of moving parts",
        status: "completed",
        machineId: "machine-1",
        assignedTo: "Rajesh Kumar",
        createdAt: todayDate,
      },
      {
        id: "2",
        title: "Replace Hydraulic Filter",
        description: "Change hydraulic filter on Press Machine B due to pressure drop",
        status: "in-progress",
        machineId: "machine-2",
        assignedTo: "Priya Sharma",
        createdAt: todayDate,
      },
      {
        id: "3",
        title: "Calibrate Temperature Sensors",
        description: "Verify and calibrate all temperature sensors on Furnace C",
        status: "pending",
        machineId: "machine-3",
        assignedTo: "Amit Patel",
        createdAt: todayDate,
      },
      {
        id: "4",
        title: "Inspect Safety Guards",
        description: "Check all safety guards and emergency stop buttons",
        status: "completed",
        machineId: "machine-4",
        assignedTo: "Sneha Singh",
        createdAt: todayDate,
      },
      {
        id: "5",
        title: "Clean Cooling System",
        description: "Flush and clean cooling system, check coolant levels",
        status: "in-progress",
        machineId: "machine-5",
        assignedTo: "Vikram Reddy",
        createdAt: todayDate,
      },
      {
        id: "6",
        title: "Belt Tension Adjustment",
        description: "Adjust belt tension on conveyor system",
        status: "pending",
        machineId: "machine-6",
        assignedTo: "Anjali Deshmukh",
        createdAt: todayDate,
      },
      {
        id: "7",
        title: "Electrical Panel Inspection",
        description: "Inspect electrical connections and check for loose wires",
        status: "completed",
        machineId: "machine-7",
        assignedTo: "Arjun Verma",
        createdAt: todayDate,
      },
      {
        id: "8",
        title: "Bearing Replacement",
        description: "Replace worn bearings on Motor Assembly D",
        status: "pending",
        machineId: "machine-8",
        assignedTo: "Kavita Joshi",
        createdAt: todayDate,
      },
      {
        id: "9",
        title: "Lubricate Bearings",
        description: "Apply grease to all bearing points on production line",
        status: "completed",
        machineId: "machine-1",
        assignedTo: "Rajesh Kumar",
        createdAt: todayDate,
      },
      {
        id: "10",
        title: "Test Emergency Systems",
        description: "Test all emergency stop buttons and alarms",
        status: "in-progress",
        machineId: "machine-9",
        assignedTo: "Priya Sharma",
        createdAt: todayDate,
      },
      // Some tasks from yesterday (won't show in today's report)
      {
        id: "11",
        title: "Yesterday's Task",
        description: "This task was from yesterday",
        status: "completed",
        machineId: "machine-1",
        assignedTo: "Rajesh Kumar",
        createdAt: yesterdayDate,
      },
    ];
  })();

  const machines: Machine[] = [
    { id: "machine-1", name: "CNC Machine A", status: "operational" },
    { id: "machine-2", name: "Press Machine B", status: "operational" },
    { id: "machine-3", name: "Furnace C", status: "operational" },
    { id: "machine-4", name: "Assembly Line 1", status: "operational" },
    { id: "machine-5", name: "Cooling Tower", status: "maintenance" },
    { id: "machine-6", name: "Conveyor System", status: "operational" },
    { id: "machine-7", name: "Power Distribution", status: "operational" },
    { id: "machine-8", name: "Motor Assembly D", status: "maintenance" },
    { id: "machine-9", name: "Compressor Unit", status: "down" },
    { id: "machine-10", name: "Packaging Machine", status: "operational" },
    { id: "machine-11", name: "Welding Robot", status: "operational" },
    { id: "machine-12", name: "Quality Control Station", status: "operational" },
  ];

  // Filter today's tasks
  const todaysTasks = allTasks.filter((task) => {
    const taskDate = new Date(task.createdAt).toDateString();
    const currentDate = new Date().toDateString();
    return taskDate === currentDate;
  });

  // Filter by selected user
  const filteredTasks = todaysTasks.filter((task) => {
    // If admin and "all" is selected, show all tasks
    if (user?.role === "admin" && selectedUser === "all") {
      return true;
    }
    // If admin and specific user is selected, show that user's tasks
    if (user?.role === "admin" && selectedUser !== "all") {
      return task.assignedTo === users.find(u => u.id === selectedUser)?.name;
    }
    // If regular user, show only their tasks
    return task.assignedTo === user?.username;
  });

  // Calculate statistics based on filtered tasks
  const completedTasks = filteredTasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress").length;
  const pendingTasks = filteredTasks.filter((task) => task.status === "pending").length;
  const totalTasks = filteredTasks.length;

  // Machine statistics (always show all machines for admin, filtered for users)
  const userMachineIds = filteredTasks.map(t => t.machineId);
  const relevantMachines = user?.role === "admin" && selectedUser === "all" 
    ? machines 
    : machines.filter(m => userMachineIds.includes(m.id));

  const activeMachines = relevantMachines.filter((m) => m.status === "operational").length;
  const maintenanceMachines = relevantMachines.filter((m) => m.status === "maintenance").length;
  const downMachines = relevantMachines.filter((m) => m.status === "down").length;

  const stats = [
    {
      title: "Total Tasks Today",
      value: totalTasks,
      icon: Activity,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: AlertCircle,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const machineStats = [
    {
      title: "Operational",
      value: activeMachines,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Maintenance",
      value: maintenanceMachines,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Down",
      value: downMachines,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Report</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <p className="text-base">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-lg">
              <Users className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-medium text-sky-900">
                {user?.role === "admin" ? "Admin View" : "User View"}
              </span>
            </div>
          </div>
        </div>

        {/* User Filter - Only show for admin */}
        {user?.role === "admin" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <span className="text-xs font-semibold">Filter by User:</span>
              </div>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {selectedUser !== "all" && (
                <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">
                  Viewing: {users.find(u => u.id === selectedUser)?.name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Machine Status Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-gray-900">
            Machine Status Overview
            {user?.role === "admin" && selectedUser !== "all" && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                (Machines assigned to {users.find(u => u.id === selectedUser)?.name})
              </span>
            )}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {machineStats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border-2 border-transparent hover:border-gray-300 transition-all`}
            >
              <p className="text-xs font-medium text-gray-700">{stat.title}</p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-600">
          Total Machines: <span className="font-semibold">{relevantMachines.length}</span>
        </div>
      </div>

      {/* Today's Tasks List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Today's Tasks
            {user?.role === "admin" && selectedUser !== "all" && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                for {users.find(u => u.id === selectedUser)?.name}
              </span>
            )}
          </h2>
        </div>
        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-base">
                {user?.role === "admin" && selectedUser !== "all"
                  ? `No tasks assigned to ${users.find(u => u.id === selectedUser)?.name} today`
                  : "No tasks assigned for today"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        Machine: {machines.find((m) => m.id === task.machineId)?.name || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignedTo}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-lg p-6 border border-sky-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-gray-900">Performance Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Task Completion Rate</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-sky-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-bold text-sky-600">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600">Machine Availability</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${relevantMachines.length > 0 ? (activeMachines / relevantMachines.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-bold text-green-600">
                {relevantMachines.length > 0 ? Math.round((activeMachines / relevantMachines.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;