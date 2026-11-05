import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Calendar,
  Layers,
  FileText,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ExpenseCategory } from '../types/expense';
import { EXPENSE_CATEGORIES, CATEGORY_META_MAP, MAX_NOTE_LENGTH } from '../utils/constants';
import { useExpenseContext } from '../context/ExpenseContext';
import { getTodayDateString } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface FormErrors {
  amount?: string;
  category?: string;
  date?: string;
  note?: string;
}

export const ExpenseFormView: React.FC = () => {
  const {
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense,
    setActiveTab,
    openExpenseDetail,
  } = useExpenseContext();

  const isEditing = Boolean(editingExpense);

  // Form states
  const [amountInput, setAmountInput] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (editingExpense) {
      setAmountInput(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note || '');
    } else {
      // Defaults for new expense
      setAmountInput('');
      setCategory('Materials');
      setDate(getTodayDateString());
      setNote('');
    }
    setErrors({});
  }, [editingExpense]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Amount validation
    if (!amountInput || amountInput.trim() === '') {
      newErrors.amount = 'Expense amount is required.';
    } else {
      const numVal = parseFloat(amountInput);
      if (isNaN(numVal)) {
        newErrors.amount = 'Please enter a valid numeric amount.';
      } else if (numVal <= 0) {
        newErrors.amount = 'Amount must be greater than zero (₹0.00).';
      } else {
        // Check decimal places: up to 2 decimal places allowed
        const parts = amountInput.split('.');
        if (parts.length > 2) {
          newErrors.amount = 'Amount cannot have multiple decimal points.';
        } else if (parts.length === 2 && parts[1].length > 2) {
          newErrors.amount = 'Amount can have at most two decimal places.';
        }
      }
    }

    // 2. Category validation
    if (!category) {
      newErrors.category = 'Please select an expense category.';
    }

    // 3. Date validation
    if (!date) {
      newErrors.date = 'Expense date is required.';
    }

    // 4. Note validation
    if (note && note.length > MAX_NOTE_LENGTH) {
      newErrors.note = `Note cannot exceed ${MAX_NOTE_LENGTH} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string, digits, and a single decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setAmountInput(val);
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as ExpenseCategory);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_NOTE_LENGTH) {
      setNote(val);
      if (errors.note) {
        setErrors((prev) => ({ ...prev, note: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const parsedAmount = Math.round(parseFloat(amountInput) * 100) / 100;

    try {
      if (isEditing && editingExpense) {
        updateExpense(editingExpense.id, {
          amount: parsedAmount,
          category: category as ExpenseCategory,
          date,
          note,
        });
        openExpenseDetail(editingExpense.id);
      } else {
        addExpense({
          amount: parsedAmount,
          category: category as ExpenseCategory,
          date,
          note,
        });
        setActiveTab('expenses');
      }
    } finally {
      setIsSubmitting(false);
      setEditingExpense(null);
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
    if (isEditing && editingExpense) {
      openExpenseDetail(editingExpense.id);
    } else {
      setActiveTab('expenses');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isEditing ? 'Edit Expense Record' : 'Record New Expense'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {isEditing
            ? 'Update the financial details for this transaction in local storage.'
            : 'Enter the amount, category, and date to log an expense for this project.'}
        </p>
      </div>

      {/* Main Card Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        {/* 1. Expense Amount */}
        <div>
          <label htmlFor="expense-amount" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Expense Amount (₹ INR) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-semibold text-base">
              ₹
            </div>
            <input
              id="expense-amount"
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`w-full pl-9 pr-4 py-3 rounded-xl border text-lg font-mono-numbers font-medium transition-colors focus:outline-hidden focus:ring-2 ${
                errors.amount
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
          </div>
          {errors.amount ? (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.amount}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">
              Enter numeric values greater than ₹0.00 (e.g. 1500 or 1500.50)
            </p>
          )}
        </div>

        {/* 2. Expense Category */}
        <div>
          <label htmlFor="expense-category" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="expense-category"
              value={category}
              onChange={handleCategoryChange}
              className={`w-full appearance-none pl-4 pr-10 py-3 rounded-xl border text-sm font-medium bg-white transition-colors focus:outline-hidden focus:ring-2 ${
                errors.category
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            >
              <option value="" disabled>
                -- Select Expense Category --
              </option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          {errors.category ? (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.category}</span>
            </p>
          ) : category ? (
            <p className="mt-1.5 text-xs text-slate-500">
              {CATEGORY_META_MAP[category]?.description}
            </p>
          ) : null}
        </div>

        {/* 3. Expense Date */}
        <div>
          <label htmlFor="expense-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Expense Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={handleDateChange}
              max={getTodayDateString()}
              className={`w-full pl-4 pr-10 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 ${
                errors.date
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          {errors.date ? (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.date}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">
              Defaults to today. You can select past dates for retrospective logging.
            </p>
          )}
        </div>

        {/* 4. Expense Note */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="expense-note" className="block text-sm font-semibold text-slate-800">
              Expense Note <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {note.length} / {MAX_NOTE_LENGTH}
            </span>
          </div>
          <div className="relative">
            <textarea
              id="expense-note"
              rows={3}
              value={note}
              onChange={handleNoteChange}
              placeholder="e.g. Purchased 50 cement bags, invoice #INV-492, supplier Apex Traders"
              className={`w-full p-3.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                errors.note
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 text-slate-900 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />
          </div>
          {errors.note && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.note}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Save Expense'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
