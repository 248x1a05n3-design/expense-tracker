import React, { useState } from 'react';
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Layers,
  Clock,
  ArrowLeft,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatINR, formatDate, formatDateTime } from '../utils/formatters';
import { CATEGORY_META_MAP } from '../utils/constants';
import { CategoryIcon } from './CategoryIcon';
import { ConfirmationDialog } from './ConfirmationDialog';

export const ExpenseDetailModal: React.FC = () => {
  const {
    selectedExpenseId,
    setSelectedExpenseId,
    expenses,
    openEditExpense,
    deleteExpense,
    addToast,
  } = useExpenseContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!selectedExpenseId) return null;

  const expense = expenses.find((e) => e.id === selectedExpenseId);

  if (!expense) {
    return null;
  }

  const meta = CATEGORY_META_MAP[expense.category];

  const handleCopyId = () => {
    navigator.clipboard.writeText(expense.id);
    setCopiedId(true);
    addToast('info', 'Copied to Clipboard', `Expense ID ${expense.id}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmDelete = () => {
    deleteExpense(expense.id);
    setIsDeleting(false);
    setSelectedExpenseId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedExpenseId(null)}
              className="p-1.5 -ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              aria-label="Back to expenses"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 id="detail-modal-title" className="text-sm font-semibold text-slate-800">
              Expense Record Details
            </h3>
          </div>

          <button
            onClick={() => setSelectedExpenseId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Amount & Category Highlight Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-medium">Expense Amount</span>
              <div className="text-3xl font-bold font-mono-numbers tracking-tight mt-0.5 text-white">
                {formatINR(expense.amount)}
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 shrink-0 self-start sm:self-auto">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: meta?.color || '#059669' }}
              >
                <CategoryIcon category={expense.category} className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-100">{expense.category}</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expense Date */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Expense Date</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(expense.date)}
              </div>
            </div>

            {/* Unique Expense ID */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Record ID</span>
                <button
                  onClick={handleCopyId}
                  className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                >
                  {copiedId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-xs font-mono-numbers text-slate-700 truncate" title={expense.id}>
                {expense.id}
              </div>
            </div>
          </div>

          {/* Full Expense Note */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">Description / Notes</span>
            </div>
            {expense.note ? (
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {expense.note}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No detailed notes or description entered for this transaction.
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="p-4 rounded-xl bg-slate-100/60 text-xs text-slate-500 space-y-1.5 border border-slate-200/50">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Created At:</span>
              </span>
              <span className="font-mono-numbers text-slate-700">
                {formatDateTime(expense.createdAt)}
              </span>
            </div>
            {expense.updatedAt && expense.updatedAt !== expense.createdAt && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Modified:</span>
                </span>
                <span className="font-mono-numbers text-slate-700">
                  {formatDateTime(expense.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Expense</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedExpenseId(null)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedExpenseId(null);
                openEditExpense(expense);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleting}
        expense={expense}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleting(false)}
      />
    </div>
  );
};
