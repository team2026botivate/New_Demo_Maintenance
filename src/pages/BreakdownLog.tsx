import React, { useState } from 'react';
import { AlertOctagon, Plus, Filter, Edit2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useBreakdownStore, { DOWNTIME_COST_PER_HOUR } from '../store/breakdownStore';
import { runRulesForMachine } from '../services/ruleEngine';
import { machineMasterData } from '../services/ruleEngine';
import { BreakdownLog, BreakdownStatus, FailureType, SeverityLevel } from '../models/types';

const FAILURE_TYPES: FailureType[] = ['Electrical', 'Mechanical', 'Software', 'Operator Error', 'Hydraulic', 'Pneumatic', 'Other'];
const SEVERITY_LEVELS: SeverityLevel[] = ['Critical', 'Major', 'Minor'];
const STATUSES: BreakdownStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

const initialForm = {
  machineId: '',
  date: new Date().toISOString().slice(0, 16),
  failureType: '' as FailureType | '',
  rootCause: '',
  downtimeHours: '',
  severity: '' as SeverityLevel | '',
  technicianAssigned: '',
  actionTaken: '',
  status: 'Open' as BreakdownStatus,
};

const severityColor = (s: SeverityLevel) => ({
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Major:    'bg-orange-100 text-orange-700 border-orange-200',
  Minor:    'bg-yellow-100 text-yellow-700 border-yellow-200',
}[s] ?? 'bg-gray-100 text-gray-700');

const statusColor = (s: BreakdownStatus) => ({
  Open:        'bg-red-100 text-red-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved:    'bg-green-100 text-green-700',
  Closed:      'bg-gray-100 text-gray-700',
}[s] ?? 'bg-gray-100 text-gray-700');

const BreakdownLogPage: React.FC = () => {
  const { breakdowns, addBreakdown, updateBreakdown } = useBreakdownStore();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [filterMachine, setFilterMachine] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<BreakdownStatus>('Open');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.machineId) errs.machineId = 'Select a machine';
    if (!form.date) errs.date = 'Date is required';
    if (!form.failureType) errs.failureType = 'Select failure type';
    if (!form.rootCause.trim()) errs.rootCause = 'Root cause is required';
    if (!form.downtimeHours || isNaN(Number(form.downtimeHours)) || Number(form.downtimeHours) < 0)
      errs.downtimeHours = 'Enter valid downtime hours';
    if (!form.severity) errs.severity = 'Select severity';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const machine = machineMasterData.find((m) => m.id === Number(form.machineId));
    addBreakdown({
      machineId: Number(form.machineId),
      machineName: machine?.name ?? 'Unknown',
      date: form.date,
      failureType: form.failureType as FailureType,
      rootCause: form.rootCause.trim(),
      downtimeHours: Number(form.downtimeHours),
      status: form.status,
      severity: form.severity as SeverityLevel,
      technicianAssigned: form.technicianAssigned.trim() || 'Unassigned',
      actionTaken: form.actionTaken.trim(),
    });

    toast.success('Breakdown logged successfully!');
    setForm({ ...initialForm, date: new Date().toISOString().slice(0, 16) });
    setShowForm(false);

    setTimeout(() => runRulesForMachine(Number(form.machineId)), 500);
  };

  const handleEditStatus = (bd: BreakdownLog) => {
    setEditingId(bd.id);
    setEditStatus(bd.status);
  };

  const saveStatus = (id: string) => {
    updateBreakdown(id, { status: editStatus });
    setEditingId(null);
    toast.success('Status updated');
  };

  const filteredBreakdowns = breakdowns
    .filter((b) => filterMachine === 'all' || b.machineId === Number(filterMachine))
    .filter((b) => filterStatus === 'all' || b.status === filterStatus)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalDowntime = filteredBreakdowns.reduce((s, b) => s + b.downtimeHours, 0);
  const totalCost = filteredBreakdowns.reduce((s, b) => s + b.downtimeCost, 0);
  const openCount = breakdowns.filter((b) => b.status === 'Open').length;

  const inputCls = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertOctagon size={22} className="text-red-500" />
            Breakdown Log
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Record and track machine failure events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          {showForm ? 'Cancel' : 'Report Breakdown'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
          <p className="text-xs font-medium text-gray-500">Open Breakdowns</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{openCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500">Total Breakdowns</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{breakdowns.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4">
          <p className="text-xs font-medium text-gray-500">Total Downtime (filtered)</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalDowntime.toFixed(0)}h</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500">Downtime Cost (filtered)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">₹{totalCost.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400">@ ₹{DOWNTIME_COST_PER_HOUR}/hr</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b flex items-center gap-2">
            <AlertOctagon size={16} className="text-red-500" />
            Report Breakdown Event
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Machine */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Machine *</label>
              <select className={inputCls('machineId')} value={form.machineId} onChange={(e) => setForm({ ...form, machineId: e.target.value })}>
                <option value="">Select Machine...</option>
                {machineMasterData.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              {errors.machineId && <p className="text-xs text-red-500 mt-1">{errors.machineId}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date & Time of Failure *</label>
              <input type="datetime-local" className={inputCls('date')} value={form.date} max={new Date().toISOString().slice(0, 16)} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Failure Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Failure Type *</label>
              <select className={inputCls('failureType')} value={form.failureType} onChange={(e) => setForm({ ...form, failureType: e.target.value as FailureType })}>
                <option value="">Select Type...</option>
                {FAILURE_TYPES.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
              </select>
              {errors.failureType && <p className="text-xs text-red-500 mt-1">{errors.failureType}</p>}
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity *</label>
              <select className={inputCls('severity')} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as SeverityLevel })}>
                <option value="">Select Severity...</option>
                {SEVERITY_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.severity && <p className="text-xs text-red-500 mt-1">{errors.severity}</p>}
            </div>

            {/* Downtime */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Downtime Hours *</label>
              <input
                type="number" min={0} step={0.5} placeholder="e.g. 4"
                className={inputCls('downtimeHours')}
                value={form.downtimeHours}
                onChange={(e) => setForm({ ...form, downtimeHours: e.target.value })}
              />
              {errors.downtimeHours && <p className="text-xs text-red-500 mt-1">{errors.downtimeHours}</p>}
              {form.downtimeHours && !isNaN(Number(form.downtimeHours)) && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto cost: ₹{(Number(form.downtimeHours) * DOWNTIME_COST_PER_HOUR).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Technician */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Technician Assigned</label>
              <select className={inputCls('technicianAssigned')} value={form.technicianAssigned} onChange={(e) => setForm({ ...form, technicianAssigned: e.target.value })}>
                <option value="">Unassigned</option>
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Mike Anderson</option>
                <option>Priya Sharma</option>
                <option>Amit Singh</option>
              </select>
            </div>

            {/* Root Cause */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Root Cause *</label>
              <textarea rows={2} placeholder="Describe the root cause of the failure..." className={inputCls('rootCause')} value={form.rootCause} onChange={(e) => setForm({ ...form, rootCause: e.target.value })} />
              {errors.rootCause && <p className="text-xs text-red-500 mt-1">{errors.rootCause}</p>}
            </div>

            {/* Action Taken */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Action Taken</label>
              <textarea rows={2} placeholder="What was done to resolve the issue?" className={inputCls('actionTaken')} value={form.actionTaken} onChange={(e) => setForm({ ...form, actionTaken: e.target.value })} />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select className={inputCls('status')} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BreakdownStatus })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2 border-t">
              <button type="button" onClick={() => { setShowForm(false); setErrors({}); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button type="submit" className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">Log Breakdown</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters + Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Breakdown Records</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filterMachine} onChange={(e) => setFilterMachine(e.target.value)}
            >
              <option value="all">All Machines</option>
              {machineMasterData.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50">
              <tr>
                {['Date', 'Machine', 'Failure Type', 'Severity', 'Downtime', 'Cost', 'Technician', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBreakdowns.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">No breakdown records found</td></tr>
              ) : (
                filteredBreakdowns.map((bd) => (
                  <tr key={bd.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{new Date(bd.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800 whitespace-nowrap">{bd.machineName}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{bd.failureType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severityColor(bd.severity)}`}>
                        {bd.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">{bd.downtimeHours}h</td>
                    <td className="px-4 py-3 text-xs text-gray-700">₹{bd.downtimeCost.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{bd.technicianAssigned}</td>
                    <td className="px-4 py-3">
                      {editingId === bd.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as BreakdownStatus)}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button onClick={() => saveStatus(bd.id)} className="p-1 text-green-600 hover:text-green-800"><Check size={14} /></button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(bd.status)}`}>{bd.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEditStatus(bd)} className="p-1 text-gray-400 hover:text-sky-600 transition" title="Edit status">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          Showing {filteredBreakdowns.length} of {breakdowns.length} records
        </div>
      </div>
    </div>
  );
};

export default BreakdownLogPage;
