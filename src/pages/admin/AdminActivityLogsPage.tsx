import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Calendar, 
  UserCheck, 
  FileSpreadsheet, 
  Activity,
  Layers
} from 'lucide-react';

export const AdminActivityLogsPage: React.FC = () => {
  const { activityLogs } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.recordId && log.recordId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Admin Name', 'Role', 'Module', 'Action', 'Record ID', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.adminName}"`,
      `"${l.adminRole}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      `"${l.recordId || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HaatBazar_ActivityLogs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modulesList = Array.from(new Set(activityLogs.map((l) => l.module)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#006B35]" />
            Security & Activity Audit Logs
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Immutable trace of administrative actions, courier rate updates, order modifications, and logins.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] font-semibold rounded-xl text-sm transition-colors border border-emerald-200"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Audit Trail
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, keyword, record ID, or admin name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006B35]"
          >
            <option value="all">All Modules ({activityLogs.length})</option>
            {modulesList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-[#64748B] uppercase">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Details</th>
                <th className="py-3 px-4 font-semibold">Admin / Operator</th>
                <th className="py-3 px-4 font-semibold text-right">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No activity logs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const date = new Date(log.timestamp);
                  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const formattedDate = date.toLocaleDateString();

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <span className="font-semibold text-slate-700 block">{formattedTime}</span>
                        <span>{formattedDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          {log.module}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#17231B] text-xs">
                        {log.action}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600 max-w-md">
                        {log.details}
                      </td>

                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#006B35]" />
                          <span className="font-semibold text-slate-800">{log.adminName}</span>
                          <span className="text-[10px] text-slate-400">({log.adminRole})</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-xs text-[#006B35] font-semibold whitespace-nowrap">
                        {log.recordId || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
