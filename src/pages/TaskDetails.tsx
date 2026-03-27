import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Wrench,
  FileText,
  User,
  Package,
  ShoppingCart,
  Building,
  Upload,
  Paperclip,
  X,
  Camera,
  Save,
} from "lucide-react";

interface ChecklistItem {
  id: number;
  taskNo: string;
  department: string;
  description: string;
  taskStatus: "pending" | "completed" | "in-progress";
  image: string | null;
  remarks: string;
  soundOfMachine: string;
  temperature: string;
  maintenanceCost: string;
}

interface DocumentItem {
  id: number;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
}

interface HistoryItemDetail {
  taskNo: string;
  department: string;
  description: string;
  taskStatus: "pending" | "completed" | "in-progress";
  remarks: string;
  soundOfMachine: string;
  temperature: string;
  maintenanceCost: string;
  image: string | null;
}

interface HistoryEntry {
  id: number;
  date: string;
  user: string;
  action: string;
  items: HistoryItemDetail[];
}

interface MockTask {
  id: number;
  machineId: number;
  machineName: string;
  department: string;
  type: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  priority: string;
  location: string;
  vendor: string;
  description: string;
  estimatedCost: number;
  detailsData: Array<{
    id: number;
    taskNo: string;
    taskDate: string;
    description: string;
    soundTest: string;
    temperature: string;
  }>;
  checklistItems: ChecklistItem[];
  documents: DocumentItem[];
}

const mockTask: MockTask = {
  id: 3,
  machineId: 2,
  machineName: "CNC Machine CNC-305",
  department: "Manufacturing",
  type: "Off-site Service",
  status: "in-progress",
  dueDate: "2024-03-22",
  assignedTo: "External Vendor",
  priority: "high",
  location: "Off-site",
  vendor: "Precision Machines Inc.",
  description: "Send control unit for recalibration and firmware update.",
  estimatedCost: 2800,
  detailsData: [
    {
      id: 1,
      taskNo: "TSK-001",
      taskDate: "2024-03-01",
      description: "Initial inspection and diagnosis",
      soundTest: "Normal",
      temperature: "45°C",
    },
    {
      id: 2,
      taskNo: "TSK-002",
      taskDate: "2024-03-05",
      description: "Disconnect power and prepare unit",
      soundTest: "N/A",
      temperature: "22°C",
    },
    {
      id: 3,
      taskNo: "TSK-003",
      taskDate: "2024-03-10",
      description: "Pack and ship to vendor",
      soundTest: "N/A",
      temperature: "N/A",
    },
  ],
  checklistItems: [
    {
      id: 1,
      taskNo: "CHK-001",
      department: "Manufacturing",
      description: "Disconnect power and tag out machine",
      taskStatus: "pending",
      image: null,
      remarks: "",
      soundOfMachine: "",
      temperature: "",
      maintenanceCost: "",
    },
    {
      id: 2,
      taskNo: "CHK-002",
      department: "Manufacturing",
      description: "Remove control unit from housing",
      taskStatus: "pending",
      image: null,
      remarks: "",
      soundOfMachine: "",
      temperature: "",
      maintenanceCost: "",
    },
    {
      id: 3,
      taskNo: "CHK-003",
      department: "Quality Control",
      description: "Pack for shipping with appropriate padding",
      taskStatus: "pending",
      image: null,
      remarks: "",
      soundOfMachine: "",
      temperature: "",
      maintenanceCost: "",
    },
    {
      id: 4,
      taskNo: "CHK-004",
      department: "Logistics",
      description: "Complete shipping documentation",
      taskStatus: "pending",
      image: null,
      remarks: "",
      soundOfMachine: "",
      temperature: "",
      maintenanceCost: "",
    },
    {
      id: 5,
      taskNo: "CHK-005",
      department: "Logistics",
      description: "Send to vendor's service center",
      taskStatus: "pending",
      image: null,
      remarks: "",
      soundOfMachine: "",
      temperature: "",
      maintenanceCost: "",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Service Request Form.pdf",
      type: "PDF",
      uploadedBy: "John Smith",
      date: "2024-03-01",
    },
    {
      id: 2,
      name: "Shipping Documentation.pdf",
      type: "PDF",
      uploadedBy: "Mike Anderson",
      date: "2024-03-12",
    },
  ],
};

const TaskDetails = () => {
  const [task] = useState(mockTask);
  const [activeTab, setActiveTab] = useState("details");
  const [checklistItems, setChecklistItems] = useState<any[]>(mockTask.checklistItems);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>(mockTask.documents);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === checklistItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(checklistItems.map((item) => item.id));
    }
  };

  const handleChecklistUpdate = (id: number, field: string, value: any) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChecklistUpdate(id, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitChecklist = () => {
    const selectedItems = checklistItems.filter((item) =>
      selectedRows.includes(item.id)
    );

    if (selectedItems.length === 0) {
      alert("Please select at least one checklist item to submit");
      return;
    }

    const newHistoryEntry = {
      id: history.length + 1,
      date: new Date().toISOString().split("T")[0],
      user: "Current User",
      action: "Checklist submitted",
      items: selectedItems.map((item) => ({
        taskNo: item.taskNo,
        department: item.department,
        description: item.description,
        taskStatus: item.taskStatus,
        remarks: item.remarks,
        soundOfMachine: item.soundOfMachine,
        temperature: item.temperature,
        maintenanceCost: item.maintenanceCost,
        image: item.image,
      })),
    };

    setHistory((prev) => [newHistoryEntry, ...prev]);
    setSelectedRows([]);
    alert("Checklist submitted successfully!");
    setActiveTab("history");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFile) {
      const newDocument = {
        id: Date.now(),
        name: uploadFile.name,
        type: uploadFile.type.includes("pdf") ? "PDF" : "File",
        uploadedBy: "Current User",
        date: new Date().toISOString().split("T")[0],
      };
      setDocuments((prev) => [...prev, newDocument]);
      alert("Document uploaded successfully");
      setShowUploadForm(false);
      setUploadFile(null);
    }
  };

  const handleDocumentDelete = (documentId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      alert("Document deleted successfully");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      overdue: "bg-red-100 text-red-800",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {status === "completed" && <CheckCircle size={16} className="mr-1" />}
        {status === "pending" && <Clock size={16} className="mr-1" />}
        {status === "in-progress" && <Clock size={16} className="mr-1" />}
        {status === "overdue" && <AlertTriangle size={16} className="mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      critical: "bg-red-100 text-red-800 border-red-300",
      high: "bg-amber-100 text-amber-800",
      medium: "bg-blue-100 text-blue-800",
      low: "bg-green-100 text-green-800",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${badges[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4 overflow-x-auto">
          <Link
            to="/tasks"
            className="flex items-center text-sky-600 hover:text-sky-900 font-bold text-sm"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Back to Tasks</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {task.type}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{task.machineName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>

        {/* Task Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">{task.machineName}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{task.department} Department</p>
              </div>
              <button
                className="px-6 py-3 text-sm font-black text-white bg-sky-600 rounded-xl hover:bg-sky-700 shadow-xl shadow-sky-100 transition-all active:scale-95 uppercase tracking-widest w-full sm:w-auto"
                onClick={() => setShowUpdateForm(true)}
              >
                Update Status
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">Assignment</h3>
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-gray-400" />
                  <span className="text-xs">{task.assignedTo}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">Location</h3>
                <div className="flex items-center">
                  <Wrench size={16} className="mr-2 text-gray-400" />
                  <span className="text-xs">{task.location}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">Due Date</h3>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">Estimated Cost</h3>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-400" />
                  <span className="text-xs">${task.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              {["details", "checklist", "history", "documents"].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-4 md:px-6 font-medium text-xs border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "details" && <FileText size={16} className="inline mr-2" />}
                  {tab === "checklist" && <CheckCircle size={16} className="inline mr-2" />}
                  {tab === "history" && <Clock size={16} className="inline mr-2" />}
                  {tab === "documents" && <Paperclip size={16} className="inline mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Sound Test</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Temperature</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {task.detailsData.map((detail) => (
                      <tr key={detail.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-medium text-gray-900">{detail.taskNo}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(detail.taskDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{detail.description}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{detail.soundTest}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{detail.temperature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Checklist Tab */}
            {activeTab === "checklist" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 text-xs text-sky-600 border border-sky-600 rounded-md hover:bg-sky-50"
                  >
                    {selectedRows.length === checklistItems.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={handleSubmitChecklist}
                    disabled={selectedRows.length === 0}
                    className="px-4 py-2 text-xs text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-gray-400 flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    Submit Checklist ({selectedRows.length})
                  </button>
                </div>

                {/* Mobile View */}
                <div className="block lg:hidden space-y-4">
                  {checklistItems.map((item) => (
                    <div key={item.id} className={`border rounded-lg p-4 ${selectedRows.includes(item.id) ? "bg-sky-50 border-sky-300" : "bg-white"}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleRowSelect(item.id)}
                          className="mt-1 h-4 w-4 text-sky-600 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.taskNo}</h4>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 ml-7">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                          <input
                            type="text"
                            value={item.department}
                            readOnly
                            className="w-full px-3 py-2 text-xs border rounded-md bg-gray-50"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Task Status</label>
                          <select
                            value={item.taskStatus}
                            onChange={(e) => handleChecklistUpdate(item.id, "taskStatus", e.target.value)}
                            className="w-full px-3 py-2 text-xs border rounded-md"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Sound Of Machine</label>
                          <select
                            value={item.soundOfMachine}
                            onChange={(e) => handleChecklistUpdate(item.id, "soundOfMachine", e.target.value)}
                            className="w-full px-3 py-2 text-xs border rounded-md"
                          >
                            <option value="">Select...</option>
                            <option value="Good">Good</option>
                            <option value="Bad">Bad</option>
                            <option value="Better">Better</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Temperature</label>
                          <input
                            type="text"
                            value={item.temperature}
                            onChange={(e) => handleChecklistUpdate(item.id, "temperature", e.target.value)}
                            placeholder="e.g., 45°C"
                            className="w-full px-3 py-2 text-xs border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Maintenance Cost</label>
                          <input
                            type="text"
                            value={item.maintenanceCost}
                            onChange={(e) => handleChecklistUpdate(item.id, "maintenanceCost", e.target.value)}
                            placeholder="e.g., ₹500"
                            className="w-full px-3 py-2 text-xs border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                          <textarea
                            value={item.remarks}
                            onChange={(e) => handleChecklistUpdate(item.id, "remarks", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-xs border rounded-md"
                            placeholder="Enter remarks..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center px-3 py-2 text-xs text-sky-600 border border-sky-600 rounded-md cursor-pointer hover:bg-sky-50">
                              <Camera size={16} className="mr-2" />
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(item.id, e)}
                                className="hidden"
                              />
                            </label>
                            {item.image && (
                              <img src={item.image} alt="Preview" className="h-12 w-12 object-cover rounded border" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === checklistItems.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-sky-600 rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sound Of Machine</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Cost</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {checklistItems.map((item) => (
                        <tr key={item.id} className={selectedRows.includes(item.id) ? "bg-sky-50" : "hover:bg-gray-50"}>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleRowSelect(item.id)}
                              className="h-4 w-4 text-sky-600 rounded"
                            />
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{item.taskNo}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{item.department}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{item.description}</td>
                          <td className="px-4 py-3 text-xs">
                            <select
                              value={item.taskStatus}
                              onChange={(e) => handleChecklistUpdate(item.id, "taskStatus", e.target.value)}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Camera size={16} className="text-sky-600" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(item.id, e)}
                                className="hidden"
                              />
                              {item.image && <img src={item.image} alt="Preview" className="h-8 w-8 object-cover rounded" />}
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <textarea
                              value={item.remarks}
                              onChange={(e) => handleChecklistUpdate(item.id, "remarks", e.target.value)}
                              rows={1}
                              className="px-2 py-1 text-xs border rounded w-32"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.soundOfMachine}
                              onChange={(e) => handleChecklistUpdate(item.id, "soundOfMachine", e.target.value)}
                              className="px-2 py-1 text-xs border rounded"
                            >
                              <option value="">Select...</option>
                              <option value="Good">Good</option>
                              <option value="Bad">Bad</option>
                              <option value="Better">Better</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.temperature}
                              onChange={(e) => handleChecklistUpdate(item.id, "temperature", e.target.value)}
                              className="px-2 py-1 text-xs border rounded w-24"
                              placeholder="e.g., 45°C"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.maintenanceCost}
                              onChange={(e) => handleChecklistUpdate(item.id, "maintenanceCost", e.target.value)}
                              className="px-2 py-1 text-xs border rounded w-24"
                              placeholder="₹0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No checklist submissions yet. Submit a checklist to see history.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {history.map((entry: HistoryEntry) => (
                      <div key={entry.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{entry.action}</h3>
                            <p className="text-xs text-gray-500">By {entry.user}</p>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-4">
                          {entry.items.map((item: HistoryItemDetail, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="font-medium text-gray-700">Task No:</span>
                                  <p className="text-gray-900">{item.taskNo}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Department:</span>
                                  <p className="text-gray-900">{item.department}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Status:</span>
                                  <p className="text-gray-900">{item.taskStatus}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Sound:</span>
                                  <p className="text-gray-900">{item.soundOfMachine || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Temperature:</span>
                                  <p className="text-gray-900">{item.temperature || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Cost:</span>
                                  <p className="text-gray-900">{item.maintenanceCost || "N/A"}</p>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-3">
                                  <span className="font-medium text-gray-700">Description:</span>
                                  <p className="text-gray-900">{item.description}</p>
                                </div>
                                {item.remarks && (
                                  <div className="sm:col-span-2 lg:col-span-3">
                                    <span className="font-medium text-gray-700">Remarks:</span>
                                    <p className="text-gray-900">{item.remarks}</p>
                                  </div>
                                )}
                                {item.image && (
                                  <div className="sm:col-span-2 lg:col-span-3">
                                    <span className="font-medium text-gray-700">Image:</span>
                                    <img src={item.image} alt="Task" className="mt-2 h-32 w-32 object-cover rounded border" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-base font-medium">Documents</h3>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="px-4 py-2 text-xs text-white bg-sky-600 rounded-md hover:bg-sky-700 flex items-center w-full sm:w-auto justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Document
                  </button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-xs font-medium text-sky-600">{doc.name}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{doc.type}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{doc.uploadedBy}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{new Date(doc.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-xs text-right">
                            <button className="text-sky-600 hover:text-sky-900 mr-3">Download</button>
                            <button
                              onClick={() => handleDocumentDelete(doc.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No documents uploaded yet.</div>
                  ) : (
                    documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 bg-white">
                        <h4 className="font-medium text-sky-600 mb-2">{doc.name}</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-gray-900">{doc.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Uploaded By:</span>
                            <span className="text-gray-900">{doc.uploadedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date:</span>
                            <span className="text-gray-900">{new Date(doc.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 px-3 py-2 text-xs text-sky-600 border border-sky-600 rounded hover:bg-sky-50">
                            Download
                          </button>
                          <button
                            onClick={() => handleDocumentDelete(doc.id)}
                            className="flex-1 px-3 py-2 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-base font-medium">Update Task Status</h3>
              <button onClick={() => setShowUpdateForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert("Status updated!"); setShowUpdateForm(false); }}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Update Notes</label>
                  <textarea rows={3} className="w-full px-3 py-2 border rounded-md" placeholder="Enter notes..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-sky-600 rounded-md hover:bg-sky-700">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-base font-medium">Upload Document</h3>
              <button onClick={() => { setShowUploadForm(false); setUploadFile(null); }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit}>
              <div className="p-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Select File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                {uploadFile && <p className="mt-2 text-xs text-gray-600">Selected: {uploadFile.name}</p>}
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowUploadForm(false); setUploadFile(null); }}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="px-4 py-2 text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-gray-400"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;