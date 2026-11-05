import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Expense,
  ExpenseCategory,
  ProjectSummary,
  ToastMessage,
  ScreenTab,
} from '../types/expense';
import {
  loadStoredExpenses,
  saveExpensesToStorage,
  generateExpenseId,
  generateSampleDemoData,
} from '../services/storage';
import { calculateProjectSummary } from '../utils/calculations';

interface ExpenseContextType {
  expenses: Expense[];
  summary: ProjectSummary;
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  selectedExpenseId: string | null;
  setSelectedExpenseId: (id: string | null) => void;
  editingExpense: Expense | null;
  setEditingExpense: (exp: Expense | null) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'error', title: string, message?: string) => void;
  removeToast: (id: string) => void;
  addExpense: (data: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
  }) => Expense;
  updateExpense: (
    id: string,
    data: {
      amount: number;
      category: ExpenseCategory;
      date: string;
      note?: string;
    }
  ) => boolean;
  deleteExpense: (id: string) => boolean;
  loadDemoData: () => void;
  clearAllExpenses: () => void;
  openAddExpense: () => void;
  openEditExpense: (expense: Expense) => void;
  openExpenseDetail: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage once on mount
  useEffect(() => {
    const stored = loadStoredExpenses();
    setExpenses(stored);
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever expenses change (after initial mount)
  useEffect(() => {
    if (isLoaded) {
      saveExpensesToStorage(expenses);
    }
  }, [expenses, isLoaded]);

  // Toast notifications manager
  const addToast = useCallback((type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dynamic summary computation
  const summary = useMemo(() => {
    return calculateProjectSummary(expenses);
  }, [expenses]);

  // Actions
  const addExpense = useCallback(
    (data: { amount: number; category: ExpenseCategory; date: string; note?: string }): Expense => {
      const nowIso = new Date().toISOString();
      const newExpense: Expense = {
        id: generateExpenseId(),
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        note: data.note ? data.note.trim() : '',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      addToast(
        'success',
        'Expense Recorded',
        `₹${newExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} under ${newExpense.category} saved.`
      );
      return newExpense;
    },
    [addToast]
  );

  const updateExpense = useCallback(
    (
      id: string,
      data: { amount: number; category: ExpenseCategory; date: string; note?: string }
    ): boolean => {
      let updated = false;
      const nowIso = new Date().toISOString();

      setExpenses((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            updated = true;
            return {
              ...item,
              amount: Number(data.amount),
              category: data.category,
              date: data.date,
              note: data.note ? data.note.trim() : '',
              updatedAt: nowIso,
            };
          }
          return item;
        })
      );

      if (updated) {
        addToast('success', 'Expense Updated', 'Changes were saved successfully.');
      }
      return updated;
    },
    [addToast]
  );

  const deleteExpense = useCallback(
    (id: string): boolean => {
      let deletedAmount = 0;
      let deletedCat = '';
      const existing = expenses.find((e) => e.id === id);
      if (existing) {
        deletedAmount = existing.amount;
        deletedCat = existing.category;
      }

      setExpenses((prev) => prev.filter((item) => item.id !== id));

      if (selectedExpenseId === id) {
        setSelectedExpenseId(null);
      }
      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }

      addToast(
        'info',
        'Expense Deleted',
        deletedCat
          ? `Deleted ₹${deletedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${deletedCat})`
          : 'Expense removed from local records.'
      );
      return true;
    },
    [expenses, selectedExpenseId, editingExpense, addToast]
  );

  const loadDemoData = useCallback(() => {
    const demo = generateSampleDemoData();
    setExpenses(demo);
    addToast('success', 'Demo Project Loaded', '10 realistic sample expenses loaded.');
  }, [addToast]);

  const clearAllExpenses = useCallback(() => {
    setExpenses([]);
    setSelectedExpenseId(null);
    setEditingExpense(null);
    addToast('info', 'All Expenses Cleared', 'Local ledger has been reset.');
  }, [addToast]);

  const openAddExpense = useCallback(() => {
    setEditingExpense(null);
    setActiveTab('add');
  }, []);

  const openEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  }, []);

  const openExpenseDetail = useCallback((id: string) => {
    setSelectedExpenseId(id);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        activeTab,
        setActiveTab,
        selectedExpenseId,
        setSelectedExpenseId,
        editingExpense,
        setEditingExpense,
        toasts,
        addToast,
        removeToast,
        addExpense,
        updateExpense,
        deleteExpense,
        loadDemoData,
        clearAllExpenses,
        openAddExpense,
        openEditExpense,
        openExpenseDetail,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export function useExpenseContext(): ExpenseContextType {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
}
