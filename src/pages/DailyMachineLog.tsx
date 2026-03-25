import React, { useState } from 'react';
import { Activity, Plus, Filter, Thermometer, Clock, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import useDailyLogStore from '../store/dailyLogStore';
import { runRulesForMachine } from '../services/ruleEngine';
import { machineMasterData } from '../services/ruleEngine';
import { DailyMachineLog } from '../models/types';

const initialForm = {
  machineId: '',
  date: new Date().toISOString().slice(0, 10),
  runtimeHours: '',
  temperature: '',
  load: '',
  operatorName: '',
  remarks: '',
};

const DailyMachineLogPage: React.FC = () => {
  const { logs, addLog } = useDailyLogStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterMachineId, setFilterMachineId] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredLogs: DailyMachineLog[] =
    filterMachineId === 'all'
      ? [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [...logs]
          .filter((l) => l.machineId === Number(filterMachineId))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.machineId) errs.machineId = 'Please select a machine';
    if (!form.date) errs.date = 'Date is required';
    if (!form.runtimeHours || isNaN(Number(form.runtimeHours)) || Number(form.runtimeHours) < 0 || Number(form.runtimeHours) > 24)
      errs.runtimeHours = 'Runtime must be 0–24 hours';
    if (!form.temperature || isNaN(Number(form.temperature)) || Number(form.temperature) < 0 || Number(form.temperature) > 200)
      errs.temperature = 'Temperature must be 0–200°C';
    if (!form.load || isNaN(Number(form.load)) || Number(form.load) < 0 || Number(form.load) > 100)
      errs.load = 'Load must be 0–100%';
    if (!form.operatorName.trim()) errs.operatorName = 'Operator name is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const machine = machineMasterData.find((m) => m.id === Number(form.machineId));
    addLog({
      machineId: Number(form.machineId),
      machineName: machine?.name ?? 'Unknown',
      date: form.date,
      runtimeHours: Number(form.runtimeHours),
      temperature: Number(form.temperature),
      load: Number(form.load),
      operatorName: form.operatorName.trim(),
      remarks: form.remarks.trim(),
    });

    toast.success('Daily log submitted successfully!');
    setForm({ ...initialForm, date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);

    // Run rule engine after adding log
    setTimeout(() => {
      runRulesForMachine(Number(form.machineId));
    }, 500);

    setSubmitting(false);
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity size={22} className="text-sky-500" />
            Daily Machine Log
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Record daily operational data for predictive analysis</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          {showForm ? 'Cancel' : 'Add Log Entry'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b">New Daily Log Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Machine */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Machine *</label>
              <select
                className={inputCls('machineId')}
                value={form.machineId}
                onChange={(e) => setForm({ ...form, machineId: e.target.value })}
              >
                <option value="">Select Machine...</option>
                {machineMasterData.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {errors.machineId && <p className="text-xs text-red-500 mt-1">{errors.machineId}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                className={inputCls('date')}
                value={form.date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Runtime Hours */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Runtime Hours *</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min={0} max={24} step={0.5}
                  placeholder="e.g. 8"
                  className={`pl-8 ${inputCls('runtimeHours')}`}
                  value={form.runtimeHours}
                  onChange={(e) => setForm({ ...form, runtimeHours: e.target.value })}
                />
              </div>
              {errors.runtimeHours && <p className="text-xs text-red-500 mt-1">{errors.runtimeHours}</p>}
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Temperature (°C) *</label>
              <div className="relative">
                <Thermometer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min={0} max={200}
                  placeholder="e.g. 45"
                  className={`pl-8 ${inputCls('temperature')}`}
                  value={form.temperature}
                  onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                />
              </div>
              {errors.temperature && <p className="text-xs text-red-500 mt-1">{errors.temperature}</p>}
            </div>

            {/* Load */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Load (%) *</label>
              <input
                type="number"
                min={0} max={100}
                placeholder="e.g. 75"
                className={inputCls('load')}
                value={form.load}
                onChange={(e) => setForm({ ...form, load: e.target.value })}
              />
              {errors.load && <p className="text-xs text-red-500 mt-1">{errors.load}</p>}
            </div>

            {/* Operator */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Operator Name *</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  className={`pl-8 ${inputCls('operatorName')}`}
                  value={form.operatorName}
                  onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
                />
              </div>
              {errors.operatorName && <p className="text-xs text-red-500 mt-1">{errors.operatorName}</p>}
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
              <div className="relative">
                <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows={2}
                  placeholder="Any observations or notes..."
                  className={`pl-8 ${inputCls('remarks')}`}
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2 border-t">
              <button
                type="button"
                onClick={() => { setShowForm(false); setErrors({}); setForm({ ...initialForm, date: new Date().toISOString().slice(0, 10) }); }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {machineMasterData.slice(0, 4).map((m) => {
          const runtime = useDailyLogStore.getState().getTotalRuntime(m.id, 30);
          const pct = Math.min(Math.round((runtime / m.runtimeThreshold) * 100), 100);
          return (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-medium text-gray-500 truncate">{m.name}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{runtime.toFixed(0)} hrs</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct}% of {m.runtimeThreshold}h threshold</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Log History</h2>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filterMachineId}
              onChange={(e) => setFilterMachineId(e.target.value)}
            >
              <option value="all">All Machines</option>
              {machineMasterData.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50">
              <tr>
                {['Date', 'Machine', 'Runtime (hrs)', 'Temperature', 'Load %', 'Operator', 'Remarks'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No logs found</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const machine = machineMasterData.find((m) => m.id === log.machineId);
                  const tempWarn = machine && log.temperature > machine.temperatureThreshold;
                  return (
                    <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{log.date}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-800 whitespace-nowrap">{log.machineName}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{log.runtimeHours}h</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`font-medium ${tempWarn ? 'text-red-600' : 'text-gray-700'}`}>
                          {log.temperature}°C{tempWarn && ' ⚠️'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">{log.load}%</td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{log.operatorName}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{log.remarks || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>
    </div>
  );
};

export default DailyMachineLogPage;
