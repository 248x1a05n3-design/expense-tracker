export type ExpenseCategory =
  | 'Materials'
  | 'Labor'
  | 'Transportation'
  | 'Equipment'
  | 'Food & Accommodation'
  | 'Office Expenses'
  | 'Utilities'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface ExpenseFilter {
  category: ExpenseCategory | 'ALL';
  searchQuery: string;
  startDate: string;
  endDate: string;
  sortBy: SortOption;
}

export interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  bgLight: string;
}

export interface ProjectSummary {
  totalExpenses: number;
  totalTransactions: number;
  averageExpense: number;
  highestExpense: Expense | null;
  categorySummaries: CategorySummary[];
}

export type ScreenTab = 'dashboard' | 'expenses' | 'add' | 'summary';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}
