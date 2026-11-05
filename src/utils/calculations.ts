import { Expense, ProjectSummary, CategorySummary } from '../types/expense';
import { EXPENSE_CATEGORIES, CATEGORY_META_MAP } from './constants';

/**
 * Computes all dynamic project summaries from an array of expenses.
 */
export function calculateProjectSummary(expenses: Expense[]): ProjectSummary {
  if (!expenses || expenses.length === 0) {
    const emptyCategorySummaries: CategorySummary[] = EXPENSE_CATEGORIES.map((cat) => ({
      category: cat,
      totalAmount: 0,
      percentage: 0,
      transactionCount: 0,
      color: CATEGORY_META_MAP[cat].color,
      bgLight: CATEGORY_META_MAP[cat].badgeBg,
    }));

    return {
      totalExpenses: 0,
      totalTransactions: 0,
      averageExpense: 0,
      highestExpense: null,
      categorySummaries: emptyCategorySummaries,
    };
  }

  let totalExpenses = 0;
  let highestExpense: Expense | null = null;

  // Initialize category map
  const catMap = new Map<string, { total: number; count: number }>();
  for (const cat of EXPENSE_CATEGORIES) {
    catMap.set(cat, { total: 0, count: 0 });
  }

  for (const expense of expenses) {
    totalExpenses += expense.amount;

    if (!highestExpense || expense.amount > highestExpense.amount) {
      highestExpense = expense;
    }

    const current = catMap.get(expense.category) || { total: 0, count: 0 };
    catMap.set(expense.category, {
      total: current.total + expense.amount,
      count: current.count + 1,
    });
  }

  const totalTransactions = expenses.length;
  const averageExpense = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;

  // Build category summaries with percentage calculation
  const categorySummaries: CategorySummary[] = EXPENSE_CATEGORIES.map((cat) => {
    const info = catMap.get(cat) || { total: 0, count: 0 };
    const percentage = totalExpenses > 0 ? (info.total / totalExpenses) * 100 : 0;

    return {
      category: cat,
      totalAmount: info.total,
      percentage: Number(percentage.toFixed(1)),
      transactionCount: info.count,
      color: CATEGORY_META_MAP[cat].color,
      bgLight: CATEGORY_META_MAP[cat].badgeBg,
    };
  });

  // Sort categories by total amount descending so highest expenses appear first
  categorySummaries.sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    totalExpenses,
    totalTransactions,
    averageExpense,
    highestExpense,
    categorySummaries,
  };
}

/**
 * Groups expenses by date/month for trend visualization.
 */
export interface TimelinePoint {
  label: string; // e.g. "05 Nov" or "Nov 2026"
  dateKey: string;
  total: number;
  count: number;
}

export function calculateTimelineSummary(expenses: Expense[]): TimelinePoint[] {
  if (!expenses.length) return [];

  // Group by date YYYY-MM-DD
  const dateMap = new Map<string, { total: number; count: number }>();

  // Sort chronological
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  for (const exp of sorted) {
    const current = dateMap.get(exp.date) || { total: 0, count: 0 };
    dateMap.set(exp.date, {
      total: current.total + exp.amount,
      count: current.count + 1,
    });
  }

  const points: TimelinePoint[] = [];
  dateMap.forEach((value, dateKey) => {
    try {
      const [y, m, d] = dateKey.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const label = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
      }).format(dateObj);
      points.push({
        label,
        dateKey,
        total: value.total,
        count: value.count,
      });
    } catch {
      points.push({
        label: dateKey,
        dateKey,
        total: value.total,
        count: value.count,
      });
    }
  });

  return points;
}
