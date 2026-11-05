import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  HardDriveDownload,
  Database,
  Building2,
} from 'lucide-react';
import { ScreenTab } from '../types/expense';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatINR } from '../utils/formatters';
import { exportExpensesToCSV, triggerDownload } from '../services/storage';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openAddExpense,
    expenses,
    summary,
    loadDemoData,
    addToast,
  } = useExpenseContext();

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      addToast('info', 'No Data', 'Add expenses first before exporting.');
      return;
    }
    const csv = exportExpensesToCSV(expenses);
    const dateStr = new Date().toISOString().split('T')[0];
    triggerDownload(csv, `project_expenses_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    addToast('success', 'Export Complete', `Saved ${expenses.length} records to CSV.`);
  };

  const navItems: Array<{
    id: ScreenTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt, badge: expenses.length },
    { id: 'add', label: 'Add Expense', icon: PlusCircle },
    { id: 'summary', label: 'Summary', icon: PieChart },
  ];

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 select-none">
        {/* Brand & Wordmark */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none">
                Project Expense
              </h1>
              <span className="text-xs text-slate-400 font-medium">Financial Tracker</span>
            </div>
          </div>
        </div>

        {/* Quick Balance Widget in Sidebar */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Total Spent
          </div>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1 truncate">
            {formatINR(summary.totalExpenses)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>{summary.totalTransactions} recorded entries</span>
            <span className="text-emerald-400 font-medium">Local DB</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'add') {
                    openAddExpense();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono-numbers ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {expenses.length === 0 && (
            <button
              onClick={loadDemoData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Load Sample Project Data</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV Report</span>
          </button>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Offline on-device storage (₹ INR)
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (below lg) */}
      <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Project Expense</h1>
            <div className="text-[10px] text-slate-400">Financial Tracker</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddExpense}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg shadow-sm active:bg-emerald-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (below lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'add') {
                  openAddExpense();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg min-h-[48px] transition-colors relative ${
                isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : ''}`} />
              <span className="text-[11px] mt-0.5">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-mono-numbers">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
