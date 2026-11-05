import { Expense, ExpenseCategory } from '../types/expense';

const STORAGE_KEY = 'project_expense_tracker_records_v1';

/**
 * Generates a unique ID for an expense record.
 */
export function generateExpenseId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'exp_' + crypto.randomUUID();
  }
  return 'exp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Validates whether an unknown object conforms to an Expense.
 */
function isValidExpense(item: unknown): item is Expense {
  if (!item || typeof item !== 'object') return false;
  const exp = item as Record<string, unknown>;
  return (
    typeof exp.id === 'string' &&
    typeof exp.amount === 'number' &&
    !isNaN(exp.amount) &&
    typeof exp.category === 'string' &&
    typeof exp.date === 'string' &&
    typeof exp.createdAt === 'string'
  );
}

/**
 * Loads all expenses from LocalStorage.
 * Gracefully handles JSON parsing errors or corrupted entries without crashing.
 */
export function loadStoredExpenses(): Expense[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Stored expense data was not an array. Resetting.');
      return [];
    }

    // Filter valid records and sanitize numbers
    const validExpenses: Expense[] = [];
    for (const item of parsed) {
      if (isValidExpense(item)) {
        validExpenses.push({
          ...item,
          amount: Number(item.amount),
          note: typeof item.note === 'string' ? item.note : '',
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : item.createdAt,
        });
      }
    }

    return validExpenses;
  } catch (err) {
    console.error('Failed to load expenses from LocalStorage:', err);
    return [];
  }
}

/**
 * Saves the given array of expenses to LocalStorage.
 */
export function saveExpensesToStorage(expenses: Expense[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return true;
  } catch (err) {
    console.error('Failed to save expenses to LocalStorage:', err);
    return false;
  }
}

/**
 * Creates sample initial demonstration data if the user explicitly requests demo data.
 */
export function generateSampleDemoData(): Expense[] {
  const now = new Date();
  const formatD = (offsetDays: number) => {
    const d = new Date(now.getTime() - offsetDays * 86400000);
    return d.toISOString().split('T')[0];
  };

  const sampleEntries: Array<{
    amount: number;
    category: ExpenseCategory;
    dateOffset: number;
    note: string;
  }> = [
    {
      amount: 145000.0,
      category: 'Materials',
      dateOffset: 1,
      note: 'Procured 200 bags of Portland cement & TMT reinforcement steel bars for Foundation Block A',
    },
    {
      amount: 82500.0,
      category: 'Labor',
      dateOffset: 2,
      note: 'Fortnightly milestone payment for skilled masonry & shuttering carpentry crew',
    },
    {
      amount: 18400.0,
      category: 'Transportation',
      dateOffset: 3,
      note: 'Heavy truck hauling for aggregate delivery and sand transport from quarry',
    },
    {
      amount: 42000.0,
      category: 'Equipment',
      dateOffset: 5,
      note: 'Monthly rental for concrete mixer plant and hydraulic earth excavator',
    },
    {
      amount: 12500.0,
      category: 'Food & Accommodation',
      dateOffset: 6,
      note: 'Weekly canteen catering and clean drinking water tankers for site workers',
    },
    {
      amount: 7800.0,
      category: 'Office Expenses',
      dateOffset: 8,
      note: 'Structural blueprint plot prints, site register books, safety helmets, and markers',
    },
    {
      amount: 15600.0,
      category: 'Utilities',
      dateOffset: 10,
      note: 'Commercial temporary power connection billing and diesel fuel for backup generator',
    },
    {
      amount: 6200.0,
      category: 'Other',
      dateOffset: 12,
      note: 'Municipal site inspection certification and soil compaction testing documentation fee',
    },
    {
      amount: 98000.0,
      category: 'Materials',
      dateOffset: 15,
      note: 'Procured plumbing conduits, CPVC pipes, drainage fittings, and brass stop valves',
    },
    {
      amount: 54000.0,
      category: 'Labor',
      dateOffset: 18,
      note: 'Electrical wiring team contract installment for ground floor main distribution boards',
    },
  ];

  return sampleEntries.map((entry, index) => {
    const dateStr = formatD(entry.dateOffset);
    const ts = new Date(now.getTime() - entry.dateOffset * 86400000).toISOString();
    return {
      id: `exp_sample_${index + 1}`,
      amount: entry.amount,
      category: entry.category,
      date: dateStr,
      note: entry.note,
      createdAt: ts,
      updatedAt: ts,
    };
  });
}

/**
 * Exports expenses to a CSV string.
 */
export function exportExpensesToCSV(expenses: Expense[]): string {
  const headers = ['ID', 'Date', 'Category', 'Amount (INR)', 'Note', 'Created At', 'Last Updated'];
  const rows = expenses.map((e) => [
    `"${e.id}"`,
    `"${e.date}"`,
    `"${e.category}"`,
    e.amount.toFixed(2),
    `"${(e.note || '').replace(/"/g, '""')}"`,
    `"${e.createdAt}"`,
    `"${e.updatedAt}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Triggers a file download in the browser.
 */
export function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
