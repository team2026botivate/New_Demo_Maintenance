import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMachineLog } from '../models/types';

// Mock seed data covering high-runtime and high-temperature scenarios for rule engine testing
const seedLogs: DailyMachineLog[] = [
  // Machine 1 (HP-102) – approaching runtime threshold (480/500 hrs)
  { id: 'log-001', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-18', runtimeHours: 10, temperature: 45, load: 70, operatorName: 'Rajesh Kumar', remarks: 'Normal operation', createdAt: '2026-03-18T08:00:00' },
  { id: 'log-002', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-19', runtimeHours: 10, temperature: 46, load: 72, operatorName: 'Rajesh Kumar', remarks: '', createdAt: '2026-03-19T08:00:00' },
  { id: 'log-003', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-20', runtimeHours: 10, temperature: 47, load: 68, operatorName: 'Suresh Patel', remarks: '', createdAt: '2026-03-20T08:00:00' },
  { id: 'log-004', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-21', runtimeHours: 10, temperature: 48, load: 75, operatorName: 'Suresh Patel', remarks: 'Slight vibration noted', createdAt: '2026-03-21T08:00:00' },
  { id: 'log-005', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-22', runtimeHours: 10, temperature: 49, load: 73, operatorName: 'Rajesh Kumar', remarks: '', createdAt: '2026-03-22T08:00:00' },
  { id: 'log-006', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-23', runtimeHours: 8, temperature: 50, load: 71, operatorName: 'Rajesh Kumar', remarks: '', createdAt: '2026-03-23T08:00:00' },
  { id: 'log-007', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-24', runtimeHours: 9, temperature: 51, load: 74, operatorName: 'Suresh Patel', remarks: '', createdAt: '2026-03-24T08:00:00' },
  { id: 'log-008', machineId: 1, machineName: 'Hydraulic Press HP-102', date: '2026-03-25', runtimeHours: 10, temperature: 52, load: 76, operatorName: 'Rajesh Kumar', remarks: 'Temperature increasing', createdAt: '2026-03-25T08:00:00' },
  // Cumulative: 77 hrs for March alone; machine runtimeThreshold set to 80 → triggers alert

  // Machine 2 (CNC-305) – overheating scenario
  { id: 'log-009', machineId: 2, machineName: 'CNC Machine CNC-305', date: '2026-03-23', runtimeHours: 8, temperature: 55, load: 80, operatorName: 'Amit Singh', remarks: '', createdAt: '2026-03-23T08:00:00' },
  { id: 'log-010', machineId: 2, machineName: 'CNC Machine CNC-305', date: '2026-03-24', runtimeHours: 8, temperature: 62, load: 85, operatorName: 'Amit Singh', remarks: 'Spindle hot', createdAt: '2026-03-24T08:00:00' },
  { id: 'log-011', machineId: 2, machineName: 'CNC Machine CNC-305', date: '2026-03-25', runtimeHours: 9, temperature: 68, load: 88, operatorName: 'Priya Sharma', remarks: 'High temp alert', createdAt: '2026-03-25T09:00:00' },
  // temperatureThreshold set to 65 → triggers temperature alert

  // Machine 3 (Conveyor CB-201) – normal
  { id: 'log-012', machineId: 3, machineName: 'Conveyor Belt CB-201', date: '2026-03-23', runtimeHours: 8, temperature: 38, load: 60, operatorName: 'Vijay Nair', remarks: '', createdAt: '2026-03-23T08:00:00' },
  { id: 'log-013', machineId: 3, machineName: 'Conveyor Belt CB-201', date: '2026-03-24', runtimeHours: 8, temperature: 36, load: 58, operatorName: 'Vijay Nair', remarks: '', createdAt: '2026-03-24T08:00:00' },
  { id: 'log-014', machineId: 3, machineName: 'Conveyor Belt CB-201', date: '2026-03-25', runtimeHours: 8, temperature: 37, load: 62, operatorName: 'Vijay Nair', remarks: '', createdAt: '2026-03-25T08:00:00' },

  // Machine 4 (IM-405) – normal
  { id: 'log-015', machineId: 4, machineName: 'Injection Molder IM-405', date: '2026-03-24', runtimeHours: 10, temperature: 42, load: 65, operatorName: 'Deepak Rao', remarks: '', createdAt: '2026-03-24T08:00:00' },
  { id: 'log-016', machineId: 4, machineName: 'Injection Molder IM-405', date: '2026-03-25', runtimeHours: 10, temperature: 43, load: 67, operatorName: 'Deepak Rao', remarks: '', createdAt: '2026-03-25T08:00:00' },
];

interface DailyLogState {
  logs: DailyMachineLog[];
  addLog: (log: Omit<DailyMachineLog, 'id' | 'createdAt'>) => DailyMachineLog;
  getLogsByMachine: (machineId: number) => DailyMachineLog[];
  getTotalRuntime: (machineId: number, lastNDays?: number) => number;
  getLatestLog: (machineId: number) => DailyMachineLog | undefined;
}

const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      logs: seedLogs,

      addLog: (logData) => {
        const newLog: DailyMachineLog = {
          ...logData,
          id: `log-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ logs: [newLog, ...state.logs] }));
        return newLog;
      },

      getLogsByMachine: (machineId) => {
        return get().logs
          .filter((l) => l.machineId === machineId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getTotalRuntime: (machineId, lastNDays) => {
        let logs = get().logs.filter((l) => l.machineId === machineId);
        if (lastNDays !== undefined) {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - lastNDays);
          logs = logs.filter((l) => new Date(l.date) >= cutoff);
        }
        return logs.reduce((sum, l) => sum + l.runtimeHours, 0);
      },

      getLatestLog: (machineId) => {
        const logs = get()
          .logs.filter((l) => l.machineId === machineId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return logs[0];
      },
    }),
    { name: 'daily-log-store' }
  )
);

export default useDailyLogStore;
