import React, { useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

// --- DUMMY DATA ---
const mockUsers = [
  {
    id: 1,
    employeeName: "Dev",
    department: "Management",
    phoneNumber: "555-0101",
    employeeCode: "MNG001",
    username: "jsmith",
    pageAccess: "Admin",
  },
  {
    id: 2,
    employeeName: "Karan",
    department: "Maintenance",
    phoneNumber: "555-0102",
    employeeCode: "MNT015",
    username: "sjohnson",
    pageAccess: "User",
  },
  {
    id: 3,
    employeeName: "Monika",
    department: "Production",
    phoneNumber: "555-0103",
    employeeCode: "PRD022",
    username: "mdavis",
    pageAccess: "User",
  },
];

// --- USER FORM MODAL COMPONENT ---
const UserFormModal = ({ userToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    userToEdit || {
      employeeName: "",
      department: "",
      phoneNumber: "",
      employeeCode: "",
      username: "",
      password: "",
      pageAccess: "User",
    }
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.employeeName ||
      !formData.department ||
      !formData.username ||
      (!userToEdit && !formData.password)
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 m-4 transform transition-all">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {userToEdit ? "Edit User Account" : "Add New User"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Employee Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Department<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Employee Code
              </label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Username (ID)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Page Access (Role)
            </label>
            <select
              name="pageAccess"
              value={formData.pageAccess}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {userToEdit ? "New Password (Leave blank to keep old)" : "Password"}
              {!userToEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-8 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors duration-200"
            >
              <Save className="w-5 h-5" />
              {userToEdit ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SETTINGS COMPONENT ---
const Settings = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u)));
      showToast(`User ${userData.employeeName} updated successfully.`);
    } else {
      const newUser = {
        id: Date.now(),
        ...userData,
      };
      setUsers([...users, newUser]);
      showToast(`User ${newUser.employeeName} added successfully.`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      setUsers(users.filter((u) => u.id !== userId));
      showToast(`User ${userName} deleted successfully.`);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-sky-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {toastMessage && (
        <div className="fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white font-semibold z-50">
          {toastMessage}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Account Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Manage user accounts and access permissions
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors duration-200 shadow-lg text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden">Add User</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    Department
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    Employee Code
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    ID (Username)
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                    Page Access
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${getAvatarColor(
                            u.employeeName
                          )} text-white font-bold text-xs`}
                        >
                          {getInitials(u.employeeName)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            {u.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">{u.employeeCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                      {u.department}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                      {u.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 whitespace-nowrap">
                      {u.employeeCode}
                    </td>
                    <td className="px-6 py-4 text-xs text-sky-600 font-mono whitespace-nowrap">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          u.pageAccess === "Admin"
                            ? "bg-red-100 text-red-800"
                            : u.pageAccess === "User"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {u.pageAccess}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 text-sky-600 rounded-lg hover:text-sky-800 hover:bg-sky-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.employeeName)}
                          className="p-2 text-red-600 rounded-lg hover:text-red-800 hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-base font-medium">No user accounts found</p>
              <p className="text-xs mt-1">Click "Add New User" to create your first user account</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${getAvatarColor(
                      u.employeeName
                    )} text-white font-bold`}
                  >
                    {getInitials(u.employeeName)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{u.employeeName}</div>
                    <div className="text-xs text-gray-500">{u.employeeCode}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    u.pageAccess === "Admin"
                      ? "bg-red-100 text-red-800"
                      : u.pageAccess === "User"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {u.pageAccess}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Department:</span>
                  <span className="text-gray-900 font-medium">{u.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900 font-medium">{u.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Username:</span>
                  <span className="text-sky-600 font-mono font-medium">{u.username}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(u)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(u.id, u.employeeName)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-base font-medium">No user accounts found</p>
              <p className="text-xs mt-1">Click "Add New User" to create your first user account</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <UserFormModal
          userToEdit={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default Settings;