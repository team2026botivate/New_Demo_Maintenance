import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  FileText,
  UserCircle
} from 'lucide-react';

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    machineId: 1,
    machineName: 'Hydraulic Press HP-102',
    department: 'Manufacturing',
    type: 'Quarterly Maintenance',
    status: 'pending',
    dueDate: '2024-03-15',
    assignedTo: 'user', // Changed to match user login
    assignedToName: 'John Smith',
    priority: 'medium',
    location: 'On-site',
    description: 'Perform quarterly maintenance check on hydraulic press components and fluid levels.'
  },
  {
    id: 2,
    machineId: 3,
    machineName: 'Conveyor Belt CB-201',
    department: 'Packaging',
    type: 'Repair',
    status: 'completed',
    dueDate: '2024-03-05',
    completedDate: '2024-03-05',
    assignedTo: 'admin',
    assignedToName: 'Sarah Johnson',
    priority: 'high',
    location: 'On-site',
    description: 'Replace worn-out belt segments and alignment check.',
    cost: {
      labor: 350,
      parts: 1200,
      vendor: 0,
      total: 1550
    }
  },
  {
    id: 3,
    machineId: 2,
    machineName: 'CNC Machine CNC-305',
    department: 'Manufacturing',
    type: 'Off-site Service',
    status: 'in-progress',
    dueDate: '2024-03-22',
    assignedTo: 'user', // Changed to match user login
    assignedToName: 'External Vendor',
    priority: 'high',
    location: 'Off-site',
    vendor: 'Precision Machines Inc.',
    description: 'Send control unit for recalibration and firmware update.',
    estimatedCost: 2800
  },
  {
    id: 4,
    machineId: 5,
    machineName: 'Industrial Oven IO-103',
    department: 'Production',
    type: 'Monthly Maintenance',
    status: 'pending',
    dueDate: '2024-03-20',
    assignedTo: 'admin',
    assignedToName: 'Mike Anderson',
    priority: 'low',
    location: 'On-site',
    description: 'Check temperature sensors and verify calibration.'
  },
  {
    id: 5,
    machineId: 4,
    machineName: 'Injection Molder IM-405',
    department: 'Manufacturing',
    type: 'Emergency Repair',
    status: 'overdue',
    dueDate: '2024-03-01',
    assignedTo: 'user', // Changed to match user login
    assignedToName: 'Emily Clark',
    priority: 'critical',
    location: 'On-site',
    description: 'Investigate hydraulic pressure loss and repair affected components.'
  }
];

const Tasks: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Debug: Log user object
  console.log('Current user:', user);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredTasks = mockTasks
    .filter(task => {
      // For regular user, only show tasks assigned to them
      // For admin, show all tasks
      // Check against both user.username and user.id for compatibility
      if (user?.role === 'user') {
        const userIdentifier = user.username || user.id || 'user';
        console.log('Filtering for user:', userIdentifier, 'Task assigned to:', task.assignedTo);
        if (task.assignedTo !== userIdentifier) {
          return false;
        }
      }

      const matchesSearch = task.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || task.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesLocation = selectedLocation === 'all' || task.location === selectedLocation;
      return matchesSearch && matchesDepartment && matchesStatus && matchesLocation;
    })
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Clock size={12} className="mr-1" />
            In Progress
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle size={12} className="mr-1" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Maintenance Tasks</h1>
          {user?.role === 'user' && (
            <p className="text-xs text-gray-500 mt-1">Showing tasks assigned to you</p>
          )}
        </div>
        {user?.role === 'admin' && (
          <button className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-sky-600 rounded-md border border-transparent shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            <Plus size={16} className="mr-2" />
            Create Task
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col p-4 space-y-4 bg-white rounded-lg shadow-lg md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search tasks..."
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
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Packaging">Packaging</option>
              <option value="Production">Production</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="On-site">On-site</option>
              <option value="Off-site">Off-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Table for Desktop */}
      <div className="hidden overflow-hidden bg-white rounded-lg shadow-lg md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('machineName')}
                >
                  <div className="flex items-center">
                    Machine & Task
                    {sortColumn === 'machineName' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department
                    {sortColumn === 'department' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Status/Priority
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    {sortColumn === 'dueDate' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('assignedToName')}
                >
                  <div className="flex items-center">
                    Assigned To
                    {sortColumn === 'assignedToName' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-xs font-medium text-left whitespace-nowrap">
                    <div className="flex justify-start space-x-2">
                      <Link 
                        to={`/tasks/${task.id}`} 
                        className="p-1 text-sky-600 rounded hover:text-sky-900 hover:bg-sky-50"
                      >
                        <FileText size={18} />
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-900">{task.machineName}</div>
                    <div className="mt-1 text-xs text-gray-500">{task.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{task.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                    {task.completedDate && (
                      <div className="text-xs text-green-600">
                        Completed: {new Date(task.completedDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle size={20} className="mr-2 text-gray-400" />
                      <span className="text-xs text-gray-900">{task.assignedToName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-900">{task.location}</div>
                    {task.vendor && (
                      <div className="text-xs text-gray-500">{task.vendor}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Task Cards for Mobile */}
      <div className="block space-y-4 md:hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <p className="text-gray-500">No tasks found matching your criteria.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="p-4 bg-white rounded-lg shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {task.machineName}
                  </h3>
                  <p className="text-xs text-gray-500">{task.type}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
                <Link 
                  to={`/tasks/${task.id}`} 
                  className="p-2 text-sky-600 rounded hover:text-sky-900 hover:bg-sky-50"
                >
                  <FileText size={20} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="font-medium text-gray-500">Department:</span>
                  <p className="text-gray-900">{task.department}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Due Date:</span>
                  <p className="text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Assigned To:</span>
                  <p className="text-gray-900">{task.assignedToName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{task.location}</p>
                  {task.vendor && (
                    <p className="text-xs text-gray-500">{task.vendor}</p>
                  )}
                </div>
              </div>
              {task.completedDate && (
                <div className="mt-2 text-xs text-green-600">
                  Completed: {new Date(task.completedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;