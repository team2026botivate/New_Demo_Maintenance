/**
 * Health Score Service
 * Computes a 0–100 health score per machine based on 4 weighted penalty factors.
 *
 * Formula: healthScore = 100 − (breakdownPenalty + delayPenalty + tempPenalty + runtimePenalty)
 *
 * FUTURE (Phase 2 AI): Replace formula with trained regression model using historical data.
 */

import useDailyLogStore from '../store/dailyLogStore';
import useBreakdownStore from '../store/breakdownStore';
import useTaskStore from '../store/taskStore';
import { machineMasterData } from './ruleEngine';

// Penalty weights (total max penalty = 100)
const WEIGHTS = {
  breakdownFreq: 35,   // high impact – breakdowns in last 30 days
  delayedTasks:  25,   // medium impact – overdue maintenance tasks
  temperature:   20,   // medium impact – temperature deviation %
  runtimeLoad:   20,   // medium impact – runtime vs threshold
};

/**
 * Calculate health score (0–100) for a given machine.
 * Higher score = healthier machine.
 */
export const calculateHealthScore = (machineId: number): number => {
  const machine = machineMasterData.find((m) => m.id === machineId);
  if (!machine) return 50; // default when machine not in master

  // ── Factor 1: Breakdown frequency penalty ────────────────────────────────
  const breakdownsLast30 = useBreakdownStore.getState().getRecent(machineId, 30).length;
  // 0 breakdowns = 0 penalty; 3+ breakdowns = full penalty
  const breakdownPenalty = Math.min(breakdownsLast30 / 3, 1) * WEIGHTS.breakdownFreq;

  // ── Factor 2: Overdue task penalty ───────────────────────────────────────
  const machineTasks = useTaskStore.getState().getTasksByMachine(machineId);
  const today = new Date().toISOString().slice(0, 10);
  const overdueTasks = machineTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate < today
  );
  // 0 overdue = 0 penalty; 2+ overdue = full penalty
  const delayPenalty = Math.min(overdueTasks.length / 2, 1) * WEIGHTS.delayedTasks;

  // ── Factor 3: Temperature deviation penalty ───────────────────────────────
  const latestLog = useDailyLogStore.getState().getLatestLog(machineId);
  let tempPenalty = 0;
  if (latestLog && machine.temperatureThreshold > 0) {
    const deviation = Math.max(latestLog.temperature - machine.temperatureThreshold, 0);
    // Deviation of 15°C above threshold = full penalty
    tempPenalty = Math.min(deviation / 15, 1) * WEIGHTS.temperature;
  }

  // ── Factor 4: Runtime overload penalty ───────────────────────────────────
  const totalRuntime30 = useDailyLogStore.getState().getTotalRuntime(machineId, 30);
  let runtimePenalty = 0;
  if (machine.runtimeThreshold > 0) {
    const overload = Math.max(totalRuntime30 - machine.runtimeThreshold, 0);
    // Overload of 50% above threshold = full penalty
    runtimePenalty = Math.min(overload / (machine.runtimeThreshold * 0.5), 1) * WEIGHTS.runtimeLoad;
  }

  const totalPenalty = breakdownPenalty + delayPenalty + tempPenalty + runtimePenalty;
  const score = Math.max(0, Math.min(100, Math.round(100 - totalPenalty)));
  return score;
};

/** Classify score into a risk category */
export const getHealthCategory = (score: number): 'Healthy' | 'Moderate' | 'High Risk' => {
  if (score >= 70) return 'Healthy';
  if (score >= 50) return 'Moderate';
  return 'High Risk';
};

/** Tailwind color classes per health category */
export const getHealthColorClass = (score: number): string => {
  if (score >= 70) return 'text-green-700 bg-green-100';
  if (score >= 50) return 'text-amber-700 bg-amber-100';
  return 'text-red-700 bg-red-100';
};

/** Bar color for progress bar */
export const getHealthBarColor = (score: number): string => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

/** Calculate MTBF (Mean Time Between Failures) in hours for a machine */
export const calculateMTBF = (machineId: number): number | null => {
  const machine = machineMasterData.find((m) => m.id === machineId);
  if (!machine) return null;

  const breakdowns = useBreakdownStore.getState().getByMachine(machineId);
  if (breakdowns.length === 0) return null;

  // Approximate: assume machine has been operational for 365 days with expectedDailyRuntime=8 hrs
  const totalOperationalHours = 365 * 8;
  const totalDowntime = useBreakdownStore.getState().getTotalDowntime(machineId);
  const uptime = totalOperationalHours - totalDowntime;

  return Math.round(uptime / breakdowns.length);
};

/** Get health scores for all machines */
export const getAllHealthScores = (): { machineId: number; name: string; score: number; category: string }[] => {
  return machineMasterData.map((m) => {
    const score = calculateHealthScore(m.id);
    return { machineId: m.id, name: m.name, score, category: getHealthCategory(score) };
  });
};
