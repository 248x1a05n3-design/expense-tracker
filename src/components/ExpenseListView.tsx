import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  X,
  PlusCircle,
  FileSpreadsheet,
  ChevronRight,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Expense, ExpenseCategory, SortOption } from '../types/expense';
import { EXPENSE_CATEGORIES, CATEGORY_META_MAP } from '../utils/constants';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatINR, formatDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { ConfirmationDialog } from './ConfirmationDialog';

export const ExpenseListView: React.FC = () => {
  const {
    expenses,
    openAddExpense,
    openExpenseDetail,
    openEditExpense,
    deleteExpense,
    loadDemoData,
  } = useExpenseContext();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Deletion modal state
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Filter and sort computation
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Text Search (matches category or note)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (exp) =>
          exp.category.toLowerCase().includes(q) ||
          (exp.note && exp.note.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((exp) => exp.category === selectedCategory);
    }

    // 3. Date Range Filter
    if (startDate) {
      result = result.filter((exp) => exp.date >= startDate);
    }
    if (endDate) {
      result = result.filter((exp) => exp.date <= endDate);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        // Sort by date desc, then by createdAt desc
        const dateComp = b.date.localeCompare(a.date);
        return dateComp !== 0 ? dateComp : b.createdAt.localeCompare(a.createdAt);
      }
      if (sortBy === 'oldest') {
        const dateComp = a.date.localeCompare(b.date);
        return dateComp !== 0 ? dateComp : a.createdAt.localeCompare(b.createdAt);
      }
      if (sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, searchQuery, selectedCategory, startDate, endDate, sortBy]);

  // Total amount of current filtered view
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'ALL' ||
    startDate !== '' ||
    endDate !== '' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Project Expenses</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            View, search, filter, and inspect detailed records from your project ledger.
          </p>
        </div>

        <button
          onClick={openAddExpense}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by note or category..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'ALL')}
              className="w-full appearance-none px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 text-slate-700 transition-colors"
            >
              <option value="ALL">All Categories ({expenses.length})</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Date Range: From / To */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
              className="w-1/2 px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
              className="w-1/2 px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 text-slate-700 transition-colors"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Amount</option>
              <option value="lowest">Sort: Lowest Amount</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800 font-semibold">{filteredExpenses.length}</strong> of{' '}
              <strong className="text-slate-800">{expenses.length}</strong> expenses
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Subtotal:{' '}
              <strong className="text-slate-900 font-mono-numbers font-semibold">
                {formatINR(filteredTotal)}
              </strong>
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Expenses List Table / Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            {expenses.length === 0 ? (
              <>
                <h3 className="text-base font-bold text-slate-800">No Expenses Recorded</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Your project expense tracker is currently empty. Record your first expense or load
                  sample records to explore.
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
                    Load Sample Project Data
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-slate-800">No Matching Expenses Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  No records match your active search and filter parameters. Try clearing the filters
                  or adjusting your search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExpenses.map((expense) => {
              const meta = CATEGORY_META_MAP[expense.category];

              return (
                <div
                  key={expense.id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => openExpenseDetail(expense.id)}
                >
                  {/* Left Column: Icon + Category + Date + Note */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 pr-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0"
                      style={{
                        backgroundColor: `${meta?.color}15`,
                        color: meta?.color || '#0f172a',
                      }}
                    >
                      <CategoryIcon category={expense.category} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {expense.category}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatDate(expense.date)}
                        </span>
                      </div>

                      {expense.note ? (
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {expense.note}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-0.5">No note provided</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Amount + Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 font-mono-numbers">
                        {formatINR(expense.amount)}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => openEditExpense(expense)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Expense"
                        aria-label="Edit expense"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpenseToDelete(expense)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Expense"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openExpenseDetail(expense.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                        title="View Details"
                        aria-label="View expense details"
                      >
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(expenseToDelete)}
        expense={expenseToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
};
