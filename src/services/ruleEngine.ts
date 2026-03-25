/**
 * Rule Engine – Phase 1 Predictive Maintenance
 * Evaluates 4 rules against stored data and pushes alerts + auto-creates tasks.
 *
 * FUTURE (Phase 2 AI): Replace rule functions with ML model predictions.
 */

import toast from 'react-hot-toast';
import useDailyLogStore from '../store/dailyLogStore';
import useBreakdownStore from '../store/breakdownStore';
import useAlertStore from '../store/alertStore';
import useTaskStore from '../store/taskStore';
import { Alert } from '../models/types';

// Machine master data (matches what Machines.tsx and MachineDetails.tsx use)
// In a real app this would be a shared machine store
export interface MachineMaster {
  id: number;
  name: string;
  runtimeThreshold: number;
  temperatureThreshold: number;
  criticality: 'High' | 'Medium' | 'Low';
  department: string;
}

export const machineMasterData: MachineMaster[] = [
  { id: 1, name: 'Hydraulic Press HP-102',   runtimeThreshold: 80,  temperatureThreshold: 55, criticality: 'High',   department: 'Manufacturing' },
  { id: 2, name: 'CNC Machine CNC-305',      runtimeThreshold: 100, temperatureThreshold: 65, criticality: 'High',   department: 'Production' },
  { id: 3, name: 'Conveyor Belt CB-201',     runtimeThreshold: 150, temperatureThreshold: 50, criticality: 'Medium', department: 'Packaging' },
  { id: 4, name: 'Injection Molder IM-405',  runtimeThreshold: 200, temperatureThreshold: 60, criticality: 'Medium', department: 'Manufacturing' },
  { id: 5, name: 'Industrial Oven IO-103',   runtimeThreshold: 120, temperatureThreshold: 80, criticality: 'High',   department: 'Logistics' },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
const pushAlert = (alertData: Omit<Alert, 'id' | 'isRead' | 'autoTaskCreated' | 'createdAt'>): Alert | null => {
  const alertStore = useAlertStore.getState();
  const taskStore  = useTaskStore.getState();

  // De-duplicate: only one alert per machine × type per 24 hrs
  if (alertStore.hasAlert(alertData.machineId, alertData.type)) return null;

  const newAlert = alertStore.addAlert(alertData);

  // Auto-create maintenance task
  taskStore.createTaskFromAlert(newAlert);
  alertStore.markTaskCreated(newAlert.id);

  // Show toast notification
  toast.error(`⚠️ Alert: ${alertData.title}`, { duration: 5000 });

  return newAlert;
};

// ─── Rule 1: Runtime Threshold ────────────────────────────────────────────────
export const checkRuntimeThreshold = (machine: MachineMaster): Alert | null => {
  const totalRuntime = useDailyLogStore.getState().getTotalRuntime(machine.id, 30);
  if (totalRuntime < machine.runtimeThreshold) return null;

  return pushAlert({
    machineId: machine.id,
    machineName: machine.name,
    type: 'RUNTIME_THRESHOLD',
    title: 'Maintenance Due',
    message: `${machine.name} has accumulated ${totalRuntime.toFixed(0)} hrs in the last 30 days (threshold: ${machine.runtimeThreshold} hrs). Schedule maintenance now.`,
    severity: machine.criticality === 'High' ? 'Critical' : 'High',
  });
};

// ─── Rule 2: Temperature Threshold ───────────────────────────────────────────
export const checkTemperatureThreshold = (machine: MachineMaster): Alert | null => {
  const latestLog = useDailyLogStore.getState().getLatestLog(machine.id);
  if (!latestLog || latestLog.temperature <= machine.temperatureThreshold) return null;

  return pushAlert({
    machineId: machine.id,
    machineName: machine.name,
    type: 'TEMPERATURE_THRESHOLD',
    title: 'Overheating Risk',
    message: `${machine.name} reported ${latestLog.temperature}°C (safe limit: ${machine.temperatureThreshold}°C) on ${latestLog.date}. Inspect cooling system immediately.`,
    severity: latestLog.temperature > machine.temperatureThreshold + 10 ? 'Critical' : 'High',
  });
};

// ─── Rule 3: Breakdown Frequency ─────────────────────────────────────────────
export const checkBreakdownFrequency = (machine: MachineMaster): Alert | null => {
  const recentBreakdowns = useBreakdownStore.getState().getRecent(machine.id, 10);
  if (recentBreakdowns.length < 2) return null;

  return pushAlert({
    machineId: machine.id,
    machineName: machine.name,
    type: 'BREAKDOWN_FREQUENCY',
    title: 'High Risk Machine',
    message: `${machine.name} had ${recentBreakdowns.length} breakdowns in the last 10 days. This machine is at high risk of critical failure.`,
    severity: recentBreakdowns.length >= 3 ? 'Critical' : 'High',
  });
};

// ─── Rule 4: Maintenance Delay Escalation ────────────────────────────────────
export const checkMaintenanceDelays = (): Alert[] => {
  const overdueTasks = useTaskStore.getState().getOverdueTasks();
  const alerts: Alert[] = [];

  // Group by machine and only alert once per machine
  const machineSeen = new Set<number>();
  overdueTasks.forEach((task) => {
    if (machineSeen.has(task.machineId)) return;
    machineSeen.add(task.machineId);

    const alert = pushAlert({
      machineId: task.machineId,
      machineName: task.machineName,
      type: 'MAINTENANCE_DELAY',
      title: 'Overdue Maintenance Escalation',
      message: `${task.machineName} has maintenance tasks overdue since ${task.dueDate}. Immediate admin action required.`,
      severity: 'Medium',
    });
    if (alert) alerts.push(alert);
  });

  return alerts;
};

// ─── Run All Rules for a Specific Machine ────────────────────────────────────
export const runRulesForMachine = (machineId: number): Alert[] => {
  const machine = machineMasterData.find((m) => m.id === machineId);
  if (!machine) return [];

  const results: (Alert | null)[] = [
    checkRuntimeThreshold(machine),
    checkTemperatureThreshold(machine),
    checkBreakdownFrequency(machine),
  ];

  return results.filter((a): a is Alert => a !== null);
};

// ─── Run All Rules for All Machines ──────────────────────────────────────────
export const runAllRules = (): Alert[] => {
  const alerts: Alert[] = [];

  machineMasterData.forEach((machine) => {
    const r1 = checkRuntimeThreshold(machine);
    const r2 = checkTemperatureThreshold(machine);
    const r3 = checkBreakdownFrequency(machine);
    if (r1) alerts.push(r1);
    if (r2) alerts.push(r2);
    if (r3) alerts.push(r3);
  });

  const delayAlerts = checkMaintenanceDelays();
  alerts.push(...delayAlerts);

  return alerts;
};
