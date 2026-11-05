import React, { useMemo } from 'react';
import {
  Wallet,
  Receipt,
  TrendingUp,
  Layers,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Info,
} from 'lucide-react';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatINR, formatDate } from '../utils/formatters';
import { calculateTimelineSummary } from '../utils/calculations';
import { CategoryDonutChart } from './charts/CategoryDonutChart';
import { CategoryBarChart } from './charts/CategoryBarChart';
import { TimelineTrendChart } from './charts/TimelineTrendChart';
import { CategoryIcon } from './CategoryIcon';
import { exportExpensesToCSV, triggerDownload } from '../services/storage';

export const SummaryView: React.FC = () => {
  const { summary, expenses, addToast } = useExpenseContext();

  // Compute timeline data
  const timelinePoints = useMemo(() => {
    return calculateTimelineSummary(expenses);
  }, [expenses]);

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      addToast('info', 'No Data', 'Add expenses first before exporting.');
      return;
    }
    const csv = exportExpensesToCSV(expenses);
    const dateStr = new Date().toISOString().split('T')[0];
    triggerDownload(csv, `financial_summary_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    addToast('success', 'Summary Exported', 'CSV report saved to your device.');
  };

  const highestCat = summary.categorySummaries.find((c) => c.totalAmount > 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Dynamic analytics, categorical breakdowns, and timeline summaries computed from your
            local expense ledger.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Project Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Project Expenses
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {formatINR(summary.totalExpenses)}
          </div>
          <div className="mt-2 text-xs text-slate-500">100% of recorded project budget</div>
        </div>

        {/* Total Number of Expenses */}
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
          <div className="mt-2 text-xs text-slate-500">Individual expense entries</div>
        </div>

        {/* Average Expense Amount */}
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
          <div className="mt-2 text-xs text-slate-500">Average amount spent per transaction</div>
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
              'None recorded yet'
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid: Donut + Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Donut Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Expense Distribution</h3>
                <p className="text-xs text-slate-500">Percentage share across categories</p>
              </div>
            </div>
          </div>

          <div className="py-6">
            <CategoryDonutChart
              categories={summary.categorySummaries}
              totalAmount={summary.totalExpenses}
              size={240}
            />
          </div>

          {highestCat && highestCat.totalAmount > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>Top Spending Category:</span>
              <span className="font-semibold text-slate-900 font-mono-numbers">
                {highestCat.category} ({highestCat.percentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Chart 2: Category Comparison Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Category Comparison</h3>
                <p className="text-xs text-slate-500">Ranked by total monetary expenditure</p>
              </div>
            </div>
          </div>

          <div className="py-4">
            <CategoryBarChart categories={summary.categorySummaries} />
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            All categories update automatically as expenses are logged or edited.
          </div>
        </div>
      </div>

      {/* Chart 3: Date-Based Expense Timeline Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Timeline Spending Summary</h3>
              <p className="text-xs text-slate-500">Historical date-wise expense volume</p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {timelinePoints.length} active dates
          </span>
        </div>

        <div className="py-4">
          <TimelineTrendChart points={timelinePoints} />
        </div>
      </div>

      {/* Comprehensive Category-Wise Expense Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Category-Wise Breakdown Table</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive metrics per category including amount, share, and transaction counts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5 text-right">Transactions</th>
                <th className="py-3 px-5 text-right">Share (%)</th>
                <th className="py-3 px-5 text-right">Average / Tx</th>
                <th className="py-3 px-5 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.categorySummaries.map((cat) => {
                const avg = cat.transactionCount > 0 ? cat.totalAmount / cat.transactionCount : 0;
                return (
                  <tr key={cat.category} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            category={cat.category}
                            className="w-4 h-4 text-slate-500"
                          />
                          <span className="font-semibold text-slate-800">{cat.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono-numbers text-slate-600">
                      {cat.transactionCount}
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono-numbers font-medium text-slate-700">
                      {cat.percentage}%
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono-numbers text-slate-600">
                      {formatINR(avg)}
                    </td>

                    <td className="py-3.5 px-5 text-right font-mono-numbers font-bold text-slate-900 text-sm">
                      {formatINR(cat.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50/90 border-t-2 border-slate-200 font-semibold text-slate-900">
              <tr>
                <td className="py-3.5 px-5">Total Project Summary</td>
                <td className="py-3.5 px-5 text-right font-mono-numbers">
                  {summary.totalTransactions}
                </td>
                <td className="py-3.5 px-5 text-right font-mono-numbers">
                  {summary.totalTransactions > 0 ? '100.0%' : '0.0%'}
                </td>
                <td className="py-3.5 px-5 text-right font-mono-numbers">
                  {formatINR(summary.averageExpense)}
                </td>
                <td className="py-3.5 px-5 text-right font-mono-numbers font-bold text-emerald-700 text-sm">
                  {formatINR(summary.totalExpenses)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
