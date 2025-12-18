import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  DollarSign,
  BarChart2,
  Calendar,
  ThermometerSun,
  X,
  Plus,
  Trash2,
  Filter,
} from "lucide-react";

const repairVsPurchaseData = [
  { name: "HP-102", purchasePrice: 85000, repairCost: 12450, status: "Active", department: "Manufacturing" },
  { name: "CNC-305", purchasePrice: 120000, repairCost: 18700, status: "Maintenance", department: "Production" },
  { name: "CB-201", purchasePrice: 45000, repairCost: 5200, status: "Active", department: "Packaging" },
  { name: "IM-405", purchasePrice: 95000, repairCost: 3450, status: "Active", department: "Manufacturing" },
  { name: "IO-103", purchasePrice: 72000, repairCost: 8900, status: "Repair", department: "Logistics" },
];

const departmentCostData = [
  { name: "Manufacturing", cost: 24500, machines: 62, tasks: 38 },
  { name: "Packaging", cost: 12800, machines: 45, tasks: 22 },
  { name: "Production", cost: 18200, machines: 58, tasks: 31 },
  { name: "Logistics", cost: 8900, machines: 83, tasks: 15 },
];

const temperatureReadings = [
  { time: "08:00", HP102: 45, CNC305: 52, CB201: 48, status: "Normal" },
  { time: "10:00", HP102: 47, CNC305: 54, CB201: 49, status: "Normal" },
  { time: "12:00", HP102: 46, CNC305: 53, CB201: 50, status: "Normal" },
  { time: "14:00", HP102: 48, CNC305: 55, CB201: 51, status: "Warning" },
  { time: "16:00", HP102: 47, CNC305: 54, CB201: 49, status: "Normal" },
];

const frequentRepairData = [
  { name: "CNC-305", repairs: 12, lastRepair: "2024-11-05", cost: 18700 },
  { name: "HP-102", repairs: 8, lastRepair: "2024-11-08", cost: 12450 },
  { name: "IO-103", repairs: 6, lastRepair: "2024-11-10", cost: 8900 },
];

const machineImages = [
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop",
];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterValue, setFilterValue] = useState("all");
  const [tableData, setTableData] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsModalOpen(true);
      const timer = setTimeout(() => setIsModalOpen(false), 2000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setActiveTab(0);
    setFilterValue("all");
    
    // Set appropriate data based on card type
    switch(cardType) {
      case "machines":
        setTableData(repairVsPurchaseData);
        break;
      case "departments":
        setTableData(departmentCostData);
        break;
      case "temperature":
        setTableData(temperatureReadings);
        break;
      case "repairs":
        setTableData(frequentRepairData);
        break;
      default:
        setTableData([]);
    }
  };

  const closeModal = () => {
    setSelectedCard(null);
    setTableData([]);
  };

  const addRow = () => {
    const newRow = { ...tableData[0], name: `New-${Date.now()}` };
    setTableData([...tableData, newRow]);
  };

  const removeRow = (index: number) => {
    setTableData(tableData.filter((_, i) => i !== index));
  };

  const getFilteredData = () => {
    if (filterValue === "all") return tableData;
    return tableData.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  };

  const renderTableContent = () => {
    const filteredData = getFilteredData();
    
    if (selectedCard === "machines") {
      return (
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Machine</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Purchase Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Repair Cost</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Department</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-sky-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-xs">{item.name}</td>
                <td className="px-4 py-3 text-xs">₹{item.purchasePrice.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-xs">₹{item.repairCost.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "Active" ? "bg-green-100 text-green-800" : 
                    item.status === "Maintenance" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{item.department}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedCard === "departments") {
      return (
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Total Cost</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Machines</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Tasks</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-sky-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-xs font-medium">{item.name}</td>
                <td className="px-4 py-3 text-xs">₹{item.cost.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-xs">{item.machines}</td>
                <td className="px-4 py-3 text-xs">{item.tasks}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedCard === "temperature") {
      return (
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">HP-102 (°C)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">CNC-305 (°C)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">CB-201 (°C)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-sky-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-xs">{item.time}</td>
                <td className="px-4 py-3 text-xs">{item.HP102}°C</td>
                <td className="px-4 py-3 text-xs">{item.CNC305}°C</td>
                <td className="px-4 py-3 text-xs">{item.CB201}°C</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "Normal" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedCard === "repairs") {
      return (
        <table className="w-full">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Machine</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Total Repairs</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Last Repair Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Total Cost</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-sky-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-xs font-medium">{item.name}</td>
                <td className="px-4 py-3 text-xs">{item.repairs}</td>
                <td className="px-4 py-3 text-xs">{item.lastRepair}</td>
                <td className="px-4 py-3 text-xs">₹{item.cost.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => removeRow(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <select className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastQuarter">Last Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Total Machines", value: 248, icon: <Wrench size={18} className="text-blue-600" />, color: "bg-blue-100" },
            { label: "Maintenance Tasks", value: 156, icon: <Calendar size={18} className="text-sky-600" />, color: "bg-sky-100" },
            { label: "Tasks Complete", value: 89, icon: <CheckCircle size={18} className="text-green-600" />, color: "bg-green-100" },
            { label: "Tasks Pending", value: 42, icon: <Clock size={18} className="text-amber-600" />, color: "bg-amber-100" },
            { label: "Tasks Overdue", value: 25, icon: <AlertTriangle size={18} className="text-red-600" />, color: "bg-red-100" },
            { label: "Total Cost", value: 36450, prefix: "₹", icon: <DollarSign size={18} className="text-purple-600" />, color: "bg-purple-100" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className={`p-2.5 ${stat.color} rounded-full mr-3`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    {stat.label}
                  </p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {stat.prefix || ""}{stat.value.toLocaleString("en-IN")}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div 
            onClick={() => handleCardClick("machines")}
            className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <h2 className="flex items-center text-base font-bold text-gray-800 mb-4">
              <BarChart2 size={20} className="mr-2 text-sky-600" />
              Repair Cost vs Purchase Price
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repairVsPurchaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="purchasePrice" name="Purchase Price" fill="#0284c7" />
                  <Bar dataKey="repairCost" name="Repair Cost" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick("departments")}
            className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <h2 className="flex items-center text-base font-bold text-gray-800 mb-4">
              <DollarSign size={18} className="mr-2 text-sky-600" />
              Department Cost Analysis
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentCostData}
                    dataKey="cost"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentCostData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={["#0284c7", "#60A5FA", "#F59E0B", "#10B981"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick("temperature")}
            className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <h2 className="flex items-center text-base font-bold text-gray-800 mb-4">
              <ThermometerSun size={18} className="mr-2 text-sky-600" />
              Temperature Readings
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureReadings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="HP102" name="HP-102" stroke="#0284c7" />
                  <Line type="monotone" dataKey="CNC305" name="CNC-305" stroke="#F59E0B" />
                  <Line type="monotone" dataKey="CB201" name="CB-201" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick("repairs")}
            className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <h2 className="flex items-center text-base font-bold text-gray-800 mb-4">
              <Wrench size={18} className="mr-2 text-sky-600" />
              Frequent Repairs
            </h2>
            <div className="h-80 flex flex-col justify-between">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequentRepairData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="repairs" name="Number of Repairs" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t">
                {frequentRepairData.map((machine, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={machineImages[idx]}
                      alt={machine.name}
                      className="w-20 h-20 rounded-xl object-cover mb-2 shadow-lg hover:scale-105 transition-transform"
                    />
                    <span className="text-xs font-medium text-gray-600">{machine.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="p-6 mx-4 w-full max-w-sm text-center bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-center mb-3">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <p className="font-semibold text-green-800">Login Successful!</p>
              <p className="text-green-600">Welcome to MaintenancePro.</p>
            </div>
          </div>
        )}

        {selectedCard && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b bg-sky-50">
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedCard === "machines" && "Machine Details"}
                  {selectedCard === "departments" && "Department Details"}
                  {selectedCard === "temperature" && "Temperature Log"}
                  {selectedCard === "repairs" && "Repair History"}
                </h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab(0)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        activeTab === 0 ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Overview ({tableData.length})
                    </button>
                    <button
                      onClick={() => setActiveTab(1)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        activeTab === 1 ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Details
                    </button>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filterValue === "all" ? "" : filterValue}
                        onChange={(e) => setFilterValue(e.target.value || "all")}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <button
                      onClick={addRow}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Plus size={18} />
                      Add Row
                    </button>
                  </div>
                </div>

                <div className="overflow-auto max-h-[500px] border rounded-lg">
                  {renderTableContent()}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-xs text-gray-600">
                    Showing {getFilteredData().length} of {tableData.length} entries
                  </p>
                   <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;