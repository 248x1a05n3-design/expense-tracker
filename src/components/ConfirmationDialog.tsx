import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { Expense } from '../types/expense';

interface ConfirmationDialogProps {
  isOpen: boolean;
  expense: Expense | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  expense,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl relative"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 id="dialog-title" className="text-lg font-bold text-slate-900 leading-snug">
              Delete Expense Record?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete this expense of{' '}
              <span className="font-semibold text-slate-900 font-mono-numbers">
                {formatINR(expense.amount)}
              </span>{' '}
              for <span className="font-medium text-slate-800">{expense.category}</span>?
            </p>
            <p className="mt-1 text-xs text-slate-500">
              This action will permanently remove this record from your local device storage.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
          >
            Delete Expense
          </button>
        </div>
      </div>
    </div>
  );
};
