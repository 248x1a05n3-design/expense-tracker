import React from 'react';
import {
  Wallet,
  Receipt,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Calendar,
  Layers,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatINR, formatDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { CATEGORY_META_MAP } from '../utils/constants';

export const DashboardView: React.FC = () => {
  const {
    summary,
    expenses,
    setActiveTab,
    openAddExpense,
    openExpenseDetail,
    loadDemoData,
  } = useExpenseContext();

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Project Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time ledger summary and expenditure analysis stored locally on this device.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('expenses')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            View All Expenses
          </button>
          <button
            onClick={openAddExpense}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {formatINR(summary.totalExpenses)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Cumulative budget spent across all categories</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Transactions
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {summary.totalTransactions}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {summary.totalTransactions === 1 ? '1 recorded entry' : 'Individual ledger entries'}
          </div>
        </div>

        {/* Highest Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Highest Expense
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {summary.highestExpense ? formatINR(summary.highestExpense.amount) : '₹0.00'}
          </div>
          <div className="mt-2 text-xs text-slate-500 truncate">
            {summary.highestExpense ? (
              <span>
                {summary.highestExpense.category} · {formatDate(summary.highestExpense.date)}
              </span>
            ) : (
              'No expenses recorded yet'
            )}
          </div>
        </div>

        {/* Average Transaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Expense
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {formatINR(summary.averageExpense)}
          </div>
          <div className="mt-2 text-xs text-slate-500">Mean expenditure per transaction</div>
        </div>
      </div>

      {/* Main Content Split: Recent Expenses & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Expenses */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Expenses</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Last 5 expenditures recorded in project records
              </p>
            </div>

            <button
              onClick={() => setActiveTab('expenses')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>View all ({expenses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {recentExpenses.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Receipt className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">No Expenses Recorded Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Start tracking by adding your first project expense, or load sample demonstration
                  records to test the dashboard.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={openAddExpense}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Add First Expense
                  </button>
                  <button
                    onClick={loadDemoData}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Load Sample Data
                  </button>
                </div>
              </div>
            ) : (
              recentExpenses.map((expense) => {
                const meta = CATEGORY_META_MAP[expense.category];
                return (
                  <div
                    key={expense.id}
                    onClick={() => openExpenseDetail(expense.id)}
                    className="p-4 sm:px-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${meta?.color}15`,
                          color: meta?.color || '#0f172a',
                        }}
                      >
                        <CategoryIcon category={expense.category} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {expense.category}
                          </span>
                          <span className="text-xs text-slate-500 font-normal">
                            · {formatDate(expense.date)}
                          </span>
                        </div>
                        {expense.note ? (
                          <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                            {expense.note}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 italic mt-0.5">No note provided</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pl-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 font-mono-numbers">
                          {formatINR(expense.amount)}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {recentExpenses.length > 0 && (
            <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
              <span>Showing {recentExpenses.length} of {expenses.length} records</span>
              <button
                onClick={() => setActiveTab('expenses')}
                className="font-medium text-slate-700 hover:text-slate-900"
              >
                Go to Expense List &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Category Expense Overview & Donut */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Expense Distribution</h3>
                <p className="text-xs text-slate-500">Category-wise financial share</p>
              </div>
              <button
                onClick={() => setActiveTab('summary')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Reports
              </button>
            </div>

            <div className="py-4">
              <CategoryDonutChart
                categories={summary.categorySummaries}
                totalAmount={summary.totalExpenses}
                size={210}
              />
            </div>
          </div>

          {/* Quick Category List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {summary.categorySummaries
              .filter((c) => c.totalAmount > 0)
              .slice(0, 4)
              .map((c) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-slate-700 font-medium truncate">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-numbers shrink-0">
                    <span className="font-semibold text-slate-900">{formatINR(c.totalAmount)}</span>
                    <span className="text-slate-600 text-[11px] w-10 text-right">
                      {c.percentage}%
                    </span>
                  </div>
                </div>
              ))}

            {summary.categorySummaries.filter((c) => c.totalAmount > 0).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">
                No categorical spending recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
