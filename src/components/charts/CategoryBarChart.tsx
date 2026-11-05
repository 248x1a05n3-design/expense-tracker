import React from 'react';
import { CategorySummary } from '../../types/expense';
import { formatINR } from '../../utils/formatters';
import { CategoryIcon } from '../CategoryIcon';

interface CategoryBarChartProps {
  categories: CategorySummary[];
  maxAmount?: number;
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  categories,
  maxAmount,
}) => {
  // Sort descending by total amount
  const sorted = [...categories].sort((a, b) => b.totalAmount - a.totalAmount);
  const highest = maxAmount || Math.max(...categories.map((c) => c.totalAmount), 1);

  return (
    <div className="space-y-3.5">
      {sorted.map((item) => {
        const percentageOfMax = (item.totalAmount / highest) * 100;
        const hasSpend = item.totalAmount > 0;

        return (
          <div key={item.category} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-800 truncate">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-500 shrink-0">
                  ({item.transactionCount} {item.transactionCount === 1 ? 'tx' : 'txs'})
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono-numbers">
                <span className="font-semibold text-slate-900">
                  {formatINR(item.totalAmount)}
                </span>
                <span className="text-[11px] text-slate-600 font-medium w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Progress bar container */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${hasSpend ? Math.max(percentageOfMax, 2) : 0}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
