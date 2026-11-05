import { ExpenseCategory } from '../types/expense';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Materials',
  'Labor',
  'Transportation',
  'Equipment',
  'Food & Accommodation',
  'Office Expenses',
  'Utilities',
  'Other',
];

export interface CategoryMeta {
  category: ExpenseCategory;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const CATEGORY_META_MAP: Record<ExpenseCategory, CategoryMeta> = {
  Materials: {
    category: 'Materials',
    color: '#4f46e5', // Indigo
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    description: 'Raw materials, cement, bricks, hardware, lumber',
  },
  Labor: {
    category: 'Labor',
    color: '#d97706', // Amber
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    description: 'Contractor fees, daily wages, sub-contractors',
  },
  Transportation: {
    category: 'Transportation',
    color: '#0284c7', // Sky
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    description: 'Fuel, freight shipping, hauling, site vehicle rentals',
  },
  Equipment: {
    category: 'Equipment',
    color: '#059669', // Emerald
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    description: 'Machinery rental, power tools, safety gear, repair',
  },
  'Food & Accommodation': {
    category: 'Food & Accommodation',
    color: '#e11d48', // Rose
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    description: 'Site meals, refreshments, lodging, worker boarding',
  },
  'Office Expenses': {
    category: 'Office Expenses',
    color: '#7c3aed', // Violet
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    description: 'Stationery, site office supplies, software, printing',
  },
  Utilities: {
    category: 'Utilities',
    color: '#ea580c', // Orange
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    description: 'Site electricity, water tankers, internet, diesel genset',
  },
  Other: {
    category: 'Other',
    color: '#64748b', // Slate
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    description: 'Permits, miscellaneous, emergency incidental costs',
  },
};

export const MAX_NOTE_LENGTH = 300;
