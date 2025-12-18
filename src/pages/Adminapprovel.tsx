import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  ThumbsUp,
  XCircle,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// --- DUMMY DATA ---
const mockTasks = [
  {
    id: 1001,
    department: "Manufacturing",
    description: "Replace worn bearing on Hydraulic Press HP-102.",
    taskStatus: "Pending",
    image: "/path/to/img1001.jpg",
    remarks: "Bearing noise high, replacement urgent.",
    soundOfMachine: "Loud grinding/squeal (120dB)",
    temperature: "85°C (High)",
    maintenanceCost: 450,
    machineName: "HP-102",
  },
  {
    id: 1002,
    department: "Packaging",
    description: "Conveyor Belt CB-201 alignment and tension check.",
    taskStatus: "Approved",
    image: "/path/to/img1002.jpg",
    remarks: "Minor misalignment fixed, approved by Admin.",
    soundOfMachine: "Normal operation (70dB)",
    temperature: "45°C (Normal)",
    maintenanceCost: 120,
    machineName: "CB-201",
  },
  {
    id: 1003,
    department: "Production",
    description: "Industrial Oven IO-103 thermostat calibration.",
    taskStatus: "Pending",
    image: "/path/to/img1003.jpg",
    remarks: "Temperature drift detected, calibration needed.",
    soundOfMachine: "Standard fan noise (65dB)",
    temperature: "205°C (Target)",
    maintenanceCost: 280,
    machineName: "IO-103",
  },
  {
    id: 1004,
    department: "Manufacturing",
    description: "CNC Machine CNC-305 software update and diagnostics.",
    taskStatus: "Rejected",
    image: "/path/to/img1004.jpg",
    remarks: "Update rejected, conflicting with current production software. Re-evaluate.",
    soundOfMachine: "Standard operation (80dB)",
    temperature: "55°C (Normal)",
    maintenanceCost: 0,
    machineName: "CNC-305",
  },
  {
    id: 1005,
    department: "Manufacturing",
    description: "Check fluid levels on Injection Molder IM-405.",
    taskStatus: "Approved",
    image: "/path/to/img1005.jpg",
    remarks: "Levels checked and topped up. Approved.",
    soundOfMachine: "Low humming (75dB)",
    temperature: "60°C (Normal)",
    maintenanceCost: 50,
    machineName: "IM-405",
  },
];

const AdminApproval = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === "Pending") {
        return task.taskStatus === "Pending";
      }
      return task.taskStatus === "Approved" || task.taskStatus === "Rejected";
    })
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const handleSelectTask = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((task) => task.id));
    }
  };

  const handleApproveSelected = () => {
    if (selectedTaskIds.length === 0) {
      alert("Please select at least one task to approve.");
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTaskIds.includes(task.id) && task.taskStatus === "Pending"
          ? { ...task, taskStatus: "Approved" }
          : task
      )
    );
    setSelectedTaskIds([]);
  };

  const handleRejectSelected = () => {
    if (selectedTaskIds.length === 0) {
      alert("Please select at least one task to reject.");
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTaskIds.includes(task.id) && task.taskStatus === "Pending"
          ? { ...task, taskStatus: "Rejected" }
          : task
      )
    );
    setSelectedTaskIds([]);
  };

  const handleApproveTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, taskStatus: "Approved" } : task
      )
    );
  };

  const handleRejectTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, taskStatus: "Rejected" } : task
      )
    );
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ArrowUp size={14} className="ml-1" />
      ) : (
        <ArrowDown size={14} className="ml-1" />
      );
    }
    return null;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Admin Approval & Cross Verification
        </h1>

        {/* Tab Navigation and Actions */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("Pending")}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 text-xs md:text-xs font-medium rounded-t-lg transition-all duration-150 ${
                  activeTab === "Pending"
                    ? "border-b-2 border-sky-600 text-sky-600 bg-sky-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="hidden sm:inline">Pending Approvals </span>
                <span className="sm:hidden">Pending </span>
                ({tasks.filter((t) => t.taskStatus === "Pending").length})
              </button>
              <button
                onClick={() => setActiveTab("History")}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 text-xs md:text-xs font-medium rounded-t-lg transition-all duration-150 ${
                  activeTab === "History"
                    ? "border-b-2 border-sky-600 text-sky-600 bg-sky-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="hidden sm:inline">History </span>
                <span className="sm:hidden">History </span>
                ({tasks.filter((t) => t.taskStatus !== "Pending").length})
              </button>
            </div>

            <div className="flex items-center gap-2 p-2">
              {activeTab === "Pending" && selectedTaskIds.length > 0 && (
                <>
                  <button
                    onClick={handleApproveSelected}
                    className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  >
                    <ThumbsUp size={14} className="mr-1.5" />
                    Approve ({selectedTaskIds.length})
                  </button>
                  <button
                    onClick={handleRejectSelected}
                    className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-lg shadow-lg text-white bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                  >
                    <XCircle size={14} className="mr-1.5" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          {activeTab === "Pending" && filteredTasks.length > 0 && (
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
              <input
                type="checkbox"
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                checked={selectedTaskIds.length === filteredTasks.length}
                onChange={handleSelectAll}
              />
              <label className="ml-3 text-xs text-gray-700 font-medium">
                Select All Tasks
              </label>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === "Pending" && (
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                        checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
                        onChange={handleSelectAll}
                        disabled={filteredTasks.length === 0}
                      />
                    </th>
                  )}
                  {[
                    { label: "Task No", key: "id" },
                    { label: "Department", key: "department" },
                    { label: "Description", key: "description" },
                    { label: "Status", key: "taskstatus" },
                    { label: "Machine", key: "machinename" },
                    { label: "Temperature", key: "temperature" },
                    { label: "Cost", key: "maintenancecost" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(header.key)}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {getSortIcon(header.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedTaskIds.includes(task.id) && activeTab === "Pending"
                        ? "bg-sky-50"
                        : ""
                    }`}
                  >
                    {activeTab === "Pending" && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                          checked={selectedTaskIds.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 text-xs font-medium text-gray-900 whitespace-nowrap">
                      #{task.id}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {task.department}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-900 max-w-xs">
                      <div className="truncate" title={task.description}>
                        {task.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(task.taskStatus)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {task.machineName}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {task.temperature}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-700 whitespace-nowrap">
                      ${task.maintenanceCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
                selectedTaskIds.includes(task.id) && activeTab === "Pending"
                  ? "ring-2 ring-sky-500"
                  : ""
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Header with checkbox and status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {activeTab === "Pending" && (
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                        checked={selectedTaskIds.includes(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                      />
                    )}
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Task #{task.id}</div>
                      <div className="text-xs font-semibold text-gray-900 mt-0.5">
                        {task.machineName}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(task.taskStatus)}
                </div>

                {/* Department */}
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 font-medium w-24">Department:</span>
                  <span className="text-gray-900">{task.department}</span>
                </div>

                {/* Description */}
                <div className="text-xs">
                  <span className="text-gray-500 font-medium">Description:</span>
                  <p className="text-gray-900 mt-1">{task.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Temperature</div>
                    <div className="text-xs text-gray-900 font-semibold mt-0.5">
                      {task.temperature}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Sound Level</div>
                    <div className="text-xs text-gray-900 font-semibold mt-0.5">
                      {task.soundOfMachine}
                    </div>
                  </div>
                </div>

                {/* Cost and Remarks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Maintenance Cost:</span>
                    <span className="text-base font-bold text-gray-900">
                      ${task.maintenanceCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Remarks:</span> {task.remarks}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApproveTask(task.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors"
                  >
                    <CheckCircle size={16} className="mr-1.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectTask(task.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
                  >
                    <XCircle size={16} className="mr-1.5" />
                    Reject
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 active:bg-sky-200 transition-colors">
                    <Eye size={16} className="mr-1.5" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-base">
              No tasks found in the {activeTab} section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproval;