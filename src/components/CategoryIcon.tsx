import React from 'react';
import {
  Hammer,
  Users,
  Truck,
  Wrench,
  Utensils,
  Briefcase,
  Zap,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react';
import { ExpenseCategory } from '../types/expense';

interface CategoryIconProps {
  category: ExpenseCategory | string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Materials: Hammer,
  Labor: Users,
  Transportation: Truck,
  Equipment: Wrench,
  'Food & Accommodation': Utensils,
  'Office Expenses': Briefcase,
  Utilities: Zap,
  Other: MoreHorizontal,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = 'w-4 h-4',
  size,
}) => {
  const IconComponent = ICON_MAP[category] || MoreHorizontal;
  return <IconComponent className={className} size={size} />;
};
