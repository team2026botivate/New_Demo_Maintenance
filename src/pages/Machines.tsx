import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Wrench,
  FileText,
  Package,
} from "lucide-react";

// Mock data for machines
const mockMachines = [
  {
    id: 1,
    name: "Hydraulic Press HP-102",
    department: "Manufacturing",
    status: "operational",
    lastMaintenance: "2023-12-15",
    nextMaintenance: "2024-03-15",
    purchaseDate: "2020-06-10",
    purchasePrice: 85000,
    totalRepairCost: 12450,
    repairCount: 8,
    healthScore: 92,
    image: "https://images.unsplash.com/photo-1565071559227-20ab25b7685e?w=400&h=300&fit=crop",
    taskAssigned: true,
    assignedUser: "John Smith",
    maintenanceParts: ["Hydraulic Seals", "Pressure Valves", "Oil Filters"],
  },
  {
    id: 2,
    name: "CNC Machine CNC-305",
    department: "Manufacturing",
    status: "maintenance",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-04-20",
    purchaseDate: "2019-03-22",
    purchasePrice: 120000,
    totalRepairCost: 18700,
    repairCount: 12,
    healthScore: 78,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    taskAssigned: true,
    assignedUser: "Sarah Johnson",
    maintenanceParts: ["Spindle Bearings", "Coolant Pump", "Drive Belt", "Linear Guides", "Control Board"],
  },
  {
    id: 3,
    name: "Conveyor Belt CB-201",
    department: "Packaging",
    status: "repair",
    lastMaintenance: "2023-11-05",
    nextMaintenance: "2024-02-05",
    purchaseDate: "2021-01-15",
    purchasePrice: 45000,
    totalRepairCost: 5200,
    repairCount: 4,
    healthScore: 65,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop",
    taskAssigned: false,
    assignedUser: null,
    maintenanceParts: ["Belt Tensioner", "Motor Brushes"],
  },
  {
    id: 4,
    name: "Injection Molder IM-405",
    department: "Manufacturing",
    status: "operational",
    lastMaintenance: "2024-02-10",
    nextMaintenance: "2024-05-10",
    purchaseDate: "2022-08-30",
    purchasePrice: 95000,
    totalRepairCost: 3450,
    repairCount: 2,
    healthScore: 95,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    taskAssigned: true,
    assignedUser: "Mike Davis",
    maintenanceParts: ["Heating Elements", "Injection Nozzle", "Hydraulic Cylinder", "Temperature Sensors"],
  },
  {
    id: 5,
    name: "Industrial Oven IO-103",
    department: "Production",
    status: "operational",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-04-05",
    purchaseDate: "2020-11-12",
    purchasePrice: 72000,
    totalRepairCost: 8900,
    repairCount: 6,
    healthScore: 85,
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop",
    taskAssigned: false,
    assignedUser: null,
    maintenanceParts: ["Heating Coils", "Thermostat", "Fan Motor", "Insulation Panels", "Door Seals"],
  },
];

const Machines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredMachines = mockMachines
    .filter((machine) => {
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        machine.name.toLowerCase().includes(searchLower) ||
        machine.id.toString().includes(searchLower) ||
        machine.department.toLowerCase().includes(searchLower) ||
        machine.status.toLowerCase().includes(searchLower) ||
        machine.assignedUser?.toLowerCase().includes(searchLower) ||
        machine.maintenanceParts.some(part => part.toLowerCase().includes(searchLower)) ||
        new Date(machine.nextMaintenance).toLocaleDateString().includes(searchLower) ||
        new Date(machine.lastMaintenance).toLocaleDateString().includes(searchLower) ||
        machine.repairCount.toString().includes(searchLower) ||
        machine.healthScore.toString().includes(searchLower);
      
      const matchesDepartment =
        selectedDepartment === "all" ||
        machine.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === "all" || machine.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "operational":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Operational
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Wrench size={12} className="mr-1" />
            Maintenance
          </span>
        );
      case "repair":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <AlertTriangle size={12} className="mr-1" />
            Repair
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={12} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  const getHealthIndicator = (score) => {
    let color = "";
    if (score >= 90) color = "bg-green-500";
    else if (score >= 70) color = "bg-blue-500";
    else if (score >= 50) color = "bg-amber-500";
    else color = "bg-red-500";

    return (
      <div className="flex items-center">
        <div className={`mr-2 w-2 h-2 rounded-full ${color}`}></div>
        <span>{score}%</span>
      </div>
    );
  };

  const getTaskAssignmentBadge = (assigned) => {
    if (assigned) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Assigned
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unassigned
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Machines</h1>
        <Link
          to="/machines/new"
          className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-sky-600 rounded-md border border-transparent shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 w-full sm:w-auto justify-center"
        >
          <Plus size={16} className="mr-2" />
          Add Machine
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col p-4 space-y-4 bg-white rounded-lg shadow-lg">
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search machines, parts..."
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center space-x-2 flex-1">
            <Filter size={16} className="text-gray-500 flex-shrink-0" />
            <select
              className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Packaging">Packaging</option>
              <option value="Production">Production</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 flex-1">
            <select
              className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
            </select>
          </div>
        </div>
      </div>

      {/* Machine List Table for Desktop */}
      <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Actions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Machine Name
                    {sortColumn === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center">
                    Department
                    {sortColumn === "department" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  <div className="flex items-center">
                    <Package size={14} className="mr-1" />
                    Part Names
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortColumn === "status" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Task Assignment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("nextMaintenance")}
                >
                  <div className="flex items-center">
                    Next Maintenance
                    {sortColumn === "nextMaintenance" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("repairCount")}
                >
                  <div className="flex items-center">
                    Repair Count
                    {sortColumn === "repairCount" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("healthScore")}
                >
                  <div className="flex items-center">
                    Health
                    {sortColumn === "healthScore" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-xs font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/machines/${machine.id}`}
                        className="p-1 text-sky-600 rounded hover:text-sky-900 hover:bg-sky-50"
                      >
                        <FileText size={18} />
                      </Link>
                      <button className="p-1 text-amber-600 rounded hover:text-amber-900 hover:bg-amber-50">
                        <Wrench size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={machine.image}
                      alt={machine.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">
                      {machine.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {machine.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">
                      {machine.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {machine.maintenanceParts.map((part, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800"
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(machine.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTaskAssignmentBadge(machine.taskAssigned)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">
                      {new Date(machine.nextMaintenance).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last:{" "}
                      {new Date(machine.lastMaintenance).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {machine.repairCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getHealthIndicator(machine.healthScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMachines.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              No machines found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Machine Cards for Mobile */}
      <div className="block md:hidden space-y-4">
        {filteredMachines.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <p className="text-gray-500">
              No machines found matching your criteria.
            </p>
          </div>
        ) : (
          filteredMachines.map((machine) => (
            <div key={machine.id} className="p-4 bg-white rounded-lg shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <img
                    src={machine.image}
                    alt={machine.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 break-words">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {machine.id}</p>
                    <div className="mt-2">
                      {getStatusBadge(machine.status)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-2 flex-shrink-0">
                  <Link
                    to={`/machines/${machine.id}`}
                    className="p-2 text-sky-600 rounded hover:text-sky-900 hover:bg-sky-50"
                  >
                    <FileText size={18} />
                  </Link>
                  <button className="p-2 text-amber-600 rounded hover:text-amber-900 hover:bg-amber-50">
                    <Wrench size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Department:</span>
                  <span className="text-gray-900">{machine.department}</span>
                </div>
                
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-gray-500 mb-2">Part Names:</span>
                  <div className="flex flex-wrap gap-1">
                    {machine.maintenanceParts.map((part, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Task Assignment:</span>
                  <div>{getTaskAssignmentBadge(machine.taskAssigned)}</div>
                </div>
                
                {machine.taskAssigned && machine.assignedUser && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-500">Assigned To:</span>
                    <span className="text-gray-900">{machine.assignedUser}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Health:</span>
                  <div>{getHealthIndicator(machine.healthScore)}</div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Next Maintenance:</span>
                  <span className="text-gray-900">
                    {new Date(machine.nextMaintenance).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Last Maintenance:</span>
                  <span className="text-gray-900">
                    {new Date(machine.lastMaintenance).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500">Repairs:</span>
                  <span className="text-gray-900">{machine.repairCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Machines;