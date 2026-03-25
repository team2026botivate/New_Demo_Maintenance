import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskStoreItem, Alert } from '../models/types';

// Mock seed tasks (mirrors existing page mock data)
const seedTasks: TaskStoreItem[] = [
  { id: 'task-001', machineId: 1, machineName: 'Hydraulic Press HP-102', department: 'Manufacturing', type: 'Quarterly', status: 'scheduled', dueDate: '2026-04-10', assignedTo: 'Sarah Johnson', priority: 'high', description: 'Quarterly lubrication and seal inspection', estimatedCost: 1200 },
  { id: 'task-002', machineId: 2, machineName: 'CNC Machine CNC-305', department: 'Production', type: 'Repair', status: 'in-progress', dueDate: '2026-03-26', assignedTo: 'John Smith', priority: 'critical', description: 'Control board replacement after electrical surge', estimatedCost: 3500 },
  { id: 'task-003', machineId: 3, machineName: 'Conveyor Belt CB-201', department: 'Packaging', type: 'Preventive', status: 'scheduled', dueDate: '2026-04-05', assignedTo: 'Mike Anderson', priority: 'medium', description: 'Belt tension adjustment and roller inspection', estimatedCost: 800 },
  { id: 'task-004', machineId: 4, machineName: 'Injection Molder IM-405', department: 'Manufacturing', type: 'Annual', status: 'scheduled', dueDate: '2026-05-01', assignedTo: 'Sarah Johnson', priority: 'medium', description: 'Annual safety inspection and calibration', estimatedCost: 2500 },
  { id: 'task-005', machineId: 5, machineName: 'Industrial Oven IO-103', department: 'Logistics', type: 'Repair', status: 'overdue', dueDate: '2026-03-20', assignedTo: 'Unassigned', priority: 'critical', description: 'Heating element urgently needs replacement', estimatedCost: 1800 },
  { id: 'task-006', machineId: 1, machineName: 'Hydraulic Press HP-102', department: 'Manufacturing', type: 'Predictive', status: 'overdue', dueDate: '2026-03-22', assignedTo: 'John Smith', priority: 'high', description: 'Runtime threshold exceeded – scheduled maintenance overdue', estimatedCost: 900 },
];

interface TaskStoreState {
  tasks: TaskStoreItem[];
  addTask: (task: Omit<TaskStoreItem, 'id'>) => TaskStoreItem;
  updateTask: (id: string, updates: Partial<TaskStoreItem>) => void;
  createTaskFromAlert: (alert: Alert) => TaskStoreItem;
  getOverdueTasks: () => TaskStoreItem[];
  getTasksByMachine: (machineId: number) => TaskStoreItem[];
}

const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      tasks: seedTasks,

      addTask: (taskData) => {
        const newTask: TaskStoreItem = {
          ...taskData,
          id: `task-${Date.now()}`,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      createTaskFromAlert: (alert) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 2); // due in 2 days by default

        const priorityMap: Record<string, TaskStoreItem['priority']> = {
          Critical: 'critical',
          High: 'high',
          Medium: 'medium',
          Low: 'low',
        };

        const typeMap: Record<string, string> = {
          RUNTIME_THRESHOLD: 'Predictive – Runtime',
          TEMPERATURE_THRESHOLD: 'Predictive – Temperature',
          BREAKDOWN_FREQUENCY: 'Predictive – Breakdown Freq',
          MAINTENANCE_DELAY: 'Escalation – Overdue',
        };

        const newTask: TaskStoreItem = {
          id: `task-${Date.now()}`,
          machineId: alert.machineId,
          machineName: alert.machineName,
          department: 'Maintenance',
          type: typeMap[alert.type] ?? 'Predictive',
          status: 'scheduled',
          dueDate: dueDate.toISOString().slice(0, 10),
          assignedTo: 'Unassigned',
          priority: priorityMap[alert.severity] ?? 'medium',
          description: `Auto-generated from alert: ${alert.message}`,
          fromAlert: alert.id,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
      },

      getOverdueTasks: () => {
        const today = new Date().toISOString().slice(0, 10);
        return get().tasks.filter(
          (t) => t.status !== 'completed' && t.dueDate < today
        );
      },

      getTasksByMachine: (machineId) =>
        get()
          .tasks.filter((t) => t.machineId === machineId)
          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
    }),
    { name: 'task-store' }
  )
);

export default useTaskStore;
