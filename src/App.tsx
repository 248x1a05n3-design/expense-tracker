import React from 'react';
import { ExpenseProvider, useExpenseContext } from './context/ExpenseContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ExpenseListView } from './components/ExpenseListView';
import { ExpenseFormView } from './components/ExpenseFormView';
import { SummaryView } from './components/SummaryView';
import { ExpenseDetailModal } from './components/ExpenseDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { PlusCircle, Database, RotateCcw } from 'lucide-react';
import { formatINR } from './utils/formatters';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openAddExpense,
    toasts,
    removeToast,
    summary,
    loadDemoData,
    clearAllExpenses,
    expenses,
  } = useExpenseContext();

  // Screen title & breadcrumb mapping
  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'expenses':
        return 'Expenses / List';
      case 'add':
        return 'Expenses / New Entry';
      case 'summary':
        return 'Reports / Summary';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar (Desktop) and Top/Bottom (Mobile) */}
      <Navigation />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar (Desktop & Tablet) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-medium">Project Tracker</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">{getBreadcrumb()}</span>
          </div>

          <div className="flex items-center gap-3">
            {expenses.length > 0 ? (
              <button
                onClick={clearAllExpenses}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Reset all expenses from local storage"
              >
                Reset Ledger
              </button>
            ) : (
              <button
                onClick={loadDemoData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>
            )}

            {activeTab !== 'add' && (
              <button
                onClick={openAddExpense}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Expense</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'expenses' && <ExpenseListView />}
          {activeTab === 'add' && <ExpenseFormView />}
          {activeTab === 'summary' && <SummaryView />}
        </main>
      </div>

      {/* Dedicated Expense Detail Modal / View */}
      <ExpenseDetailModal />

      {/* Notification Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
