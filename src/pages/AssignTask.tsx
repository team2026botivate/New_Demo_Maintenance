import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function TaskAssignmentForm() {
  const [formData, setFormData] = useState({
    taskType: '',
    machineName: '',
    givenBy: '',
    ownerName: 'admin1',
    temperature: '',
    workDescription: '',
    taskStartDate: '',
    taskTime: '',
    frequency: '',
    taskStatus: '',
    machineArea: '',
    partName: '',
    nextSuggTest: '',
    priority: '',
    enableReminder: false,
    requireAttachment: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Task assigned successfully!');
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <div className="relative">
                <select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Machine Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Machine Name
              </label>
              <div className="relative">
                <select
                  name="machineName"
                  value={formData.machineName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Machine</option>
                  <option value="machine1">Machine 1</option>
                  <option value="machine2">Machine 2</option>
                  <option value="machine3">Machine 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Part Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Part Name
              </label>
              <input
                type="text"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="Enter task description..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>


            {/* Temperature */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <div className="relative">
                <select
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Temperature</option>
                  <option value="low">Yes</option>
                  <option value="medium">No</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div className="mt-6">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Work Description
            </label>
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Enter task description..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Task Start Date, Task Time, Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Task Start Date
              </label>
              <input
                type="date"
                name="taskStartDate"
                value={formData.taskStartDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Task Time
              </label>
              <input
                type="time"
                name="taskTime"
                value={formData.taskTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <div className="relative">
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Dynamic calendar/UI tasks text */}
          <div className="mt-6 p-3 bg-sky-50 border border-sky-200 rounded text-xs text-sky-700">
            Dynamic calendar/UI tasks
          </div>

          {/* Additional Options */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Additional Option</h3>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <div>
                <div className="font-medium text-gray-700">Enable Reminder</div>
                <div className="text-xs text-sky-600">Send reminder before task due date</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableReminder"
                  checked={formData.enableReminder}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-700">Require Attachment</div>
                <div className="text-xs text-sky-600">User must upload a file when completing task</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="requireAttachment"
                  checked={formData.requireAttachment}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}