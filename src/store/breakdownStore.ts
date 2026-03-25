import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BreakdownLog } from '../models/types';

const DOWNTIME_COST_PER_HOUR = 500; // ₹500 per hour default rate

// Mock seed data – includes multiple breakdowns in last 10 days for Machine 2 (CNC-305)
const today = new Date('2026-03-25');
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 16);
};

const seedBreakdowns: BreakdownLog[] = [
  // CNC-305 (machine 2) – 3 breakdowns in last 10 days → triggers frequency alert
  {
    id: 'bd-001', machineId: 2, machineName: 'CNC Machine CNC-305',
    date: daysAgo(2), failureType: 'Electrical', rootCause: 'Power surge damaged control board',
    downtimeHours: 4, downtimeCost: 4 * DOWNTIME_COST_PER_HOUR,
    status: 'Resolved', severity: 'Critical', technicianAssigned: 'John Smith',
    actionTaken: 'Replaced control board, tested all circuits', createdAt: daysAgo(2),
  },
  {
    id: 'bd-002', machineId: 2, machineName: 'CNC Machine CNC-305',
    date: daysAgo(5), failureType: 'Mechanical', rootCause: 'Spindle bearing worn out',
    downtimeHours: 6, downtimeCost: 6 * DOWNTIME_COST_PER_HOUR,
    status: 'Resolved', severity: 'Major', technicianAssigned: 'Sarah Johnson',
    actionTaken: 'Replaced spindle bearings, lubricated assembly', createdAt: daysAgo(5),
  },
  {
    id: 'bd-003', machineId: 2, machineName: 'CNC Machine CNC-305',
    date: daysAgo(8), failureType: 'Software', rootCause: 'CNC firmware crash during cycle',
    downtimeHours: 2, downtimeCost: 2 * DOWNTIME_COST_PER_HOUR,
    status: 'Closed', severity: 'Minor', technicianAssigned: 'Mike Anderson',
    actionTaken: 'Rebooted and updated firmware to latest version', createdAt: daysAgo(8),
  },
  // HP-102 (machine 1) – 1 breakdown last month
  {
    id: 'bd-004', machineId: 1, machineName: 'Hydraulic Press HP-102',
    date: daysAgo(20), failureType: 'Hydraulic', rootCause: 'Hydraulic seal failure',
    downtimeHours: 3, downtimeCost: 3 * DOWNTIME_COST_PER_HOUR,
    status: 'Closed', severity: 'Major', technicianAssigned: 'John Smith',
    actionTaken: 'Replaced all seals and flushed hydraulic fluid', createdAt: daysAgo(20),
  },
  // IO-103 (machine 5) – 1 open breakdown
  {
    id: 'bd-005', machineId: 5, machineName: 'Industrial Oven IO-103',
    date: daysAgo(1), failureType: 'Electrical', rootCause: 'Heating element failure',
    downtimeHours: 0, downtimeCost: 0,
    status: 'Open', severity: 'Critical', technicianAssigned: 'Unassigned',
    actionTaken: '', createdAt: daysAgo(1),
  },
  // CB-201 (machine 3) – 1 resolved breakdown
  {
    id: 'bd-006', machineId: 3, machineName: 'Conveyor Belt CB-201',
    date: daysAgo(35), failureType: 'Mechanical', rootCause: 'Belt tensioner spring broke',
    downtimeHours: 2, downtimeCost: 2 * DOWNTIME_COST_PER_HOUR,
    status: 'Closed', severity: 'Minor', technicianAssigned: 'Sarah Johnson',
    actionTaken: 'Replaced tensioner spring', createdAt: daysAgo(35),
  },
];

interface BreakdownState {
  breakdowns: BreakdownLog[];
  addBreakdown: (bd: Omit<BreakdownLog, 'id' | 'downtimeCost' | 'createdAt'>) => BreakdownLog;
  updateBreakdown: (id: string, updates: Partial<BreakdownLog>) => void;
  getByMachine: (machineId: number) => BreakdownLog[];
  getRecent: (machineId: number, lastNDays: number) => BreakdownLog[];
  getTotalDowntime: (machineId: number, lastNDays?: number) => number;
  getMonthlyDowntime: () => { month: string; hours: number; cost: number }[];
}

const useBreakdownStore = create<BreakdownState>()(
  persist(
    (set, get) => ({
      breakdowns: seedBreakdowns,

      addBreakdown: (bdData) => {
        const newBd: BreakdownLog = {
          ...bdData,
          id: `bd-${Date.now()}`,
          downtimeCost: bdData.downtimeHours * DOWNTIME_COST_PER_HOUR,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ breakdowns: [newBd, ...state.breakdowns] }));
        return newBd;
      },

      updateBreakdown: (id, updates) => {
        set((state) => ({
          breakdowns: state.breakdowns.map((b) => {
            if (b.id !== id) return b;
            const updated = { ...b, ...updates };
            // Recalculate cost if downtimeHours changed
            if (updates.downtimeHours !== undefined) {
              updated.downtimeCost = updates.downtimeHours * DOWNTIME_COST_PER_HOUR;
            }
            return updated;
          }),
        }));
      },

      getByMachine: (machineId) =>
        get()
          .breakdowns.filter((b) => b.machineId === machineId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

      getRecent: (machineId, lastNDays) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - lastNDays);
        return get().breakdowns.filter(
          (b) => b.machineId === machineId && new Date(b.date) >= cutoff
        );
      },

      getTotalDowntime: (machineId, lastNDays) => {
        let bds = get().breakdowns.filter((b) => b.machineId === machineId);
        if (lastNDays !== undefined) {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - lastNDays);
          bds = bds.filter((b) => new Date(b.date) >= cutoff);
        }
        return bds.reduce((sum, b) => sum + b.downtimeHours, 0);
      },

      getMonthlyDowntime: () => {
        const monthMap: Record<string, { hours: number; cost: number }> = {};
        get().breakdowns.forEach((b) => {
          const d = new Date(b.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
          if (!monthMap[key]) monthMap[key] = { hours: 0, cost: 0 };
          monthMap[key].hours += b.downtimeHours;
          monthMap[key].cost += b.downtimeCost;
        });
        return Object.entries(monthMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, val]) => ({
            month: key,
            ...val,
          }));
      },
    }),
    { name: 'breakdown-store' }
  )
);

export { DOWNTIME_COST_PER_HOUR };
export default useBreakdownStore;
